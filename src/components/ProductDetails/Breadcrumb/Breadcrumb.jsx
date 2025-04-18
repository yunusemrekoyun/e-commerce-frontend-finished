import React from 'react';
import PropTypes from 'prop-types';
import './Breadcrumb.css';

const Breadcrumb = ({ category, brand, productName }) => {
  return (
    <div className="single-topbar">
      <nav className="breadcrumb">
        <ul>
          <li><a href="#">Home</a></li>
          {category && <li><a href="#">{category}</a></li>} {/* Kategori Adı */}
          {brand && <li><a href="#">{brand}</a></li>} {/* Marka Adı */}
          <li>{productName}</li> {/* Ürün Adı */}
        </ul>
      </nav>
      <h1>{productName}</h1> {/* Ürün Adını Başlık Olarak Kullanma */}
    </div>
  );
};

Breadcrumb.propTypes = {
  category: PropTypes.string,
  brand: PropTypes.string,
  productName: PropTypes.string.isRequired,
};

export default Breadcrumb;