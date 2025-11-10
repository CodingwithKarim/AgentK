// Tailwind class constants
export const baseBtn = [
  "inline-flex items-center gap-1.5",
  "rounded-xl border border-zinc-300/80 bg-white/70 backdrop-blur",
  "px-2.5 py-1.5 shadow-sm hover:shadow-md",
  "transition-all duration-150",
  "focus:outline-none focus:ring-2 focus:ring-blue-500/60",
  "text-xs",
].join(" ");

export const popover = [
  "absolute z-50 mt-1",
  "min-w-[180px] max-w-[320px]",
  "overflow-hidden rounded-xl border border-zinc-200 bg-white/95 backdrop-blur",
  "shadow-xl",
].join(" ");

export const row = [
  "cursor-pointer px-3 py-2 flex items-center gap-2",
  "hover:bg-zinc-50",
  "text-xs leading-relaxed",
].join(" ");

// Inline SVG icons
export function ChevronDown(props: any) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function CheckIcon(props: any) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function Dot(props: any) {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" {...props}>
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function BadgeDot(props: any) {
  return (
    <svg viewBox="0 0 24 24" width="8" height="8" {...props}>
      <circle cx="12" cy="12" r="4" className="fill-blue-600" />
    </svg>
  );
}

export function ModelGlyph(props: any) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3l7 4v10l-7 4-7-4V7l7-4z" />
      <path d="M12 7l7 4M12 7L5 11M12 17V7" />
    </svg>
  );
}
