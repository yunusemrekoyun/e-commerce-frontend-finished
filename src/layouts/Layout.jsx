/********************************************************
 * /Applications/Works/e-commerce/frontend/src/layouts/Layout.jsx
 ********************************************************/

import PropTypes from "prop-types";

export const Layout = ({ children }) => {
  // Hiçbir şey sarmalamıyoruz
  return <>{children}</>;
};
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
export default Layout;
