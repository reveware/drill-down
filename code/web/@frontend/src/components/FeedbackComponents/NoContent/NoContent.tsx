import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ToTheMoonSVG } from '../../../assets/svg';
import { AppRoutes } from '../../../Routes';
import { selectLoggedInUser } from '../../../store';
import './NoContent.scss';
import { HintMessage } from '../HintMessage/HintMessage';


export const NoContent: React.FC = () => {
    const user = useSelector(selectLoggedInUser);
    return (
        <div className="travel-with-us">
            <HintMessage message={`${user?.username}, you don't seem to have any posts :(`}/>

            <ToTheMoonSVG className='to-the-moon'/>

            <p className='cta'>
                Click
                {
                    <strong>
                        <Link to={AppRoutes.CREATE_POST}> here </Link>
                    </strong>
                }
                to get started!
            </p>
        </div>
    );
};
