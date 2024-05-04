import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import logo from '../logo1.svg';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../index';
import { useContext } from 'react';
import Store from '../store';

const NavBar = observer(() => {
  const store = useContext(StoreContext)

  return (
    <Navbar expand="lg" className="bg-body-tertiary mb-3">
      <Container>
        <Navbar.Brand href="#home">
          <img
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="React Bootstrap logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
            <NavDropdown title={<FontAwesomeIcon icon={faPlus} />}>
              <NavDropdown.Item onClick={() => {
                store.setAddEntityModal('Flight')
              }}>Flight</NavDropdown.Item>
              <NavDropdown.Item onClick={() => {
                store.setAddEntityModal('Glider')
              }}>Glider</NavDropdown.Item>
              <NavDropdown.Item onClick={() => {
                store.setAddEntityModal('Site')
              }}>Site</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
})

export default NavBar;
