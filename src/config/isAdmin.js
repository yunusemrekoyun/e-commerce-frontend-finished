/********************************************************
 * /Applications/Works/e-commerce/frontend/src/config/isAdmin.js
 ********************************************************/
export const isAdmin = () => {
  return localStorage.getItem("isAdmin") === "true";
};
