import React from 'react';
import Header from '../Header/Header';
import './Layout.css'


const Layout = ({ children }) => {
  return (
    <div>
      <Header/>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
