# 🔟 Controlled & Uncontrolled Forms in React

---

## ❓ What are Forms in React?

Forms allow users to interact with your application by inputting data. In React, you can handle forms in two ways:

1. **Controlled Components**: React state drives the form
2. **Uncontrolled Components**: DOM handles form data directly

Understanding when to use each approach is crucial for effective form handling.

---

## 🎮 Controlled Components

In controlled components, React **controls** the form data:

- Form values are kept in React state
- React updates the values on change events
- Form submissions are handled explicitly

```jsx
import React, { useState } from 'react';

function AddIssue() {
  // State for form values
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'OPEN'
  });
  
  // Update state on input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log('Submitting issue:', formData);
    // Call API to create issue
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>
      
      <button type="submit">Create Issue</button>
    </form>
  );
}
```

---

## 🆓 Uncontrolled Components

Uncontrolled components let the **DOM handle** form data:

- Form values stored in DOM, not React state
- Access values using refs when needed
- Form follows more traditional HTML behaviors

```jsx
import React, { useRef } from 'react';

function AddIssue() {
  // Create refs for form elements
  const titleRef = useRef();
  const descriptionRef = useRef();
  const statusRef = useRef();
  
  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get values from refs
    const formData = {
      title: titleRef.current.value,
      description: descriptionRef.current.value,
      status: statusRef.current.value
    };
    
    console.log('Submitting issue:', formData);
    // Call API to create issue
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          ref={titleRef}
          defaultValue=""
          required
        />
      </div>
      
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          ref={descriptionRef}
          defaultValue=""
          required
        />
      </div>
      
      <div>
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          name="status"
          ref={statusRef}
          defaultValue="OPEN"
        >
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>
      
      <button type="submit">Create Issue</button>
    </form>
  );
}
```

---

## 📊 Controlled vs Uncontrolled: Comparison

| Feature | Controlled | Uncontrolled |
|---------|------------|--------------|
| Form Data Storage | React state | DOM |
| Code Complexity | More verbose | Simpler |
| Data Validation | Real-time validation | On submission |
| Dynamic Inputs | Easy to implement | More complex |
| Form Reset | Explicit state reset | Native reset button |
| Initial Values | Passed as `value` | Passed as `defaultValue` |
| Performance | Re-renders on every change | Minimal re-renders |
| Refs Required | No | Yes |

---

## 🧩 Form Validation in Controlled Components

Controlled components make validation straightforward:

```jsx
function AddIssue() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'OPEN'
  });
  
  // Add validation state
  const [errors, setErrors] = useState({
    title: '',
    description: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Validate on change
    validateField(name, value);
  };
  
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'title':
        error = value.length < 3 ? 'Title must be at least 3 characters' : '';
        break;
      case 'description':
        error = value.length < 10 ? 'Description must be at least 10 characters' : '';
        break;
      default:
        break;
    }
    
    setErrors({
      ...errors,
      [name]: error
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    let isValid = true;
    Object.keys(formData).forEach(key => {
      validateField(key, formData[key]);
      if (errors[key]) isValid = false;
    });
    
    if (isValid) {
      console.log('Submitting issue:', formData);
      // Call API
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        {errors.title && <div className="error">{errors.title}</div>}
      </div>
      
      {/* Other fields... */}
      
      <button type="submit">Create Issue</button>
    </form>
  );
}
```

---

## 🔄 Dynamic Forms with Controlled Components

Controlled components excel with dynamic forms:

```jsx
function DynamicForm() {
  const [formFields, setFormFields] = useState([
    { id: 1, name: '', value: '' }
  ]);
  
  const handleAddField = () => {
    const newField = {
      id: Date.now(),
      name: '',
      value: ''
    };
    
    setFormFields([...formFields, newField]);
  };
  
  const handleRemoveField = (id) => {
    setFormFields(formFields.filter(field => field.id !== id));
  };
  
  const handleFieldChange = (id, event) => {
    const { name, value } = event.target;
    
    setFormFields(formFields.map(field => 
      field.id === id ? { ...field, [name]: value } : field
    ));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formFields);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {formFields.map(field => (
        <div key={field.id} className="field-row">
          <input
            type="text"
            name="name"
            placeholder="Field Name"
            value={field.name}
            onChange={(e) => handleFieldChange(field.id, e)}
          />
          <input
            type="text"
            name="value"
            placeholder="Field Value"
            value={field.value}
            onChange={(e) => handleFieldChange(field.id, e)}
          />
          <button type="button" onClick={() => handleRemoveField(field.id)}>
            Remove
          </button>
        </div>
      ))}
      
      <button type="button" onClick={handleAddField}>
        Add Field
      </button>
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## 📑 File Uploads with Uncontrolled Components

Uncontrolled components are ideal for file uploads:

```jsx
function FileUploadForm() {
  const fileInputRef = useRef();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const file = fileInputRef.current.files[0];
    if (!file) {
      alert('Please select a file');
      return;
    }
    
    console.log('Selected file:', file);
    
    // Create FormData for API submission
    const formData = new FormData();
    formData.append('file', file);
    
    // Upload the file
    fetch('http://localhost:8080/api/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => console.log('Upload successful:', data))
    .catch(error => console.error('Upload failed:', error));
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="file">Select File:</label>
        <input
          type="file"
          id="file"
          name="file"
          ref={fileInputRef}
        />
      </div>
      
      <button type="submit">Upload</button>
    </form>
  );
}
```

---

## 🧠 When to Use Each Approach

### Use Controlled Components When:
- You need real-time validation
- Form values depend on each other
- You're implementing dynamic forms
- You need to manipulate input values on the fly
- You want to disable the submit button conditionally

### Use Uncontrolled Components When:
- Handling file inputs
- Integrating with third-party DOM libraries
- Building very simple forms
- Performance is a concern
- You're migrating from traditional HTML forms

---

## 🏆 Best Practices

1. **Be Consistent**: Choose one approach for your entire form
2. **Simplify Complex State**: Use libraries for complex forms (Formik, React Hook Form)
3. **Validation Strategy**: Plan validation strategy based on UX needs
4. **Error Handling**: Provide clear error messages
5. **Accessibility**: Ensure forms are accessible with proper labels
6. **Performance**: For large forms, consider libraries that optimize re-renders

---

## 📚 Form Libraries

For complex forms, consider these popular libraries:

- **Formik**: Powerful, complete solution for forms in React
- **React Hook Form**: Performance-focused library with minimal re-renders
- **Redux Form**: For forms integrated with Redux
- **Final Form**: High performance form state management

```jsx
// Example using Formik
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function AddIssueWithFormik() {
  const initialValues = {
    title: '',
    description: '',
    status: 'OPEN'
  };
  
  const validationSchema = Yup.object({
    title: Yup.string()
      .min(3, 'Title must be at least 3 characters')
      .required('Title is required'),
    description: Yup.string()
      .min(10, 'Description must be at least 10 characters')
      .required('Description is required')
  });
  
  const handleSubmit = (values, { setSubmitting }) => {
    console.log('Submitting issue:', values);
    // API call here
    setSubmitting(false);
  };
  
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <div>
          <label htmlFor="title">Title:</label>
          <Field type="text" name="title" id="title" />
          <ErrorMessage name="title" component="div" className="error" />
        </div>
        
        <div>
          <label htmlFor="description">Description:</label>
          <Field as="textarea" name="description" id="description" />
          <ErrorMessage name="description" component="div" className="error" />
        </div>
        
        <div>
          <label htmlFor="status">Status:</label>
          <Field as="select" name="status" id="status">
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </Field>
        </div>
        
        <button type="submit">Create Issue</button>
      </Form>
    </Formik>
  );
}
```

---

## 📝 Summary

- **Controlled components** use React state to manage form data
- **Uncontrolled components** rely on DOM to store form values
- Controlled components offer better control and validation
- Uncontrolled components are simpler and sometimes more performant
- Choose the approach based on your form's complexity and requirements
- Consider form libraries for complex form needs

Understanding both approaches empowers you to choose the right tool for each situation in your React applications.