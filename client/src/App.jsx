import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import CreateListing from "./pages/CreateListing.jsx";
import ManageListings from "./pages/ManageListings.jsx";
import RequireAuth from "./components/RequireAuth.jsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
      <Route path="/owner/listings" element={<RequireAuth allowedRoles={["owner"]}><ManageListings /></RequireAuth>} />
      <Route path="/owner/listings/new" element={<RequireAuth allowedRoles={["owner"]}><CreateListing /></RequireAuth>} />
    </Routes>
  );
}

export default App;