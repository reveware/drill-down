import { Populated, User } from '@drill-down/common';
import React from 'react';
import { Image } from 'react-bootstrap';
import './UserRoom.scss';


interface UserRoomProps {
    user: Populated<User>;
}

export const UserRoom: React.FC<UserRoomProps> = (props) => {
    const { user } = props;

    return (
        <div  className="user-room"> 
            <Image id={`${user.username}-room`} src="/images/render-example.png" />
        </div>
    );
};
