import React from 'react';

const Banners1 = () => {
  return (
    <div
      className="full-width_border"
      style={{ borderWidth: '2px', borderColor: 'rgb(238, 238, 238)', borderStyle: 'solid' }}
    >
      <div style={{ position: 'relative' }}>
        <div style={{ backgroundColor: 'rgb(238, 238, 238)' }}>
          <img
            loading="lazy"
            src="/assets/images/shop/shop_banner_character1.png"
            width={1759}
            height={420}
            alt="Pattern"
            style={{ objectFit: 'cover' }}
          />
          <div
            className="shop-banner__content"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 1,
            }}
          >
            <h2
              style={{
                fontSize: '4.5rem',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#333',
              }}
            >
              Jackets &amp; Coats
            </h2>
            <ul
  style={{
    display: 'flex',marginLeft: '-1000px',
   
  }}
>
  <li style={{ marginRight: '15px' }}>
    <a
      href="#"
      style={{
        color: '#333',
        textDecoration: 'none',
        fontWeight: 'bold',
        transition: 'color 0.3s ease',
        color: '#ff0000',
      }}
    >
      All
    </a>
  </li>
  <li style={{ marginRight: '15px' }}>
    <a
      href="#"
      style={{
        color: '#333',
        textDecoration: 'none',
        transition: 'color 0.3s ease',
      }}
    >
      StayHome
    </a>
  </li>
  <li style={{ marginRight: '15px' }}>
    <a
      href="#"
      style={{
        color: '#333',
        textDecoration: 'none',
        transition: 'color 0.3s ease',
      }}
    >
      Jackets
    </a>
  </li>
  <li style={{ marginRight: '15px' }}>
    <a
      href="#"
      style={{
        color: '#333',
        textDecoration: 'none',
        transition: 'color 0.3s ease',
      }}
    >
      Hoodies
    </a>
  </li>
  <li style={{ marginRight: '15px' }}>
    <a
      href="#"
      style={{
        color: '#333',
        textDecoration: 'none',
        transition: 'color 0.3s ease',
      }}
    >
      Men
    </a>
  </li>
  <li style={{ marginRight: '15px' }}>
    <a
      href="#"
      style={{
        color: '#333',
        textDecoration: 'none',
        transition: 'color 0.3s ease',
      }}
    >
      Women
    </a>
  </li>
  <li style={{ marginRight: '15px' }}>
    <a
      href="#"
      style={{
        color: '#333',
        textDecoration: 'none',
        transition: 'color 0.3s ease',
      }}
    >
      Accessories
    </a>
  </li>
  <li style={{ marginRight: '15px' }}>
    <a
      href="#"
      style={{
        color: '#333',
        textDecoration: 'none',
        transition: 'color 0.3s ease',
      }}
    >
      Shoes
    </a>
  </li>
</ul>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Banners1;
