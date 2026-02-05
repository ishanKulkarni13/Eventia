import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const EventList = ({ title, events, emptyMessage, footer }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.length === 0 && (
          <p className="text-sm text-gray-500">{emptyMessage}</p>
        )}
        {events.map((event) => (
          <div key={event._id} className="rounded-lg border bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.description}</p>
                <p className="mt-2 text-xs text-gray-400">
                  {event.date ? new Date(event.date).toLocaleDateString() : 'Date TBD'} · {event.location || 'Location TBD'}
                </p>
                <p className="mt-1 text-xs text-gray-400">Capacity: {event.capacity ?? 'N/A'}</p>
              </div>
              {footer ? footer(event) : null}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default EventList;
