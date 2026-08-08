import { useCallback, useLayoutEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { X, Menu, LogOut, ChevronsLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "./ConfirmModal";
import WorkzenLogo from "./WorkzenLogo";
import "./Sidebar.css";

const MOBILE_BREAKPOINT = 768;
const TABLET_AUTO_COLLAPSE_BREAKPOINT = 900;

/**
 * Works out whether the sidebar should be collapsed for the given
 * window width, respecting a manual user preference if one was saved.
 * Laptop and desktop stay expanded by default — only tablet widths
 * auto-collapse to an icon rail. Mobile always wins: below the mobile
 * breakpoint it becomes an off-canvas drawer, so "collapsed" (icon
 * rail) never applies there.
 */
function computeCollapsed(width) {
  if (width <= MOBILE_BREAKPOINT) return false;

  const manual = localStorage.getItem("sidebarManual") === "true";
  if (manual) {
    return localStorage.getItem("sidebarCollapsed") === "true";
  }
  return width <= TABLET_AUTO_COLLAPSE_BREAKPOINT;
}

/**
 * Sidebar
 * ------------------------------------------------------------
 * props:
 *  - navItems: [{ to, label, icon: LucideIconComponent, end?: bool }]
 *
 * User info and logout are pulled straight from AuthContext, so
 * this component is fully self-contained and can be dropped into
 * any dashboard layout.
 *
 * Collapse behaviour:
 *  - Auto-collapses to an icon rail only at tablet widths.
 *  - Fully expanded by default on both laptop and desktop.
 *  - A toggle button lets the user manually collapse/expand at any
 *    non-mobile width; that choice is remembered across sessions.
 *  - Off-canvas drawer on mobile.
 */
export default function Sidebar({ navItems }) {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [collapsed, setCollapsed] = useState(() =>
    typeof window === "undefined" ? false : computeCollapsed(window.innerWidth)
  );

  // Keep a CSS var in sync so the main content area can shift with it.
  useLayoutEffect(() => {
    document.documentElement.style.setProperty(
      "--current-sidebar-width",
      collapsed ? "84px" : "260px"
    );
  }, [collapsed]);

  // Re-derive the collapsed state on resize, unless the user has
  // manually overridden it (their choice is respected until mobile).
  useLayoutEffect(() => {
    const handleResize = () => {
      setCollapsed(computeCollapsed(window.innerWidth));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebarManual", "true");
      localStorage.setItem("sidebarCollapsed", String(next));
      return next;
    });
  }, []);

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
          <WorkzenLogo size={22} textSize={16} />
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
      <aside
        className={`sidebar ${isOpen ? "sidebar-open" : ""} ${
          collapsed ? "collapsed" : ""
        }`}
      >
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <WorkzenLogo size={26} textSize={19} />
          </div>

          <button
            className="sidebar-toggle-btn"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expand navigation menu" : "Collapse navigation menu"}
            title={collapsed ? "Expand menu" : "Collapse menu"}
          >
            <ChevronsLeft size={16} strokeWidth={2.4} />
          </button>

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
