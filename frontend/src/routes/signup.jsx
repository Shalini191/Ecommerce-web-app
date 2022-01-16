import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from './../config';
import './style.css';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  function validateForm() {
    return name.length > 0 && email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    axios
      .post(`${BASE_URL}/signup`, {
        data: {
          name,
          email,
          password,
        },
      })
      .then((response) => {
        if (response.data.success === 'true') {
          setError('');
          setSuccess(response.data.data.message);
          setTimeout(() => navigate('/', { state: { user: { email, password } } }), 3000);
        } else {
          setError(response.data.data.error);
          setSuccess('');
        }
      });
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Alert variant="primary" onClose={() => setSuccess('')} show={!!success} dismissible>
          {success}
        </Alert>
        <Alert variant="danger" onClose={() => setError('')} show={!!error} dismissible>
          {error}
        </Alert>

        <Form.Group size="lg" controlId="email">
          <Form.Control
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
        </Form.Group>
        <Form.Group size="lg" controlId="email">
          <Form.Control
            className="mt-2"
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
            Sign-up
          </Button>
          <div>
            Already have an account? <Link to="/">Sign-in</Link>
          </div>
        </div>
      </Form>
    </div>
  );
}
