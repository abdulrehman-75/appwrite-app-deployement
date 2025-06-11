import React from 'react';
import logoSrc from '../../assets/logo.png'; 
function Logo({ width = "100px", alt = "Blog Logo" }) {
  return (
    <img
      src={logoSrc}
      width={width}
      height="auto"
      alt={alt}
      className="block"
      style={{ display: 'block' }}
    />
  );
}

export default Logo;
