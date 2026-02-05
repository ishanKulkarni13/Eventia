import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AttendanceCodeCard from '../../components/attendance/AttendanceCodeCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { authRequest } from '../../services/api';
import { clearAuth, getToken } from '../../services/auth';

const VolunteerMarkAttendance = () => {
  const navigate = useNavigate();
  const token = getToken();
  const [events, setEvents] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error
  const [code, setCode] = useState('');
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const selectedEvent = useMemo(
    () => events.find((event) => event.slug === selectedSlug),
    [events, selectedSlug]
  );

  const handleUnauthorized = () => {
    clearAuth();
    toast.error('Session expired. Please log in again.');
    navigate('/login', { replace: true });
  };

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

  const fetchCode = async (slug) => {
    if (!token || !slug) return;
    setStatus('loading');
    try {
      const data = await authRequest(`/api/attendance/${slug}/code`, token);
      setCode(data.code);
      setRemainingSeconds(data.remainingSeconds);
      setStatus('ready');
    } catch (error) {
      setCode('');
      setRemainingSeconds(0);
      setStatus('error');
      if (error.message.toLowerCase().includes('authorization') || error.message.toLowerCase().includes('token')) {
        handleUnauthorized();
      }
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!selectedSlug) return;
    fetchCode(selectedSlug);
  }, [selectedSlug]);

  useEffect(() => {
    if (!selectedSlug) return undefined;
    if (status !== 'ready') return undefined;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          fetchCode(selectedSlug);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedSlug, status]);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Event</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">No assigned events yet.</p>
          ) : (
            <Select value={selectedSlug} onValueChange={setSelectedSlug}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an event" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event._id} value={event.slug}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      <AttendanceCodeCard
        event={selectedEvent}
        code={code}
        remainingSeconds={remainingSeconds}
        status={status}
        onRefresh={() => fetchCode(selectedSlug)}
      />

      {status === 'error' && (
        <p className="text-xs text-muted-foreground">
          Attendance is not active or the code is unavailable. Start attendance from the admin panel.
        </p>
      )}
    </div>
  );
};

export default VolunteerMarkAttendance;
