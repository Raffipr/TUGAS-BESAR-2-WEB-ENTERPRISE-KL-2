import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser , FiEdit2, FiTrash2, FiPlus, FiArrowLeft, FiBook, FiChevronDown } from 'react-icons/fi';
import supabase from '../utils/supabase';
import '../styles/dosen.css';

const Dosen: React.FC = () => {
  const [dosenList, setDosenList] = useState<any[]>([]);
  const [matkulList, setMatkulList] = useState<any[]>([]);
  const [filteredMatkul, setFilteredMatkul] = useState<any[]>([]);
  const [showMatkulDropdown, setShowMatkulDropdown] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    nip: '',
    email: '',
    matkul_id: '',
    matkul_name: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDosen();
    fetchMatkul();
  }, []);

  const fetchDosen = async () => {
    const { data, error } = await supabase
      .from('dosen')
      .select(`
        *,
        matkul: matkul_id (kode_matkul, nama_matkul)
      `);
    
    if (error) {
      console.error('Error fetching dosen:', error);
      setErrorMessage('Gagal memuat data dosen');
    } else {
      setDosenList(data || []);
    }
  };

  const fetchMatkul = async () => {
    const { data, error } = await supabase.from('matkul').select('*');
    if (error) console.error('Error fetching matkul:', error);
    else {
      setMatkulList(data || []);
      setFilteredMatkul(data || []); // Set filteredMatkul untuk dropdown
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'matkul_name') {
      // Filter mata kuliah berdasarkan input
      const filtered = matkulList.filter(matkul =>
        matkul.nama_matkul.toLowerCase().includes(value.toLowerCase()) ||
        matkul.kode_matkul.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredMatkul(filtered);
      setShowMatkulDropdown(value.length > 0);
    }
  };

  const selectMatkul = (matkul: any) => {
    setFormData({
      ...formData,
      matkul_id: matkul.id,
      matkul_name: `${matkul.kode_matkul} - ${matkul.nama_matkul}`
    });
    setShowMatkulDropdown(false);
  };

  const toggleMatkulDropdown = () => {
    setShowMatkulDropdown(!showMatkulDropdown);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validasi form
    if (!formData.nama || !formData.nip) {
      setErrorMessage('Nama dan NIP wajib diisi');
      return;
    }

    try {
      const dosenData = {
        nama: formData.nama,
        nip: formData.nip,
        email: formData.email,
        matkul_id: formData.matkul_id || null
      };

      if (isEditing && currentId) {
        // Update data dosen
        const { error } = await supabase
          .from('dosen')
          .update(dosenData)
          .eq('id', currentId);

        if (error) throw error;
      } else {
        // Tambah data dosen baru
        const { error } = await supabase.from('dosen').insert([dosenData]);
        if (error) throw error;
      }

      fetchDosen();
      resetForm();
    } catch (error) {
      console.error('Error saving data:', error);
      setErrorMessage('Terjadi kesalahan saat menyimpan data');
    }
  };

  const handleEdit = (dosen: any) => {
    setFormData({
      nama: dosen.nama,
      nip: dosen.nip,
      email: dosen.email || '',
      matkul_id: dosen.matkul_id || '',
      matkul_name: dosen.matkul ? `${dosen.matkul.kode_matkul} - ${dosen.matkul.nama_matkul}` : ''
    });
    setIsEditing(true);
    setCurrentId(dosen.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    
    try {
      const { error } = await supabase.from('dosen').delete().eq('id', id);
      if (error) throw error;
      fetchDosen();
    } catch (error) {
      console.error('Error deleting data:', error);
      setErrorMessage('Gagal menghapus data');
    }
  };

  const resetForm = () => {
    setFormData({
      nama: '',
      nip: '',
      email: '',
      matkul_id: '',
      matkul_name: ''
    });
    setIsEditing(false);
    setCurrentId(null);
    setErrorMessage('');
    setShowMatkulDropdown(false);
  };

  return (
    <div className="dosen-container">
      <div className="dosen-header">
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          <FiArrowLeft /> Kembali
        </button>
        <h2 className="dosen-title">
          <FiUser  /> Data Dosen
        </h2>
        <div className="dosen-actions">
          <button className="btn btn-primary" onClick={resetForm}>
            <FiPlus /> Tambah Dosen
          </button>
        </div>
      </div>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="dosen-form">
        <div className="form-group">
          <label>Nama Dosen</label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleInputChange}
            placeholder="Nama lengkap"
            required
          />
        </div>

        <div className="form-group">
          <label>NIP</label>
          <input
            type="text"
            name="nip"
            value={formData.nip}
            onChange={handleInputChange}
            placeholder="Nomor Induk Pegawai"
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email aktif"
          />
        </div>

        <div className="form-group">
          <label>Mata Kuliah yang Diampu</label>
          <div className="combobox-container">
            <div className="combobox-input">
              <input
                type="text"
                name="matkul_name"
                value={formData.matkul_name}
                onChange={handleInputChange}
                placeholder="Ketik atau pilih mata kuliah"
                autoComplete="off"
                onFocus={toggleMatkulDropdown}
              />
              <button 
                type="button" 
                className="dropdown-toggle"
                onClick={toggleMatkulDropdown}
              >
                <FiChevronDown />
              </button>
            </div>
            
            {showMatkulDropdown && (
              <div className="dropdown-menu">
                {filteredMatkul.length > 0 ? (
                  filteredMatkul.map(matkul => (
                    <div 
                      key={matkul.id}
                      className="dropdown-item"
                      onClick={() => selectMatkul(matkul)}
                    >
                      {matkul.kode_matkul} - {matkul.nama_matkul}
                    </div>
                  ))
                ) : (
                  <div className="dropdown-item disabled">Tidak ditemukan</div>
                )}
              </div>
            )}
          </div>
          <input 
            type="hidden" 
            name="matkul_id" 
            value={formData.matkul_id} 
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
              <th>NIP</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Mata Kuliah</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dosenList.map(dosen => (
              <tr key={dosen.id}>
                <td>{dosen.nip}</td>
                <td>{dosen.nama}</td>
                <td>{dosen.email || '-'}</td>
                <td>
                  {dosen.matkul ? (
                    <span className="matkul-badge">
                      <FiBook /> {dosen.matkul.kode_matkul} - {dosen.matkul.nama_matkul}
                    </span>
                  ) : '-'}
                </td>
                <td>
                  <button
                    onClick={() => handleEdit(dosen)}
                    className="btn-icon btn-edit"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(dosen.id)}
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

export default Dosen;
