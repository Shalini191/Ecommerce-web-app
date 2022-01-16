import React, { useEffect } from 'react';
import Header from './header';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Invoice() {
  const { state } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/');
    } else if (!state) {
      navigate('/product');
    }
  }, [navigate, state]);

  const product = state?.product;
  const user = JSON.parse(sessionStorage.getItem('user'));
  return (
    <>
      <Header />
      <Card className="m-auto mt-5 w-75 flex-row">
        <Card.Body>
          <h3>Invoice</h3>
          <Table borderless size="sm">
            <tbody>
              <tr>
                <td>Order ID</td>
                <td>{`#${product?.orderId}`}</td>
              </tr>
              <tr>
                <td>Order Time</td>
                <td>{product?.orderTime}</td>
              </tr>
              <tr>
                <td>Customer Name</td>
                <td>{user?.name}</td>
              </tr>
              <tr>
                <td>Customer Email</td>
                <td>{user?.email}</td>
              </tr>
            </tbody>
          </Table>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{product?.name}</td>
                <td>{product?.quantity}</td>
                <td>{`₹${product?.price}`}</td>
                <td>{`₹${parseFloat(product?.price) * parseInt(product?.quantity)}.00`}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
}
