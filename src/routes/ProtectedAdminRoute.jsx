/********************************************************
 * /Applications/Works/e-commerce/frontend/src/ProtectedAdminRoute.jsx
 ********************************************************/
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { isAdmin } from "../config/isAdmin";

const ProtectedAdminRoute = ({ children }) => {
  // localStorage.getItem("isAdmin") => "true" / "false"
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

ProtectedAdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedAdminRoute;
