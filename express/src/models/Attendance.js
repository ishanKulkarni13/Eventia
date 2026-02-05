import mongoose from 'mongoose';

/**
 * Attendance record is immutable and separate from registrations.
 */
const attendanceSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

attendanceSchema.index({ event: 1, student: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
