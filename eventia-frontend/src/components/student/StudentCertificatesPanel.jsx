import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const StudentCertificatesPanel = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Certificates</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Certificates will appear here after events are verified.
        </p>
      </CardContent>
    </Card>
  );
};

export default StudentCertificatesPanel;
