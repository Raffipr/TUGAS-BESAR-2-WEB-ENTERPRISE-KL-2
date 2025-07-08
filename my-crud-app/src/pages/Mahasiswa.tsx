import React, { useEffect, useState } from 'react';
import { FiUser , FiEdit2, FiTrash2, FiPlus, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import supabase from '../utils/supabase';
import '../styles/mahasiswa.css'; // Import CSS khusus Mahasiswa

const Mahasiswa: React.FC = () => {
  const [mahasiswa, setMahasiswa] = useState<any[]>([]);
  const [nama, setNama] = useState('');
  const [nim, setNim] = useState('');
  const [prodi, setProdi] = useState('');
  const [kelasId, setKelasId] = useState('');
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
    const mahasiswaData = {
      nama,
      nim,
      prodi,
      kelas_id: kelasId
    };

    if (isEditing && currentId) {
      const { error } = await supabase
        .from('mahasiswa')
        .update(mahasiswaData)
        .eq('id', currentId);
      
      if (!error) {
        fetchMahasiswa();
        resetForm();
      }
    } else {
      const { error } = await supabase.from('mahasiswa').insert([mahasiswaData]);
      if (!error) fetchMahasiswa();
    }
  };

  const handleEdit = (item: any) => {
    setNama(item.nama);
    setNim(item.nim);
    setProdi(item.prodi);
    setKelasId(item.kelas_id);
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
    setProdi('');
    setKelasId('');
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
          <FiUser  /> Data Mahasiswa
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
            placeholder="Nama mahasiswa"
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
            placeholder="Nomor Induk Mahasiswa"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Program Studi</label>
          <input
            type="text"
            className="form-control"
            value={prodi}
            onChange={(e) => setProdi(e.target.value)}
            placeholder="Program studi"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Kelas</label>
          <input
            type="text"
            className="form-control"
            value={kelasId}
            onChange={(e) => setKelasId(e.target.value)}
            placeholder="ID Kelas"
            required
          />
        </div>
        
        <div className="form-actions">
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
              <th>Nama</th>
              <th>NIM</th>
              <th>Prodi</th>
              <th>Kelas</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {mahasiswa.map((mhs) => (
              <tr key={mhs.id}>
                <td>{mhs.nama}</td>
                <td>{mhs.nim}</td>
                <td>{mhs.prodi}</td>
                <td>{mhs.kelas_id}</td>
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
