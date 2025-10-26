import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPanel from '../components/AdminPanel';
import { getAdminAuth, clearAdminAuth } from '../utils/storage';

const Admin = () => {
  const [auth, setAuth] = useState(getAdminAuth());
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      navigate('/admin/login');
    }
  }, [auth, navigate]);

  const handleLogout = () => {
    clearAdminAuth();
    setAuth(false);
    navigate('/');
  };

  if (!auth) {
    return null;
  }

  return <AdminPanel onLogout={handleLogout} />;
};

export default Admin;
