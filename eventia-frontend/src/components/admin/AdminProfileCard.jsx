import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const AdminProfileCard = ({ profile }) => {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-background p-3 shadow-sm">
      <Avatar className="h-10 w-10">
        <AvatarImage src={profile.avatar} alt={profile.name} />
        <AvatarFallback>AD</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-foreground">{profile.name}</span>
        <span className="text-xs text-muted-foreground">{profile.email}</span>
        <span className="text-xs text-muted-foreground">{profile.title}</span>
      </div>
    </div>
  );
};

export default AdminProfileCard;
