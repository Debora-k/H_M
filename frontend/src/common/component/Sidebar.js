import React, { useState } from "react";
import { Offcanvas, Navbar, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleSelectMenu = (url) => {
    setShow(false);
    navigate(url);
  };

  const NavbarContent = () => {
    return (
      <div>
        <Link to="/">
          <img width={100} src="/image/hm-logo.png" alt="hm-logo.png" />
        </Link>
        <div className="sidebar-item">Admin Account</div>
        <ul className="sidebar-area">
          <li
            className="sidebar-item"
            onClick={() => handleSelectMenu("/admin/item?page=1")}
          >
            product
          </li>
          <li
            className="sidebar-item"
            onClick={() => handleSelectMenu("/admin/order?page=1")}
          >
            order
          </li>
        </ul>
      </div>
    );
  };
  return (
    <>
      <div className="sidebar-toggle">{NavbarContent()}</div>

      <Navbar bg="light" expand={false} className="mobile-sidebar-toggle">
        <Container fluid>
          <img width={80} src="/image/hm-logo.png" alt="hm-logo.png" />
          <Navbar.Brand href="#"></Navbar.Brand>
          <Navbar.Toggle
            aria-controls={`offcanvasNavbar-expand`}
            onClick={() => setShow(true)}
          />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand`}
            aria-labelledby={`offcanvasNavbarLabel-expand`}
            placement="start"
            className="sidebar"
            show={show}
          >
            <Offcanvas.Header closeButton></Offcanvas.Header>
            <Offcanvas.Body>{NavbarContent()}</Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default Sidebar;
