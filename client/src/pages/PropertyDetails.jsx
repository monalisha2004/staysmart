import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient.js";

function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(`/properties/${id}`);
        if (!ignore) setProperty(res.data);
      } catch {
        if (!ignore) setError("Property not found");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [id]);

  if (loading) return <p style={{ textAlign: "center", marginTop: "4rem" }}>Loading property...</p>;
  if (error) return <p style={{ textAlign: "center", marginTop: "4rem", color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 700, margin: "3rem auto", fontFamily: "sans-serif" }}>
      <h1>{property.title}</h1>
      <p style={{ color: "#666" }}>{property.city}, {property.locality}</p>
      <p><strong>₹{property.rent}/month</strong> — Deposit: ₹{property.deposit}</p>
      <p>Type: {property.type} | Furnishing: {property.furnishing} | Occupancy: {property.occupancy}</p>
      {property.facilities.length > 0 && (
        <p>Facilities: {property.facilities.join(", ")}</p>
      )}
      {property.images.length > 0 && (
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1rem" }}>
          {property.images.map((img, i) => (
            <img key={i} src={`http://localhost:5000${img}`} alt="" style={{ width: 150, height: 150, objectFit: "cover", borderRadius: 8 }} />
          ))}
        </div>
      )}
    </div>
  );
}

export default PropertyDetails;