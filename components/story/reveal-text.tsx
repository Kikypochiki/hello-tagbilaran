export function RevealText({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const words = children.trim().split(/\s+/);

  return (
    <p className={className}>
      <span className="story-reveal-text">
        {words.map((word, index) => (
          <span className="story-reveal-word" key={`${word}-${index}`}>
            {word}
            {index < words.length - 1 ? "\u00a0" : ""}
          </span>
        ))}
      </span>
    </p>
  );
}
