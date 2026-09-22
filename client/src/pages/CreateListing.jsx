import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient.js";

function CreateListing() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [rent, setRent] = useState("");
  const [deposit, setDeposit] = useState("");
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [furnishing, setFurnishing] = useState("unfurnished");
  const [occupancy, setOccupancy] = useState("");
  const [facilitiesText, setFacilitiesText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !type.trim() || !rent || !deposit || !city.trim() || !locality.trim() || !occupancy.trim()) {
      setError("All fields except facilities are required");
      return;
    }

    setLoading(true);
    try {
      const facilities = facilitiesText.split(",").map((f) => f.trim()).filter(Boolean);
      await axiosClient.post("/properties", {
        title: title.trim(),
        type: type.trim(),
        rent: Number(rent),
        deposit: Number(deposit),
        city: city.trim(),
        locality: locality.trim(),
        furnishing,
        occupancy: occupancy.trim(),
        facilities,
      });
      navigate("/owner/listings");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "3rem auto", fontFamily: "sans-serif" }}>
      <h1>Create Listing</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Title</label><br />
          <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%", padding: "0.5rem" }} />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Type (e.g. 2BHK, PG, Single Room)</label><br />
          <input value={type} onChange={(e) => setType(e.target.value)} style={{ width: "100%", padding: "0.5rem" }} />
        </div>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <div style={{ flex: 1 }}>
            <label>Rent (₹/month)</label><br />
            <input type="number" value={rent} onChange={(e) => setRent(e.target.value)} style={{ width: "100%", padding: "0.5rem" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Deposit (₹)</label><br />
            <input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)} style={{ width: "100%", padding: "0.5rem" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <div style={{ flex: 1 }}>
            <label>City</label><br />
            <input value={city} onChange={(e) => setCity(e.target.value)} style={{ width: "100%", padding: "0.5rem" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Locality</label><br />
            <input value={locality} onChange={(e) => setLocality(e.target.value)} style={{ width: "100%", padding: "0.5rem" }} />
          </div>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Furnishing</label><br />
          <select value={furnishing} onChange={(e) => setFurnishing(e.target.value)} style={{ width: "100%", padding: "0.5rem" }}>
            <option value="unfurnished">Unfurnished</option>
            <option value="semi-furnished">Semi-furnished</option>
            <option value="furnished">Furnished</option>
          </select>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Occupancy (e.g. single, double, triple)</label><br />
          <input value={occupancy} onChange={(e) => setOccupancy(e.target.value)} style={{ width: "100%", padding: "0.5rem" }} />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Facilities (comma-separated)</label><br />
          <input value={facilitiesText} onChange={(e) => setFacilitiesText(e.target.value)} placeholder="WiFi, Parking, Power backup" style={{ width: "100%", padding: "0.5rem" }} />
        </div>
        <button type="submit" disabled={loading} style={{ width: "100%", padding: "0.75rem" }}>
          {loading ? "Creating..." : "Create Listing"}
        </button>
      </form>
    </div>
  );
}

export default CreateListing;