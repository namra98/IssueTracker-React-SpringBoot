import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIssues, deleteIssue } from '../services/issueService';

function IssueTracker() {
  const [issues, setIssues] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/issues')
      .then(response => response.json())
      .then(data => setIssues(data))
      .catch(error => console.error('Error fetching issues:', error));
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
