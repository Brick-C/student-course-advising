import { NavLink, Outlet } from "react-router-dom";
import "../../styles/admin.css";

const Admin = () => {
  return (
    <div className="home-page">
      <div className="container">
        <div className="left">
          <div className="left-menu">
            <ul>
              <li>
                <NavLink
                  to="dashboard"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Home
                </NavLink>
              </li>

              <li>
                <button className="logout-button">Logout</button>
              </li>
            </ul>
          </div>
        </div>

        <div className="right">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Admin;
