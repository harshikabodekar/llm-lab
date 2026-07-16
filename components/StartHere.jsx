export default function StartHere({ children }) {
  return (
    <p className="mb-5 w-fit border-[1.5px] border-ink bg-marker px-3 py-1.5 font-mono text-xs">
      start here → {children}
    </p>
  );
}
