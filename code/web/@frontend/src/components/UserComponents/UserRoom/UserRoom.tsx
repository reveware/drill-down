import { UserOverview } from '@drill-down/interfaces';
import React from 'react';
import { Image } from 'react-bootstrap';
import './UserRoom.scss';

interface UserRoomProps {
    user: UserOverview;
}

export const UserRoom: React.FC<UserRoomProps> = (props) => {
    const { user } = props;

    return (
        <div className="user-room">
           <Image fluid id={`${user.username}-room`} src="/images/render-example.png" className="user-room-img" />
        </div>
    );
};
