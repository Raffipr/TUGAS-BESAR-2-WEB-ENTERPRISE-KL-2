import { useState } from 'react';
import supabase from '../utils/supabase';


const MahasiswaForm = () => {
  const [formData, setFormData] = useState({
    nim: '',
    nama: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('mahasiswa')
        .insert([formData])
        .select();

      if (error) throw error;
      
      setMessage('Data mahasiswa berhasil disimpan!');
      setFormData({ nim: '', nama: '', email: '' });
    } catch (error) {
      setMessage(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Tambah Mahasiswa</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">NIM</label>
          <input
            type="text"
            name="nim"
            value={formData.nim}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Nama</label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-500 text-white p-2 rounded w-full ${loading ? 'opacity-50' : 'hover:bg-blue-600'}`}
        >
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>
        
        {message && (
          <div className={`mt-4 p-2 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default MahasiswaForm;
