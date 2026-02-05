import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import { getRole, getToken } from './services/auth';

const RoleRedirect = () => {
  const token = getToken();
  const role = getRole();

  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'admin') return <Navigate to="/admin" replace />;
  if (role === 'volunteer') return <Navigate to="/volunteer" replace />;
  return <Navigate to="/student" replace />;
};

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = getToken();
  const role = getRole();

  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/volunteer"
        element={
          <ProtectedRoute allowedRoles={['volunteer']}>
            <VolunteerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
