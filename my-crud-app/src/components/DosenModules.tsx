// src/components/DosenModule.tsx
import React, { useEffect, useState } from 'react';

import '../styles.css'; // Import CSS
import supabase from '../utils/supabase';

interface DosenModule {
  id: string;
  dosen_id: string;
  module_id: string;
}

const DosenModule: React.FC = () => {
  const [dosenModule, setDosenModule] = useState<DosenModule[]>([]);
  const [dosenId, setDosenId] = useState<string>('');
  const [modulId, setModulId] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dosenList, setDosenList] = useState<{ id: string; nama: string }[]>([]);
  const [modulList, setModulList] = useState<{ id: string; nama: string }[]>([]);

  const fetchDosenModule = async () => {
    const { data, error } = await supabase.from('dosen_module').select('*');
    if (error) console.error('Error fetching dosen_module:', error);
    else setDosenModule(data as DosenModule[]);
  };

  const fetchDosenList = async () => {
    const { data, error } = await supabase.from('Dosen').select('*');
    if (error) console.error('Error fetching dosen:', error);
    else setDosenList(data as { id: string; nama: string }[]);
  };

  const fetchModulList = async () => {
    const { data, error } = await supabase.from('Modul').select('*');
    if (error) console.error('Error fetching modul:', error);
    else setModulList(data as { id: string; nama: string }[]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedId) {
      const { error } = await supabase
        .from('dosen_module')
        .update({ dosenId, module_id: modulId })
        .eq('id', selectedId);
      if (error) console.error('Error updating dosen_module:', error);
    } else {
      const { error } = await supabase.from('dosen_module').insert([{ dosenId, module_id: modulId }]);
      if (error) console.error('Error adding dosen_module:', error);
    }
    setDosenId('');
    setModulId('');
    setSelectedId(null);
    fetchDosenModule();
  };

  const handleEdit = (dm: DosenModule) => {
    setDosenId(dm.dosen_id);
    setModulId(dm.module_id);
    setSelectedId(dm.id);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('dosen_module').delete().eq('id', id);
    if (error) console.error('Error deleting dosen_module:', error);
    fetchDosenModule();
  };

  useEffect(() => {
    fetchDosenModule();
    fetchDosenList();
    fetchModulList();
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h2>Manajemen Dosen dan Modul</h2>
        <form onSubmit={handleSubmit}>
          <select value={dosenId} onChange={(e) => setDosenId(e.target.value)} required>
            <option value="">Pilih Dosen</option>
            {dosenList.map((dsn) => (
              <option key={dsn.id} value={dsn.id}>{dsn.nama}</option>
            ))}
          </select>
          <select value={modulId} onChange={(e) => setModulId(e.target.value)} required>
            <option value="">Pilih Modul</option>
            {modulList.map((mdl) => (
              <option key={mdl.id} value={mdl.id}>{mdl.nama}</option>
            ))}
          </select>
          <button type="submit">{selectedId ? 'Update' : 'Add'} Dosen-Module</button>
        </form>
        <ul>
          {dosenModule.map((dm) => (
            <li key={dm.id} className="list-item">
              Dosen ID: {dm.dosen_id} - Modul ID: {dm.module_id}
              <div>
                <button onClick={() => handleEdit(dm)}>Edit</button>
                <button onClick={() => handleDelete(dm.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DosenModule;
