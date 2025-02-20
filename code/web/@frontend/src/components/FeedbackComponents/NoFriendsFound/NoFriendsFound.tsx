import React from 'react';
import * as images from '../../../assets/img';
import {CampingSVG} from '../../../assets/svg';
import { Image } from 'src/components';
import  * as _ from 'lodash';
import './NoFriendsFound.scss';

export const NoFriendsFound = ()=> {

    return (
        <div className='no-friends-found'>
            <CampingSVG className='camping'/>
            <div><span>No friends found</span><span>It's lonely at the top.</span> </div>
        </div>
    )
}
