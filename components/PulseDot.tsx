export default function PulseDot({ className }: { className?: string }) {
  return (
    <span className={`relative flex h-2 w-2 ${className}`}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-background opacity-75"></span>
      <span className="relative inline-flex h-2 w-2 rounded-full bg-background"></span>
    </span>
  );
}
