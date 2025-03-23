# 5️⃣ React Props - Passing Data to Components

---

## ❓ What are Props?

Props (short for properties) are **how components receive data from their parent**.

* Props are passed as attributes in JSX (similar to HTML attributes)
* Props are read-only (immutable) - components cannot modify their props
* Props flow down from parent to child (one-way data flow)
* Props can be any JavaScript value: strings, numbers, objects, arrays, functions, even other React components

```jsx
// Parent component passing props
function App() {
  return <UserProfile name="John Doe" role="Developer" isActive={true} />;
}

// Child component receiving props
function UserProfile(props) {
  return (
    <div className="profile">
      <h2>{props.name}</h2>
      <p>Role: {props.role}</p>
      <p>Status: {props.isActive ? 'Active' : 'Inactive'}</p>
    </div>
  );
}
```

### Rendered Output:
```html
<div class="profile">
  <h2>John Doe</h2>
  <p>Role: Developer</p>
  <p>Status: Active</p>
</div>
```

---

## Props Destructuring in Detail

For cleaner code, you can destructure props. This makes your component code more readable and concise.

### Before Destructuring:
```jsx
function UserProfile(props) {
  return (
    <div className="profile">
      <h2>{props.name}</h2>
      <p>Role: {props.role}</p>
      <p>Status: {props.isActive ? 'Active' : 'Inactive'}</p>
    </div>
  );
}
```

### After Destructuring:
```jsx
function UserProfile({ name, role, isActive }) {
  return (
    <div className="profile">
      <h2>{name}</h2>
      <p>Role: {role}</p>
      <p>Status: {isActive ? 'Active' : 'Inactive'}</p>
    </div>
  );
}
```

### Advanced Destructuring with Nested Props:
```jsx
function UserCard({ user, actions, style = {} }) {
  // Destructuring nested objects
  const { name, email, address = {} } = user;
  const { street, city } = address;
  
  return (
    <div style={style}>
      <h2>{name}</h2>
      <p>{email}</p>
      <p>{street}, {city}</p>
      <button onClick={actions.edit}>Edit</button>
      <button onClick={actions.delete}>Delete</button>
    </div>
  );
}

// Usage
<UserCard 
  user={{ 
    name: "Jane Doe", 
    email: "jane@example.com",
    address: { street: "123 Main St", city: "New York" }
  }}
  actions={{
    edit: () => console.log("Edit clicked"),
    delete: () => console.log("Delete clicked")
  }}
/>
```

---

## Default Props - Complete Guide

Default props provide fallback values for props that aren't passed by the parent component. This makes components more robust and easier to use.

### Method 1: Default Parameter Values (Recommended for Functional Components)
```jsx
function Button({ text = 'Click me', type = 'primary', onClick }) {
  return (
    <button className={`btn btn-${type}`} onClick={onClick}>
      {text}
    </button>
  );
}
```

### Method 2: defaultProps Property (Works with Class Components Too)
```jsx
function Button(props) {
  return (
    <button className={`btn btn-${props.type}`} onClick={props.onClick}>
      {props.text}
    </button>
  );
}

Button.defaultProps = {
  text: 'Click me',
  type: 'primary'
};
```

### Rendered Output:
```jsx
// These all produce visually equivalent buttons with different texts
<Button /> // → <button class="btn btn-primary">Click me</button>
<Button text="Submit" /> // → <button class="btn btn-primary">Submit</button>
<Button type="secondary" /> // → <button class="btn btn-secondary">Click me</button>
```

Default props ensure components remain functional and visually consistent even with incomplete data.

---

## Props vs. State - Comprehensive Comparison

Understanding the difference between props and state is crucial for effective React development:

| Feature | Props | State |
|---------|-------|-------|
| Source | Received from parent | Defined within component |
| Mutability | Read-only (immutable) | Mutable (can be updated) |
| Purpose | Pass data down the component tree | Track information that changes over time |
| Update Location | Updated by parent component | Updated by the component itself |
| Re-renders | Component re-renders when props change | Component re-renders when state changes |
| Initial Value | Can be used to set initial state | Can be initialized with or without props |
| Access | Available in all components | Only available in class components or through hooks |
| Persistence | New props on every render | Persists between re-renders |
| Examples | User info, callback functions, configuration | Form input values, toggle states, loading state |

### Common patterns:
- Use props to configure a component from its parent
- Use state to track information that changes due to user interaction
- Convert props to state when you need a prop as a starting value that will later change

---

## Children Props - Visual Explanation

The `children` prop is a special prop that lets you pass components, elements, or text between the opening and closing tags of a component.

```jsx
function Card({ title, children }) {
  return (
    <div className="card">
      <h2 className="card-title">{title}</h2>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

// Usage:
<Card title="Welcome">
  <p>This is the content inside the card.</p>
  <button>Click me</button>
</Card>
```

### What renders on the page:

```html
<div class="card">
  <h2 class="card-title">Welcome</h2>
  <div class="card-content">
    <p>This is the content inside the card.</p>
    <button>Click me</button>
  </div>
</div>
```

The elements between `<Card>` and `</Card>` are passed as the `children` prop to the Card component and rendered wherever you place `{children}` in your component.

---


## Props Drilling - Problems and Solutions

Props drilling happens when props are passed through multiple layers of components that don't actually use them:

```jsx
function App() {
  const user = { name: "John", role: "Admin" };
  // Passing user down through multiple levels
  return <MainPage user={user} />;
}

function MainPage({ user }) {
  // MainPage doesn't use user, just passes it down
  return <Sidebar user={user} />;
}

function Sidebar({ user }) {
  // Sidebar doesn't use user either, just passes it down
  return <UserInfo user={user} />;
}

function UserInfo({ user }) {
  // Finally used here, several levels deep
  return <h1>Hello, {user.name} ({user.role})</h1>;
}
```

### Problems with props drilling:
1. Components become tightly coupled
2. Any change to the data structure affects all intermediate components
3. Code becomes harder to maintain as the app grows
4. Intermediate components receive props they don't use

### Solutions to props drilling:
1. **Component composition**: Restructure components to avoid deep nesting
2. **Context API**: Share values without explicitly passing props through every level
3. **State management libraries**: Redux, MobX, or Zustand for more complex applications

---

## Advanced Prop Patterns

### 1. Render Props
A technique where a component receives a function as a prop and calls it to render something:

```jsx
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return render(position);
}

// Usage
<MouseTracker 
  render={({ x, y }) => (
    <div>
      The mouse position is: {x}, {y}
    </div>
  )}
/>
```

### 2. Component as Props
Passing components as props for flexible UI composition:

```jsx
function Dashboard({ 
  HeaderComponent, 
  SidebarComponent, 
  MainContent, 
  FooterComponent = DefaultFooter 
}) {
  return (
    <div className="dashboard">
      <HeaderComponent />
      <div className="dashboard-body">
        <SidebarComponent />
        <main>{MainContent}</main>
      </div>
      <FooterComponent />
    </div>
  );
}

// Usage
<Dashboard 
  HeaderComponent={CustomHeader}
  SidebarComponent={AdminSidebar}
  MainContent={<UserStats userId={123} />}
/>
```

These advanced patterns enable highly flexible and reusable component architecture.