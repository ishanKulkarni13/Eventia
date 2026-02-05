import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import VolunteerHome from './pages/volunteer/VolunteerHome';
import VolunteerMarkAttendance from './pages/volunteer/VolunteerMarkAttendance';
import VolunteerProfile from './pages/volunteer/VolunteerProfile';
import { getRole, getToken } from './services/auth';
import { Toaster } from './components/ui/sonner';
import { ModeToggle } from './components/mode-toggle';

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
    <>
      <Toaster richColors />
      <div className="fixed right-4 top-4 z-50">
        <ModeToggle />
      </div>
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
        >
          <Route index element={<VolunteerHome />} />
          <Route path="mark-attendance-qr" element={<VolunteerMarkAttendance />} />
          <Route path="profile" element={<VolunteerProfile />} />
        </Route>
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
    </>
  );
}

export default App;
