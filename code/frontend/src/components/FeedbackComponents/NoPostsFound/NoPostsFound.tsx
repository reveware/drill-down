import React from 'react';
import { Card } from 'react-bootstrap';
import { AirportSVG } from 'src/assets/svg';
import './NoPostsFound.scss';


interface NoPostsFoundProps{
    username: string
}
export const NoPostsFound: React.FC<NoPostsFoundProps>= ({username})=> {
    return <Card className='no-posts-found'>
        <div>
            <h1>It looks like {username} is taking a vacation from posting.</h1>
            <AirportSVG/>
        </div>
    </Card>
}