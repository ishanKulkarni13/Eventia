import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import VolunteerLayout from '../components/volunteer/VolunteerLayout';
import { clearAuth } from '../services/auth';

const profile = {
  name: 'Volunteer User',
  email: 'volunteer@eventia.com',
  title: 'Event Volunteer',
  avatar: 'https://ui-avatars.com/api/?name=Volunteer+User&background=0D0D0D&color=fff',
};

const VolunteerDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    toast.info('Logged out');
    navigate('/login', { replace: true });
  };

  return (
    <VolunteerLayout
      profile={{ ...profile, onLogout: handleLogout }}
      title="Volunteer Hub"
      subtitle="Track assigned events and updates."
    />
  );
};

export default VolunteerDashboard;
