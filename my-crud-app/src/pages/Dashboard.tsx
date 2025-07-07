// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUsers, FiBook, FiUser, FiLayers } from 'react-icons/fi';
import '../styles/dashboard.css'; // File CSS terpisah
import supabase from '../utils/supabase';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [dataCounts, setDataCounts] = useState({
    mahasiswa: 0,
    dosen: 0,
    matkul: 0,
    kelas: 0
  });
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate('/login');
      else {
        setUser(session.user);
        fetchDataCounts();
      }
    };
    getSession();
  }, [navigate]);

  const fetchDataCounts = async () => {
    const promises = [
      supabase.from('mahasiswa').select('*', { count: 'exact' }),
      supabase.from('dosen').select('*', { count: 'exact' }),
      supabase.from('matkul').select('*', { count: 'exact' }),
      supabase.from('kelas').select('*', { count: 'exact' })
    ];

    const [mahasiswa, dosen, matkul, kelas] = await Promise.all(promises);
    
    setDataCounts({
      mahasiswa: mahasiswa.count || 0,
      dosen: dosen.count || 0,
      matkul: matkul.count || 0,
      kelas: kelas.count || 0
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className={`dashboard-container ${darkMode ? 'dark' : 'light'}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>AcademicSys</h2>
          <div className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️' : '🌙'}
          </div>
        </div>

        <div className="user-profile">
          <div className="avatar">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <h4>{user?.email}</h4>
            <span>Admin</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="active">
            <FiLayers /> Dashboard
          </button>
          <button onClick={() => navigate('/mahasiswa')}>
            <FiUsers /> Mahasiswa
          </button>
          <button onClick={() => navigate('/dosen')}>
            <FiUser /> Dosen
          </button>
          <button onClick={() => navigate('/matkul')}>
            <FiBook /> Matkul
          </button>
          <button onClick={() => navigate('/kelas')}>
            <FiBook /> Kelas
          </button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">
          <h1>Dashboard Overview</h1>
          <div className="header-actions">
            <div className="search-bar">
              <input type="text" placeholder="Search..." />
            </div>
          </div>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(101, 87, 255, 0.1)' }}>
              <FiUsers style={{ color: '#6557FF' }} />
            </div>
            <div className="stat-info">
              <h3>Mahasiswa</h3>
              <p>{dataCounts.mahasiswa} <span>Orang</span></p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(255, 87, 87, 0.1)' }}>
              <FiUser style={{ color: '#FF5757' }} />
            </div>
            <div className="stat-info">
              <h3>Dosen</h3>
              <p>{dataCounts.dosen} <span>Orang</span></p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(87, 203, 255, 0.1)' }}>
              <FiBook style={{ color: '#57CBFF' }} />
            </div>
            <div className="stat-info">
              <h3>Matkul</h3>
              <p>{dataCounts.matkul} <span>Mata Kuliah</span></p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(255, 181, 87, 0.1)' }}>
              <FiBook style={{ color: '#FFB557' }} />
            </div>
            <div className="stat-info">
              <h3>Kelas</h3>
              <p>{dataCounts.kelas} <span>Kelas</span></p>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <section className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {/* Isi dengan aktivitas terbaru */}
            <div className="activity-item">
              <div className="activity-icon">👤</div>
              <div className="activity-details">
                <p><strong>Admin</strong> menambahkan data mahasiswa baru</p>
                <small>2 jam yang lalu</small>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
