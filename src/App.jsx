import Home from "@/Pages/Home";
import Layout from "@/Pages/Layout";
import Login from "@/Pages/Login";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
      </Route>

      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
