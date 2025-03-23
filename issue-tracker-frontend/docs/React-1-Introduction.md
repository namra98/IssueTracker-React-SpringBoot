---
marp: true
theme: default
class: invert
paginate: true
---

# 1️⃣ Why React?
## How it's different from Vanilla JS and other frameworks

---

## ❓ Why do we need React?

Before React, developers built UI using Vanilla JavaScript or jQuery. However, these approaches had limitations:

* **Manual DOM Manipulation**: Updating the DOM manually is slow and error-prone.
* **Complex UI State Management**: Large applications required complex logic to sync UI with data.
* **Poor Code Reusability**: Reusing components across applications was difficult.

React was introduced by Facebook in 2013 to solve these problems with **Component-Based Architecture** and **Virtual DOM**.

---

## Traditional DOM Manipulation

```javascript
// Creating elements
const container = document.createElement('div');
const header = document.createElement('h1');
header.textContent = 'User Profile';
container.appendChild(header);

// Event handling
const button = document.createElement('button');
button.textContent = 'Update Profile';
button.addEventListener('click', function() {
  // Update DOM elements manually
  header.textContent = 'Updated Profile';
  // More manual updates...
});
container.appendChild(button);

document.body.appendChild(container);
```

**Problems:** Complex code, direct DOM access, difficult to maintain as application grows

---

## The React Way

```jsx
function UserProfile() {
  const [isUpdated, setIsUpdated] = React.useState(false);
  
  return (
    <div>
      <h1>{isUpdated ? 'Updated Profile' : 'User Profile'}</h1>
      <button onClick={() => setIsUpdated(true)}>
        Update Profile
      </button>
    </div>
  );
}

ReactDOM.render(<UserProfile />, document.getElementById('root'));
```

**Benefits:** Declarative code, React handles DOM updates, easy to understand flow

---

## 🔄 React vs. Vanilla JavaScript

| Feature | Vanilla JS | React |
|---------|------------|-------|
| UI Updates | Manual DOM manipulation | Virtual DOM for efficient updates |
| Code Reusability | Limited | Component-based structure |
| State Management | Global variables, localStorage | useState, Redux, Context API |
| Routing | Uses `window.location` | React Router for declarative navigation |
| Performance | Direct DOM changes are slow | Virtual DOM optimizes rendering |

---

## Component-Based Architecture

React components are like building blocks for your UI:

```jsx
// A reusable Button component
function Button({ text, onClick }) {
  return (
    <button className="custom-button" onClick={onClick}>
      {text}
    </button>
  );
}

// Using the Button component in multiple places
function App() {
  return (
    <div>
      <h1>My Application</h1>
      <Button text="Login" onClick={() => console.log('Login clicked')} />
      <Button text="Signup" onClick={() => console.log('Signup clicked')} />
      <Button text="Help" onClick={() => console.log('Help clicked')} />
    </div>
  );
}
```

This promotes reusability, maintainability, and separation of concerns.

---

## Virtual DOM Advantage

When data changes in a React application:
1. React builds a new Virtual DOM tree
2. Compares it with the previous one (diffing)
3. Calculates the minimal number of changes needed
4. Updates only those specific parts in the real DOM

---

## Why React is Popular Among Developers

* **Declarative Syntax**: Describe what your UI should look like, not how to change it
* **Strong Community Support**: Extensive libraries, tools, and learning resources
* **Backed by Facebook**: Maintained by a large company with significant resources
* **Large Ecosystem**: Libraries like Redux, React Router, and styled-components
* **Cross-Platform Development**: React Native for mobile apps, React-VR for VR
* **Job Market Demand**: One of the most sought-after skills in web development

---

## React's Developer Experience

* **Component DevTools**: Browser extensions for debugging React applications
* **Hot Reloading**: See changes without refreshing the entire page
* **Create React App**: Zero configuration setup
* **Error Boundaries**: Catch and handle errors gracefully
* **React Strict Mode**: Highlight potential problems during development

---

## When to Use React?

* **Single Page Applications (SPAs)**: Complex web applications with multiple views
* **Interactive UIs**: Applications with frequent UI updates
* **Large-Scale Applications**: Projects with multiple developers working together
* **When Performance Matters**: Applications that need to be fast and responsive

*React might be overkill for simple static websites or small projects with minimal interactivity.*

---

## Industry Adoption

Big companies using React:
- Facebook/Meta
- Instagram
- Netflix
- Airbnb
- Dropbox
- Reddit
- Twitter
- Uber
- PayPal
- Discord

This widespread adoption means learning React is a valuable career investment.