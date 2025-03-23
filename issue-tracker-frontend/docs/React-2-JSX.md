# 2️⃣ JSX - How It Works Under the Hood

---

## ❓ What is JSX?

JSX (JavaScript XML) is a syntax extension that allows writing HTML inside JavaScript. Example:

```jsx
const element = <h1>Hello, React!</h1>;
```

This isn't valid JavaScript. **Babel** (a compiler) converts it to:

```js
const element = React.createElement('h1', null, 'Hello, React!');
```

---

## 🛠 JSX to JavaScript Transformation

JSX is syntactic sugar for `React.createElement`. The following JSX:

```jsx
const App = () => <h1>Hello, World!</h1>;
```

Compiles to:

```js
const App = () => React.createElement('h1', null, 'Hello, World!');
```

---

## JSX with Multiple Elements

JSX with multiple elements:

```jsx
const App = () => (
  <div>
    <h1>Title</h1>
    <p>Paragraph</p>
  </div>
);
```

Compiles to:

```js
const App = () => React.createElement(
  'div',
  null,
  React.createElement('h1', null, 'Title'),
  React.createElement('p', null, 'Paragraph')
);
```

---

## JSX with Attributes and Props

JSX with attributes:

```jsx
const element = <img src="profile.jpg" alt="Profile" className="avatar" />;
```

Compiles to:

```js
const element = React.createElement(
  'img',
  { 
    src: 'profile.jpg', 
    alt: 'Profile', 
    className: 'avatar' 
  }
);
```

Note: We use `className` in JSX instead of HTML's `class` attribute.

---

## JSX with JavaScript Expressions

You can embed JavaScript expressions inside JSX using curly braces `{}`:

```jsx
const name = 'React User';
const element = <h1>Hello, {name}!</h1>;

// You can also use expressions in attributes
const imageUrl = 'profile.jpg';
const imageElement = <img src={imageUrl} />;

// Even function calls
const formatName = (user) => user.firstName + ' ' + user.lastName;
const greeting = <h1>Hello, {formatName(user)}!</h1>;
```

---

## JSX Children Elements

```jsx
const element = (
  <div>
    <h1>Welcome!</h1>
    <p>This is a paragraph with <strong>bold text</strong>.</p>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
  </div>
);
```

This creates a complex nested structure of `React.createElement()` calls.

---

## **Why use JSX?**

* **It's more readable and intuitive**:
  - HTML-like syntax is familiar to web developers
  - Structure is more visible than nested function calls

* **React uses it for defining UI components**:
  - Seamless integration of markup and logic
  - Encourages thinking in components

* **JSX enables compile-time optimizations**:
  - Syntax errors caught during compilation
  - Code hints and autocompletion in IDEs

---

## JSX Best Practices

* Use parentheses for multi-line JSX:
  ```jsx
  return (
    <div>
      <h1>Title</h1>
    </div>
  );
  ```

* Use camelCase for props:
  ```jsx
  <div className="container" onClick={handleClick} />
  ```

* Self-closing tags for elements without children:
  ```jsx
  <img src="image.jpg" alt="Description" />
  ```
