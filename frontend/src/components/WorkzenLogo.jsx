/**
 * WorkzenLogo
 * ------------------------------------------------------------
 * Brand mark for Workzen: a ring (balance / completion) cut
 * through by a checkmark (work, done). Renders in white/gradient
 * so it reads on both the indigo sidebar and the login gradient.
 *
 * props:
 *  - size: icon size in px (default 26)
 *  - showText: whether to render the "Workzen" wordmark (default true)
 *  - textSize: font-size in px for the wordmark (default 19)
 *  - className: extra class(es) for the wrapping span
 */
export default function WorkzenLogo({
  size = 26,
  showText = true,
  textSize = 19,
  className = "",
}) {
  const gradientId = "workzen-ring-gradient";

  return (
    <span className={`workzen-logo ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="workzen-logo-icon"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="2"
            y1="2"
            x2="30"
            y2="30"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#a5b4fc" />
            <stop offset="1" stopColor="#e9d5ff" />
          </linearGradient>
        </defs>
        <circle
          cx="16"
          cy="16"
          r="13.25"
          stroke={`url(#${gradientId})`}
          strokeWidth="2.5"
          fill="rgba(255, 255, 255, 0.08)"
        />
        <path
          d="M10.5 16.75L14 20.25L21.5 11.75"
          stroke="#ffffff"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {showText && (
        <span className="workzen-logo-text" style={{ fontSize: textSize }}>
          Workzen
        </span>
      )}
    </span>
  );
}
