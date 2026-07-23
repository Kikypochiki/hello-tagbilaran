export function GalleryThreshold() {
  return (
    <div className="gallery-threshold" aria-hidden="true">
      <svg viewBox="0 0 1000 720" preserveAspectRatio="xMidYMid slice">
        <path
          className="gallery-threshold__coast"
          d="M-80 550C70 455 188 591 325 477S584 361 710 457s232 18 360-146"
        />
        <path
          className="gallery-threshold__coast gallery-threshold__coast--echo"
          d="M-60 592C91 501 203 628 347 522s249-103 373-21 225 14 342-119"
        />
        <path
          className="gallery-threshold__route"
          d="M104 635C208 527 238 557 309 456s174-48 213-143 145-20 212-112"
        />
        <circle cx="104" cy="635" r="7" />
        <circle cx="309" cy="456" r="7" />
        <circle cx="522" cy="313" r="7" />
        <circle cx="734" cy="201" r="7" />
      </svg>
      <span className="gallery-threshold__registration gallery-threshold__registration--one" />
      <span className="gallery-threshold__registration gallery-threshold__registration--two" />
    </div>
  );
}
