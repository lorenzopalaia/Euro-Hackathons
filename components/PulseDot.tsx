export default function PulseDot({ className }: { className?: string }) {
  return (
    <span className={`relative flex h-2 w-2 ${className}`}>
      <span className="bg-background absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
      <span className="bg-background relative inline-flex h-2 w-2 rounded-full"></span>
    </span>
  );
}
