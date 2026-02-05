import { useEffect, useMemo, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { toast } from 'sonner';
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

const extractSixDigitCode = (value) => {
  if (!value) return '';
  const match = value.match(/\b\d{6}\b/);
  return match ? match[0] : '';
};

const StudentAttendancePanel = ({ events, onSubmitCode, submitting }) => {
  const [selectedSlug, setSelectedSlug] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [scanError, setScanError] = useState('');
  const qrRef = useRef(null);
  const qrInstanceRef = useRef(null);
  const hasStartedRef = useRef(false);
  const lastSubmittedRef = useRef('');
  useEffect(() => {
    if (!qrRef.current || qrInstanceRef.current) return;

    qrInstanceRef.current = new Html5Qrcode('student-qr-reader');

    return () => {
      if (qrInstanceRef.current?.isScanning) {
        qrInstanceRef.current.stop().catch(() => null);
      }
      qrInstanceRef.current?.clear?.();
      qrInstanceRef.current = null;
      hasStartedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!qrInstanceRef.current || hasStartedRef.current) return;

    const startScanner = async () => {
      try {
        await qrInstanceRef.current.start(
          { facingMode: 'environment' },
          { fps: 8, aspectRatio: 1.0 },
          (decodedText) => {
            const code = extractSixDigitCode(decodedText);
            if (code) {
              setManualCode(code);
              setScanError('');
            } else {
              setScanError('No 6-digit code detected.');
            }
          }
        );
        hasStartedRef.current = true;

        const container = document.getElementById('student-qr-reader');
        const canvas = container?.querySelector('canvas');
        if (canvas) canvas.style.display = 'none';
      } catch (error) {
        setScanError('Camera access denied or unavailable.');
      }
    };

    startScanner();

    return () => {
      if (qrInstanceRef.current?.isScanning) {
        qrInstanceRef.current.stop().catch(() => null);
      }
      hasStartedRef.current = false;
    };
  }, []);

  const selectedEvent = useMemo(
    () => events.find((event) => event.slug === selectedSlug),
    [events, selectedSlug]
  );

  const attendanceLive = Boolean(selectedEvent?.attendanceActive);
  const canSubmit = manualCode.length === 6 && attendanceLive && !submitting;

  useEffect(() => {
    if (!attendanceLive || !selectedEvent || submitting) return;
    if (manualCode.length !== 6) return;
    if (manualCode === lastSubmittedRef.current) return;

    lastSubmittedRef.current = manualCode;
    onSubmitCode(selectedEvent.slug, manualCode);
  }, [attendanceLive, manualCode, onSubmitCode, selectedEvent, submitting]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedEvent) {
      toast.error('Select an event first.');
      return;
    }
    if (!attendanceLive) {
      toast.error('Attendance is not live yet.');
      return;
    }
    if (manualCode.length !== 6) {
      toast.error('Enter a valid 6-digit code.');
      return;
    }
    onSubmitCode(selectedEvent.slug, manualCode);
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Event</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events available.</p>
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
          {selectedEvent && (
            <p className="mt-3 text-xs text-muted-foreground">
              Status: {attendanceLive ? 'Live' : 'Not live'} · Remaining seats: {selectedEvent.remainingCapacity}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Enter 6-digit code</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="attendance-code">Code</Label>
                <Input
                  id="attendance-code"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  value={manualCode}
                  onChange={(event) => setManualCode(event.target.value.replace(/\D/g, ''))}
                  disabled={!selectedEvent}
                />
              </div>
              <Button type="submit" disabled={!canSubmit}>
                {submitting ? 'Submitting...' : 'Mark attendance'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scan QR code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="overflow-hidden rounded-lg border">
              <div id="student-qr-reader" ref={qrRef} className="w-full" />
            </div>
            {scanError && <p className="text-xs text-muted-foreground">{scanError}</p>}
            <p className="text-xs text-muted-foreground">
              Scan the QR displayed at the venue. The code will auto-fill.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentAttendancePanel;
