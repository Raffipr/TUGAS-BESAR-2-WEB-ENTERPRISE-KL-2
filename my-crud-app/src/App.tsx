import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Mahasiswa from "./pages/Mahasiswa";
import Dosen from "./pages/Dosen";
import Matkul from "./pages/Matkul";
import Kelas from "./pages/Kelas";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dosen" element={<Dosen />} />
        <Route path="/mahasiswa" element={<Mahasiswa />} />
        <Route path="/matkul" element={<Matkul />} />
        <Route path="/kelas" element={<Kelas />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App