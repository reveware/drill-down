import React from 'react';
import { Dropdown, FormControl, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './NavBar.scss';
import { AppRoutes } from '../../Routes';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch, logOut, selectLoggedInUser } from '../../store';
import {Button} from '../../components';
import { Prompts, ToastService } from '../../services/Toast.service';


export const NavBar: React.FC = () => {
    const loggedInUser = useAppSelector(selectLoggedInUser);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="navbar">
            <Navbar.Brand href={AppRoutes.HOME}>Drill Down</Navbar.Brand>
            {loggedInUser && (
                <React.Fragment>
                    <Navbar.Toggle />
                    <Navbar.Collapse id="user-menu-collapse">
                        <div id="nav-links-collapse" className="nav-links">
                            {loggedInUser && (
                                <Nav className="mr-auto">
                                    <Nav.Link as={Link} to={AppRoutes.HOME}>
                                        Home
                                    </Nav.Link>
                                    <Nav.Link as={Link} to={AppRoutes.HOME}>
                                        Friends
                                    </Nav.Link>
                                    <Nav.Link as={Link} to={AppRoutes.HOME}>
                                        Assets
                                    </Nav.Link>
                                </Nav>
                            )}
                        </div>

                        <Nav>
                            <NavDropdown title={<FontAwesomeIcon icon="user" size="lg" />}>
                                <NavDropdown.Item
                                    onClick={() => {
                                        navigate(AppRoutes.USER_PROFILE.replace(':username', loggedInUser.username));
                                    }}>
                                    {`${loggedInUser.first_name} ${loggedInUser.last_name}`}
                                </NavDropdown.Item>
                                <Dropdown.Divider />
                                <NavDropdown.Item
                                    onClick={() => {
                                        dispatch(logOut());
                                    }}>
                                    <FontAwesomeIcon icon="sign-out-alt" size="lg" className="mr-3"></FontAwesomeIcon>
                                    Log Out
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>

                        <div className="search-bar">
                            <FormControl type="text" placeholder="Search" />
                            <Button
                                label='Search'
                                variant="secondary"
                                onClick={() => {ToastService.prompt(Prompts.SearchTriggered)}}/>
                        </div>
                    </Navbar.Collapse>
                </React.Fragment>
            )}
        </Navbar>
    );
};
