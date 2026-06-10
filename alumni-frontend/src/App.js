import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ManageAlumni from './pages/ManageAlumni';
import EditAlumni from './pages/EditAlumni';
import ManageStudents from './pages/ManageStudents';
import DeepSearch from './pages/DeepSearch';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/alumni" element={<ManageAlumni />} />
        <Route path="/admin/alumni/edit/:id" element={<EditAlumni />} />
        <Route path="/admin/students" element={<ManageStudents />} />
        <Route path="/admin/search" element={<DeepSearch />} />
      </Routes>
    </Router>
  );
}

export default App;
