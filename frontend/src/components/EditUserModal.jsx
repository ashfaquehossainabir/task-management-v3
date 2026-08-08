import { useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { X, Save } from "lucide-react";
import { API_BASE_URL } from "../config/api";

export default function EditUserModal({ user, closeModal, onSaved }) {
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    password: "",
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { password, ...rest } = form;
      const payload = password.trim() ? { ...rest, password } : rest;

      const res = await axios.put(
        `${API_BASE_URL}/api/users/${user._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("User updated successfully ✨");
      onSaved?.(res.data.user);
      closeModal();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update user ❌"
      );
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit User</h3>
          <button className="close-btn" onClick={closeModal} aria-label="Close">
            <X size={16} strokeWidth={2.4} />
          </button>
        </div>

        <form className="task-form" onSubmit={submit}>
          <label>Name</label>
          <input
            value={form.name}
            required
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <label>Email</label>
          <input
            type="email"
            value={form.email}
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label>Role</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="employee">Employee</option>
            <option value="leader">Leader</option>
            <option value="manager">Manager</option>
          </select>

          <label>Reset Password</label>
          <input
            type="password"
            value={form.password}
            placeholder="Leave blank to keep current password"
            minLength={6}
            autoComplete="new-password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button type="submit" className="icon-btn" disabled={saving}>
            <Save size={16} strokeWidth={2.4} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
