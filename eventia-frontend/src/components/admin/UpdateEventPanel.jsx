import { useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const UpdateEventPanel = ({ events, onUpdate, loading }) => {
  const [selectedId, setSelectedId] = useState('');
  const selectedEvent = useMemo(
    () => events.find((event) => event._id === selectedId),
    [events, selectedId]
  );
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: '',
  });

  const handleSelect = (eventId) => {
    const event = events.find((item) => item._id === eventId);
    setSelectedId(eventId);
    if (!event) return;
    setForm({
      title: event.title || '',
      description: event.description || '',
      date: event.date ? event.date.slice(0, 10) : '',
      location: event.location || '',
      capacity: event.capacity ? String(event.capacity) : '',
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedEvent) return;
    onUpdate(selectedEvent._id, {
      title: form.title,
      description: form.description,
      date: form.date,
      location: form.location,
      capacity: Number(form.capacity),
    });
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Event</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events to update.</p>
          ) : (
            <Select value={selectedId} onValueChange={handleSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an event" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event._id} value={event._id}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Update Details</CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedEvent ? (
            <p className="text-sm text-muted-foreground">Select an event to edit.</p>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="update-title">Title</Label>
                <Input
                  id="update-title"
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="update-description">Description</Label>
                <Input
                  id="update-description"
                  value={form.description}
                  onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="update-date">Date</Label>
                  <Input
                    id="update-date"
                    type="date"
                    value={form.date}
                    onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="update-location">Location</Label>
                  <Input
                    id="update-location"
                    value={form.location}
                    onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="update-capacity">Capacity</Label>
                <Input
                  id="update-capacity"
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={(event) => setForm((prev) => ({ ...prev, capacity: event.target.value }))}
                  required
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Save Changes'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateEventPanel;
