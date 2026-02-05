import { Button } from '../ui/button';
import EventList from './EventList';

const ManageEventsPanel = ({ events, onDelete, deletingId }) => {
  return (
    <EventList
      title="Manage Events"
      events={events}
      emptyMessage="No events to manage."
      footer={(event) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(event._id)}
          disabled={deletingId === event._id}
        >
          {deletingId === event._id ? 'Deleting...' : 'Delete'}
        </Button>
      )}
    />
  );
};

export default ManageEventsPanel;
