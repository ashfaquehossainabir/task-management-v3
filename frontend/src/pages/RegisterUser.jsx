import { useState } from "react";
import toast from "react-hot-toast";
import { UserPlus } from "lucide-react";
import { API_BASE_URL } from "../config/api";
import { DEPARTMENTS } from "../data/departments";

export default function RegisterUser({ closeModal, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    department: DEPARTMENTS[0],
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("User created successfully ✅");
        onCreated?.(data.user);
        closeModal();
      } else {
        toast.error(data.message || "Failed to create user ❌");
      }
    } catch {
      toast.error("Failed to create user ❌");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input name="name" placeholder="Enter user name" onChange={handleChange} required />
      <input name="email" placeholder="Enter user email" onChange={handleChange} required />
      <input
        name="password"
        type="password"
        placeholder="Enter user password"
        onChange={handleChange}
        required
      />

      <select name="role" onChange={handleChange}>
        <option value="employee">Employee</option>
        <option value="leader">Leader</option>
        <option value="manager">Manager</option>
      </select>

      <select name="department" value={form.department} onChange={handleChange}>
        {DEPARTMENTS.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>

      <button type="submit" className="icon-btn" disabled={saving}>
        <UserPlus size={16} strokeWidth={2.4} />
        {saving ? "Creating..." : "Create User"}
      </button>
    </form>
  );
}
