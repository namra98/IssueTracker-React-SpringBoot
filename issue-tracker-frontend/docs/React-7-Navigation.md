# 7️⃣ React Router - Navigation Between Components

---

## ❓ What is React Router?

React Router is a standard library for routing in React that enables navigation between views in your application.

- Creates a **Single Page Application (SPA)** experience
- Manages URL changes without page reloads
- Provides access to URL parameters and history
- Handles nested routes and redirects

---

## 🛠️ Setting Up React Router

First, install React Router:

```bash
npm install react-router-dom
```

Then, wrap your application with `BrowserRouter`:

```jsx
// index.js or App.js
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
```

---

## 📍 Defining Routes

Routes in React Router define what component should be rendered when a URL matches a specific path:

```jsx
// App.js
import { Routes, Route } from 'react-router-dom';
import IssueTracker from './components/IssueTracker';
import IssueDetails from './components/IssueDetails';
import AddIssue from './components/AddIssue';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Issue Management System</h1>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<IssueTracker />} />
          <Route path="/issue-details/:id" element={<IssueDetails />} />
          <Route path="/add-issue" element={<AddIssue />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
```

### Key Components:

- `<Routes>`: Container for all Route components
- `<Route>`: Maps a URL path to a component
- `path="*"`: Catch-all route for handling 404s

---

## 🧭 Navigation in React Router

### 1. Using the `Link` Component

Links prevent full page reloads and use React Router's navigation:

```jsx
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <Link to="/">Issue List</Link>
      <Link to="/add-issue">Add New Issue</Link>
    </nav>
  );
}
```

### 2. Using the `useNavigate` Hook (Programmatic Navigation)

For navigation after form submissions or button clicks:

```jsx
// From our IssueTracker.js example
import { useNavigate } from 'react-router-dom';

function IssueTracker() {
  const navigate = useNavigate();
  
  return (
    <div>
      <button onClick={() => navigate('/add-issue')}>Add New Issue</button>
      
      {/* Table rows */}
      <button onClick={() => navigate(`/issue-details/${issue.id}`)}>
        Details
      </button>
      
      {/* Going back */}
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}
```

---

## 📌 URL Parameters with `useParams`

URL parameters allow you to capture values from the URL. For example, in the path `/issue-details/:id`, `:id` is a parameter:

```jsx
// From our IssueDetails.js example
import { useParams } from 'react-router-dom';

function IssueDetails() {
  // Extract the id parameter from the URL
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  
  useEffect(() => {
    // Use the id parameter in the API request
    fetch(`http://localhost:8080/issues/${id}`)
      .then(response => response.json())
      .then(data => {
        setIssue(data);
        setFormData({
          title: data.title,
          description: data.description,
          status: data.status,
          user: data.user
        });
      })
      .catch(error => console.error('Error fetching issue:', error));
  }, [id]);
  
  // Rest of component...
}
```

---

## 🔄 Putting It All Together

Let's see how our Issue Tracker application uses React Router:

### Step 1: Define Routes in App.js

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import IssueTracker from './components/IssueTracker';
import IssueDetails from './components/IssueDetails';
import AddIssue from './components/AddIssue';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header>
          <h1>Issue Management System</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<IssueTracker />} />
            <Route path="/issue-details/:id" element={<IssueDetails />} />
            <Route path="/add-issue" element={<AddIssue />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
```

### Step 2: Navigate Between Routes (IssueTracker.js)

```jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIssues, deleteIssue } from '../services/issueService';

function IssueTracker() {
  const [issues, setIssues] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getIssues().then(setIssues).catch(console.error);
  }, []);

  const handleDelete = async (id) => {
    await deleteIssue(id);
    setIssues(issues.filter(issue => issue.id !== id));
  };

  return (
    <div>
      <h1>Issue Tracker</h1>
      <button onClick={() => navigate('/add-issue')}>Add New Issue</button>
      <table>
        {/* Table header... */}
        <tbody>
          {issues.map(issue => (
            <tr key={issue.id}>
              {/* Table cells... */}
              <td>
                <button onClick={() => navigate(`/issue-details/${issue.id}`)}>
                  Details
                </button>
                <button onClick={() => handleDelete(issue.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Step 3: Access URL Parameters (IssueDetails.js)

```jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function IssueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    user: { name: '' }
  });

  useEffect(() => {
    fetch(`http://localhost:8080/issues/${id}`)
      .then(response => response.json())
      .then(data => {
        setIssue(data);
        setFormData({
          title: data.title,
          description: data.description,
          status: data.status,
          user: data.user
        });
      })
      .catch(error => console.error('Error fetching issue:', error));
  }, [id]);

  // Form handling logic...

  return (
    <div>
      <h1>Issue Details</h1>
      {/* Form or display... */}
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}
```

---

## 🧩 Advanced React Router Features

### 1. Nested Routes

Nest routes to create more complex layouts:

```jsx
function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <Link to="/dashboard/issues">Issues</Link>
        <Link to="/dashboard/users">Users</Link>
      </nav>
      
      <Routes>
        <Route path="issues" element={<IssueTracker />} />
        <Route path="users" element={<UserList />} />
      </Routes>
    </div>
  );
}

// In App.js
<Route path="/dashboard/*" element={<Dashboard />} />
```

### 2. Protected Routes

Restrict access to certain routes:

```jsx
function ProtectedRoute({ children }) {
  const isAuthenticated = checkAuthStatus(); // Your auth logic
  
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// In your Routes
<Route 
  path="/admin" 
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
```

### 3. useLocation Hook

Access current URL information:

```jsx
import { useLocation } from 'react-router-dom';

function AnalyticsTracker() {
  const location = useLocation();
  
  useEffect(() => {
    // Track page views when URL changes
    trackPageView(location.pathname);
  }, [location]);
  
  return null; // This component doesn't render anything
}
```

---

## 📝 Summary

React Router enables navigation in single-page applications by:

- Defining routes with the `<Route>` component
- Navigating with `<Link>` or the `useNavigate` hook
- Accessing URL parameters with `useParams`
- Supporting nested routes and protected routes

In our Issue Tracker application, we use React Router to navigate between:
- The issues list (`/`)
- Issue details (`/issue-details/:id`)
- Adding new issues (`/add-issue`)

This creates a seamless, app-like experience without full page reloads.