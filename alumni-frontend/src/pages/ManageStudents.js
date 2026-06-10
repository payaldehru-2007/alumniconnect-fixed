import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ full_name:'', username:'', password:'' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => { loadStudents(); }, []);

  const loadStudents = () => {
    fetch('http://localhost:3000/auth/students', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setStudents(Array.isArray(data) ? data : []))
      .catch(() => {});
  };

  const handleAdd = async () => {
    if (!form.full_name || !form.username || !form.password) { setMessage('Please fill all fields'); return; }
    const res = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: form.full_name, username: form.username, password: form.password, role: 'student' })
    });
    const data = await res.json();
    if (res.ok) { setMessage('Student account created!'); loadStudents(); setForm({ full_name:'', username:'', password:'' }); }
    else setMessage(data.message || 'Error creating account');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Manage Students</h2>
        <button style={styles.backBtn} onClick={() => navigate('/admin')}>← Back</button>
      </div>
      <div style={styles.formBox}>
        <h3>Create Student Account</h3>
        <div style={styles.grid}>
          <input style={styles.input} placeholder="Full Name" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} />
          <input style={styles.input} placeholder="Username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
          <input style={styles.input} placeholder="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        </div>
        {message && <p style={{color: message.includes('!') ? 'green' : 'red'}}>{message}</p>}
        <button style={styles.addBtn} onClick={handleAdd}>Create Account</button>
      </div>
      <h3 style={{marginTop:'30px'}}>All Student Accounts ({students.length})</h3>
      <table style={styles.table}>
        <thead><tr style={styles.thead}><th style={styles.th}>Full Name</th><th style={styles.th}>Username</th></tr></thead>
        <tbody>
          {students.map((s, i) => (
            <tr key={i} style={styles.row}>
              <td style={styles.td}>{s.name}</td>
              <td style={styles.td}>{s.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: { padding:'30px', background:'#f0f2f5', minHeight:'100vh' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' },
  title: { color:'#1a3c6e' },
  backBtn: { padding:'8px 16px', background:'#666', color:'white', border:'none', borderRadius:'4px', cursor:'pointer' },
  formBox: { background:'white', padding:'25px', borderRadius:'8px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)' },
  grid: { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px', marginBottom:'15px' },
  input: { padding:'10px', border:'1px solid #ddd', borderRadius:'4px', fontSize:'14px' },
  addBtn: { padding:'10px 25px', background:'#1a3c6e', color:'white', border:'none', borderRadius:'4px', cursor:'pointer' },
  table: { width:'100%', borderCollapse:'collapse', background:'white', borderRadius:'8px', overflow:'hidden' },
  thead: { background:'#1a3c6e' },
  th: { color:'white', padding:'12px', textAlign:'left' },
  row: { borderBottom:'1px solid #eee' },
  td: { padding:'12px' }
};

export default ManageStudents;