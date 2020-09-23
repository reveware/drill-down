import React from 'react';
import { Button, Form, FormControl, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './NavBar.scss';
import { useSelector, useDispatch } from 'react-redux';

import { AppRoutes } from '../../routes';
import { AppState } from '../../store';
import {showToast} from "../../store/actions";
import {ToastTypes} from "../../store/types";

export const NavBar: React.FC = () => {
    const user = useSelector((store: AppState) => store.user);
    const dispatch = useDispatch();
    return (
        <div className="nav-bar">
            <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
                <Navbar.Brand href={AppRoutes.HOME}>Drill Down</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse>
                    <Nav className="mr-auto">
                        <Nav.Link href={AppRoutes.HOME}>Home</Nav.Link>
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
                                        dispatch(
                                            showToast({
                                                type: ToastTypes.SUCCESS,
                                                content: { title: 'GAHD DAMN', message: 'This is cool' },
                                            })
                                        );
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
