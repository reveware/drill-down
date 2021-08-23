import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Dropdown, Form, FormControl, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './NavBar.scss';
import { AppRoutes } from '../../Routes';
import { Link } from 'react-router-dom';
import { AppState } from '../../store/store.type';
import { logOut } from '../../store';
import { ToastService } from '../../services/ToastService';
import { history } from '../../App';

export const NavBar: React.FC = () => {
    const { user } = useSelector((store: AppState) => store.auth);
    const dispatch = useDispatch();
    return (
        <div className="nav-bar">
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand href={AppRoutes.HOME}>Drill Down</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse>
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to={AppRoutes.HOME}>
                            Home
                        </Nav.Link>
                        <NavDropdown title="Starred" id="starred-tags-dropdown">
                            <NavDropdown.Item as={Link} to="#tags">
                                Tags
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item as={Link} to={'#people'}>
                                People
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <NavDropdown title={<FontAwesomeIcon icon="user" size="lg" />} id="basic-nav-dropdown">
                            {user ? (
                                <React.Fragment>
                                    <NavDropdown.Item onClick={() => {
                                    
                                            history.push(AppRoutes.USER_PROFILE.replace(':username', user.username));
                                        }}>

                                        {`${user.firstName} ${user.lastName}`}
                                    </NavDropdown.Item>
                                    <Dropdown.Divider />
                                    <NavDropdown.Item
                                        onClick={() => {
                                            dispatch(logOut(user));
                                        }}>
                                        <FontAwesomeIcon icon="sign-out-alt" size="lg" className="mr-3"></FontAwesomeIcon>
                                        Log Out
                                    </NavDropdown.Item>
                                </React.Fragment>
                            ) : (
                                <NavDropdown.Item as={Link} to={AppRoutes.LOGIN}>
                                    Login
                                </NavDropdown.Item>
                            )}
                        </NavDropdown>

                        <Form className="tag-search-bar">
                            <div className="mr-2">
                                <FormControl type="text" placeholder="Search" />
                            </div>
                            <div>
                                <Button
                                    variant="light"
                                    onClick={() => {
                                        ToastService.success({ title: 'GAHD DAMN', message: 'This is cool' });
                                    }}>
                                    Search
                                </Button>
                            </div>
                        </Form>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
};
