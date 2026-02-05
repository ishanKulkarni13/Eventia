import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import StudentCertificatesPanel from '../components/student/StudentCertificatesPanel';
import StudentAttendancePanel from '../components/student/StudentAttendancePanel';
import StudentEventList from '../components/student/StudentEventList';
import StudentLayout from '../components/student/StudentLayout';
import { authRequest } from '../services/api';
import { clearAuth, getToken } from '../services/auth';

const profile = {
  name: 'Student User',
  email: 'student@eventia.com',
  title: 'Student Participant',
  avatar: 'https://ui-avatars.com/api/?name=Student+User&background=0D0D0D&color=fff',
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const token = getToken();
  const [events, setEvents] = useState([]);
  const [activeSection, setActiveSection] = useState('available');
  const [registeringId, setRegisteringId] = useState(null);
  const [attendanceSubmitting, setAttendanceSubmitting] = useState(false);

  const handleUnauthorized = () => {
    clearAuth();
    toast.error('Session expired. Please log in again.');
    navigate('/login', { replace: true });
  };

  const handleLogout = () => {
    clearAuth();
    toast.info('Logged out');
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    const fetchEvents = async () => {
      if (!token) return;
      try {
        const data = await authRequest('/api/student/events', token);
        setEvents(data);
      } catch (error) {
        if (error.message.toLowerCase().includes('authorization') || error.message.toLowerCase().includes('token')) {
          handleUnauthorized();
        } else {
          toast.error(error.message);
        }
      }
    };

    fetchEvents();
  }, []);

  const handleRegister = async (event) => {
    if (!token || !event?.slug) return;
    setRegisteringId(event.slug);

    try {
      await authRequest(`/api/student/events/${event.slug}/register`, token, {
        method: 'POST',
      });
      toast.success('Registered successfully');
      const data = await authRequest('/api/student/events', token);
      setEvents(data);
    } catch (error) {
      if (error.message.toLowerCase().includes('authorization') || error.message.toLowerCase().includes('token')) {
        handleUnauthorized();
      } else {
        toast.error(error.message);
      }
    } finally {
      setRegisteringId(null);
    }
  };

  const handleAttendanceSubmit = async (eventSlug, code) => {
    if (!token) return;
    setAttendanceSubmitting(true);
    try {
      await authRequest(`/api/student/events/${eventSlug}/attendance`, token, {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
      toast.success('Attendance recorded');
      const data = await authRequest('/api/student/events', token);
      setEvents(data);
    } catch (error) {
      if (error.message.toLowerCase().includes('authorization') || error.message.toLowerCase().includes('token')) {
        handleUnauthorized();
      } else {
        toast.error(error.message);
      }
    } finally {
      setAttendanceSubmitting(false);
    }
  };

  const sectionMeta = {
    available: {
      title: 'Available Events',
      subtitle: 'Discover events you can attend today.',
    },
    attendance: {
      title: 'Mark Attendance',
      subtitle: 'Enter the live code or scan the QR at the venue.',
    },
    certificates: {
      title: 'Certificates',
      subtitle: 'View your verified participation proofs.',
    },
  };

  return (
    <StudentLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      profile={{ ...profile, onLogout: handleLogout }}
      title={sectionMeta[activeSection].title}
      subtitle={sectionMeta[activeSection].subtitle}
    >
      {activeSection === 'available' ? (
        <StudentEventList
          events={events}
          onRegister={handleRegister}
          registeringId={registeringId}
        />
      ) : activeSection === 'attendance' ? (
        <StudentAttendancePanel
          events={events}
          onSubmitCode={handleAttendanceSubmit}
          submitting={attendanceSubmitting}
        />
      ) : (
        <StudentCertificatesPanel />
      )}
    </StudentLayout>
  );
};

export default StudentDashboard;
