import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Catalog from './routes/catalog';
import Signup from './routes/signup';
import Login from './routes/login';
import Invoice from './routes/invoice';
import Product from './routes/product';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="sign-up" element={<Signup />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="invoice" element={<Invoice />} />
        <Route path="product" element={<Product />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);
