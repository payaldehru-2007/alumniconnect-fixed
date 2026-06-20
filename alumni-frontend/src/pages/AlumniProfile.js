import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function AlumniProfile() {
  const { id } = useParams();
  const [alumni, setAlumni] = useState(null);
  const [profiles, setProfiles] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const alumniRes = await axios.get(`https://alumniconnect-pi.vercel.app/api/alumni/${id}`);
        setAlumni(alumniRes.data);
        const searchRes = await axios.get(`http://localhost:8000/discover`, {
          params: {
            name: alumniRes.data.name,
            batch: alumniRes.data.batch,
            branch: alumniRes.data.branch,
            college: 'your college name here'
          }
        });
        setProfiles(searchRes.data.profiles);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div style={styles.loading}>Searching profiles... ⏳</div>;
  if (!alumni) return <div style={styles.loading}>Alumni not found.</div>;

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.logo}>AlumniConnect</h2>
        <a href="/admin/alumni" style={styles.backLink}>← Back to Alumni</a>
      </div>
      <div style={styles.body}>
        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.avatar}>{alumni.name.charAt(0).toUpperCase()}</div>
            <h3 style={styles.name}>{alumni.name}</h3>
            <p style={styles.role}>{alumni.job_title} at {alumni.company}</p>
            <div style={styles.divider} />
            <div style={styles.infoSection}>
              <p style={styles.sectionTitle}>College Info</p>
              <div style={styles.infoRow}><span style={styles.label}>Branch</span><span>{alumni.branch}</span></div>
              <div style={styles.infoRow}><span style={styles.label}>Batch</span><span>{alumni.batch}</span></div>
              <div style={styles.infoRow}><span style={styles.label}>Roll No</span><span>{alumni.roll_number}</span></div>
            </div>
            <div style={styles.divider} />
            <div style={styles.infoSection}>
              <p style={styles.sectionTitle}>Current Info</p>
              <div style={styles.infoRow}><span style={styles.label}>Company</span><span>{alumni.company}</span></div>
              <div style={styles.infoRow}><span style={styles.label}>Role</span><span>{alumni.job_title}</span></div>
              <div style={styles.infoRow}><span style={styles.label}>City</span><span>{alumni.city}</span></div>
            </div>
          </div>
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>🔍 Deep Search Results</h3>
            <p style={styles.subtitle}>Profiles found online for {alumni.name}</p>
            {profiles ? (
              <div style={styles.profileList}>
                <div style={styles.profileCard}>
                  <div style={{...styles.platformIcon, background: '#0077B5'}}>in</div>
                  <div style={styles.profileInfo}>
                    <p style={styles.platformName}>LinkedIn</p>
                    {profiles.linkedin?.found ? (
                      <a href={profiles.linkedin.link} target="_blank" rel="noreferrer" style={styles.profileLink}>{profiles.linkedin.link}</a>
                    ) : (<p style={styles.notFound}>Not found</p>)}
                  </div>
                  <span style={profiles.linkedin?.found ? styles.activeTag : styles.notFoundTag}>{profiles.linkedin?.found ? 'Found' : 'Not found'}</span>
                </div>
                <div style={styles.profileCard}>
                  <div style={{...styles.platformIcon, background: '#333'}}>GH</div>
                  <div style={styles.profileInfo}>
                    <p style={styles.platformName}>GitHub</p>
                    {profiles.github?.found ? (
                      <a href={profiles.github.link} target="_blank" rel="noreferrer" style={styles.profileLink}>{profiles.github.link}</a>
                    ) : (<p style={styles.notFound}>Not found</p>)}
                  </div>
                  <span style={profiles.github?.found ? styles.activeTag : styles.notFoundTag}>{profiles.github?.found ? 'Found' : 'Not found'}</span>
                </div>
                <div style={styles.profileCard}>
                  <div style={{...styles.platformIcon, background: '#1DA1F2'}}>X</div>
                  <div style={styles.profileInfo}>
                    <p style={styles.platformName}>Twitter / X</p>
                    {profiles.twitter?.found ? (
                      <a href={profiles.twitter.link} target="_blank" rel="noreferrer" style={styles.profileLink}>{profiles.twitter.link}</a>
                    ) : (<p style={styles.notFound}>Not found</p>)}
                  </div>
                  <span style={profiles.twitter?.found ? styles.activeTag : styles.notFoundTag}>{profiles.twitter?.found ? 'Found' : 'Not found'}</span>
                </div>
              </div>
            ) : (
              <p style={styles.notFound}>Could not fetch profiles. Make sure deep search service is running.</p>
            )}
            <p style={styles.poweredBy}>Powered by Python Deep Search · SerpAPI</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f4f8' },
  navbar: { background: '#1A3C6E', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { color: '#fff', margin: 0 },
  backLink: { color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' },
  body: { padding: '2rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
  card: { background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  avatar: { width: '56px', height: '56px', borderRadius: '50%', background: '#E6F1FB', color: '#0C447C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '600', marginBottom: '1rem' },
  name: { margin: '0 0 4px', color: '#1A3C6E', fontSize: '18px' },
  role: { margin: '0 0 1rem', color: '#888', fontSize: '13px' },
  divider: { borderTop: '1px solid #eee', margin: '1rem 0' },
  infoSection: { marginBottom: '0.5rem' },
  sectionTitle: { fontWeight: '600', color: '#1A3C6E', fontSize: '13px', margin: '0 0 8px' },
  subtitle: { color: '#888', fontSize: '12px', margin: '0 0 1rem' },
  infoRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' },
  label: { color: '#888' },
  profileList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  profileCard: { display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #eee', borderRadius: '10px', padding: '12px' },
  platformIcon: { width: '32px', height: '32px', borderRadius: '8px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', flexShrink: 0 },
  platformName: { margin: '0 0 2px', fontSize: '13px', fontWeight: '500' },
  profileInfo: { flex: 1 },
  profileLink: { fontSize: '11px', color: '#2E6DA4', wordBreak: 'break-all' },
  notFound: { fontSize: '11px', color: '#aaa', margin: 0 },
  activeTag: { fontSize: '10px', padding: '3px 8px', borderRadius: '6px', background: '#E6F9EE', color: '#27AE60', flexShrink: 0 },
  notFoundTag: { fontSize: '10px', padding: '3px 8px', borderRadius: '6px', background: '#f5f5f5', color: '#aaa', flexShrink: 0 },
  poweredBy: { margin: '1rem 0 0', fontSize: '10px', color: '#ccc', textAlign: 'right' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '16px', color: '#1A3C6E' }
};

export default AlumniProfile;