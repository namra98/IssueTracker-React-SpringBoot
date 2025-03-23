# 8️⃣ API Integration with Fetch & Axios

---

## ❓ What is API Integration?

API (Application Programming Interface) integration is the process of enabling communication between your frontend React application and backend services. It allows your React application to:

- **Retrieve data** from databases or external services
- **Send data** to be processed or stored
- **Update existing information** on the server
- **Delete resources** when necessary

Modern web applications are rarely self-contained. Instead, they act as clients that interact with servers through well-defined APIs, typically using HTTP requests.

---

## 🌐 HTTP Request Lifecycle

Understanding the HTTP request lifecycle is crucial for API integration:

1. **Client initiates request**: Your React app sends an HTTP request to a server
2. **Server processes request**: The server receives, validates, and processes the request
3. **Server returns response**: Contains status code, headers, and optional response body
4. **Client handles response**: Your React app processes the response (success or error)

This process is **asynchronous**, meaning your application continues running while waiting for the response.

---

## 🧰 API Integration Options in React

React doesn't have a built-in way to make HTTP requests. Instead, you can use:

### 1. Fetch API
- Built into modern browsers
- Promise-based
- Minimal abstraction over HTTP
- No need for external dependencies

### 2. Axios
- External library (requires installation)
- Promise-based
- More features than Fetch
- Consistent interface across browsers
- Automatic JSON parsing
- Request/response interception

### 3. Other libraries
- React Query
- SWR (Stale-While-Revalidate)
- Apollo Client (for GraphQL)

We'll focus on the two most common options: Fetch API and Axios.

---

## 📤 HTTP Methods for CRUD Operations

APIs typically follow REST principles and use different HTTP methods for different operations:

| HTTP Method | CRUD Operation | Description |
|-------------|----------------|-------------|
| GET | Read | Retrieve data from the server |
| POST | Create | Send data to create a new resource |
| PUT/PATCH | Update | Modify an existing resource (PUT replaces, PATCH modifies) |
| DELETE | Delete | Remove a resource |

---

## 🔍 Fetch API In-Depth

The Fetch API provides a modern interface for making HTTP requests. It returns Promises, making it compatible with async/await syntax.

### Key Concepts:

1. **The `fetch()` function**: Takes a URL and optional configuration object
2. **Response object**: What fetch returns, needs to be parsed
3. **Two-step process**: First check if response is OK, then parse data

### Basic GET Request Pattern:

```jsx
fetch('https://api.example.com/data')
  .then(response => {
    // First check if the response is OK (status 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // Then parse the response body as JSON
    return response.json();
  })
  .then(data => {
    // Now we can work with the parsed data
    console.log(data);
  })
  .catch(error => {
    // Handle any errors that occurred
    console.error('Fetch error:', error);
  });
```

### Using Fetch with async/await:

```jsx
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error; // Re-throw to handle in the component
  }
}
```

### Common Response Parsing Methods:

- `response.json()` - Parse as JSON
- `response.text()` - Get as plain text
- `response.blob()` - Handle binary data (like images)
- `response.formData()` - Form data
- `response.arrayBuffer()` - Raw data buffer

---

## 🔄 Making Different Types of Requests with Fetch

### GET Request (Retrieving Data)

```jsx
// In our IssueDetails component
useEffect(() => {
  fetch(`http://localhost:8080/issues/${id}`)
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch issue');
      return response.json();
    })
    .then(data => {
      setIssue(data);
      setFormData({
        title: data.title,
        description: data.description,
        status: data.status,
        user: data.user
      });
    })
    .catch(error => console.error('Error:', error));
}, [id]);
```

### POST Request (Creating Data)

POST requests send data to create a new resource:

```jsx
// Create a new issue
const createIssue = (newIssue) => {
  fetch('http://localhost:8080/issues', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newIssue)
  })
    .then(response => {
      if (!response.ok) throw new Error('Failed to create issue');
      return response.json();
    })
    .then(data => {
      console.log('Issue created:', data);
      // Navigate to issue list or the new issue details
    })
    .catch(error => console.error('Error:', error));
};
```

### PUT Request (Updating Data)

PUT requests update an existing resource by replacing it entirely:

```jsx
// Update an existing issue
const handleFormSubmit = (e) => {
  e.preventDefault();
  fetch(`http://localhost:8080/issues/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
    .then(response => {
      if (!response.ok) throw new Error('Failed to update issue');
      return response.json();
    })
    .then(data => {
      setIssue(data);
      setIsEditing(false);
    })
    .catch(error => console.error('Error updating issue:', error));
};
```

### DELETE Request (Removing Data)

DELETE requests remove a resource:

```jsx
// Delete an issue
const handleDelete = (id) => {
  fetch(`http://localhost:8080/issues/${id}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (!response.ok) throw new Error('Failed to delete issue');
      
      // Remove from UI (no content typically returned from DELETE)
      setIssues(issues.filter(issue => issue.id !== id));
    })
    .catch(error => console.error('Error:', error));
};
```

---

## 🛡️ Understanding HTTP Headers

Headers provide metadata about the request or response. Common headers include:

### Request Headers:
- `Content-Type`: Specifies the format of the data (e.g., `application/json`)
- `Authorization`: For authentication (e.g., `Bearer token`)
- `Accept`: Indicates what content types the client can process

### Response Headers:
- `Content-Type`: Format of the returned data
- `Cache-Control`: Directives for caching
- `Content-Length`: Size of the response body

### Setting Headers with Fetch:

```jsx
fetch('http://localhost:8080/issues', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  },
  body: JSON.stringify(newIssue)
})
```

---

## 📦 Axios: A Better Alternative?

Axios is a popular HTTP client library that offers several advantages over the Fetch API:

### Key Advantages:

1. **Automatic JSON parsing**: No need to call `.json()`
2. **Request/response interceptors**: Modify requests or responses globally
3. **Better error handling**: Errors for bad status codes by default
4. **Request cancellation**: Cancel requests that are no longer needed
5. **Timeout configuration**: Set request timeouts easily
6. **Cross-browser compatibility**: Works consistently across browsers
7. **Simpler syntax**: Less boilerplate code

### Installing Axios:

```bash
npm install axios
```

### Basic Axios Example:

```jsx
import axios from 'axios';

// GET request
axios.get('http://localhost:8080/issues')
  .then(response => {
    // Data is already parsed as JSON
    console.log(response.data);
  })
  .catch(error => {
    // Error handling is simpler
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error message:', error.message);
    }
  });
```

### CRUD Operations with Axios:

```jsx
// GET: Read data
axios.get(`http://localhost:8080/issues/${id}`)
  .then(response => setIssue(response.data))
  .catch(error => console.error(error));

// POST: Create data
axios.post('http://localhost:8080/issues', newIssue)
  .then(response => console.log('Created:', response.data))
  .catch(error => console.error(error));

// PUT: Update data
axios.put(`http://localhost:8080/issues/${id}`, updatedIssue)
  .then(response => console.log('Updated:', response.data))
  .catch(error => console.error(error));

// DELETE: Remove data
axios.delete(`http://localhost:8080/issues/${id}`)
  .then(() => removeIssueFromState(id))
  .catch(error => console.error(error));
```

---

## 🔧 Creating an API Service Layer

A best practice in React applications is to centralize API calls in a service layer. This:

1. **Separates concerns**: Keeps API logic separate from component logic
2. **Promotes reusability**: API functions can be used across components
3. **Simplifies testing**: API calls can be mocked easily
4. **Enables consistency**: Error handling and authentication in one place

### Creating an Axios Instance:

```jsx
// src/services/api.js
import axios from 'axios';

// Create a pre-configured axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor for global error handling
api.interceptors.response.use(
  response => response,
  error => {
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      // Redirect to login or refresh token
      console.log('Session expired');
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Creating Service Functions:

```jsx
// src/services/issueService.js
import api from './api';

// Get all issues (with optional filter)
export const getIssues = async (filters = {}) => {
  try {
    const response = await api.get('/issues', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching issues:', error);
    throw error;
  }
};

// Get a single issue by ID
export const getIssueById = async (id) => {
  try {
    const response = await api.get(`/issues/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching issue ${id}:`, error);
    throw error;
  }
};

// Create a new issue
export const createIssue = async (issueData) => {
  try {
    const response = await api.post('/issues', issueData);
    return response.data;
  } catch (error) {
    console.error('Error creating issue:', error);
    throw error;
  }
};

// Update an existing issue
export const updateIssue = async (id, issueData) => {
  try {
    const response = await api.put(`/issues/${id}`, issueData);
    return response.data;
  } catch (error) {
    console.error(`Error updating issue ${id}:`, error);
    throw error;
  }
};

// Delete an issue
export const deleteIssue = async (id) => {
  try {
    await api.delete(`/issues/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting issue ${id}:`, error);
    throw error;
  }
};
```

---

## 🔄 Managing API State in React Components

When integrating APIs with React components, managing loading, success, and error states is crucial for a good user experience:

### 1. Loading States
Show the user that data is being loaded:

```jsx
function IssueTracker() {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    getIssues()
      .then(data => {
        setIssues(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);
  
  if (isLoading) {
    return <div className="loading-spinner">Loading issues...</div>;
  }
  
  return (
    // Render issues table
  );
}
```

### 2. Error States
Handle and display errors appropriately:

```jsx
function IssueDetails() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    getIssueById(id)
      .then(data => {
        setIssue(data);
        setIsLoading(false);
      })
      .catch(error => {
        setError('Failed to load issue details. Please try again.');
        setIsLoading(false);
        console.error(error);
      });
  }, [id]);
  
  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!issue) return <div className="not-found">Issue not found</div>;
  
  return (
    // Render issue details
  );
}
```

### 3. Success States and Feedback
Provide feedback when operations succeed:

```jsx
function AddIssue() {
  const [formData, setFormData] = useState({/*...*/});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const newIssue = await createIssue(formData);
      setSuccessMessage('Issue created successfully!');
      
      // Navigate after brief delay to show success message
      setTimeout(() => {
        navigate(`/issue-details/${newIssue.id}`);
      }, 1500);
    } catch (error) {
      setError('Failed to create issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {error && <div className="error-message">{error}</div>}
      {/* Form fields */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Issue'}
      </button>
    </form>
  );
}
```

---

## 🔒 Authentication and Authorization

Most APIs require authentication to identify the user and determine what they're allowed to do:

### 1. Token-Based Authentication

JWT (JSON Web Token) is a common authentication method:

```jsx
// Login service
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    const { token } = response.data;
    
    // Store token in localStorage or secure cookie
    localStorage.setItem('token', token);
    
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Logout service
export const logout = () => {
  localStorage.removeItem('token');
  // Redirect to login page
};
```

### 2. Protecting Routes

Prevent unauthorized users from accessing certain pages:

```jsx
function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }
    
    // Verify token validity with the server
    api.get('/auth/verify')
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch(() => {
        // Token invalid
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  
  if (isLoading) {
    return <div>Checking authentication...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Usage in routes
<Route 
  path="/issues" 
  element={
    <ProtectedRoute>
      <IssueTracker />
    </ProtectedRoute>
  } 
/>
```

---

## 🧹 Error Handling Best Practices

Proper error handling is essential for API integration:

### 1. Specific Error Messages

```jsx
try {
  await updateIssue(id, formData);
} catch (error) {
  if (error.response) {
    switch (error.response.status) {
      case 400:
        setError('Invalid input. Please check your data.');
        break;
      case 401:
        setError('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
        break;
      case 403:
        setError('You do not have permission to update this issue.');
        break;
      case 404:
        setError('Issue not found. It may have been deleted.');
        break;
      case 500:
        setError('Server error. Please try again later.');
        break;
      default:
        setError('An error occurred. Please try again.');
    }
  } else if (error.request) {
    setError('No response from server. Please check your connection.');
  } else {
    setError('Error preparing request. Please try again.');
  }
}
```

### 2. Global Error Handling

Use Axios interceptors for consistent error handling:

```jsx
// In api.js
api.interceptors.response.use(
  response => response,
  error => {
    // Log errors to monitoring service
    logErrorToService(error);
    
    // Handle common errors globally
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized globally
          redirectToLogin();
          break;
        case 503:
          // Show maintenance message
          showMaintenanceAlert();
          break;
      }
    } else if (!navigator.onLine) {
      // Show offline message
      showOfflineAlert();
    }
    
    return Promise.reject(error);
  }
);
```

---

## 🚀 Advanced API Integration Techniques

### 1. Request Cancellation

Cancel requests that are no longer needed (e.g., when a component unmounts):

```jsx
function SearchIssues() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    // Skip if query is empty
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    // Create cancel token
    const cancelToken = axios.CancelToken.source();
    
    api.get('/issues/search', {
      params: { q: query },
      cancelToken: cancelToken.token
    })
      .then(response => {
        setResults(response.data);
      })
      .catch(error => {
        if (!axios.isCancel(error)) {
          console.error('Search error:', error);
        }
      });
    
    // Cleanup: cancel request if component unmounts or query changes
    return () => {
      cancelToken.cancel();
    };
  }, [query]);
  
  // Render search UI
}
```

### 2. Optimistic Updates

Update the UI before the server confirms the change for a more responsive feel:

```jsx
function IssueTracker() {
  const [issues, setIssues] = useState([]);
  
  const handleStatusChange = async (id, newStatus) => {
    // Copy the current issues
    const originalIssues = [...issues];
    
    // Find the issue to update
    const issueIndex = issues.findIndex(issue => issue.id === id);
    if (issueIndex === -1) return;
    
    // Create updated issue
    const updatedIssue = { 
      ...issues[issueIndex], 
      status: newStatus 
    };
    
    // Update locally first (optimistic update)
    const newIssues = [...issues];
    newIssues[issueIndex] = updatedIssue;
    setIssues(newIssues);
    
    try {
      // Send update to server
      await updateIssue(id, { status: newStatus });
      // Success, no need to do anything else
    } catch (error) {
      // If error, revert to original state
      setIssues(originalIssues);
      // Show error
      alert('Failed to update status. Please try again.');
    }
  };
  
  // Render issues table with status controls
}
```

### 3. Data Caching

Cache API responses to reduce unnecessary requests:

```jsx
// Simple cache implementation
const cache = {
  data: {},
  set: function(key, data, ttl = 60000) {
    this.data[key] = {
      data,
      expiry: Date.now() + ttl
    };
  },
  get: function(key) {
    const entry = this.data[key];
    if (!entry) return null;
    
    if (entry.expiry < Date.now()) {
      delete this.data[key];
      return null;
    }
    
    return entry.data;
  }
};

// Example usage in service
export const getIssueById = async (id) => {
  const cacheKey = `issue_${id}`;
  const cachedData = cache.get(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }
  
  try {
    const response = await api.get(`/issues/${id}`);
    
    // Cache for 5 minutes
    cache.set(cacheKey, response.data, 5 * 60 * 1000);
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching issue ${id}:`, error);
    throw error;
  }
};
```

---

## 📝 Summary

API integration is a fundamental aspect of modern React applications:

1. **HTTP Communication**: Understand the request-response cycle
2. **API Client Options**:
   - Fetch API: Built-in, basic functionality
   - Axios: Enhanced features, better developer experience

3. **Best Practices**:
   - Create a service layer to centralize API calls
   - Handle loading, error, and success states properly
   - Implement authentication and authorization
   - Use techniques like request cancellation and optimistic updates

4. **Error Handling**:
   - Provide specific, user-friendly error messages
   - Implement global error handling for common cases
   - Always have fallback UI for error states

By following these principles, you can create React applications that effectively communicate with backend services while providing a smooth user experience.