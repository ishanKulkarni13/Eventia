import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authRequest } from '../services/api';
import { clearAuth, getToken } from '../services/auth';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const token = getToken();
  const [events, setEvents] = useState([]);

  const handleUnauthorized = () => {
    clearAuth();
    toast.error('Session expired. Please log in again.');
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-semibold">Student Dashboard</h1>
      <p className="mt-2 text-sm text-gray-500">Available events you can attend.</p>

      <div className="mt-6 grid gap-3">
        {events.length === 0 && (
          <p className="text-sm text-gray-500">No events available yet.</p>
        )}
        {events.map((event) => (
          <div key={event._id} className="rounded-lg border bg-white p-4">
            <h3 className="font-semibold">{event.title}</h3>
            {event.description && <p className="text-sm text-gray-600">{event.description}</p>}
            <p className="mt-2 text-xs text-gray-400">
              {event.date ? new Date(event.date).toLocaleDateString() : 'Date TBD'} · {event.location || 'Location TBD'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
