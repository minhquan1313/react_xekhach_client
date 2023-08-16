import { Outlet } from "react-router";
import { Link } from "react-router-dom";

function Layout() {
  return (
    <div className="bg-red-500">
      Layout page
      <Link to="/login">Hihi</Link>
      <Outlet />
    </div>
  );
}

export default Layout;
