import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
 import Register from "./pages/Register.jsx";
 import Profile from "./pages/Profile.jsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;