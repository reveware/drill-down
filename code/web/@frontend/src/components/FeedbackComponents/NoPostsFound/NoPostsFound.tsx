import React from 'react';
import { AirportSVG } from 'src/assets/svg';
import './NoPostsFound.scss';

export const NoPostsFound: React.FC = () => {
    return <div className='no-posts-found'>
        <h1>not many posts were found...</h1>
        <AirportSVG />
    </div>
}