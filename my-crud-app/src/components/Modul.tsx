import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiBookOpen } from 'react-icons/fi';
import supabase from '../utils/supabase';

const Matkul = () => {
  const [matkul, setMatkul] = useState<any[]>([]);
  const [nama, setNama] = useState('');
  const [kode, setKode] = useState('');
  const [sks, setSks] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

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
        .update({ nama, kode, sks: parseInt(sks) })
        .eq('id', currentId);
      
      if (!error) {
        fetchMatkul();
        resetForm();
      }
    } else {
      const { error } = await supabase.from('matkul').insert([{ 
        nama, 
        kode, 
        sks: parseInt(sks) 
      }]);
      if (!error) {
        fetchMatkul();
        resetForm();
      }
    }
  };

  const handleEdit = (item: any) => {
    setNama(item.nama);
    setKode(item.kode);
    setSks(item.sks);
    setIsEditing(true);
    setCurrentId(item.id);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('matkul').delete().eq('id', id);
    if (!error) fetchMatkul();
  };

  const resetForm = () => {
    setNama('');
    setKode('');
    setSks('');
    setIsEditing(false);
    setCurrentId(null);
  };

  return (
    <div className="modern-container">
      <div className="form-section">
        <h2 className="section-title">
          <FiBookOpen className="icon" /> {isEditing ? 'Edit' : 'Tambah'} Mata Kuliah
        </h2>
        <form onSubmit={handleSubmit} className="form-input">
          <div className="input-group">
            <label>Kode Matkul</label>
            <input
              type="text"
              value={kode}
              onChange={(e) => setKode(e.target.value)}
              placeholder="Kode Mata Kuliah"
              required
            />
          </div>
          <div className="input-group">
            <label>Nama Matkul</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama Mata Kuliah"
              required
            />
          </div>
          <div className="input-group">
            <label>SKS</label>
            <select
              value={sks}
              onChange={(e) => setSks(e.target.value)}
              required
            >
              <option value="">Pilih SKS</option>
              {[1, 2, 3, 4, 6].map((num) => (
                <option key={num} value={num}>{num} SKS</option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {isEditing ? 'Update' : 'Simpan'}
            </button>
            {isEditing && (
              <button type="button" onClick={resetForm} className="btn-secondary">
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="table-section">
        <div className="table-header">
          <h2 className="section-title">
            <FiBookOpen className="icon" /> Daftar Mata Kuliah
          </h2>
          <div className="total-items">{matkul.length} Mata Kuliah</div>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama</th>
                <th>SKS</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {matkul.map((mtk) => (
                <tr key={mtk.id}>
                  <td>{mtk.kode}</td>
                  <td>{mtk.nama}</td>
                  <td>{mtk.sks} SKS</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(mtk)} className="btn-edit">
                      <FiEdit2 />
                    </button>
                    <button onClick={() => handleDelete(mtk.id)} className="btn-danger">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Matkul;
