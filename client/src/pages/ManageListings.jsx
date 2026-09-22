import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient.js";

function ManageListings() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/properties/mine");
      setProperties(res.data);
      setError("");
    } catch {
      setError("Failed to load your listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get("/properties/mine");
        if (!ignore) {
          setProperties(res.data);
        }
      } catch {
        if (!ignore) setError("Failed to load your listings");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axiosClient.put(`/properties/${id}/status`, { status: newStatus });
      fetchProperties();
    } catch {
      setError("Failed to update status");
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "4rem" }}>Loading your listings...</p>;

  return (
    <div style={{ maxWidth: 800, margin: "3rem auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Manage Listings</h1>
        <Link to="/owner/listings/new">+ New Listing</Link>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {properties.length === 0 && <p>You haven't created any listings yet.</p>}
      {properties.map((p) => (
        <div key={p._id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: "1rem", marginBottom: "1rem" }}>
          <h3>{p.title}</h3>
          <p>{p.city}, {p.locality} — ₹{p.rent}/month</p>
          <p>Status: <strong>{p.status}</strong></p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {p.status !== "published" && <button onClick={() => handleStatusChange(p._id, "published")}>Publish</button>}
            {p.status === "published" && <button onClick={() => handleStatusChange(p._id, "occupied")}>Mark Occupied</button>}
            {p.status !== "draft" && <button onClick={() => handleStatusChange(p._id, "draft")}>Move to Draft</button>}
            {p.status !== "archived" && <button onClick={() => handleStatusChange(p._id, "archived")}>Archive</button>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ManageListings;