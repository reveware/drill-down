import React from 'react';
import { Dropdown, FormControl, Nav, Navbar, NavDropdown, Offcanvas } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './NavBar.scss';
import { AppRoutes } from '../../Routes';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch, logOut, selectLoggedInUser } from '../../store';
import { Button } from '../../components';
import { Prompts, ToastService } from '../../services/Toast.service';
import { useGetPendingFriendsQuery } from 'src/hooks';


export const NavBar: React.FC = () => {
    const loggedInUser = useAppSelector(selectLoggedInUser);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { data: friendRequests } = useGetPendingFriendsQuery({ username: loggedInUser?.username! })


    return (
        <Navbar variant="dark" bg="dark" className="card navbar" expand="lg">
            <Navbar.Brand href={AppRoutes.HOME}>Drill Down</Navbar.Brand>
            {loggedInUser && (
                <React.Fragment>
                    <Navbar.Toggle aria-controls="user-offcanvas-menu" />
                    <Navbar.Offcanvas id="user-offcanvas-menu" placement="end">
                        <Offcanvas.Header closeButton />
                        <Offcanvas.Body>

                            <div id="nav-links-collapse" className="nav-links-group">
                                {loggedInUser && (
                                    <Nav className="nav-links mr-auto">
                                        <Nav.Link as={Link} to={AppRoutes.HOME}>
                                            Home
                                        </Nav.Link>
                                        <Nav.Link as={Link} to={AppRoutes.USER_FRIENDS.replace(':username', loggedInUser.username)}>
                                            Friends
                                            {friendRequests && friendRequests.length > 0 && (
                                                <div className="notification" onClick={()=>{alert('friend request')}}>
                                                    {friendRequests.length}
                                                </div>
                                            )}
                                        </Nav.Link>

                                        <Nav.Link as={Link} to={AppRoutes.HOME}>
                                            Assets
                                        </Nav.Link>
                                    </Nav>
                                )}
                            </div>

                            <Nav>
                                <NavDropdown title={<span>@{loggedInUser.username} <FontAwesomeIcon icon="user" /></span>}>
                                    <NavDropdown.Item
                                        onClick={() => {
                                            navigate(AppRoutes.USER_PROFILE.replace(':username', loggedInUser.username));
                                        }}>
                                        Profile
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
                                    onClick={() => { ToastService.prompt(Prompts.SearchTriggered) }} />
                            </div>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </React.Fragment>
            )}
        </Navbar>
    );
};
