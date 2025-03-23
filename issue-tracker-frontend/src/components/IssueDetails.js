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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8080/issues/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        setIssue(data);
        setIsEditing(false);
      })
      .catch(error => console.error('Error updating issue:', error));
  };

  if (!issue) return <div>Loading...</div>;

  return (
    <div>
      <h1>Issue Details</h1>
      {isEditing ? (
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
            <label>User:</label>
            <input
              type="text"
              name="user"
              value={formData.user.name}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <div>
          <p><strong>Title:</strong> {issue.title}</p>
          <p><strong>Description:</strong> {issue.description}</p>
          <p><strong>Status:</strong> {issue.status}</p>
          <p><strong>User:</strong> {issue.user.name}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => navigate(-1)}>Back</button>
        </div>
      )}
    </div>
  );
}

export default IssueDetails;