# 6️⃣ React Hooks - useState & useEffect

---

## ❓ What are React Hooks?

Hooks are functions that let you use state and other React features in functional components. The two most essential hooks are:

* `useState` - For managing component state
* `useEffect` - For handling side effects (API calls, subscriptions, etc.)

---

## 🔄 useState Hook

The `useState` hook lets functional components maintain state:

```jsx
// Basic syntax
const [state, setState] = useState(initialValue);
```

### Using useState in our Issue Tracker:

```jsx
import React, { useState } from 'react';

function IssueTracker() {
  // Define state for our issues list
  const [issues, setIssues] = useState([]);
  
  // Example usage
  const handleDelete = async (id) => {
    await deleteIssue(id);
    // Update state by filtering out the deleted issue
    setIssues(issues.filter(issue => issue.id !== id));
  };
  
  return (
    // JSX rendering...
  );
}
```

### Key Points:

* `issues` is our state variable containing the array of issues
* `setIssues` is the function we call to update the state
* Initial state is an empty array `[]`
* When we delete an issue, we update the state with the filtered array

---

## 🌐 useEffect Hook

The `useEffect` hook handles side effects like data fetching:

```jsx
// Basic syntax
useEffect(() => {
  // Effect code (runs after render)
  
  return () => {
    // Cleanup function (optional)
  };
}, [dependencies]); // Re-run effect when dependencies change
```

### Using useEffect in our Issue Tracker:

```jsx
import React, { useState, useEffect } from 'react';
import { getIssues } from '../services/issueService';

function IssueTracker() {
  const [issues, setIssues] = useState([]);
  
  // Fetch issues when component mounts
  useEffect(() => {
    getIssues()
      .then(setIssues)
      .catch(console.error);
  }, []); // Empty dependency array means "run once after initial render"
  
  return (
    // JSX rendering...
  );
}
```

### Key Points:

* The effect fetches issues when the component first mounts
* Empty dependency array `[]` means it only runs once
* We use the `setIssues` function to update our state with the fetched data

---

## 💡 Our Complete Issue Tracker With Hooks

Let's break down how hooks are used in our complete component:

```jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIssues, deleteIssue } from '../services/issueService';

function IssueTracker() {
  // State hook - stores our issues array
  const [issues, setIssues] = useState([]);
  const navigate = useNavigate();

  // Effect hook - fetches data when component mounts
  useEffect(() => {
    getIssues().then(setIssues).catch(console.error);
  }, []);

  // Handler that updates state after deletion
  const handleDelete = async (id) => {
    await deleteIssue(id);
    setIssues(issues.filter(issue => issue.id !== id));
  };

  return (
    <div>
      <h1>Issue Tracker</h1>
      <button onClick={() => navigate('/add-issue')}>Add New Issue</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>User</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues.map(issue => (
            <tr key={issue.id}>
              <td>{issue.id}</td>
              <td>{issue.title}</td>
              <td>{issue.description}</td>
              <td>{issue.status}</td>
              <td>{issue.user?.name || 'N/A'}</td>
              <td>
                <button onClick={() => navigate(`/issue-details/${issue.id}`)}>Details</button>
                <button onClick={() => handleDelete(issue.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IssueTracker;
```

---

## 🔄 useState Common Patterns

### 1. Form inputs

```jsx
function AddIssue() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('OPEN');
  
  return (
    <form>
      <input 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {/* More form fields... */}
    </form>
  );
}
```

### 2. Form with a single object

```jsx
function AddIssue() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'OPEN'
  });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  return (
    <form>
      <input 
        name="title"
        value={formData.title}
        onChange={handleChange}
      />
      {/* More form fields... */}
    </form>
  );
}
```

---

## 🌐 useEffect Common Patterns

### 1. Data fetching when component mounts

```jsx
// From our IssueTracker example
useEffect(() => {
  getIssues().then(setIssues).catch(console.error);
}, []);
```

### 2. Data fetching when a parameter changes

```jsx
function IssueDetails({ issueId }) {
  const [issue, setIssue] = useState(null);
  
  useEffect(() => {
    getIssueById(issueId)
      .then(setIssue)
      .catch(console.error);
  }, [issueId]); // Re-fetch when issueId changes
  
  // Render issue details...
}
```

### 3. Clean up when component unmounts

```jsx
function IssueNotifications() {
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    // Set up websocket connection
    const socket = new WebSocket('ws://api.example.com/issues');
    
    socket.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications(prev => [...prev, newNotification]);
    };
    
    // Clean up when component unmounts
    return () => {
      socket.close();
    };
  }, []);
  
  // Render notifications...
}
```

---

## 🧰 Rules of Hooks

1. **Only call hooks at the top level** of your component
   - Don't put them in loops, conditions, or nested functions

2. **Only call hooks from React function components**
   - Don't call them from regular JavaScript functions

3. **Always include all dependencies** in the dependency array
   - Missing dependencies can cause stale data bugs

```jsx
// ❌ WRONG: Hooks in conditions
function IssueTracker() {
  if (someCondition) {
    useEffect(() => {/*...*/}, []); // This breaks the rules!
  }
}

// ✅ CORRECT: Condition inside the hook
function IssueTracker() {
  useEffect(() => {
    if (someCondition) {
      // Effect code here
    }
  }, [someCondition]);
}
```

---

## 🚫 Common Pitfalls to Avoid

### 1. Infinite loop with useEffect

```jsx
// ❌ WRONG: Missing dependency array
useEffect(() => {
  // This runs after EVERY render!
  fetchIssues().then(setIssues);
}); // No dependency array

// ✅ CORRECT: With empty dependency array
useEffect(() => {
  fetchIssues().then(setIssues);
}, []); // Only runs once
```

### 2. Forgetting the dependency array

When you use a state variable inside useEffect, include it in the dependency array if you want the effect to re-run when it changes:

```jsx
// Example: Filter issues when filter state changes
const [filter, setFilter] = useState('ALL');

useEffect(() => {
  getIssues(filter).then(setIssues).catch(console.error);
}, [filter]); // Re-fetch when filter changes
```

### 3. Directly mutating state

```jsx
// ❌ WRONG: Mutating array
const handleStatusChange = (id, newStatus) => {
  const issue = issues.find(i => i.id === id);
  issue.status = newStatus; // Direct mutation!
  setIssues(issues); // Won't trigger re-render properly
};

// ✅ CORRECT: Creating new array
const handleStatusChange = (id, newStatus) => {
  setIssues(issues.map(issue => 
    issue.id === id 
      ? { ...issue, status: newStatus } 
      : issue
  ));
};
```

---

## 📝 Summary

* **useState** lets functional components maintain and update state
* **useEffect** handles side effects like data fetching and subscriptions
* Use empty dependency array `[]` for effects that should run once
* Include variables in the dependency array if effect should re-run when they change
* Always follow the Rules of Hooks for reliable behavior
* Avoid mutating state directly - create new objects/arrays instead