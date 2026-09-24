import { useState } from "react";
import { useNavigate } from "react-router-dom";

function HomeSearch() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("city", query.trim());
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div style={{ maxWidth: 600, margin: "5rem auto", fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>StaySmart</h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>Find your next PG, rental, or roommate</p>
      <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.5rem" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by city (e.g. Bangalore)"
          style={{ flex: 1, padding: "0.75rem" }}
        />
        <button type="submit" style={{ padding: "0.75rem 1.5rem" }}>Search</button>
      </form>
    </div>
  );
}

export default HomeSearch;