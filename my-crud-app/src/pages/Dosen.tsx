import React, { useEffect, useState } from 'react';
import { FiUser, FiEdit2, FiTrash2, FiPlus, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import supabase from '../utils/supabase';
import '../styles/dosen.css'; // Import CSS khusus Dosen

const Dosen: React.FC = () => {
  const [dosen, setDosen] = useState<any[]>([]);
  const [nama, setNama] = useState('');
  const [nip, setNip] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDosen();
  }, []);

  const fetchDosen = async () => {
    const { data, error } = await supabase.from('dosen').select('*');
    if (error) console.error('Error fetching data:', error);
    else setDosen(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && currentId) {
      const { error } = await supabase
        .from('dosen')
        .update({ nama, nip, email })
        .eq('id', currentId);
      
      if (!error) {
        fetchDosen();
        resetForm();
      }
    } else {
      const { error } = await supabase.from('dosen').insert([{ nama, nip, email }]);
      if (!error) {
        fetchDosen();
        resetForm();
      }
    }
  };

  const handleEdit = (item: any) => {
    setNama(item.nama);
    setNip(item.nip);
    setEmail(item.email);
    setIsEditing(true);
    setCurrentId(item.id);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('dosen').delete().eq('id', id);
    if (!error) fetchDosen();
  };

  const resetForm = () => {
    setNama('');
    setNip('');
    setEmail('');
    setIsEditing(false);
    setCurrentId(null);
  };

  return (
    <div className="dosen-container">
      <div className="dosen-header">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="btn btn-secondary"
        >
          <FiArrowLeft /> Kembali
        </button>
        <h2 className="dosen-title">
          <FiUser /> Data Dosen
        </h2>
        <div className="dosen-actions">
          <button className="btn btn-primary" onClick={resetForm}>
            <FiPlus /> Tambah Dosen
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="dosen-form">
        <div className="form-group">
          <label>Nama Dosen</label>
          <input
            type="text"
            className="form-control"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Contoh: Prof. John Doe"
            required
          />
        </div>
        
        <div className="form-group">
          <label>NIP</label>
          <input
            type="text"
            className="form-control"
            value={nip}
            onChange={(e) => setNip(e.target.value)}
            placeholder="Contoh: 198002012003041002"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Contoh: john@example.ac.id"
            required
          />
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Update Data' : 'Tambah Data'}
          </button>
          {isEditing && (
            <button 
              type="button" 
              onClick={resetForm}
              className="btn btn-secondary"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>NIP</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dosen.map((dsn) => (
              <tr key={dsn.id}>
                <td>{dsn.nip}</td>
                <td>{dsn.nama}</td>
                <td>{dsn.email}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleEdit(dsn)} 
                      className="btn btn-icon btn-secondary"
                    >
                      <FiEdit2 />
                    </button>
                    <button 
                      onClick={() => handleDelete(dsn.id)} 
                      className="btn btn-icon btn-danger"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dosen;
