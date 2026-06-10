import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, branches: 0, batches: 0 });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  useEffect(() => {
    fetch('http://localhost:3000/alumni', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(r => r.json())
      .then(data => {
        const alumni = data.alumni || [];
        const branches = [...new Set(alumni.map(a => a.branch))].length;
        const batches = [...new Set(alumni.map(a => a.batch))].length;
        setStats({ total: alumni.length, branches, batches });
      })
      .catch(() => {});
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Welcome back, Admin 👋</h2>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>
      <div style={styles.statsRow}>
        <div style={styles.card}><h1>{stats.total}</h1><p>Total Alumni</p></div>
        <div style={styles.card}><h1>{stats.branches}</h1><p>Branches</p></div>
        <div style={styles.card}><h1>{stats.batches}</h1><p>Batch Years</p></div>
      </div>
      <div style={styles.btnRow}>
        <button style={styles.btn} onClick={() => navigate('/admin/alumni')}>Manage Alumni</button>
        <button style={styles.btn} onClick={() => navigate('/admin/students')}>Manage Students</button>
        <button style={styles.btn} onClick={() => navigate('/admin/search')}>Deep Search</button>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '30px', background: '#f0f2f5', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  title: { color: '#1a3c6e' },
  logoutBtn: { padding: '8px 20px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  statsRow: { display: 'flex', gap: '20px', marginBottom: '30px' },
  card: { background: 'white', padding: '30px', borderRadius: '8px', flex: 1, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  btnRow: { display: 'flex', gap: '20px' },
  btn: { padding: '15px 30px', background: '#1a3c6e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }
};

export default Dashboard;