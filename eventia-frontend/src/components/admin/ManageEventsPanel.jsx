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
  onStartAttendance,
  onStopAttendance,
  onFetchAttendance,
  attendanceRecords,
  attendanceLoading,
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
  const registeredStudents = Array.isArray(selectedEvent?.registeredStudents)
    ? selectedEvent.registeredStudents
    : [];

  const assignedVolunteerIds = assignedVolunteers.map((volunteer) =>
    typeof volunteer === 'string' ? volunteer : volunteer._id
  );

  const availableVolunteers = volunteers.filter(
    (volunteer) => !assignedVolunteerIds.includes(volunteer._id)
  );

  const currentAttendance = selectedEvent ? attendanceRecords[selectedEvent.slug] : null;

  const handleAttendanceLoad = () => {
    if (!selectedEvent) return;
    onFetchAttendance(selectedEvent.slug);
  };

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
            <Tabs defaultValue="general" className="w-full" onValueChange={(value) => {
              if (value === 'attendance') {
                handleAttendanceLoad();
              }
            }}>
              <TabsList className="w-full justify-start">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
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
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Registered Students</p>
                    <p className="text-xs text-muted-foreground">View students registered for this event.</p>
                  </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 text-left">Student</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registeredStudents.length === 0 ? (
                        <tr>
                          <td className="px-4 py-3 text-muted-foreground" colSpan={3}>
                            No students registered yet.
                          </td>
                        </tr>
                      ) : (
                        registeredStudents.map((student) => (
                          <tr key={student._id || student} className="border-t">
                            <td className="px-4 py-3">
                              {typeof student === 'string' ? student : student.name}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {typeof student === 'string' ? '—' : student.email}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Student details</DialogTitle>
                                    <DialogDescription>
                                      Registered for this event.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input
                                      value={typeof student === 'string' ? student : student.name}
                                      disabled
                                    />
                                    <Label>Email</Label>
                                    <Input
                                      value={typeof student === 'string' ? '—' : student.email}
                                      disabled
                                    />
                                  </div>
                                  <DialogFooter>
                                    <Button variant="secondary">Close</Button>
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

              <TabsContent value="attendance">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Attendance Status</p>
                    <p className="text-xs text-muted-foreground">Start or stop attendance for this event.</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      onClick={() => onStartAttendance(selectedEvent.slug)}
                      disabled={assigning}
                    >
                      Start
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => onStopAttendance(selectedEvent.slug)}
                      disabled={assigning}
                    >
                      Stop
                    </Button>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border bg-background p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Current status</span>
                    <span className={selectedEvent.attendanceActive ? 'text-emerald-600' : 'text-muted-foreground'}>
                      {selectedEvent.attendanceActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {selectedEvent.attendanceStartedAt
                      ? `Started at: ${new Date(selectedEvent.attendanceStartedAt).toLocaleString()}`
                      : 'Not started yet.'}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">Attendance Records</p>
                  <Button variant="outline" size="sm" onClick={handleAttendanceLoad}>
                    Refresh
                  </Button>
                </div>

                <div className="mt-3 overflow-hidden rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 text-left">Student</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-right">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceLoading ? (
                        <tr>
                          <td className="px-4 py-3 text-muted-foreground" colSpan={3}>
                            Loading attendance...
                          </td>
                        </tr>
                      ) : currentAttendance?.records?.length ? (
                        currentAttendance.records.map((record) => (
                          <tr key={record._id} className="border-t">
                            <td className="px-4 py-3">
                              {record.student?.name || 'Unknown'}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {record.student?.email || '—'}
                            </td>
                            <td className="px-4 py-3 text-right text-muted-foreground">
                              {new Date(record.timestamp).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="px-4 py-3 text-muted-foreground" colSpan={3}>
                            No attendance records yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageEventsPanel;
