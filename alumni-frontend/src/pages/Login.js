import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        navigate('/admin');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>AlumniConnect</h2>
        <p style={styles.subtitle}>Admin Portal</p>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} type="text" placeholder="Username"
          value={username} onChange={e => setUsername(e.target.value)} />
        <input style={styles.input} type="password" placeholder="Password"
          value={password} onChange={e => setPassword(e.target.value)} />
        <button style={styles.button} onClick={handleLogin}>Sign In</button>
      </div>
    </div>
  );
};

const styles = {
  container: { display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#f0f2f5' },
  card: { background:'white', padding:'40px', borderRadius:'8px', boxShadow:'0 2px 10px rgba(0,0,0,0.1)', width:'350px' },
  title: { textAlign:'center', color:'#1a3c6e', marginBottom:'5px' },
  subtitle: { textAlign:'center', color:'#666', marginBottom:'20px' },
  input: { width:'100%', padding:'12px', margin:'8px 0', border:'1px solid #ddd', borderRadius:'4px', boxSizing:'border-box', fontSize:'14px' },
  button: { width:'100%', padding:'12px', background:'#1a3c6e', color:'white', border:'none', borderRadius:'4px', cursor:'pointer', fontSize:'16px', marginTop:'10px' },
  error: { color:'red', textAlign:'center', marginBottom:'10px' }
};

export default Login;