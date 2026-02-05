import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const AdminProfileCard = ({ profile }) => {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-white p-3">
      <Avatar className="h-10 w-10">
        <AvatarImage src={profile.avatar} alt={profile.name} />
        <AvatarFallback>AD</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-900">{profile.name}</span>
        <span className="text-xs text-gray-500">{profile.email}</span>
        <span className="text-xs text-gray-400">{profile.title}</span>
      </div>
    </div>
  );
};

export default AdminProfileCard;
