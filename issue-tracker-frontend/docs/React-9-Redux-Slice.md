# 9️⃣ Redux Toolkit & Slice - Modern State Management

---

## ❓ What is Redux?

Redux is a predictable state container for JavaScript applications, commonly used with React for managing complex application state.

- **Centralized State**: All application data in one place
- **Predictable Updates**: State changes follow a strict pattern
- **Debugging**: Time-travel debugging, action logs
- **Middleware**: For async operations, logging, etc.

---

## 🔄 Redux Flow

Traditional Redux follows this flow:

1. **Actions**: Plain objects describing what happened
2. **Dispatching**: Sending actions to the store
3. **Reducers**: Pure functions that update state based on actions
4. **Store**: Holds the state and handles updates

This flow can be verbose, requiring many files and boilerplate code.

---

## 🧰 Redux Toolkit: The Modern Solution

Redux Toolkit (RTK) simplifies Redux development with:

- Less boilerplate code
- Built-in best practices
- Simpler syntax and patterns
- Better developer experience

```bash
# Installation
npm install @reduxjs/toolkit react-redux
```

---

## 🍕 What is a Slice?

In Redux Toolkit, a "slice" is a collection of Redux reducer logic and actions for a single feature:

- Combines reducers, actions, and action creators
- Named after "slicing" the Redux store into manageable pieces
- Each slice handles a specific portion of your application state

---

## 📝 Creating a Slice

Let's create an issues slice for our Issue Tracker:

```jsx
// src/features/issues/issuesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIssues, createIssue, updateIssue, deleteIssue } from '../../services/issueService';

// Async thunk for fetching issues
export const fetchIssues = createAsyncThunk(
  'issues/fetchIssues',
  async () => {
    const response = await getIssues();
    return response;
  }
);

// Slice definition
const issuesSlice = createSlice({
  name: 'issues',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {
    // Standard reducer logic, with auto-generated action creators
    addIssue: (state, action) => {
      state.items.push(action.payload);
    },
    removeIssue: (state, action) => {
      state.items = state.items.filter(issue => issue.id !== action.payload);
    },
    updateIssueStatus: (state, action) => {
      const { id, status } = action.payload;
      const issue = state.items.find(issue => issue.id === id);
      if (issue) {
        issue.status = status;
      }
    }
  },
  extraReducers: (builder) => {
    // Handle async action lifecycle
    builder
      .addCase(fetchIssues.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchIssues.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

// Export actions and reducer
export const { addIssue, removeIssue, updateIssueStatus } = issuesSlice.actions;
export default issuesSlice.reducer;
```

---

## 🛠️ Setting Up the Redux Store

Create a centralized store with all your slices:

```jsx
// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import issuesReducer from '../features/issues/issuesSlice';
import userReducer from '../features/user/userSlice';

export const store = configureStore({
  reducer: {
    issues: issuesReducer,
    user: userReducer
  }
});
```

---

## 🔌 Connecting Redux to React

Provide the store to your React application:

```jsx
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

---

## 🧩 Using Redux in Components

Access and update state from any component:

```jsx
// src/components/IssueTracker.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchIssues, removeIssue } from '../features/issues/issuesSlice';
import { useNavigate } from 'react-router-dom';

function IssueTracker() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Select data from store
  const { items: issues, status, error } = useSelector(state => state.issues);
  
  // Dispatch action on component mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchIssues());
    }
  }, [status, dispatch]);
  
  // Handle delete with Redux
  const handleDelete = (id) => {
    dispatch(removeIssue(id));
    deleteIssue(id); // API call
  };
  
  // Loading state
  if (status === 'loading') {
    return <div>Loading issues...</div>;
  }
  
  // Error state
  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }
  
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

## 🔄 Thunks for Async Operations

Redux Toolkit's `createAsyncThunk` makes async operations simple:

```jsx
// Create a new issue with API call and Redux update
export const createNewIssue = createAsyncThunk(
  'issues/createNewIssue',
  async (issueData, { rejectWithValue }) => {
    try {
      const response = await createIssue(issueData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Usage in component
const dispatch = useDispatch();

const handleSubmit = async (formData) => {
  try {
    const resultAction = await dispatch(createNewIssue(formData));
    if (createNewIssue.fulfilled.match(resultAction)) {
      // Success - navigate to issue list
      navigate('/');
    }
  } catch (error) {
    // Handle error
    console.error('Failed to create issue:', error);
  }
};
```

---

## 💡 Redux Toolkit Benefits

1. **Simplified Code**: Reducers, actions, and types in one file
2. **Immutability Built-in**: Uses Immer for safe state updates
3. **DevTools Integration**: Better debugging experience
4. **Performance Optimizations**: Out of the box
5. **TypeScript Support**: Excellent type definitions

---

## 📋 When to Use Redux?

Redux is ideal for:

- Medium to large applications
- Complex state logic
- Shared state across many components
- Team development with clear patterns

For smaller apps, consider using React's Context API or local component state.

---

## 📝 Summary

- **Redux Toolkit** simplifies Redux development
- **Slices** organize state logic by feature
- **createAsyncThunk** handles async operations
- **useSelector** and **useDispatch** connect components
- **Immutable updates** are handled automatically
- **DevTools** provide powerful debugging

Redux and Redux Toolkit provide a robust solution for state management in larger React applications, with slices making it more modular and maintainable.