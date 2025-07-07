import React, { useEffect, useState } from 'react';
import { FiBook, FiEdit2, FiTrash2, FiPlus, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import supabase from '../utils/supabase';
import '../styles/matkul.css'; // Import CSS khusus Matkul

const Matkul: React.FC = () => {
  const [matkul, setMatkul] = useState<any[]>([]);
  const [kode, setKode] = useState('');
  const [nama, setNama] = useState('');
  const [sks, setSks] = useState(2);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatkul();
  }, []);

  const fetchMatkul = async () => {
    const { data, error } = await supabase.from('matkul').select('*');
    if (error) console.error('Error fetching data:', error);
    else setMatkul(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && currentId) {
      const { error } = await supabase
        .from('matkul')
        .update({ kode, nama, sks })
        .eq('id', currentId);
      
      if (!error) {
        fetchMatkul();
        resetForm();
      }
    } else {
      const { error } = await supabase.from('matkul').insert([{ kode, nama, sks }]);
      if (!error) {
        fetchMatkul();
        resetForm();
      }
    }
  };

  const handleEdit = (item: any) => {
    setKode(item.kode);
    setNama(item.nama);
    setSks(item.sks);
    setIsEditing(true);
    setCurrentId(item.id);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('matkul').delete().eq('id', id);
    if (!error) fetchMatkul();
  };

  const resetForm = () => {
    setKode('');
    setNama('');
    setSks(2);
    setIsEditing(false);
    setCurrentId(null);
  };

  return (
    <div className="matkul-container">
      <div className="matkul-header">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="btn btn-secondary"
        >
          <FiArrowLeft /> Kembali
        </button>
        <h2 className="matkul-title">
          <FiBook /> Mata Kuliah
        </h2>
        <div className="matkul-actions">
          <button className="btn btn-primary" onClick={resetForm}>
            <FiPlus /> Tambah Matkul
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="matkul-form">
        <div className="form-group">
          <label>Kode Matkul</label>
          <input
            type="text"
            className="form-control"
            value={kode}
            onChange={(e) => setKode(e.target.value)}
            placeholder="Contoh: CS101"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Nama Matkul</label>
          <input
            type="text"
            className="form-control"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Contoh: Algoritma Pemrograman"
            required
          />
        </div>
        
        <div className="form-group">
          <label>SKS</label>
          <select
            className="form-control"
            value={sks}
            onChange={(e) => setSks(Number(e.target.value))}
            required
          >
            {[2, 3, 4, 6].map((num) => (
              <option key={num} value={num}>{num} SKS</option>
            ))}
          </select>
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
              <th>Kode</th>
              <th>Nama Matkul</th>
              <th>SKS</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {matkul.map((mk) => (
              <tr key={mk.id}>
                <td>{mk.kode}</td>
                <td>{mk.nama}</td>
                <td>{mk.sks} SKS</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleEdit(mk)} 
                      className="btn btn-icon btn-secondary"
                    >
                      <FiEdit2 />
                    </button>
                    <button 
                      onClick={() => handleDelete(mk.id)} 
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

export default Matkul;
