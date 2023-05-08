import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ToTheMoonSVG } from '../../../assets/svg';
import { AppRoutes } from '../../../Routes';
import { selectLoggedInUser } from '../../../store';
import './NoContent.scss';


export const NoContent: React.FC = () => {
    const user = useSelector(selectLoggedInUser);
    return (
        <div className="travel-with-us">
            <p>{user?.username}, you don't seem to have any posts :(</p>

            <ToTheMoonSVG />

            <p>
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
