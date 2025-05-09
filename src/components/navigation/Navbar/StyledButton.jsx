import React from "react";
import { Link } from "react-router-dom";

function StyledButton({ to, onClick, children, className }) {
  const buttonClass = `inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium transition-colors duration-300 ${className}`;

  if (to) {
    return <Link to={to} className={buttonClass}>{children}</Link>;
  } else if (onClick) {
    return <button onClick={onClick} className={buttonClass}>{children}</button>;
  } else {
    return null;
  }
}

export default StyledButton;