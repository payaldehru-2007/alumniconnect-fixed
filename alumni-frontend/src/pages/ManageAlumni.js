import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ManageAlumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [form, setForm] = useState({ name:'', email:'', phone:'', batch:'', branch:'', roll_number:'', company:'', job_title:'', city:'', linkedin_url:'', github_url:'', twitter_handle:'' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => { loadAlumni(); }, []);

  const loadAlumni = () => {
    fetch('https://alumniconnect-pi.vercel.app/api/alumni', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setAlumni(Array.isArray(data) ? data : data.alumni || []))
      .catch(() => {});
  };

  const handleAdd = async () => {
    const res = await fetch('https://alumniconnect-pi.vercel.app/api/alumni', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok) { setMessage('Alumni added!'); loadAlumni(); setForm({ name:'', email:'', phone:'', batch:'', branch:'', roll_number:'', company:'', job_title:'', city:'', linkedin_url:'', github_url:'', twitter_handle:'' }); }
    else setMessage(data.message || 'Error adding alumni');
  };

  const handleDelete = async (id) => {
    await fetch(`https://alumniconnect-pi.vercel.app/api/alumni/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    loadAlumni();
  };

  const fields = ['name','email','phone','batch','branch','roll_number','company','job_title','city','linkedin_url','github_url','twitter_handle'];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Manage Alumni</h2>
        <button style={styles.backBtn} onClick={() => navigate('/admin')}>← Back</button>
      </div>
      <div style={styles.formBox}>
        <h3>Add New Alumni</h3>
        <div style={styles.grid}>
          {fields.map(f => (
            <input key={f} style={styles.input} placeholder={f.replace(/_/g,' ')}
              value={form[f]} onChange={e => setForm({...form, [f]: e.target.value})} />
          ))}
        </div>
        {message && <p style={{color:'green'}}>{message}</p>}
        <button style={styles.addBtn} onClick={handleAdd}>Add Alumni</button>
      </div>
      <h3 style={{marginTop:'30px'}}>All Alumni ({alumni.length})</h3>
      <table style={styles.table}>
        <thead>
          <tr style={styles.thead}>
            <th style={styles.th}>Name</th><th style={styles.th}>Batch</th><th style={styles.th}>Branch</th><th style={styles.th}>City</th><th style={styles.th}>Company</th><th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {alumni.map(a => (
            <tr key={a.id} style={styles.row}>
              <td style={styles.td}>{a.name}</td><td style={styles.td}>{a.batch}</td><td style={styles.td}>{a.branch}</td><td style={styles.td}>{a.city}</td><td style={styles.td}>{a.company}</td>
              <td style={styles.td}>
                <button style={styles.editBtn} onClick={() => navigate('/admin/alumni/edit/' + a.id, { state: a })}>Edit</button>
                <button style={styles.delBtn} onClick={() => handleDelete(a.id)}>Delete</button>
              </td>
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
  td: { padding:'12px' },
  editBtn: { padding:'5px 12px', background:'#f39c12', color:'white', border:'none', borderRadius:'3px', cursor:'pointer', marginRight:'5px' },
  delBtn: { padding:'5px 12px', background:'#e74c3c', color:'white', border:'none', borderRadius:'3px', cursor:'pointer' }
};

export default ManageAlumni;