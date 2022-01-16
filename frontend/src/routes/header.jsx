import React, { useEffect } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../images/logo.png';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  const user = JSON.parse(sessionStorage.getItem('user'));
  return (
    <Navbar bg="dark" variant="dark">
      <div className="w-100 p-2 d-flex justify-content-between">
        <Navbar.Brand href="/catalog">
          <img
            alt=""
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
            style={{ marginRight: '10px' }}
          />
          Shamazon
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <div className="d-flex">
            <Navbar.Text style={{ marginRight: '10px' }}>{`Hello, ${user?.name}!`}</Navbar.Text>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => {
                sessionStorage.clear();
                navigate('/');
              }}
            >
              Log out
            </Button>
          </div>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}
