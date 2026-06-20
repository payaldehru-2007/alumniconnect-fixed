import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MyProfile() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');
  const [form, setForm] = useState({
    name:'', email:'', phone:'', batch:'', branch:'',
    roll_number:'', company:'', job_title:'', city:'',
    linkedin_url:'', github_url:'', twitter_handle:''
  });
  const [alumniId, setAlumniId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find alumni record by name
    fetch('https://alumniconnect-pi.vercel.app/api/alumni', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : data.alumni || [];
        const myRecord = list.find(a => a.name === name);
        if (myRecord) {
          setForm(myRecord);
          setAlumniId(myRecord.id);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token, name]);

  const handleSave = async () => {
    if (alumniId) {
      // Update existing record
      const res = await fetch(`https://alumniconnect-pi.vercel.app/api/alumni/${alumniId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (res.ok) setMessage('Profile updated successfully! ✅');
      else setMessage('Error updating profile');
    } else {
      // Create new record
      const res = await fetch('https://alumniconnect-pi.vercel.app/api/alumni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setMessage('Profile created successfully! ✅');
        const data = await res.json();
        setAlumniId(data.data?.[0]?.id);
      } else setMessage('Error creating profile');
    }
  };

  if (loading) return <div style={styles.loading}>Loading your profile...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.logo}>AlumniConnect</h2>
        <button style={styles.backBtn} onClick={() => navigate('/alumni-dashboard')}>← Back</button>
      </div>
      <div style={styles.body}>
        <h3 style={styles.heading}>My Profile</h3>
        <p style={styles.subtitle}>Fill in your information so other alumni can find and connect with you</p>
        <div style={styles.formCard}>
          <p style={styles.sectionTitle}>Personal Information</p>
          <div style={styles.grid}>
            <div>
              <p style={styles.label}>Full Name</p>
              <input style={styles.input} value={form.name || ''} placeholder="Your full name"
                onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div>
              <p style={styles.label}>Email</p>
              <input style={styles.input} value={form.email || ''} placeholder="Your email"
                onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div>
              <p style={styles.label}>Phone</p>
              <input style={styles.input} value={form.phone || ''} placeholder="Your phone"
                onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <div>
              <p style={styles.label}>City</p>
              <input style={styles.input} value={form.city || ''} placeholder="Current city"
                onChange={e => setForm({...form, city: e.target.value})} />
            </div>
          </div>

          <p style={styles.sectionTitle}>College Information</p>
          <div style={styles.grid}>
            <div>
              <p style={styles.label}>Batch Year</p>
              <input style={styles.input} value={form.batch || ''} placeholder="e.g. 2022"
                onChange={e => setForm({...form, batch: e.target.value})} />
            </div>
            <div>
              <p style={styles.label}>Branch</p>
              <input style={styles.input} value={form.branch || ''} placeholder="e.g. Computer Science"
                onChange={e => setForm({...form, branch: e.target.value})} />
            </div>
            <div>
              <p style={styles.label}>Roll Number</p>
              <input style={styles.input} value={form.roll_number || ''} placeholder="Your roll number"
                onChange={e => setForm({...form, roll_number: e.target.value})} />
            </div>
          </div>

          <p style={styles.sectionTitle}>Professional Information</p>
          <div style={styles.grid}>
            <div>
              <p style={styles.label}>Current Company</p>
              <input style={styles.input} value={form.company || ''} placeholder="Where do you work?"
                onChange={e => setForm({...form, company: e.target.value})} />
            </div>
            <div>
              <p style={styles.label}>Job Title</p>
              <input style={styles.input} value={form.job_title || ''} placeholder="Your role"
                onChange={e => setForm({...form, job_title: e.target.value})} />
            </div>
          </div>

          <p style={styles.sectionTitle}>Social Media</p>
          <div style={styles.grid}>
            <div>
              <p style={styles.label}>LinkedIn URL</p>
              <input style={styles.input} value={form.linkedin_url || ''} placeholder="linkedin.com/in/yourname"
                onChange={e => setForm({...form, linkedin_url: e.target.value})} />
            </div>
            <div>
              <p style={styles.label}>GitHub URL</p>
              <input style={styles.input} value={form.github_url || ''} placeholder="github.com/yourname"
                onChange={e => setForm({...form, github_url: e.target.value})} />
            </div>
            <div>
              <p style={styles.label}>Twitter Handle</p>
              <input style={styles.input} value={form.twitter_handle || ''} placeholder="@yourhandle"
                onChange={e => setForm({...form, twitter_handle: e.target.value})} />
            </div>
          </div>

          {message && <p style={styles.message}>{message}</p>}
          <button style={styles.saveBtn} onClick={handleSave}>
            {alumniId ? 'Update Profile' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight:'100vh', backgroundColor:'#f0f4f8' },
  navbar: { background:'#1A3C6E', padding:'1rem 2rem', display:'flex', justifyContent:'space-between', alignItems:'center' },
  logo: { color:'#fff', margin:0 },
  backBtn: { color:'rgba(255,255,255,0.8)', background:'none', border:'none', fontSize:'14px', cursor:'pointer' },
  body: { padding:'2rem' },
  heading: { color:'#1A3C6E', marginBottom:'4px' },
  subtitle: { color:'#888', fontSize:'13px', marginBottom:'1.5rem' },
  formCard: { background:'#fff', padding:'1.5rem', borderRadius:'12px', boxShadow:'0 2px 10px rgba(0,0,0,0.08)' },
  sectionTitle: { fontWeight:'600', color:'#1A3C6E', fontSize:'13px', margin:'1.5rem 0 1rem', borderBottom:'1px solid #eee', paddingBottom:'8px' },
  grid: { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem', marginBottom:'0.5rem' },
  label: { margin:'0 0 5px', fontSize:'12px', color:'#888' },
  input: { width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'14px', boxSizing:'border-box' },
  saveBtn: { marginTop:'1.5rem', padding:'12px 32px', borderRadius:'8px', backgroundColor:'#1A3C6E', color:'#fff', border:'none', fontSize:'14px', cursor:'pointer' },
  message: { color:'green', fontSize:'13px', marginTop:'1rem' },
  loading: { display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', fontSize:'16px', color:'#1A3C6E' }
};

export default MyProfile;