import Home from "@/Pages/Home";
import MyLayout from "@/Pages/Layout";
import Login from "@/Pages/Login";
import Trips from "@/Pages/Trips";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route element={<MyLayout />}>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/trips"
          element={<Trips />}
        />
      </Route>

      <Route
        path="/login"
        element={<Login />}
      />
    </Routes>
  );
}

export default App;
