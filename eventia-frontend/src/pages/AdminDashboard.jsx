import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authRequest } from '../services/api';
import { clearAuth, getToken } from '../services/auth';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = getToken();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: '',
  });
  const [loading, setLoading] = useState(false);

  const handleUnauthorized = () => {
    clearAuth();
    toast.error('Session expired. Please log in again.');
    navigate('/login', { replace: true });
  };

  const fetchEvents = async () => {
    if (!token) return;
    try {
      const data = await authRequest('/api/events', token);
      setEvents(data);
    } catch (error) {
      if (error.message.toLowerCase().includes('authorization') || error.message.toLowerCase().includes('token')) {
        handleUnauthorized();
      } else {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) return;

    setLoading(true);
    try {
      const created = await authRequest('/api/events', token, {
        method: 'POST',
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          date: form.date || undefined,
          location: form.location,
          capacity: Number(form.capacity),
        }),
      });

      toast.success('Event created');
      setEvents((prev) => [created, ...prev]);
      setForm({ title: '', description: '', date: '', location: '', capacity: '' });
      await fetchEvents();
    } catch (error) {
      if (error.message.toLowerCase().includes('authorization') || error.message.toLowerCase().includes('token')) {
        handleUnauthorized();
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500">Create events and review the list.</p>
        </div>
        <button
          className="rounded-md border px-3 py-2 text-sm"
          onClick={() => {
            clearAuth();
            toast.info('Logged out');
            navigate('/login', { replace: true });
          }}
        >
          Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 rounded-lg border bg-white p-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Title</label>
          <input
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Description</label>
          <input
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Date</label>
            <input
              type="date"
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={form.date}
              onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Location</label>
            <input
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={form.location}
              onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
              required
            />
          </div>
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Capacity</label>
          <input
            type="number"
            min="1"
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={form.capacity}
            onChange={(e) => setForm((prev) => ({ ...prev, capacity: e.target.value }))}
            required
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Event'}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">All Events</h2>
        <div className="mt-4 grid gap-3">
          {events.length === 0 && (
            <p className="text-sm text-gray-500">No events yet.</p>
          )}
          {events.map((event) => (
            <div key={event._id} className="rounded-lg border bg-white p-4">
              <h3 className="font-semibold">{event.title}</h3>
              {event.description && <p className="text-sm text-gray-600">{event.description}</p>}
              <p className="mt-2 text-xs text-gray-400">
                {event.date ? new Date(event.date).toLocaleDateString() : 'Date TBD'} · {event.location || 'Location TBD'}
              </p>
              <p className="mt-1 text-xs text-gray-400">Capacity: {event.capacity ?? 'N/A'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
