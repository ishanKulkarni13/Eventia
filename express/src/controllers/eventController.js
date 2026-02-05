import Event from '../models/Event.js';

/**
 * Admin: create event (minimal fields).
 */
const createEvent = async (req, res) => {
  const { title, description, date, location, capacity, assignedVolunteers = [] } = await req.body || {};

    console.log(title, description, date, location, capacity, assignedVolunteers)

  if (!title || !description || !date || !location || !capacity) {
    return res.status(400).json({
      message: 'Title, description, date, location, and capacity are required.',
    });
  }

  if (Number(capacity) < 1) {
    return res.status(400).json({ message: 'Capacity must be at least 1.' });
  }

  const event = await Event.create({
    title,
    description,
    date,
    location,
    capacity,
    createdBy: req.user.id,
    assignedVolunteers,
  });

  return res.status(201).json(event);
};

/**
 * Admin: list all events.
 */
const listEvents = async (req, res) => {
  const events = await Event.find().sort({ createdAt: -1 });
  return res.json(events);
};

/**
 * Admin: update event by id (minimal validation).
 */
const updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const updates = req.body;

  if (!eventId) {
    return res.status(400).json({ message: 'Event ID is required.' });
  }

  const event = await Event.findByIdAndUpdate(eventId, updates, { new: true });

  if (!event) {
    return res.status(404).json({ message: 'Event not found.' });
  }

  return res.json(event);
};

/**
 * Admin: delete event by id.
 */
const deleteEvent = async (req, res) => {
  const { eventId } = req.params;

  if (!eventId) {
    return res.status(400).json({ message: 'Event ID is required.' });
  }

  const event = await Event.findByIdAndDelete(eventId);

  if (!event) {
    return res.status(404).json({ message: 'Event not found.' });
  }

  return res.json({ message: 'Event deleted.' });
};

/**
 * Volunteer: list events assigned to the logged-in volunteer.
 */
const listAssignedEvents = async (req, res) => {
  const events = await Event.find({ assignedVolunteers: req.user.id }).sort({ createdAt: -1 });
  return res.json(events);
};

/**
 * Student: list available events (simple public list).
 */
const listAvailableEvents = async (req, res) => {
  const events = await Event.find().sort({ createdAt: -1 });
  return res.json(events);
};

export {
  createEvent,
  listEvents,
  updateEvent,
  deleteEvent,
  listAssignedEvents,
  listAvailableEvents,
};
