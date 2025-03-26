
Steps:
0. Allow requests from react to spring boot - CORS error.
Add this Annotation on Spring boot controller.
```java
@RestController
@CrossOrigin(origins = "http://localhost:3000") <------------// Allow requests from React
@RequestMapping("/issues")
public class IssueController {
    private final IssueService issueService;

```

1. Create new react project for your project.
**> npx create-react-app issue-tracker-frontend**

2. Start app using
```bash
npm start
```

4. Create basic component and use rediarection.
**in Task.js**
```jsx
function Task() {
    return (
        <div>
            <h1>Hello this is a Task.</h1>
        </div>
    )
}
export default Task;
```

**in App.js**
```jsx
import Task from './Task.js';
function App() {
  return (
    <Task />
  );
}
export default App;
```
3. Add Redirection.
install react router using below
**npm install react-router-dom**

```jsx
import Counter from './Counter';
import Greetings from './Greetings';
import Task from './Task';
import Users from './Users';
import Task from './Task.js';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <h1>Hello There</h1>
        <Link to="/">Counter</Link>
        <Link to="/greetings">Greetings</Link>
        <Link to="/users">Users</Link>
        <Routes>
          <Route path="/" element={<Counter />} />
          <Route path="/greetings" element={<Greetings />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
```

4. Fetch data from backend and display in table.
```jsx
import React, {useState, useEffect} from "react";
function Users()
{
    const [users, setUsers] = useState([]);

    useEffect(
    () => {
        fetch("http://localhost:8080/users")
        .then((Response) => Response.json())
        .then((data) => {
            setUsers(data);
            console.log(data);
        })
    }, [])

    return (
        <div>
            <table>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Email</th>
                </tr>
                {users.map((user) => (
                    <tr>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                    </tr>
                ))}
                </table>
        </div>
    );
}

export default Users;
```


5. Add User Page
```jsx

import React, { useState } from 'react';
function AddUser() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState(''); 
    const [role, setRole] = useState('');

    function handleSubmit(e) {
        // prevent the default form submission
        e.preventDefault();
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Role:', role); 
        fetch('http://localhost:8080/register',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, role }),
            }
        )
        // everything is ok.
        .then((response) => response.json())
        .then(() => window.alert('User added successfully!'))
        // if there is an error.
        .catch((error) => console.error('Error:', error))
        // finally clear the form.
        .finally(() => {
            // clear the form
        });
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="role">Role:</label>
                    <input
                        type="text"
                        id="role"
                        name="role"
                        onChange={(e) => setRole(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
                </form>
        </div>
    )
}

export default AddUser;
```

