import React from "react";
import { Link } from "react-router-dom";

function StyledButton({ to, onClick, children, className }) {
  const buttonClass = `styled-button ${className || ""}`;

  if (to) {
    return <Link to={to} className={buttonClass}>{children}</Link>;
  } else if (onClick) {
    return <button onClick={onClick} className={buttonClass}>{children}</button>;
  }
  return null;
}

export default StyledButton;