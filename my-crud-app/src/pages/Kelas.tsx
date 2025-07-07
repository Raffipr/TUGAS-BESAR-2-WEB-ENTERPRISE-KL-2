import React, { useEffect, useState } from 'react';
import { FiCalendar, FiEdit2, FiTrash2, FiPlus, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import supabase from '../utils/supabase';
import '../styles/kelas.css'; // Import CSS khusus Kelas

const Kelas: React.FC = () => {
  const [kelas, setKelas] = useState<any[]>([]);
  const [kodeKelas, setKodeKelas] = useState('');
  const [namaMatkul, setNamaMatkul] = useState('');
  const [dosenPengajar, setDosenPengajar] = useState('');
  const [hari, setHari] = useState('Senin');
  const [waktu, setWaktu] = useState('');
  const [ruang, setRuang] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchKelas();
  }, []);

  const fetchKelas = async () => {
    const { data, error } = await supabase.from('kelas').select('*');
    if (error) console.error('Error fetching data:', error);
    else setKelas(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const kelasData = {
      kode_kelas: kodeKelas,
      nama_matkul: namaMatkul,
      dosen_pengajar: dosenPengajar,
      hari,
      waktu,
      ruang
    };

    if (isEditing && currentId) {
      const { error } = await supabase
        .from('kelas')
        .update(kelasData)
        .eq('id', currentId);
      
      if (!error) {
        fetchKelas();
        resetForm();
      }
    } else {
      const { error } = await supabase.from('kelas').insert([kelasData]);
      if (!error) fetchKelas();
    }
  };

  const handleEdit = (item: any) => {
    setKodeKelas(item.kode_kelas);
    setNamaMatkul(item.nama_matkul);
    setDosenPengajar(item.dosen_pengajar);
    setHari(item.hari);
    setWaktu(item.waktu);
    setRuang(item.ruang);
    setIsEditing(true);
    setCurrentId(item.id);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('kelas').delete().eq('id', id);
    if (!error) fetchKelas();
  };

  const resetForm = () => {
    setKodeKelas('');
    setNamaMatkul('');
    setDosenPengajar('');
    setHari('Senin');
    setWaktu('');
    setRuang('');
    setIsEditing(false);
    setCurrentId(null);
  };

  return (
    <div className="kelas-container">
      <div className="kelas-header">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="btn btn-secondary"
        >
          <FiArrowLeft /> Kembali
        </button>
        <h2 className="kelas-title">
          <FiCalendar /> Data Kelas
        </h2>
        <div className="kelas-actions">
          <button className="btn btn-primary" onClick={resetForm}>
            <FiPlus /> Tambah Kelas
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="kelas-form">
        <div className="form-group">
          <label>Kode Kelas</label>
          <input
            type="text"
            className="form-control"
            value={kodeKelas}
            onChange={(e) => setKodeKelas(e.target.value)}
            placeholder="Contoh: KLS2023A"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Mata Kuliah</label>
          <input
            type="text"
            className="form-control"
            value={namaMatkul}
            onChange={(e) => setNamaMatkul(e.target.value)}
            placeholder="Nama mata kuliah"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Dosen Pengajar</label>
          <input
            type="text"
            className="form-control"
            value={dosenPengajar}
            onChange={(e) => setDosenPengajar(e.target.value)}
            placeholder="Nama dosen pengajar"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Hari</label>
          <select
            className="form-control"
            value={hari}
            onChange={(e) => setHari(e.target.value)}
            required
          >
            {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Waktu</label>
          <input
            type="text"
            className="form-control"
            value={waktu}
            onChange={(e) => setWaktu(e.target.value)}
            placeholder="Contoh: 08.00-10.00"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Ruang</label>
          <input
            type="text"
            className="form-control"
            value={ruang}
            onChange={(e) => setRuang(e.target.value)}
            placeholder="Lokasi ruangan"
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
              <th>Kode Kelas</th>
              <th>Mata Kuliah</th>
              <th>Dosen</th>
              <th>Jadwal</th>
              <th>Ruang</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kelas.map((kls) => (
              <tr key={kls.id}>
                <td>{kls.kode_kelas}</td>
                <td>{kls.nama_matkul}</td>
                <td>{kls.dosen_pengajar}</td>
                <td>{kls.hari}, {kls.waktu}</td>
                <td>{kls.ruang}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleEdit(kls)} 
                      className="btn btn-icon btn-secondary"
                    >
                      <FiEdit2 />
                    </button>
                    <button 
                      onClick={() => handleDelete(kls.id)} 
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

export default Kelas;
