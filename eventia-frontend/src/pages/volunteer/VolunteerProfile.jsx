import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const VolunteerProfile = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Profile management will be available in a later milestone.
        </p>
      </CardContent>
    </Card>
  );
};

export default VolunteerProfile;
