import mongoose from 'mongoose';

/**
 * Minimal Event schema for hackathon MVP.
 * Attendance logic will be added later.
 */
const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    date: { type: Date },
    location: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);

export default Event;
