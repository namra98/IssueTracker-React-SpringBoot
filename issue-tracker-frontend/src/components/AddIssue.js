import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddIssue() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    user: { id: '' } // Changed to user.id to match expected structure
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'user') {
      setFormData({ ...formData, user: { id: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8080/issues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        navigate('/');
      })
      .catch(error => console.error('Error adding issue:', error));
  };

  return (
    <div>
      <h1>Add New Issue</h1>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Status:</label>
          <input
            type="text"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>User ID:</label>
          <input
            type="text"
            name="user"
            value={formData.user.id}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Add Issue</button>
        <button type="button" onClick={() => navigate('/')}>Cancel</button>
      </form>
    </div>
  );
}

export default AddIssue;