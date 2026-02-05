import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AdminLayout from '../components/admin/AdminLayout';
import CreateEventForm from '../components/admin/CreateEventForm';
import EventList from '../components/admin/EventList';
import ManageEventsPanel from '../components/admin/ManageEventsPanel';
import UpdateEventPanel from '../components/admin/UpdateEventPanel';
import { authRequest } from '../services/api';
import { clearAuth, getToken } from '../services/auth';

const profile = {
  name: 'Admin User',
  email: 'admin@eventia.com',
  title: 'Campus Coordinator',
  avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D0D0D&color=fff',
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = getToken();
  const [events, setEvents] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [activeSection, setActiveSection] = useState('create');
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: '',
  });
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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

  const fetchVolunteers = async () => {
    if (!token) return;
    try {
      const data = await authRequest('/api/volunteers', token);
      setVolunteers(data);
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
    fetchVolunteers();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!token) return;

    setLoading(true);
    try {
      const created = await authRequest('/api/events', token, {
        method: 'POST',
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          date: form.date,
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

  const handleUpdate = async (eventId, updates) => {
    if (!token) return;
    setLoading(true);
    try {
      await authRequest(`/api/events/${eventId}`, token, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      toast.success('Event updated');
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

  const handleDelete = async (eventId) => {
    if (!token) return;
    setDeletingId(eventId);
    try {
      await authRequest(`/api/events/${eventId}`, token, { method: 'DELETE' });
      toast.success('Event deleted');
      await fetchEvents();
    } catch (error) {
      if (error.message.toLowerCase().includes('authorization') || error.message.toLowerCase().includes('token')) {
        handleUnauthorized();
      } else {
        toast.error(error.message);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleAssignVolunteers = async (eventId, volunteerIds) => {
    if (!token) return;
    setLoading(true);
    try {
      await authRequest(`/api/events/${eventId}/volunteers`, token, {
        method: 'PUT',
        body: JSON.stringify({ volunteerIds }),
      });
      toast.success('Volunteer assignments updated');
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

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const sectionMeta = {
    create: {
      title: 'Create Events',
      subtitle: 'Add new campus events for participation tracking.',
    },
    update: {
      title: 'Update Events',
      subtitle: 'Edit existing event details quickly.',
    },
    manage: {
      title: 'Manage Events',
      subtitle: 'Review and clean up events when needed.',
    },
  };

  const renderSection = () => {
    if (activeSection === 'create') {
      return (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
          <CreateEventForm
            values={form}
            onChange={handleChange}
            onSubmit={handleCreate}
            loading={loading}
          />
          <EventList
            title="Latest Events"
            events={events}
            emptyMessage="No events created yet."
          />
        </div>
      );
    }

    if (activeSection === 'update') {
      return (
        <UpdateEventPanel
          events={events}
          onUpdate={handleUpdate}
          loading={loading}
        />
      );
    }

    return (
      <ManageEventsPanel
        events={events}
        onDelete={handleDelete}
        deletingId={deletingId}
        volunteers={volunteers}
        onAssign={handleAssignVolunteers}
        assigning={loading}
      />
    );
  };

  return (
    <AdminLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      profile={profile}
      title={sectionMeta[activeSection].title}
      subtitle={sectionMeta[activeSection].subtitle}
    >
      {renderSection()}
    </AdminLayout>
  );
};

export default AdminDashboard;
