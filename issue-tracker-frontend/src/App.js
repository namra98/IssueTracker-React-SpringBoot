import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';  // Import Navbar
import Hello from './components/Hello';
import Counter from './components/Counter';
import IssueTracker from './components/IssueTracker';
import IssueDetails from './components/IssueDetails';
import AddIssue from './components/AddIssue';

function App() {
  return (
    <Router>
      <Navbar />
      <div>
        <Hello name="Namra" role="Developer"/>
        <Hello name="Other"/>
        <Counter />
        <Routes>
          <Route path="/" element={<IssueTracker />} />
          <Route path="/issue-details/:id" element={<IssueDetails />} />
          <Route path="/add-issue" element={<AddIssue />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
