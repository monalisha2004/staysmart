import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient.js";

function PropertyResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [city, setCity] = useState(searchParams.get("city") || "");
  const [minRent, setMinRent] = useState(searchParams.get("minRent") || "");
  const [maxRent, setMaxRent] = useState(searchParams.get("maxRent") || "");
  const [furnishing, setFurnishing] = useState(searchParams.get("furnishing") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "");

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(`/properties?${searchParams.toString()}`);
        if (!ignore) {
          setProperties(res.data.properties);
          setPagination(res.data.pagination);
          setError("");
        }
      } catch {
        if (!ignore) setError("Failed to load properties");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [searchParams]);

  const applyFilters = (e) => {
    e.preventDefault();
    const params = {};
    if (city.trim()) params.city = city.trim();
    if (minRent) params.minRent = minRent;
    if (maxRent) params.maxRent = maxRent;
    if (furnishing) params.furnishing = furnishing;
    if (sort) params.sort = sort;
    params.page = 1;
    setSearchParams(params);
  };

  const goToPage = (newPage) => {
    const params = Object.fromEntries(searchParams);
    params.page = newPage;
    setSearchParams(params);
  };

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Property Results</h1>
      <form onSubmit={applyFilters} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" style={{ padding: "0.5rem" }} />
        <input value={minRent} onChange={(e) => setMinRent(e.target.value)} placeholder="Min rent" type="number" style={{ padding: "0.5rem", width: 100 }} />
        <input value={maxRent} onChange={(e) => setMaxRent(e.target.value)} placeholder="Max rent" type="number" style={{ padding: "0.5rem", width: 100 }} />
        <select value={furnishing} onChange={(e) => setFurnishing(e.target.value)} style={{ padding: "0.5rem" }}>
          <option value="">Any furnishing</option>
          <option value="unfurnished">Unfurnished</option>
          <option value="semi-furnished">Semi-furnished</option>
          <option value="furnished">Furnished</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ padding: "0.5rem" }}>
          <option value="">Newest first</option>
          <option value="rent_asc">Rent: Low to High</option>
          <option value="rent_desc">Rent: High to Low</option>
        </select>
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>Apply</button>
      </form>

      {loading && <p>Loading properties...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && properties.length === 0 && <p>No properties match your search.</p>}

      {properties.map((p) => (
        <Link key={p._id} to={`/properties/${p._id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: "1rem", marginBottom: "1rem" }}>
            <h3>{p.title}</h3>
            <p>{p.city}, {p.locality} — ₹{p.rent}/month — {p.furnishing}</p>
          </div>
        </Link>
      ))}

      {pagination.totalPages > 1 && (
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => goToPage(num)}
              style={{ fontWeight: num === pagination.page ? "bold" : "normal", padding: "0.5rem 0.75rem" }}
            >
              {num}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default PropertyResults;