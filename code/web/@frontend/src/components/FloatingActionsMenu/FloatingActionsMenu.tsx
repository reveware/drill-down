import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './FloatingActionsMenu.scss';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../Routes';
import { selectLoggedInUser, useAppSelector } from 'src/store';

export const FloatingActionsMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const loggedInUser = useAppSelector(selectLoggedInUser);
    const navigate = useNavigate();

    const handleNewPost = () => {
        navigate(AppRoutes.CREATE_POST);
    };

    const handleChatbot = () => {};

    if(!loggedInUser) {
        return null;
    }

    return (
        <React.Fragment>
            <div className="floating-actions-menu">
                {isOpen && (
                    <React.Fragment>
                        <FontAwesomeIcon className="pointer floating-action-button" icon="pencil-alt" onClick={handleNewPost} />

                        <FontAwesomeIcon className="pointer floating-action-button" icon="robot" onClick={handleChatbot} />
                    </React.Fragment>
                )}

                <FontAwesomeIcon
                    className="pointer floating-action-button"
                    icon={isOpen ? 'times' : 'plus-circle'}
                    onClick={() => {
                        setIsOpen(!isOpen);
                    }}
                />
            </div>
        </React.Fragment>
    );
};
