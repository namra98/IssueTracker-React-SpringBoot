# 1️⃣1️⃣ Context API & State Management

---

## ❓ What is the Context API?

The Context API is a built-in React feature that allows you to share state across the component tree without passing props manually through every level (prop drilling).

- **Global State**: Share data that can be considered "global"
- **Component Tree**: Make data available to any component in the tree
- **Built-in Solution**: No external libraries needed

---

## 🔄 The Problem: Prop Drilling

Without Context, data flows down through props:

```jsx
function App() {
  const [user, setUser] = useState({
    id: 1,
    name: 'John Doe',
    role: 'Admin'
  });
  
  return (
    <div className="app">
      <Header user={user} />
      <MainContent user={user} />
      <Footer user={user} />
    </div>
  );
}

function MainContent({ user }) {
  return (
    <div className="main">
      <Sidebar user={user} />
      <Dashboard user={user} />
    </div>
  );
}

function Dashboard({ user }) {
  return (
    <div className="dashboard">
      <UserInfo user={user} />
      <IssueTracker userId={user.id} />
    </div>
  );
}

function UserInfo({ user }) {
  return <div>Welcome, {user.name}!</div>;
}
```

This creates tight coupling and makes component reuse difficult.

---

## 🌟 The Solution: Context API

Context provides a way to pass data through the component tree without passing props down manually at every level.

### Creating and Using Context

```jsx
// 1. Create a context
import React, { createContext, useState, useContext } from 'react';

// Create the context with a default value
const UserContext = createContext(null);

// 2. Create a provider component
function UserProvider({ children }) {
  const [user, setUser] = useState({
    id: 1,
    name: 'John Doe',
    role: 'Admin'
  });
  
  // Login and logout functions
  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);
  
  // Value to be provided to consumers
  const value = {
    user,
    login,
    logout
  };
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// 3. Create a custom hook for using this context
function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// Export the provider and hook
export { UserProvider, useUser };
```

### Using Context in the App

```jsx
// App.js
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <UserProvider>
      <div className="app">
        <Header />
        <MainContent />
        <Footer />
      </div>
    </UserProvider>
  );
}

// Header.js
import { useUser } from './contexts/UserContext';

function Header() {
  const { user, logout } = useUser();
  
  return (
    <header>
      <h1>Issue Tracker</h1>
      {user ? (
        <div>
          <span>Welcome, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button>Login</button>
      )}
    </header>
  );
}

// UserInfo.js (deep in the component tree)
import { useUser } from './contexts/UserContext';

function UserInfo() {
  const { user } = useUser();
  
  if (!user) return <div>Please log in</div>;
  
  return (
    <div className="user-info">
      <h2>{user.name}</h2>
      <p>Role: {user.role}</p>
    </div>
  );
}
```

---

## 🔄 Context vs. Props

| Feature | Context | Props |
|---------|---------|-------|
| Data Flow | Top-down, skipping intermediate components | Parent to direct child only |
| Component Coupling | Lower coupling | Tighter coupling |
| Component Reuse | More reusable | Less reusable with deep prop chains |
| Performance | Can cause unnecessary re-renders | More optimized for local state |
| Complexity | Higher for simple cases | Lower for direct parent-child |
| Debugging | Can be harder to track | Clear data flow |
| Use Case | Global themes, user data, preferences | Component-specific data |

---

## 🧩 Multiple Contexts

You can create and use multiple contexts for different aspects of your application:

```jsx
// Theme context
const ThemeContext = createContext('light');

// Language context
const LanguageContext = createContext('en');

// User context (from earlier example)
const UserContext = createContext(null);

// Combining all contexts
function App() {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <LanguageContext.Provider value={{ language, setLanguage }}>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
}

// Custom hooks for each context
function useTheme() {
  return useContext(ThemeContext);
}

function useLanguage() {
  return useContext(LanguageContext);
}

// Using multiple contexts in a component
function SettingsPanel() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { user } = useUser();
  
  // Component implementation...
}
```

---

## 🛠️ Context with Reducer Pattern

For complex state logic, combine Context with useReducer:

```jsx
import React, { createContext, useContext, useReducer } from 'react';

// Define the initial state
const initialState = {
  issues: [],
  loading: false,
  error: null
};

// Create a reducer function
function issuesReducer(state, action) {
  switch (action.type) {
    case 'FETCH_ISSUES_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_ISSUES_SUCCESS':
      return { ...state, loading: false, issues: action.payload };
    case 'FETCH_ISSUES_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_ISSUE':
      return { ...state, issues: [...state.issues, action.payload] };
    case 'UPDATE_ISSUE':
      return {
        ...state,
        issues: state.issues.map(issue => 
          issue.id === action.payload.id ? action.payload : issue
        )
      };
    case 'DELETE_ISSUE':
      return {
        ...state,
        issues: state.issues.filter(issue => issue.id !== action.payload)
      };
    default:
      return state;
  }
}

// Create the context
const IssuesContext = createContext();

// Create a provider component
function IssuesProvider({ children }) {
  const [state, dispatch] = useReducer(issuesReducer, initialState);
  
  // Actions
  const fetchIssues = async () => {
    dispatch({ type: 'FETCH_ISSUES_START' });
    try {
      const response = await fetch('http://localhost:8080/issues');
      const data = await response.json();
      dispatch({ type: 'FETCH_ISSUES_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_ISSUES_ERROR', payload: error.message });
    }
  };
  
  const addIssue = async (issue) => {
    try {
      const response = await fetch('http://localhost:8080/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issue)
      });
      const newIssue = await response.json();
      dispatch({ type: 'ADD_ISSUE', payload: newIssue });
      return newIssue;
    } catch (error) {
      console.error('Error adding issue:', error);
      throw error;
    }
  };
  
  // More actions...
  
  return (
    <IssuesContext.Provider value={{ 
      ...state, 
      fetchIssues,
      addIssue,
      // Other actions...
    }}>
      {children}
    </IssuesContext.Provider>
  );
}

// Custom hook
function useIssues() {
  const context = useContext(IssuesContext);
  if (context === undefined) {
    throw new Error('useIssues must be used within an IssuesProvider');
  }
  return context;
}

export { IssuesProvider, useIssues };
```

### Using the Context+Reducer Pattern

```jsx
function IssueTracker() {
  const { issues, loading, error, fetchIssues } = useIssues();
  
  useEffect(() => {
    fetchIssues();
  }, []);
  
  if (loading) return <div>Loading issues...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>Issues</h1>
      <table>
        {/* Table implementation */}
      </table>
    </div>
  );
}

function AddIssueForm() {
  const { addIssue } = useIssues();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'OPEN'
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addIssue(formData);
      // Reset form or navigate
    } catch (error) {
      // Handle error
    }
  };
  
  // Form implementation...
}
```

---

## ⚠️ Context Performance Considerations

Context has some performance implications:

1. **Granular Contexts**: Split your global state into multiple, focused contexts
2. **Memoization**: Use `useMemo` and `React.memo` to prevent unnecessary re-renders
3. **Context Splitting**: Don't put rapidly changing values in the same context as rarely changing ones

```jsx
// Optimize with memoization
import React, { useMemo } from 'react';

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  // Memoize the context value
  const themeValue = useMemo(() => ({ theme, setTheme }), [theme]);
  
  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Optimize consuming component
const ThemedButton = React.memo(function ThemedButton({ onClick, label }) {
  const { theme } = useTheme();
  
  return (
    <button 
      className={`btn btn-${theme}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
});
```

---

## 📊 Context vs. Redux

| Feature | Context API | Redux |
|---------|-------------|-------|
| Setup Complexity | Low | Medium to High |
| Learning Curve | Gentle (built-in React) | Steeper (new concepts) |
| Boilerplate | Minimal | More extensive |
| Middleware | Roll your own | Built-in support |
| DevTools | Limited | Excellent |
| Performance | Can cause unnecessary re-renders | Optimized with selectors |
| Time-Travel Debugging | No | Yes |
| Community/Ecosystem | React built-in | Large ecosystem |
| Best For | Small to medium apps, specific slices of state | Large apps, complex state logic |

---

## 🛠️ When to Use Context

Context is ideal for:

1. **Theme data**: Dark/light mode, color schemes
2. **User authentication**: Current user, permissions
3. **Language preferences**: Internationalization (i18n)
4. **UI state**: Sidebar open/closed, modal visibility
5. **Medium-sized applications**: Too complex for prop drilling, but not needing Redux

---

## 🔀 Context Composition Pattern

For complex applications, consider using composition with contexts:

```jsx
// src/contexts/index.js
export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <IssuesProvider>
            {children}
          </IssuesProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// src/index.js
import { AppProviders } from './contexts';

ReactDOM.render(
  <AppProviders>
    <App />
  </AppProviders>,
  document.getElementById('root')
);
```

---

## 📝 Summary

- **Context API** provides a way to share state across components without prop drilling
- **useContext** hook makes consuming context values easy
- **Multiple contexts** can be used for different aspects of your application
- **Context + reducer** pattern handles complex state management
- **Performance optimization** is important when using context
- **Context is ideal** for theme, auth, preferences, and medium-sized applications

Context API offers a powerful built-in solution for state management in React applications, striking a balance between simplicity and functionality.