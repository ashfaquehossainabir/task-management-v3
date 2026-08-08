import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  UserPlus,
  Pencil,
  Trash2,
  Power,
  X,
  ShieldCheck,
  Search,
  SearchX,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config/api";
import RegisterUser from "../../pages/RegisterUser";
import EditUserModal from "../../components/EditUserModal";
import ConfirmModal from "../../components/ConfirmModal";

function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function AdminUserManagementPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filteredUsers = users.filter((u) => {
    const query = debouncedSearchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      u.name?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query)
    );
  });

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load users ❌");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleStatus = async (targetUser) => {
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/api/users/${targetUser._id}/status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u._id === targetUser._id
            ? { ...u, isActive: res.data.user.isActive }
            : u
        )
      );

      toast.success(
        res.data.user.isActive
          ? `${targetUser.name} activated ✅`
          : `${targetUser.name} deactivated 🚫`
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update account status ❌"
      );
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/users/${deletingUser._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUsers((prev) => prev.filter((u) => u._id !== deletingUser._id));
      toast.success(`${deletingUser.name} deleted 🗑️`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete user ❌"
      );
    } finally {
      setDeletingUser(null);
    }
  };

  return (
    <>
      <section className="dashboard-section">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ShieldCheck size={19} strokeWidth={2.2} />
            Manage Users ({users.length})
          </h3>

          <button className="add-task-btn icon-btn" onClick={() => setShowCreate(true)}>
            <UserPlus size={17} strokeWidth={2.4} />
            Add User
          </button>
        </div>

        <div className="task-filter-bar">
          <div className="task-filter-container">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search users by name or email..."
                className="task-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="search-icon">
                <Search size={16} strokeWidth={2.2} />
              </span>
            </div>

            {searchQuery !== debouncedSearchQuery && (
              <span className="searching-indicator">Searching...</span>
            )}
          </div>
        </div>
      </section>

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create User</h3>
              <button
                className="close-btn"
                onClick={() => setShowCreate(false)}
                aria-label="Close"
              >
                <X size={18} strokeWidth={2.4} />
              </button>
            </div>

            <RegisterUser
              closeModal={() => setShowCreate(false)}
              onCreated={fetchUsers}
            />
          </div>
        </div>
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          closeModal={() => setEditingUser(null)}
          onSaved={fetchUsers}
        />
      )}

      {deletingUser && (
        <ConfirmModal
          title="Delete User?"
          message={`Are you sure you want to permanently delete "${deletingUser.name}"? This cannot be undone.`}
          confirmText="Yes, Delete"
          cancelText="Cancel"
          onCancel={() => setDeletingUser(null)}
          onConfirm={handleDelete}
        />
      )}

      <section className="dashboard-section" style={{ marginTop: "16px" }}>
        {loading ? (
          <p className="empty-text">Loading users...</p>
        ) : users.length === 0 ? (
          <div className="no-task-box">
            <p className="empty-text">No users found</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="no-task-box">
            <p className="empty-text">
              <SearchX size={16} strokeWidth={2.2} style={{ verticalAlign: "-3px", marginRight: "6px" }} />
              No users match your search
            </p>
          </div>
        ) : (
          <div className="user-table">
            <div className="user-table-header">
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
              <span>Department</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {filteredUsers.map((u) => {
              const isSelf = u.name === currentUser.name;
              const isActive = u.isActive !== false;

              return (
                <div className="user-table-row" key={u._id}>
                  <span className="user-cell-name">{u.name}</span>
                  <span className="user-cell-email">{u.email}</span>
                  <span>
                    <span className={`role-badge ${u.role}`}>{u.role}</span>
                  </span>
                  <span className="user-cell-department">{u.department || "—"}</span>
                  <span>
                    <span className={isActive ? "status-active" : "status-inactive"}>
                      ● {isActive ? "Active" : "Inactive"}
                    </span>
                  </span>
                  <span className="user-actions">
                    <button
                      className="edit-btn icon-btn"
                      onClick={() => setEditingUser(u)}
                      title="Edit user"
                    >
                      <Pencil size={13} strokeWidth={2.4} />
                    </button>

                    <button
                      className={isActive ? "deactivate-btn icon-btn" : "activate-btn icon-btn"}
                      onClick={() => handleToggleStatus(u)}
                      title={isActive ? "Deactivate account" : "Activate account"}
                    >
                      <Power size={13} strokeWidth={2.4} />
                    </button>

                    <button
                      className="logout-btn icon-btn"
                      onClick={() => setDeletingUser(u)}
                      disabled={isSelf}
                      title={isSelf ? "You can't delete your own account" : "Delete user"}
                    >
                      <Trash2 size={13} strokeWidth={2.4} />
                    </button>
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
