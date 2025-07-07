import React, { useEffect, useState } from 'react';
import { FiUsers, FiEdit2, FiTrash2, FiPlus, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import supabase from '../utils/supabase';
import '../styles/mahasiswa.css'; // Import CSS

const Mahasiswa: React.FC = () => {
  const [mahasiswa, setMahasiswa] = useState<any[]>([]);
  const [nama, setNama] = useState('');
  const [nim, setNim] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMahasiswa();
  }, []);

  const fetchMahasiswa = async () => {
    const { data, error } = await supabase.from('mahasiswa').select('*');
    if (error) console.error('Error fetching data:', error);
    else setMahasiswa(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && currentId) {
      const { error } = await supabase
        .from('mahasiswa')
        .update({ nama, nim, email })
        .eq('id', currentId);
      
      if (!error) {
        fetchMahasiswa();
        resetForm();
      }
    } else {
      const { error } = await supabase.from('mahasiswa').insert([{ nama, nim, email }]);
      if (!error) {
        fetchMahasiswa();
        resetForm();
      }
    }
  };

  const handleEdit = (item: any) => {
    setNama(item.nama);
    setNim(item.nim);
    setEmail(item.email);
    setIsEditing(true);
    setCurrentId(item.id);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('mahasiswa').delete().eq('id', id);
    if (!error) fetchMahasiswa();
  };

  const resetForm = () => {
    setNama('');
    setNim('');
    setEmail('');
    setIsEditing(false);
    setCurrentId(null);
  };

  return (
    <div className="mahasiswa-container">
      <div className="mahasiswa-header">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="btn btn-secondary"
        >
          <FiArrowLeft /> Kembali
        </button>
        <h2 className="mahasiswa-title">
          <FiUsers /> Data Mahasiswa
        </h2>
        <div className="mahasiswa-actions">
          <button className="btn btn-primary" onClick={resetForm}>
            <FiPlus /> Tambah Mahasiswa
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mahasiswa-form">
        <div className="form-group">
          <label>Nama Mahasiswa</label>
          <input
            type="text"
            className="form-control"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Contoh: John Doe"
            required
          />
        </div>
        
        <div className="form-group">
          <label>NIM</label>
          <input
            type="text"
            className="form-control"
            value={nim}
            onChange={(e) => setNim(e.target.value)}
            placeholder="Contoh: 12345678"
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
            placeholder="Contoh: john@example.com"
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
              <th>NIM</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {mahasiswa.map((mhs) => (
              <tr key={mhs.id}>
                <td>{mhs.nim}</td>
                <td>{mhs.nama}</td>
                <td>{mhs.email}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleEdit(mhs)} 
                      className="btn btn-icon btn-secondary"
                    >
                      <FiEdit2 />
                    </button>
                    <button 
                      onClick={() => handleDelete(mhs.id)} 
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

export default Mahasiswa;
