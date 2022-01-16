import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from './../config';
import './style.css';

export default function Login() {
  const { state } = useLocation();
  const [email, setEmail] = useState(state?.user.email || '');
  const [password, setPassword] = useState(state?.user.password || '');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError('');
    axios
      .post(`${BASE_URL}/login`, {
        data: {
          email,
          password,
        },
      })
      .then((response) => {
        if (response.data.success === 'true') {
          setError('');
          sessionStorage.setItem('token', response.data.data.token);
          sessionStorage.setItem('user', JSON.stringify(response.data.data.user));
          navigate('/catalog');
        } else {
          setError(response.data.data.error);
        }
      });
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Alert variant="danger" onClose={() => setError('')} show={!!error} dismissible>
          {error}
        </Alert>

        <Form.Group size="lg" controlId="email">
          <Form.Control
            autoFocus
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Control
            className="mt-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </Form.Group>

        <div className="d-grid gap-2 mt-2">
          <Button block size="lg" type="submit" disabled={!validateForm()}>
            Sign-in
          </Button>
          <div>
            Not a user? <Link to="/sign-up">Sign-up</Link>
          </div>
        </div>
      </Form>
    </div>
  );
}
