import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBook, FiEdit2, FiTrash2, FiPlus, FiArrowLeft } from 'react-icons/fi';
import supabase from '../utils/supabase';
import '../styles/matkul.css';

const Matkul: React.FC = () => {
  const [matkulList, setMatkulList] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    kode: '',
    nama: '',
    sks: '',
    dosen: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatkul();
  }, []);

  const fetchMatkul = async () => {
    const { data, error } = await supabase.from('matkul').select('*');
    if (error) {
      console.error('Error fetching matkul:', error);
      setErrorMessage('Gagal memuat data mata kuliah');
    } else {
      setMatkulList(data || []);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.kode || !formData.nama || !formData.sks) {
      setErrorMessage('Kode, Nama, dan SKS wajib diisi');
      return;
    }

    try {
      const matkulData = {
        kode_matkul: formData.kode,
        nama_matkul: formData.nama,
        sks: parseInt(formData.sks),
        dosen_pengampu: formData.dosen || null
      };

      if (isEditing && currentId) {
        const { error } = await supabase
          .from('matkul')
          .update(matkulData)
          .eq('id', currentId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('matkul').insert([matkulData]);
        if (error) throw error;
      }

      fetchMatkul();
      resetForm();
    } catch (error) {
      console.error('Error saving data:', error);
      setErrorMessage('Terjadi kesalahan saat menyimpan data');
    }
  };

  const handleEdit = (matkul: any) => {
    setFormData({
      kode: matkul.kode_matkul,
      nama: matkul.nama_matkul,
      sks: matkul.sks,
      dosen: matkul.dosen_pengampu || ''
    });
    setIsEditing(true);
    setCurrentId(matkul.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) return;

    try {
      const { error } = await supabase.from('matkul').delete().eq('id', id);
      if (error) throw error;
      fetchMatkul();
    } catch (error) {
      console.error('Error deleting data:', error);
      setErrorMessage('Gagal menghapus data');
    }
  };

  const resetForm = () => {
    setFormData({
      kode: '',
      nama: '',
      sks: '',
      dosen: ''
    });
    setIsEditing(false);
    setCurrentId(null);
    setErrorMessage('');
  };

  return (
    <div className="matkul-container">
      <div className="matkul-header">
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
          <FiArrowLeft /> Kembali
        </button>
        <h2 className="matkul-title">
          <FiBook /> Data Mata Kuliah
        </h2>
        <div className="matkul-actions">
          <button className="btn btn-primary" onClick={resetForm}>
            <FiPlus /> Tambah Matkul
          </button>
        </div>
      </div>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="matkul-form">
        <div className="form-group">
          <label>Kode Mata Kuliah</label>
          <input
            type="text"
            name="kode"
            value={formData.kode}
            onChange={handleInputChange}
            placeholder="Contoh: CS101"
            required
          />
        </div>

        <div className="form-group">
          <label>Nama Mata Kuliah</label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleInputChange}
            placeholder="Nama lengkap mata kuliah"
            required
          />
        </div>

        <div className="form-group">
          <label>SKS</label>
          <input
            type="number"
            name="sks"
            value={formData.sks}
            onChange={handleInputChange}
            placeholder="Jumlah SKS"
            min="1"
            max="8"
            required
          />
        </div>

        <div className="form-group">
          <label>Dosen Pengampu</label>
          <input
            type="text"
            name="dosen"
            value={formData.dosen}
            onChange={handleInputChange}
            placeholder="Nama dosen pengampu"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Simpan Perubahan' : 'Tambah Data'}
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm} className="btn btn-secondary">
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
              <th>Nama</th>
              <th>SKS</th>
              <th>Dosen</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {matkulList.map(matkul => (
              <tr key={matkul.id}>
                <td>{matkul.kode_matkul}</td>
                <td>{matkul.nama_matkul}</td>
                <td>{matkul.sks}</td>
                <td>{matkul.dosen_pengampu || '-'}</td>
                <td>
                  <button
                    onClick={() => handleEdit(matkul)}
                    className="btn-icon btn-edit"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(matkul.id)}
                    className="btn-icon btn-danger"
                  >
                    <FiTrash2 />
                  </button>
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
