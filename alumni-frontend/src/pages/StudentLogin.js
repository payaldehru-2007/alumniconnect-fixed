import React, { useState } from 'react';
import axios from 'axios';

function StudentLogin() {
  const [mode, setMode] = useState('alumni');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('https://alumniconnect-pi.vercel.app/api/auth/login', {
        username,
        password
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name);
      if (res.data.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/alumni-dashboard';
      }
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>AlumniConnect</h2>
        <p style={styles.subtitle}>Welcome! Please select your role</p>
        <div style={styles.toggle}>
          <button
            style={mode === 'alumni' ? styles.toggleActive : styles.toggleInactive}
            onClick={() => { setMode('alumni'); setError(''); }}>
            Alumni
          </button>
          <button
            style={mode === 'admin' ? styles.toggleActive : styles.toggleInactive}
            onClick={() => { setMode('admin'); setError(''); }}>
            Admin
          </button>
        </div>
        <p style={styles.desc}>
          {mode === 'alumni' ? 'Login to view and update your profile' : 'Login to manage the alumni system'}
        </p>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} type="text" placeholder="Username"
          value={username} onChange={(e) => setUsername(e.target.value)} />
        <input style={styles.input} type="password" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <button style={styles.button} onClick={handleLogin}>
          Sign In as {mode === 'alumni' ? 'Alumni' : 'Admin'}
        </button>
        <p style={styles.note}>
          {mode === 'alumni' ? 'Your account is created by your college admin' : ''}
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', backgroundColor:'#f0f4f8' },
  card: { background:'#fff', padding:'2rem', borderRadius:'12px', width:'380px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', display:'flex', flexDirection:'column', gap:'1rem' },
  title: { margin:0, color:'#1A3C6E', fontSize:'24px' },
  subtitle: { margin:0, color:'#888', fontSize:'13px' },
  toggle: { display:'flex', borderRadius:'8px', overflow:'hidden', border:'1px solid #1A3C6E' },
  toggleActive: { flex:1, padding:'8px', backgroundColor:'#1A3C6E', color:'#fff', border:'none', fontSize:'14px', cursor:'pointer', fontWeight:'500' },
  toggleInactive: { flex:1, padding:'8px', backgroundColor:'#fff', color:'#1A3C6E', border:'none', fontSize:'14px', cursor:'pointer' },
  desc: { margin:0, color:'#888', fontSize:'12px' },
  input: { padding:'10px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'14px' },
  button: { padding:'10px', borderRadius:'8px', backgroundColor:'#1A3C6E', color:'#fff', border:'none', fontSize:'14px', cursor:'pointer' },
  error: { color:'red', fontSize:'13px', margin:0 },
  note: { margin:0, fontSize:'11px', color:'#aaa', textAlign:'center' }
};

export default StudentLogin;