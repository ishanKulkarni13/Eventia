import Event from '../models/Event.js';

/**
 * Admin: create event (minimal fields).
 */
const createEvent = async (req, res) => {
  const { title, description, date, location, assignedVolunteers = [] } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Event title is required.' });
  }

  const event = await Event.create({
    title,
    description,
    date,
    location,
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

export { createEvent, listEvents, listAssignedEvents, listAvailableEvents };
