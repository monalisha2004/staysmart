import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient.js";

function Profile() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [preferences, setPreferences] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosClient.get("/users/me");
        setName(res.data.name);
        setPhone(res.data.phone || "");
        setPreferences(res.data.preferences || "");
        setEmail(res.data.email);
        setRole(res.data.role);
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      await axiosClient.put("/users/me", { name: name.trim(), phone: phone.trim(), preferences: preferences.trim() });
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "4rem" }}>Loading profile...</p>;

  return (
    <div style={{ maxWidth: 400, margin: "4rem auto", fontFamily: "sans-serif" }}>
      <h1>My Profile</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <p style={{ color: "#666" }}>{email} — {role}</p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Name</label><br />
          <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: "0.5rem" }} />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Phone</label><br />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: "100%", padding: "0.5rem" }} />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Preferences</label><br />
          <textarea value={preferences} onChange={(e) => setPreferences(e.target.value)} style={{ width: "100%", padding: "0.5rem" }} rows={3} />
        </div>
        <button type="submit" disabled={saving} style={{ width: "100%", padding: "0.75rem" }}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default Profile;