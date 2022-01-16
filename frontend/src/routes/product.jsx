import React, { useEffect, useState } from 'react';
import Header from './header';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { BASE_URL } from './../config';
import axios from 'axios';

export default function Product() {
  const { state } = useLocation();
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  useEffect(
    () => {
      if (!token) {
        navigate('/');
      } else if (!state) {
        navigate('/catalog');
      }
    },
    [navigate, state, token],
    [],
  );

  function validateForm() {
    return quantity !== 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    axios
      .post(
        `${BASE_URL}/order`,
        {
          data: {
            product_id: product.id,
            quantity,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((response) => {
        if (response.data.success === 'true') {
          navigate('/invoice', {
            state: {
              product: {
                ...product,
                quantity,
                orderId: response.data.data.order_id,
                orderTime: Date(),
              },
            },
          });
        } else {
          sessionStorage.clear();
          navigate('/');
        }
      });
  }
  const product = state?.product;
  return (
    <>
      <Header />
      <Card className="m-auto mt-5 flex-row " style={{ width: '80%' }}>
        <Card.Img
          style={{ height: '500px', width: '600px' }}
          variant="top"
          src={product?.image_url}
        />
        <Card.Body>
          <h1>{product?.name}</h1>
          <Card.Text className="d-block">{product?.description}</Card.Text>
          <div className="d-flex">
            <span class="a-price-symbol">₹</span>
            <span class="a-price-whole">{product?.price}</span>
          </div>
          <Form onSubmit={handleSubmit}>
            <div className="d-flex align-items-center mb-4">
              <>Quantity</>
              <Form.Control
                style={{ width: '100px', marginLeft: '10px' }}
                autoFocus
                type="number"
                min={0}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <Button block size="lg" type="submit" disabled={!validateForm()}>
              Buy now
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
