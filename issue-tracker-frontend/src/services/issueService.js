const API_URL = 'http://localhost:8080/issues';

export const getIssues = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

export const getIssueById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  return response.json();
};

export const addIssue = async (issueData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(issueData)
  });
  return response.json();
};

export const deleteIssue = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
};
