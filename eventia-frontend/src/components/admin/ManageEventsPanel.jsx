import { useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const ManageEventsPanel = ({
  events,
  volunteers,
  onDelete,
  onAssign,
  deletingId,
  assigning,
}) => {
  const [selectedId, setSelectedId] = useState('');
  const [volunteerPicker, setVolunteerPicker] = useState('');
  const [removeTarget, setRemoveTarget] = useState(null);
  const selectedEvent = useMemo(
    () => events.find((event) => event._id === selectedId),
    [events, selectedId]
  );
  const assignedVolunteers = Array.isArray(selectedEvent?.assignedVolunteers)
    ? selectedEvent.assignedVolunteers
    : [];

  const assignedVolunteerIds = assignedVolunteers.map((volunteer) =>
    typeof volunteer === 'string' ? volunteer : volunteer._id
  );

  const availableVolunteers = volunteers.filter(
    (volunteer) => !assignedVolunteerIds.includes(volunteer._id)
  );

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Event</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events to manage.</p>
          ) : (
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an event" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event._id} value={event._id}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Manage Details</CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedEvent ? (
            <p className="text-sm text-muted-foreground">Select an event to manage.</p>
          ) : (
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <div className="space-y-2">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{selectedEvent.title}</h3>
                    <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedEvent.date ? new Date(selectedEvent.date).toLocaleDateString() : 'Date TBD'} · {selectedEvent.location || 'Location TBD'}
                  </p>
                  <p className="text-xs text-muted-foreground">Capacity: {selectedEvent.capacity ?? 'N/A'}</p>
                  <Button
                    variant="destructive"
                    onClick={() => onDelete(selectedEvent._id)}
                    disabled={deletingId === selectedEvent._id}
                  >
                    {deletingId === selectedEvent._id ? 'Deleting...' : 'Delete Event'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="volunteers">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Assigned Volunteers</p>
                    <p className="text-xs text-muted-foreground">Add or remove volunteers for this event.</p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button disabled={!selectedEvent || availableVolunteers.length === 0}>
                        Add Volunteer
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add volunteer</DialogTitle>
                        <DialogDescription>
                          Select a volunteer to assign to this event.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-2">
                        <Label>Volunteer</Label>
                        <Select value={volunteerPicker} onValueChange={setVolunteerPicker}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose volunteer" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableVolunteers.map((volunteer) => (
                              <SelectItem key={volunteer._id} value={volunteer._id}>
                                {volunteer.name} · {volunteer.email}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={() => {
                            if (!volunteerPicker) return;
                            onAssign(selectedEvent._id, [...assignedVolunteerIds, volunteerPicker]);
                            setVolunteerPicker('');
                          }}
                          disabled={!volunteerPicker || assigning}
                        >
                          {assigning ? 'Assigning...' : 'Assign'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="mt-4 mx-auto max-w-xs sm:max-w-full overflow-y-scroll rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 text-left">Volunteer</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignedVolunteers.length === 0 ? (
                        <tr>
                          <td className="px-4 py-3 text-muted-foreground" colSpan={3}>
                            No volunteers assigned yet.
                          </td>
                        </tr>
                      ) : (
                        assignedVolunteers.map((volunteer) => (
                          <tr key={volunteer._id || volunteer} className="border-t">
                            <td className="px-4 py-3">
                              {typeof volunteer === 'string' ? volunteer : volunteer.name}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {typeof volunteer === 'string' ? '—' : volunteer.email}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Dialog open={removeTarget === (volunteer._id || volunteer)} onOpenChange={(open) => setRemoveTarget(open ? (volunteer._id || volunteer) : null)}>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    Manage
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Remove volunteer</DialogTitle>
                                    <DialogDescription>
                                      This will unassign the volunteer from the event.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-2">
                                    <Label>Volunteer</Label>
                                    <Input
                                      value={typeof volunteer === 'string' ? volunteer : volunteer.name}
                                      disabled
                                    />
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      variant="destructive"
                                      onClick={() => {
                                        const id = volunteer._id || volunteer;
                                        const remaining = assignedVolunteerIds.filter((item) => item !== id);
                                        onAssign(selectedEvent._id, remaining);
                                        setRemoveTarget(null);
                                      }}
                                      disabled={assigning}
                                    >
                                      {assigning ? 'Updating...' : 'Remove'}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="students">
                <Card className="border-dashed">
                  <CardContent className="py-6 text-sm text-muted-foreground">
                    Student assignment tools will be added in the next milestone.
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageEventsPanel;
