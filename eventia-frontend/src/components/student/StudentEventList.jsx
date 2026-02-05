import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const StudentEventList = ({ events, onRegister, registeringId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.length === 0 && (
          <p className="text-sm text-muted-foreground">No events available yet.</p>
        )}
        {events.map((event) => {
          const isFull = event.remainingCapacity === 0;
          const disabled = event.isRegistered || isFull || registeringId === event.slug;

          return (
            <div key={event._id} className="rounded-lg border bg-background p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-foreground">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {event.date ? new Date(event.date).toLocaleDateString() : 'Date TBD'} · {event.location || 'Location TBD'}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Remaining seats: {event.remainingCapacity}
                  </p>
                </div>
                <Button
                  variant={event.isRegistered ? 'secondary' : 'default'}
                  disabled={disabled}
                  onClick={() => onRegister(event)}
                >
                  {event.isRegistered
                    ? 'Registered'
                    : isFull
                    ? 'Full'
                    : registeringId === event.slug
                    ? 'Registering...'
                    : 'Register'}
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default StudentEventList;
