export function ChapterTrace({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="chapter-trace"
      data-mirrored={mirrored || undefined}
      viewBox="0 0 1200 760"
      preserveAspectRatio="none"
    >
      <path
        className="chapter-trace__line"
        d="M74 612 C 210 530, 250 266, 432 318 S 676 580, 806 388 S 1004 126, 1136 190"
        pathLength="1"
      />
      <circle className="chapter-trace__point chapter-trace__point--start" cx="74" cy="612" r="7" />
      <circle className="chapter-trace__point chapter-trace__point--middle" cx="617" cy="460" r="5" />
      <circle className="chapter-trace__point chapter-trace__point--end" cx="1136" cy="190" r="8" />
    </svg>
  );
}
