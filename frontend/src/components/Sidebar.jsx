import { useState } from "react";
import { NavLink } from "react-router-dom";
import { X, Menu, LogOut, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "./ConfirmModal";
import "./Sidebar.css";

/**
 * Sidebar
 * ------------------------------------------------------------
 * props:
 *  - navItems: [{ to, label, icon: LucideIconComponent, end?: bool }]
 *
 * User info and logout are pulled straight from AuthContext, so
 * this component is fully self-contained and can be dropped into
 * any dashboard layout.
 */
export default function Sidebar({ navItems }) {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const initials = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  return (
    <>
      {/* ===============================
          Mobile Top Bar
      ================================ */}
      <div className="mobile-topbar">
        <button
          className="hamburger-btn"
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu size={22} strokeWidth={2.4} />
        </button>

        <div className="mobile-brand">
          <span className="brand-icon">
            <CheckCircle2 size={22} strokeWidth={2.2} />
          </span>
          <span>TaskFlow</span>
        </div>

        <div className="mobile-avatar">{initials}</div>
      </div>

      {/* ===============================
          Overlay (mobile drawer backdrop)
      ================================ */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ===============================
          Sidebar
      ================================ */}
      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <span className="brand-icon">
              <CheckCircle2 size={24} strokeWidth={2.2} />
            </span>
            <span className="brand-text">TaskFlow</span>
          </div>

          <button
            className="sidebar-close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
          >
            <X size={16} strokeWidth={2.4} />
          </button>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">{user?.name}</p>
            <p className="sidebar-user-role">{user?.role}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? "active" : ""}`
              }
            >
              <span className="nav-icon">
                <Icon size={19} strokeWidth={2.1} />
              </span>
              <span className="nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button
            className="sidebar-logout-btn"
            onClick={() => {
              setIsOpen(false);
              setShowLogoutConfirm(true);
            }}
          >
            <span className="nav-icon">
              <LogOut size={19} strokeWidth={2.2} />
            </span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>

      {showLogoutConfirm && (
        <ConfirmModal
          title="Confirm Logout"
          message="Are you sure you want to logout?"
          confirmText="Yes, Logout"
          cancelText="Cancel"
          onCancel={() => setShowLogoutConfirm(false)}
          onConfirm={() => {
            setShowLogoutConfirm(false);
            logout();
          }}
        />
      )}
    </>
  );
}
