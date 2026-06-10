import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const EditAlumni = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState(location.state || {});
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const handleSave = async () => {
    const res = await fetch(`http://localhost:3000/alumni/${form.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok) { setMessage('Alumni updated successfully!'); setTimeout(() => navigate('/admin/alumni'), 1500); }
    else setMessage(data.message || 'Error updating alumni');
  };

  const fields = ['name','email','phone','batch','branch','roll_number','company','job_title','city','linkedin_url','github_url','twitter_handle'];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Edit Alumni</h2>
        <button style={styles.backBtn} onClick={() => navigate('/admin/alumni')}>← Back</button>
      </div>
      <div style={styles.formBox}>
        <div style={styles.grid}>
          {fields.map(f => (
            <div key={f}>
              <label style={styles.label}>{f.replace(/_/g,' ').toUpperCase()}</label>
              <input style={styles.input} value={form[f] || ''}
                onChange={e => setForm({...form, [f]: e.target.value})} />
            </div>
          ))}
        </div>
        {message && <p style={{color:'green', marginBottom:'10px'}}>{message}</p>}
        <div style={styles.btnRow}>
          <button style={styles.saveBtn} onClick={handleSave}>Save Changes</button>
          <button style={styles.cancelBtn} onClick={() => navigate('/admin/alumni')}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding:'30px', background:'#f0f2f5', minHeight:'100vh' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' },
  title: { color:'#1a3c6e' },
  backBtn: { padding:'8px 16px', background:'#666', color:'white', border:'none', borderRadius:'4px', cursor:'pointer' },
  formBox: { background:'white', padding:'25px', borderRadius:'8px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)' },
  grid: { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'15px', marginBottom:'20px' },
  label: { display:'block', fontSize:'11px', color:'#666', marginBottom:'4px' },
  input: { width:'100%', padding:'10px', border:'1px solid #ddd', borderRadius:'4px', fontSize:'14px', boxSizing:'border-box' },
  btnRow: { display:'flex', gap:'15px' },
  saveBtn: { padding:'10px 25px', background:'#1a3c6e', color:'white', border:'none', borderRadius:'4px', cursor:'pointer' },
  cancelBtn: { padding:'10px 25px', background:'#666', color:'white', border:'none', borderRadius:'4px', cursor:'pointer' }
};

export default EditAlumni;