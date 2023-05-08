import React from 'react';
import { Card } from 'react-bootstrap';
import { AirportSVG } from 'src/assets/svg';
import './NoPostsFound.scss';


interface NoPostsFoundProps{
    query: 'tags' | 'user'
}
export const NoPostsFound: React.FC<NoPostsFoundProps>= ({query})=> {
    return <Card className='no-posts-found'>
        <div>
            {query === 'user' && <h1>It looks like this user is taking a vacation from posting.</h1>}
            {query === 'tags' && <h1>Not a lot of post for this tag..</h1>}
            <AirportSVG/>
        </div>
    </Card>
}