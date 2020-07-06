import React from 'react';
import { Button, Form, FormControl, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';

import './NavBar.scss';
import { useSelector } from 'react-redux';

import { AppRoutes } from '../../routes';
import { AppState } from '../../store';

export const NavBar: React.FC = () => {
    const user = useSelector((state: AppState) => state.user);

    return (
        <div className="nav-bar">
            <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
                <Navbar.Brand href="#home">Drill Down</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse>
                    <Nav className="mr-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <NavDropdown title="Starred" id="starred-tags-dropdown">
                            <NavDropdown.Item href="#tags">Tags</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#people">People</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <NavDropdown title={<FontAwesomeIcon icon="user" size="lg" />} id="basic-nav-dropdown">
                            {user && user.user ? (
                                <NavDropdown.Item>Logged as {JSON.stringify(user.user.firstName)}</NavDropdown.Item>
                            ) : (
                                <NavDropdown.Item href={AppRoutes.LOGIN}>Login</NavDropdown.Item>
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
                                        toast.success('Holly Shit, this is cool');
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
