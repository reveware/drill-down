import React from 'react';
import { Button, Form, FormControl, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import './NavBar.scss';

export const NavBar: React.FC = () => {
    return (
        <div className="mt-3 mb-3">
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand href="#home">Drill Down</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse>
                    <Nav className="mr-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#me">Me</Nav.Link>
                        <NavDropdown title="Starred" id="starred-tags-dropdown">
                            <NavDropdown.Item href="#tags">Tags</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#people">People</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <Form className="tag-search-bar">
                            <div className="mr-2">
                                <FormControl type="text" placeholder="Search" />
                            </div>
                            <div>
                                <Button variant="light">Search</Button>
                            </div>
                        </Form>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
};
