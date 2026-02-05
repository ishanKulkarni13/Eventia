import speakeasy from 'speakeasy';
import Attendance from '../models/Attendance.js';
import Event from '../models/Event.js';

const TOTP_STEP_SECONDS = 30;

const buildTotp = (secret) =>
  speakeasy.totp({
    secret,
    encoding: 'base32',
    digits: 6,
    step: TOTP_STEP_SECONDS,
  });

/**
 * Admin/Volunteer: start attendance window for an event.
 */
const startAttendance = async (req, res) => {
  const { eventId } = req.params;
  const event = await Event.findOne({ slug: eventId });

  if (!event) {
    return res.status(404).json({ message: 'Event not found.' });
  }

  if (!event.attendanceSecret) {
    event.attendanceSecret = speakeasy.generateSecret({ length: 20 }).base32;
  }

  event.attendanceActive = true;
  event.attendanceStartedAt = new Date();
  await event.save();

  return res.json({ message: 'Attendance started.' });
};

/**
 * Admin/Volunteer: stop attendance window for an event.
 */
const stopAttendance = async (req, res) => {
  const { eventId } = req.params;
  const event = await Event.findOne({ slug: eventId });

  if (!event) {
    return res.status(404).json({ message: 'Event not found.' });
  }

  event.attendanceActive = false;
  await event.save();

  return res.json({ message: 'Attendance stopped.' });
};

/**
 * Admin/Volunteer: fetch current attendance code.
 */
const getAttendanceCode = async (req, res) => {
  const { eventId } = req.params;
  const event = await Event.findOne({ slug: eventId });

  if (!event) {
    return res.status(404).json({ message: 'Event not found.' });
  }

  if (!event.attendanceActive) {
    return res.status(400).json({ message: 'Attendance is not active.' });
  }

  if (!event.attendanceSecret) {
    event.attendanceSecret = speakeasy.generateSecret({ length: 20 }).base32;
    await event.save();
  }

  const code = buildTotp(event.attendanceSecret);
  const nowSeconds = Math.floor(Date.now() / 1000);
  const remainingSeconds = TOTP_STEP_SECONDS - (nowSeconds % TOTP_STEP_SECONDS);

  return res.json({ code, remainingSeconds });
};

/**
 * Student: mark attendance by submitting the 6-digit code.
 */
const markAttendance = async (req, res) => {
  const { eventId } = req.params;
  const { code } = req.body || {};
  const studentId = req.user.id;

  if (!code) {
    return res.status(400).json({ message: 'Attendance code is required.' });
  }

  const event = await Event.findOne({ slug: eventId });
  if (!event) {
    return res.status(404).json({ message: 'Event not found.' });
  }

  if (!event.attendanceActive) {
    return res.status(400).json({ message: 'Attendance is not active.' });
  }

  const isValid = speakeasy.totp.verify({
    secret: event.attendanceSecret,
    encoding: 'base32',
    token: String(code),
    digits: 6,
    step: TOTP_STEP_SECONDS,
    window: 1,
  });

  if (!isValid) {
    return res.status(400).json({ message: 'Invalid or expired code.' });
  }

  const existing = await Attendance.findOne({ event: event._id, student: studentId });
  if (existing) {
    return res.status(400).json({ message: 'Attendance already recorded.' });
  }

  await Attendance.create({ event: event._id, student: studentId });

  return res.status(201).json({ message: 'Attendance recorded.' });
};

/**
 * Admin: list attendance records for an event.
 */
const listAttendanceRecords = async (req, res) => {
  const { eventId } = req.params;
  const event = await Event.findOne({ slug: eventId });

  if (!event) {
    return res.status(404).json({ message: 'Event not found.' });
  }

  const records = await Attendance.find({ event: event._id })
    .populate('student', 'name email role')
    .sort({ createdAt: -1 });

  return res.json({
    event: {
      id: event._id,
      slug: event.slug,
      title: event.title,
      attendanceActive: event.attendanceActive,
      attendanceStartedAt: event.attendanceStartedAt,
    },
    records,
  });
};

export { startAttendance, stopAttendance, getAttendanceCode, markAttendance, listAttendanceRecords };
