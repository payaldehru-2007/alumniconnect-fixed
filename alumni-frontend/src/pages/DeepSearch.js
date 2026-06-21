
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const DeepSearch = () => {
  const [filters, setFilters] = useState({ name:'', batch:'', branch:'', city:'', company:'' });
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [profiles, setProfiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  const handleSearch = async () => {
  setLoading(true);
  const res = await fetch('https://alumniconnect-fixed-swl8.vercel.app/api/alumni');
  const data = await res.json();
  let list = data.alumni || [];
  Object.entries(filters).forEach(([k, v]) => {
    if (v) list = list.filter(a => (a[k] || '').toLowerCase().includes(v.toLowerCase()));
  });
  setResults(list);
  setSearched(true);
  setLoading(false);
  setSelected(null);
  setProfiles(null);
};

 const handleDiscover = async (alumni) => {
  setSelected(alumni);
  setProfiles({
    linkedin: { found: false },
    github: { found: false },
    twitter: { found: false }
  });
};

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🔍 Deep Search</h2>
        <button style={styles.backBtn} onClick={() => navigate('/alumni-dashboard')}>← Back</button>
      </div>
      <div style={styles.searchBox}>
        <div style={styles.grid}>
          {['name','batch','branch','city','company'].map(f => (
            <input key={f} style={styles.input} placeholder={f.charAt(0).toUpperCase()+f.slice(1)}
              value={filters[f]} onChange={e => setFilters({...filters, [f]: e.target.value})} />
          ))}
        </div>
        <button style={styles.searchBtn} onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search Alumni'}
        </button>
      </div>
      {searched && <p style={styles.count}>{results.length} alumni found</p>}
      <div style={styles.resultsGrid}>
        {results.map(a => (
          <div key={a.id} style={styles.card}>
            <h3 style={styles.name}>{a.name}</h3>
            <p style={styles.info}>🎓 {a.batch} — {a.branch}</p>
            <p style={styles.info}>📍 {a.city}</p>
            <p style={styles.info}>💼 {a.company} — {a.job_title}</p>
            <button style={styles.discoverBtn} onClick={() => handleDiscover(a)}>🌐 Discover Profiles</button>
          </div>
        ))}
      </div>
      {selected && profiles && (
        <div style={styles.profileBox}>
          <h3>Profile Discovery — {selected.name}</h3>
          {['linkedin','github','twitter'].map(platform => (
            <div key={platform} style={styles.profileCard}>
              <strong style={styles.platformName}>{platform.toUpperCase()}</strong>
              {profiles[platform]?.found ? (
                <div>
                  <p>{profiles[platform].title}</p>
                  <a href={profiles[platform].link} target="_blank" rel="noreferrer" style={styles.link}>{profiles[platform].link}</a>
                </div>
              ) : (
                <p style={{color:'#999'}}>Not found</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding:'30px', background:'#f0f2f5', minHeight:'100vh' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' },
  title: { color:'#1a3c6e' },
  backBtn: { padding:'8px 16px', background:'#666', color:'white', border:'none', borderRadius:'4px', cursor:'pointer' },
  searchBox: { background:'white', padding:'25px', borderRadius:'8px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)', marginBottom:'20px' },
  grid: { display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr', gap:'12px', marginBottom:'15px' },
  input: { padding:'10px', border:'1px solid #ddd', borderRadius:'4px', fontSize:'14px' },
  searchBtn: { padding:'10px 30px', background:'#1a3c6e', color:'white', border:'none', borderRadius:'4px', cursor:'pointer', fontSize:'16px' },
  count: { color:'#666', marginBottom:'15px' },
  resultsGrid: { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'20px', marginBottom:'30px' },
  card: { background:'white', padding:'20px', borderRadius:'8px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)' },
  name: { color:'#1a3c6e', marginBottom:'10px' },
  info: { color:'#555', fontSize:'14px', margin:'4px 0' },
  discoverBtn: { marginTop:'12px', padding:'8px 16px', background:'#27ae60', color:'white', border:'none', borderRadius:'4px', cursor:'pointer', width:'100%' },
  profileBox: { background:'white', padding:'25px', borderRadius:'8px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)' },
  profileCard: { borderBottom:'1px solid #eee', padding:'15px 0' },
  platformName: { color:'#1a3c6e' },
  link: { color:'#2980b9', wordBreak:'break-all' }
};

export default DeepSearch;