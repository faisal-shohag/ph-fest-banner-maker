import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const AvatarDisplay = ({user, className="w-10 h-10"}) => {
    return (
        <Avatar className={className}>
                <AvatarImage src={user.photoURL} alt={user.displayName} />
                <AvatarFallback className="rounded-full">{user?.displayName[0] || 'U'}</AvatarFallback>
    </Avatar>
    );
};

export default AvatarDisplay;