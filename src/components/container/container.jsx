import React from 'react';

function Container({ children }) {
  return (
    <div className="w-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      {children}
    </div>
  );
}

export default Container;
