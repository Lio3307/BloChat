import { Link } from "react-router-dom";

export const NavBar = () => {
  return (
    <div className="sticky-top bg-white border-bottom shadow-sm z-3">
      <div className="container py-2">
        <ul className="nav justify-content-center gap-4 flex-wrap">
          <li className="nav-item">
            <Link to="/home" className="nav-link text-dark fw-semibold">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/profile" className="nav-link text-dark fw-semibold">
              Profile
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/your-post" className="nav-link text-dark fw-semibold">
              Your Post
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
