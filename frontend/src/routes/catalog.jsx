import Card from 'react-bootstrap/Card';
import Carousel from 'react-bootstrap/Carousel';
import { range } from 'lodash';
import { useNavigate } from 'react-router-dom';
import Header from './header';
import './style.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from './../config';

export default function Catalog() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/');
    } else {
      axios
        .get(`${BASE_URL}/products`, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          if (response.data.success === 'true') {
            setProducts(response.data.data.products);
          } else {
            sessionStorage.clear();
            navigate('/');
          }
        });
    }
  }, [navigate]);

  return (
    <>
      <Header />
      <Carousel variant="dark" className="Nav-buttons mt-4" fade>
        {range(3).map((i) => (
          <Carousel.Item className="d-flex justify-content-center" interval={3000} key={i}>
            <div
              style={{ width: '85%', marginBottom: '40px' }}
              className="d-flex justify-content-around"
            >
              {products.slice(i * 3, i * 3 + 3).map((product) => (
                <Card
                  key={product.id}
                  style={{ width: '22rem', cursor: 'pointer' }}
                  onClick={() => navigate('/product', { state: { product } })}
                >
                  <Card.Img style={{ height: '300px' }} variant="top" src={product.image_url} />
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text className="Ellipsis">{product.description}</Card.Text>
                    <div className="d-flex">
                      <span class="a-price-symbol">₹</span>
                      <span class="a-price-whole">{product.price}</span>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  );
}
