import { useState } from 'react';
import { useAuth } from "@/providers/authProvider";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import UpdateScheduleLink from "../../components/update-schedule-link";
import Notifications from "../../components/notifications";
import logo from '../assets/logo.png'; // Import your logo image

export default function Root() {
  const location = useLocation().pathname.replace("/", "");
  const [user, _setUser, logout] = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(true);

  const toggleNavbar = () => {
    setIsNavbarCollapsed(!isNavbarCollapsed);
  };

  const handleMenuItemClick = () => {
    setIsNavbarCollapsed(true);
  };

  return (
    <main className="flex flex-col max-w-[1400px] w-[98%] mx-auto h-full">
      <nav className="navbar navbar-expand-lg navbar-box w-full mx-auto rounded-lg my-2 flex gap-4 bg-hms-blue-dark items-center px-4 py-2 text-white justify-center h-15" >
        <a className="navbar-brand" href="#">
          <img src={logo} alt="Logo" className="d-inline-block align-top" style={{ height: "40px" }} /> {/* Adjust height as needed */}
        </a>
        <button 
          className="navbar-toggler" 
          type="button" 
          aria-controls="navbarSupportedContent" 
          aria-expanded={!isNavbarCollapsed} 
          aria-label="Toggle navigation"
          onClick={toggleNavbar}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu visible on larger screens */}
        <div className="navbar-collapse d-right d-none d-lg-block show" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item user">
              <span className="nav-link username rounded-sm">
                {user?.name}
              </span>
            </li>
            <li className={`nav-item ${location === "" ? "active" : ""}`}>
              <Link className="nav-link" to="/" onClick={handleMenuItemClick}>
                Home
              </Link>
            </li>
            {isAdmin && (
              <>
                <li className={`nav-item ${location.split("/")[0] === "medical-centers" ? "active" : ""}`}>
                  <Link className="nav-link" to="/medical-centers?region=0" onClick={handleMenuItemClick}>
                    Medical Centers
                  </Link>
                </li>
                <li className={`nav-item ${location.split("/")[0] === "providers" ? "active" : ""}`}>
                  <Link className="nav-link" to="/providers?region=0" onClick={handleMenuItemClick}>
                    Providers
                  </Link>
                </li>
                <li className={`nav-item ${location === "request-schedules" ? "active" : ""}`}>
                  <Link className="nav-link" to="request-schedules" onClick={handleMenuItemClick}>
                    Request Schedules
                  </Link>
                </li>
                <li className={`nav-item ${location === "request-update" ? "active" : ""}`}>
                  <Link className="nav-link" to="request/find" onClick={handleMenuItemClick}>
                    Update Schedule
                  </Link>
                </li>
              </>
            )}
            {!isAdmin && (
              <li className="nav-item" onClick={handleMenuItemClick}>
                <UpdateScheduleLink location={location}  />
              </li>
            )}
            <li className="nav-item">
              <Button
                onClick={() => {
                  if (logout) logout();
                }}
                className="btn logout-btn inline-flex items-center justify-center whitespace-nowrap text-sm   transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-semibold text-hms-blue-dark rounded-none p-2 hover:bg-hms-blue-dark hover:text-white hover:border-gray-200 border border-transparent"
              >
                Logout
              </Button>
            </li>
            {isAdmin && (
              <li className="nav-item notification">
                <Notifications />
              </li>
            )}
          </ul>
        </div>

        {/* Menu visible on smaller screens */}
        <div className={`navbar-collapse ${!isNavbarCollapsed ? 'show' : ''} d-lg-none`} id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item user">
              <span className="nav-link text-primary">
                {user?.name}
              </span>
            </li>
            <li className={`nav-item ${location === "" ? "active" : ""}`}>
              <Link className="nav-link" to="/" onClick={handleMenuItemClick}>
                Home
              </Link>
            </li>
            {isAdmin && (
              <>
                <li className={`nav-item ${location.split("/")[0] === "medical-centers" ? "active" : ""}`}>
                  <Link className="nav-link" to="/medical-centers?region=0" onClick={handleMenuItemClick}>
                    Medical Centers
                  </Link>
                </li>
                <li className={`nav-item ${location.split("/")[0] === "providers" ? "active" : ""}`}>
                  <Link className="nav-link" to="/providers?region=0" onClick={handleMenuItemClick}>
                    Providers
                  </Link>
                </li>
                <li className={`nav-item ${location === "request-schedules" ? "active" : ""}`}>
                  <Link className="nav-link" to="request-schedules" onClick={handleMenuItemClick}>
                    Request Schedules
                  </Link>
                </li>
                <li className={`nav-item ${location === "request-update" ? "active" : ""}`}>
                  <Link className="nav-link" to="request/find" onClick={handleMenuItemClick}>
                    Update Schedule
                  </Link>
                </li>
              </>
            )}
            {!isAdmin && (
              <li className="nav-item" onClick={handleMenuItemClick}>
                <UpdateScheduleLink location={location}  />
              </li>
            )}
            <li className="nav-item auth-btn">
              <Button
                onClick={() => {
                  if (logout) logout();
                }}
                className="btn btn-outline-secondary"
              >
                Logout
              </Button>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <Notifications />
              </li>
            )}
          </ul>
        </div>
      </nav>

      <Outlet />
    </main>
  );
}