const PATHS = {
  bedroom: (
    <>
      <path d="M3 19v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6" />
      <path d="M3 19v2M21 19v2" />
      <path d="M3 13V7a2 2 0 0 1 2-2h3v6" />
      <path d="M11 13V9a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v4" />
    </>
  ),
  study: (
    <>
      <rect x="3" y="4" width="14" height="9" rx="1" />
      <path d="M3 17h18M9 20l1-3M15 20l-1-3" />
      <path d="M20 4v9" />
    </>
  ),
  living: (
    <>
      <path d="M4 12V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
      <path d="M3 12h18v5a1 1 0 0 1-1 1h-1v2h-2v-2H7v2H5v-2H4a1 1 0 0 1-1-1v-5Z" />
      <path d="M6 12v-2M18 12v-2" />
    </>
  ),
  kids: (
    <>
      <path d="M12 3l2.2 4.6 5 .7-3.6 3.6.9 5.1-4.5-2.4-4.5 2.4.9-5.1L4.8 8.3l5-.7L12 3Z" />
    </>
  ),
  kitchen: (
    <>
      <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
      <path d="M4 21h16" />
      <path d="M8 14V9a4 4 0 0 1 8 0v5" />
      <path d="M12 5V3" />
    </>
  ),
  bathroom: (
    <>
      <path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3Z" />
      <path d="M4 12V7a2 2 0 0 1 3-1.7" />
      <path d="M9 19v2M15 19v2" />
    </>
  ),
  toilet: (
    <>
      <path d="M6 4h9v6H6z" />
      <path d="M7 10c-2 0-3 1.6-3 4 0 4 3 6 5.5 6h5c2.5 0 4.5-2.6 4.5-6 0-2.4-1-4-3-4" />
    </>
  ),

  minimal: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="1" />
    </>
  ),
  modern: (
    <>
      <path d="M6 12h12v3a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-3Z" />
      <path d="M7 12V7a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v5" />
      <path d="M6 17v3M18 17v3" />
    </>
  ),
  scandinavian: (
    <>
      <path d="M12 3l4 6h-2.5l3.5 5h-3l3 6H7l3-6H7l3.5-5H8l4-6Z" />
    </>
  ),
  industrial: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </>
  ),
  bohemian: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2 2M17.1 17.1l2 2M4.9 19.1l2-2M17.1 6.9l2-2" />
    </>
  ),
  luxury: (
    <>
      <path d="M4 9l4-5h8l4 5-10 12L4 9Z" />
      <path d="M4 9h16M8 4l2 5-2 0M16 4l-2 5 2 0M12 4v5" />
    </>
  ),
  cozy: (
    <>
      <path d="M5 11h11v4a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4v-4Z" />
      <path d="M16 12h1.5a2.5 2.5 0 0 1 0 5H16" />
      <path d="M8 8c0-1 .8-1.3.8-2.3S8 4 8 4M11.5 8c0-1 .8-1.3.8-2.3S11.5 4 11.5 4" />
    </>
  ),
  vintage: (
    <>
      <circle cx="12" cy="13" r="7" />
      <path d="M12 9v4l3 2M9 3h6M12 3v2" />
    </>
  ),
};

export default function Icon({ name, className = "h-6 w-6" }) {
  const path = PATHS[name];
  if (!path) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}
