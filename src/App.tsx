import Booking from "@/Pages/Booking";
import Home from "@/Pages/Home";
import MyLayout from "@/Pages/Layout";
import Login from "@/Pages/Login";
import NotFound from "@/Pages/NotFound";
import Register from "@/Pages/Register";
import Ticket from "@/Pages/Ticket";
import Tickets from "@/Pages/Tickets";
import Trips from "@/Pages/Trips";
import { Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<MyLayout />}>
        <Route
          index
          element={<Home />}
        />
        <Route
          path="trips"
          element={<Trips />}
        />

        <Route
          path="booking"
          element={<Navigate to={"/trips"} />}
        />
        <Route
          path="booking/:tripId"
          element={<Booking />}
        />
        <Route
          path="tickets"
          element={<Tickets />}
        />
        <Route
          path="tickets/:ticketId"
          element={<Ticket />}
        />
      </Route>

      <Route
        path="login"
        element={<Login />}
      />
      <Route
        path="register"
        element={<Register />}
      />

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}

export default App;
