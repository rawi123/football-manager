import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import "./style.css"
import Sound from './Sound'
export default function NavBar({ user, setLoggedUser }) {
    let history = useHistory()
    const handelClick = () => {
        setLoggedUser({})
        sessionStorage.clear()
        history.push("/")
    }
    const sendTo = (link) => {
        history.push(link)
    }
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" >
            <Container>
                <Navbar.Brand><Link to="/" style={{ textDecoration: "none", color: "white" }}><div className="logo"></div></Link></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <NavDropdown title="Team" id="collasible-nav-dropdown">
                            <NavDropdown.Item onClick={() => sendTo("/preview")}>Preview</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => sendTo("/train")}>Train</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link onClick={() => sendTo("/shop")}>Shop</Nav.Link>
                        <Nav.Link onClick={() => sendTo("/game")}>Game</Nav.Link>
                    </Nav>
                    <Nav>
                        <Navbar.Text><Sound /></Navbar.Text>
                        {Object.keys(user).length !== 0 ? <Navbar.Text ><div className="flex-nav row">
                            {user.energy}<i className="fas fa-battery-full"></i>
                        </div></Navbar.Text> : null}
                        {Object.keys(user).length !== 0 ? <Navbar.Text >{user.money}<i className="fas fa-money-bill money-icon"></i></Navbar.Text> : null}
                        {Object.keys(user).length === 0 ? <Nav.Link onClick={() => sendTo("/login")}>Log In</Nav.Link> : <Nav.Link onClick={handelClick}>Log Out</Nav.Link>}
                        {Object.keys(user).length !== 0 && user.isAdmin ? <Nav.Link onClick={() => sendTo("/admin-make-player")}>make player</Nav.Link> : null}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
