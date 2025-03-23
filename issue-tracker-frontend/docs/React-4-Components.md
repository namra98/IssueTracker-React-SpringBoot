
# 4️⃣ React Components - Functional vs. Class Components

---

## ❓ What are Components?

Components are **reusable UI elements** that help build modular applications. There are two types:

1. **Class Components** (Older, uses ES6 classes)
2. **Functional Components** (Modern, uses hooks)

Components can be thought of as custom HTML elements that you create.

---

## 🚀 Functional Components (Recommended)

Functional components are **JavaScript functions** that return JSX:

```jsx
function Welcome() { 
  return <h1>Hello, React!</h1>; 
}
```

They use **hooks** (like `useState`, `useEffect`) to handle state and side effects:

```jsx
function Counter() {
  // State hook
  const [count, setCount] = useState(0);
  
  // Effect hook
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

---

## 🏛 Class Components (Old Style)

Class components extend `React.Component` and use `this.state`:

```jsx
class Welcome extends React.Component {
  render() { 
    return <h1>Hello, React!</h1>; 
  }
}
```

More complex class component with state and lifecycle methods:

```jsx
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    this.handleIncrement = this.handleIncrement.bind(this);
  }
  
  handleIncrement() {
    this.setState({ count: this.state.count + 1 });
  }
  
  componentDidUpdate() {
    document.title = `Count: ${this.state.count}`;
  }
  
  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.handleIncrement}>Increment</button>
      </div>
    );
  }
}
```

---

## Component Props

Props are inputs that components receive:

```jsx
// Defining the component
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Using the component
<Welcome name="React Learner" />
```

Props are read-only and help make components reusable with different data.

---

## Functional vs Class Components Comparison

| Feature | Functional Components | Class Components |
|---------|----------------------|------------------|
| Syntax | Simple functions | ES6 classes |
| State | Uses useState hook | Uses this.state |
| Lifecycle | Uses useEffect hook | Uses lifecycle methods |
| Performance | Generally better | Slightly more overhead |
| Context | useContext hook | static contextType or Consumer |
| References | useRef hook | createRef() |
| Code Size | Less boilerplate | More verbose |

---

## Why Functional Components are Preferred

✅ **Less boilerplate**: More concise and easier to read  
✅ **Better performance**: Smaller bundle size, faster rendering  
✅ **Hooks provide better state management**: More intuitive patterns  
✅ **Encourages function composition**: Better code reuse  
✅ **Easier testing**: Pure functions are simpler to test  
✅ **No `this` keyword confusion**: Avoids binding issues  
✅ **Future-focused**: Aligned with React team's direction  

---

## Component Composition

Components can be composed together to create complex UIs:

```jsx
function App() {
  return (
    <div className="app">
      <Header title="My React App" />
      <Sidebar>
        <Navigation items={navItems} />
        <UserProfile user={currentUser} />
      </Sidebar>
      <MainContent>
        <ArticleList articles={articles} />
      </MainContent>
      <Footer copyright="2025" />
    </div>
  );
}
```

This composition pattern is one of React's most powerful features.