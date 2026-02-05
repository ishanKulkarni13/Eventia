import Event from '../models/Event.js';
import User from '../models/User.js';

/**
 * Admin: create event (minimal fields).
 */
const createEvent = async (req, res) => {
  const { title, description, date, location, capacity, assignedVolunteers = [] } = req.body || {};

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
  const events = await Event.find()
    .populate('assignedVolunteers', 'name email role')
    .sort({ createdAt: -1 });
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

/**
 * Admin: list all volunteers for assignment.
 */
const listVolunteers = async (req, res) => {
  const volunteers = await User.find({ role: 'volunteer' })
    .select('name email role')
    .sort({ name: 1 });
  return res.json(volunteers);
};

/**
 * Admin: assign volunteers to event (replace list).
 */
const assignVolunteers = async (req, res) => {
  const { eventId } = req.params;
  const { volunteerIds = [] } = req.body || {};

  if (!eventId) {
    return res.status(400).json({ message: 'Event ID is required.' });
  }

  if (!Array.isArray(volunteerIds)) {
    return res.status(400).json({ message: 'volunteerIds must be an array.' });
  }

  const uniqueIds = [...new Set(volunteerIds)];

  const volunteerCount = await User.countDocuments({
    _id: { $in: uniqueIds },
    role: 'volunteer',
  });

  if (volunteerCount !== uniqueIds.length) {
    return res.status(400).json({ message: 'One or more volunteers are invalid.' });
  }

  const event = await Event.findByIdAndUpdate(
    eventId,
    { assignedVolunteers: uniqueIds },
    { new: true }
  ).populate('assignedVolunteers', 'name email role');

  if (!event) {
    return res.status(404).json({ message: 'Event not found.' });
  }

  return res.json(event);
};

export {
  createEvent,
  listEvents,
  updateEvent,
  deleteEvent,
  listAssignedEvents,
  listAvailableEvents,
  listVolunteers,
  assignVolunteers,
};
