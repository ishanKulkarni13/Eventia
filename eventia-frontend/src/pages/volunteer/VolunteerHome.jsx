import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { authRequest } from '../../services/api';
import { clearAuth, getToken } from '../../services/auth';

const VolunteerHome = () => {
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
        const data = await authRequest('/api/volunteer/events', token);
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
    <Card>
      <CardHeader>
        <CardTitle>Assigned Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.length === 0 && (
          <p className="text-sm text-muted-foreground">No assigned events yet.</p>
        )}
        {events.map((event) => (
          <div key={event._id} className="rounded-lg border bg-background p-4 shadow-sm">
            <h3 className="font-semibold text-foreground">{event.title}</h3>
            {event.description && <p className="text-sm text-muted-foreground">{event.description}</p>}
            <p className="mt-2 text-xs text-muted-foreground">
              {event.date ? new Date(event.date).toLocaleDateString() : 'Date TBD'} · {event.location || 'Location TBD'}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default VolunteerHome;
