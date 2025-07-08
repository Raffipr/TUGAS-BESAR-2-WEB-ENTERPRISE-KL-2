import { useState } from 'react';
import { FiUserPlus, FiLoader, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import supabase from '../utils/supabase';

export default function MahasiswaForm({ onSuccess }: { onSuccess?: () => void }) {
  const [form, setForm] = useState({
    nim: '',
    nama: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{text: string; type: 'success' | 'error'} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validasi sederhana
    if (!form.nim || !form.nama || !form.email) {
      setMessage({ text: 'Harap isi semua kolom!', type: 'error' });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('mahasiswa')
        .insert([form])
        .select();

      if (error) throw error;

      // Reset form
      setForm({ nim: '', nama: '', email: '' });
      setMessage({ text: 'Data berhasil disimpan!', type: 'success' });
      
      // Refresh data di parent component jika ada
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      console.error('Error:', error);
      setMessage({ 
        text: error.message || 'Gagal menyimpan data', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FiUserPlus className="text-blue-500" /> Tambah Mahasiswa Baru
      </h2>

      {message && (
        <div className={`p-3 mb-4 rounded-md flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {message.type === 'success' ? 
            <FiCheckCircle /> : <FiXCircle />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            NIM <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nim"
            value={form.nim}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contoh: 20241001"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contoh: Budi Santoso"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contoh: budi@email.com"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded text-white font-medium flex items-center justify-center gap-2 ${
            loading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin" />
              Menyimpan...
            </>
          ) : (
            'Tambah Data'
          )}
        </button>
      </form>
    </div>
  );
}
