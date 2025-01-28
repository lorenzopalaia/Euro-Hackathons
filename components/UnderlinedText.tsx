export default function UnderlinedText({
  children,
  color1 = "#ff80b5",
  color2 = "#9089fc",
}: {
  children: React.ReactNode;
  color1?: string;
  color2?: string;
}) {
  return (
    <span
      className={`relative mx-1 inline-block bg-linear-to-r from-[#ff80b5] to-[#9089fc] bg-clip-text stroke-current font-extrabold text-transparent`}
    >
      {children}
      <svg
        className="absolute -bottom-0.5 max-h-2.5 w-full"
        viewBox="0 0 55 5"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: color1, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: color2, stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <path
          d="M0.652466 4.00002C15.8925 2.66668 48.0351 0.400018 54.6853 2.00002"
          stroke="url(#gradient)"
          strokeWidth="2"
        ></path>
      </svg>
    </span>
  );
}
