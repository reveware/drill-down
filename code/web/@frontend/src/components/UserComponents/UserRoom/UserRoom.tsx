import { UserOverview } from '@drill-down/interfaces';
import React from 'react';
import { Image } from '../../../components';
import './UserRoom.scss';
import * as images from '../../../assets/img'
interface UserRoomProps {
    user: UserOverview;
}

export const UserRoom: React.FC<UserRoomProps> = (props) => {
    const { user } = props;

    return (
        <div className="user-room">
           <Image id={`${user.username}-room`} source={images.RenderExample} className="user-room-img" />
        </div>
    );
};
