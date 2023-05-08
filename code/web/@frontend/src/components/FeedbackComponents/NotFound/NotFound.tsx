import React from 'react';
import { Card } from 'react-bootstrap';
import { SearchEngineSVG } from 'src/assets/svg';
import './NotFound.scss';


export const NotFound: React.FC = ()=> {

    return <Card className='not-found'>
        <div>
            <h1>Hmm, we couldn't find what you were looking for</h1>
            <SearchEngineSVG/>
        </div>
    </Card>
}