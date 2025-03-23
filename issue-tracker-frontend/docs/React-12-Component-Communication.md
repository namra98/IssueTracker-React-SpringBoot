# 1️⃣2️⃣ Component Communication - Props & Context

---

## ❓ Why Component Communication Matters

Modern React applications are built from many components that need to share data and coordinate actions. Effective component communication is essential for:

- Sharing state between components
- Coordinating actions across the component tree
- Building modular, reusable components
- Managing application data flow

---

## 🔄 Types of Component Relationships

React components can have different relationships:

1. **Parent-to-Child**: Most common, data flows down via props
2. **Child-to-Parent**: Child communicates up through callbacks
3. **Sibling-to-Sibling**: Components at the same level
4. **Distant Components**: Not directly related in the component tree
5. **Complex Relationships**: Components across different branches

Each relationship requires different communication strategies.

---

## 👇 Parent-to-Child Communication: Props

The simplest form of communication is passing props from parent to child:

```jsx
// Parent component
function ParentComponent() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState({ name: 'John', role: 'Admin' });
  
  return (
    <div className="parent">
      <h1>Parent Component</h1>
      <p>Count: {count}</p>
      
      {/* Pass data to child via props */}
      <ChildComponent 
        count={count} 
        user={user} 
        incrementCount={() => setCount(count + 1)}
      />
    </div>
  );
}

// Child component
function ChildComponent({ count, user, incrementCount }) {
  return (
    <div className="child">
      <h2>Child Component</h2>
      <p>Count from parent: {count}</p>
      <p>User name: {user.name}</p>
      
      {/* Use callback to communicate with parent */}
      <button onClick={incrementCount}>
        Increment Count
      </button>
    </div>
  );
}
```

Props flow down, events flow up.

---

## ☝️ Child-to-Parent Communication: Callbacks

Children communicate to parents using callback functions:

```jsx
// Parent component
function IssueTracker() {
  const [issues, setIssues] = useState([
    { id: 1, title: 'Bug in login', status: 'OPEN' },
    { id: 2, title: 'Crash on startup', status: 'IN_PROGRESS' }
  ]);
  
  // Callback function passed to child
  const handleStatusChange = (issueId, newStatus) => {
    setIssues(issues.map(issue => 
      issue.id === issueId 
        ? { ...issue, status: newStatus } 
        : issue
    ));
  };
  
  return (
    <div>
      <h1>Issue Tracker</h1>
      {issues.map(issue => (
        <IssueItem 
          key={issue.id}
          issue={issue}
          onStatusChange={handleStatusChange}
        />
      ))}
    </div>
  );
}

// Child component
function IssueItem({ issue, onStatusChange }) {
  return (
    <div className="issue">
      <h3>{issue.title}</h3>
      <p>Status: {issue.status}</p>
      <select 
        value={issue.status}
        onChange={(e) => onStatusChange(issue.id, e.target.value)}
      >
        <option value="OPEN">Open</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="RESOLVED">Resolved</option>
        <option value="CLOSED">Closed</option>
      </select>
    </div>
  );
}
```

This pattern allows children to update parent state.

---

## 🌐 Sibling Communication: Lifting State Up

For siblings to communicate, state must be lifted to their common parent:

```jsx
function IssueManager() {
  // State is lifted to the common parent
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [issues, setIssues] = useState([/* issues data */]);
  
  // Get selected issue details
  const selectedIssue = issues.find(issue => issue.id === selectedIssueId);
  
  return (
    <div className="issue-manager">
      {/* First sibling */}
      <IssueList 
        issues={issues}
        onSelectIssue={setSelectedIssueId}
        selectedIssueId={selectedIssueId}
      />
      
      {/* Second sibling */}
      <IssueDetails 
        issue={selectedIssue}
        onUpdate={(updatedIssue) => {
          setIssues(issues.map(issue => 
            issue.id === updatedIssue.id ? updatedIssue : issue
          ));
        }}
      />
    </div>
  );
}

// First sibling
function IssueList({ issues, onSelectIssue, selectedIssueId }) {
  return (
    <div className="issue-list">
      <h2>Issues</h2>
      <ul>
        {issues.map(issue => (
          <li 
            key={issue.id}
            className={issue.id === selectedIssueId ? 'selected' : ''}
            onClick={() => onSelectIssue(issue.id)}
          >
            {issue.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Second sibling
function IssueDetails({ issue, onUpdate }) {
  if (!issue) return <div className="issue-details">Select an issue</div>;
  
  const handleStatusChange = (newStatus) => {
    onUpdate({ ...issue, status: newStatus });
  };
  
  return (
    <div className="issue-details">
      <h2>{issue.title}</h2>
      <p>Status: {issue.status}</p>
      {/* Status change controls */}
    </div>
  );
}
```

The parent acts as a coordinator between siblings.

---

## 🔄 Prop Drilling Problem

When components are deeply nested, props must pass through intermediate components:

```jsx
function App() {
  const [user, setUser] = useState({ name: 'John', role: 'admin' });
  
  return (
    <div>
      <Header user={user} />
      <MainContent user={user} />
      <Footer />
    </div>
  );
}

function MainContent({ user }) {
  return (
    <main>
      <Sidebar user={user} />
      <Content user={user} />
    </main>
  );
}

function Content({ user }) {
  return (
    <div>
      <Article />
      <UserProfile user={user} />
    </div>
  );
}

function UserProfile({ user }) {
  return (
    <div>
      <h2>User Profile</h2>
      <p>Name: {user.name}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
```

This creates several problems:
- Components become tightly coupled
- Intermediate components receive props they don't use
- Changing prop names or structure affects multiple components
- Code becomes harder to maintain

---

## 🌟 Context API for Distant Components

Context solves prop drilling by making data available to any component in the tree:

```jsx
// Create context
const UserContext = createContext();

// Provider at top level
function App() {
  const [user, setUser] = useState({ name: 'John', role: 'admin' });
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div>
        <Header />
        <MainContent />
        <Footer />
      </div>
    </UserContext.Provider>
  );
}

// Intermediary components don't need the user prop anymore
function MainContent() {
  return (
    <main>
      <Sidebar />
      <Content />
    </main>
  );
}

function Content() {
  return (
    <div>
      <Article />
      <UserProfile />
    </div>
  );
}

// Consumer deep in the tree
function UserProfile() {
  // Access user data directly from context
  const { user } = useContext(UserContext);
  
  return (
    <div>
      <h2>User Profile</h2>
      <p>Name: {user.name}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}

// Can also update the context
function UserSettings() {
  const { user, setUser } = useContext(UserContext);
  
  const handleNameChange = (e) => {
    setUser({ ...user, name: e.target.value });
  };
  
  return (
    <div>
      <h2>Settings</h2>
      <input 
        type="text" 
        value={user.name} 
        onChange={handleNameChange} 
      />
    </div>
  );
}
```

Context decouples components and simplifies communication.

---

## 🛠️ Compound Components Pattern

Compound components provide an elegant way for related components to communicate:

```jsx
// Create context for internal communication
const TabContext = createContext();

// Parent component
function Tabs({ children, defaultIndex = 0 }) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  
  // Value to be shared with children
  const contextValue = {
    activeIndex,
    setActiveIndex
  };
  
  return (
    <TabContext.Provider value={contextValue}>
      <div className="tabs-container">
        {children}
      </div>
    </TabContext.Provider>
  );
}

// Child component - TabList
function TabList({ children }) {
  return (
    <div className="tab-list">
      {React.Children.map(children, (child, index) => {
        return React.cloneElement(child, { index });
      })}
    </div>
  );
}

// Child component - Tab
function Tab({ index, children }) {
  const { activeIndex, setActiveIndex } = useContext(TabContext);
  const isActive = activeIndex === index;
  
  return (
    <div 
      className={`tab ${isActive ? 'active' : ''}`}
      onClick={() => setActiveIndex(index)}
    >
      {children}
    </div>
  );
}

// Child component - TabPanels
function TabPanels({ children }) {
  const { activeIndex } = useContext(TabContext);
  
  return (
    <div className="tab-panels">
      {React.Children.toArray(children)[activeIndex]}
    </div>
  );
}

// Child component - TabPanel
function TabPanel({ children }) {
  return (
    <div className="tab-panel">
      {children}
    </div>
  );
}

// Export as members of Tabs
Tabs.TabList = TabList;
Tabs.Tab = Tab;
Tabs.TabPanels = TabPanels;
Tabs.TabPanel = TabPanel;

// Usage
function IssueCategories() {
  return (
    <Tabs>
      <Tabs.TabList>
        <Tabs.Tab>Open Issues</Tabs.Tab>
        <Tabs.Tab>In Progress</Tabs.Tab>
        <Tabs.Tab>Resolved</Tabs.Tab>
      </Tabs.TabList>
      
      <Tabs.TabPanels>
        <Tabs.TabPanel>
          <IssueList status="OPEN" />
        </Tabs.TabPanel>
        <Tabs.TabPanel>
          <IssueList status="IN_PROGRESS" />
        </Tabs.TabPanel>
        <Tabs.TabPanel>
          <IssueList status="RESOLVED" />
        </Tabs.TabPanel>
      </Tabs.TabPanels>
    </Tabs>
  );
}
```

This pattern creates a component API that is intuitive, flexible, and handles internal communication automatically.

---

## 📡 Event-Based Communication with Event Emitters

For complex cases, you can create a simple event system:

```jsx
// eventBus.js
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  off(eventName, callback) {
    if (!this.events[eventName]) return;
    this.events[eventName] = this.events[eventName]
      .filter(cb => cb !== callback);
  }

  emit(eventName, data) {
    if (!this.events[eventName]) return;
    this.events[eventName].forEach(cb => cb(data));
  }
}

export default new EventEmitter();

// Usage in components
import eventBus from './eventBus';
import { useEffect } from 'react';

// Component A (emitter)
function Notifications() {
  const markAllAsRead = () => {
    // Update local state...
    
    // Emit event for other components
    eventBus.emit('notifications-read', { timestamp: Date.now() });
  };
  
  return (
    <div>
      <h2>Notifications</h2>
      <button onClick={markAllAsRead}>Mark All as Read</button>
    </div>
  );
}

// Component B (listener) - could be anywhere in the component tree
function NotificationBadge() {
  const [unread, setUnread] = useState(5);
  
  useEffect(() => {
    // Listen for the event
    const handleNotificationsRead = () => {
      setUnread(0);
    };
    
    eventBus.on('notifications-read', handleNotificationsRead);
    
    // Clean up subscription
    return () => {
      eventBus.off('notifications-read', handleNotificationsRead);
    };
  }, []);
  
  return <div className="badge">{unread}</div>;
}
```

This approach provides loose coupling but should be used carefully to avoid making the application's data flow hard to track.

---

## 🔀 Component Communication Strategies

| Communication Type | Best Strategy | Alternative Strategy |
|-------------------|---------------|----------------------|
| Parent-to-Child | Props | Context (if many levels) |
| Child-to-Parent | Callback Functions | Context with State |
| Sibling-to-Sibling | Lift State Up | Context |
| Distant Components | Context API | State Management Library |
| Complex Patterns | Compound Components | Render Props |
| Many-to-Many | State Management (Redux) | Context + Reducer |

---

## 🧩 Advanced Patterns

Several advanced patterns facilitate specific communication needs:

### 1. Render Props

Pass a function as a prop that returns React elements:

```jsx
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Call the render prop with the state
  return render(position);
}

// Usage
<MouseTracker 
  render={({ x, y }) => (
    <div>
      <h1>Mouse Tracker</h1>
      <p>Current position: {x}, {y}</p>
    </div>
  )}
/>
```

### 2. Higher-Order Components (HOC)

Wrap components to inject props:

```jsx
// HOC
function withUser(Component) {
  return function WrappedComponent(props) {
    const { user, setUser } = useContext(UserContext);
    
    return <Component user={user} setUser={setUser} {...props} />;
  };
}

// Base component
function UserProfile({ user, setUser, ...props }) {
  return (
    <div>
      <h2>{user.name}'s Profile</h2>
      {/* Component implementation */}
    </div>
  );
}

// Enhanced component
const UserProfileWithUser = withUser(UserProfile);

// Usage
<UserProfileWithUser extraProp="value" />
```

### 3. Custom Hooks

Encapsulate and share stateful logic:

```jsx
// Custom hook
function useIssue(issueId) {
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchIssue() {
      try {
        setLoading(true);
        const response = await fetch(`/api/issues/${issueId}`);
        if (!response.ok) throw new Error('Issue not found');
        const data = await response.json();
        setIssue(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchIssue();
  }, [issueId]);
  
  return { issue, loading, error };
}

// Usage in components
function IssueDetails({ issueId }) {
  const { issue, loading, error } = useIssue(issueId);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h2>{issue.title}</h2>
      <p>{issue.description}</p>
    </div>
  );
}
```

---

## 🚀 Best Practices

1. **Use props for parent-child communication** when possible
2. **Lift state up** just high enough in the tree
3. **Create custom hooks** to share logic and state between components
4. **Use context for global concerns** like theme, auth, and truly global state
5. **Keep context granular** to prevent unnecessary re-renders
6. **Document your component interfaces** clearly
7. **Consider performance implications** especially with Context
8. **Prefer composition over inheritance** for component reuse
9. **Be consistent** in your communication patterns
10. **Test component interactions** to ensure they work correctly

---

## 📝 Summary

- **Props**: Primary way for parent-child communication
- **Callback functions**: Enable children to communicate with parents
- **Lifting state up**: Facilitates sibling communication
- **Context API**: Shares data across distant components
- **Compound components**: Create intuitive component APIs
- **Event emitters**: Enable loosely coupled communication
- **Advanced patterns**: Render props, HOCs, and custom hooks provide specialized solutions

Choosing the right communication pattern for each scenario is key to building maintainable React applications.