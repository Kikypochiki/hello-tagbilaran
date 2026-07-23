import Image from "next/image";
import type { HistoryChapter } from "@/types/content";

function ArtifactDrawing({ mode }: { mode: HistoryChapter["visualMode"] }) {
  if (mode === "coastal-chart") {
    return (
      <svg viewBox="0 0 640 260" role="img" aria-label="Interpretive shoreline contour drawing">
        <path d="M-20 190C75 118 128 218 224 153S366 75 455 134s125 4 210-58" />
        <path d="M-20 218C80 146 139 244 234 181s139-66 226-18 123 1 207-54" />
        <path d="M24 57h154M24 74h102" className="artifact-dash" />
        <circle cx="455" cy="134" r="7" />
      </svg>
    );
  }

  if (mode === "memory-folio") {
    return (
      <svg viewBox="0 0 640 260" role="img" aria-label="Two interpretive lenses joined on one folio">
        <circle cx="218" cy="130" r="89" />
        <circle cx="422" cy="130" r="89" />
        <path d="M307 130h26M320 117v26" />
        <path d="M157 131h122M361 131h122" className="artifact-dash" />
      </svg>
    );
  }

  if (mode === "town-ledger") {
    return (
      <svg viewBox="0 0 640 260" role="img" aria-label="Interpretive street survey grid">
        <path d="M44 42h552v176H44zM44 101h552M177 42v176M342 42v176M487 42v176" />
        <path d="m44 183 133-82 165 47 145-106 109 59" className="artifact-route" />
        <circle cx="342" cy="148" r="8" />
      </svg>
    );
  }

  if (mode === "mended-archive") {
    return (
      <svg viewBox="0 0 640 260" role="img" aria-label="Timeline joined with visible repair marks">
        <path d="M52 132h536" />
        <path d="m145 114 13 36 15-36 14 36 14-36M378 114l13 36 15-36 14 36 14-36" />
        <circle cx="80" cy="132" r="8" /><circle cx="320" cy="132" r="8" /><circle cx="560" cy="132" r="8" />
        <text x="57" y="177">1899</text><text x="291" y="177">1945</text><text x="527" y="177">1966</text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 640 260" role="img" aria-label="Fifteen barangays connected as a living city">
      <path d="M56 190 122 72l72 54 72-75 74 126 72-102 72 78 92-101" className="artifact-route" />
      {[
        [56,190],[92,126],[122,72],[160,101],[194,126],[229,88],[266,51],[302,113],
        [340,177],[376,126],[412,75],[448,116],[484,153],[530,103],[576,52],
      ].map(([cx, cy], index) => <circle key={index} cx={cx} cy={cy} r="7" />)}
    </svg>
  );
}

export function ChapterArtifact({ chapter }: { chapter: HistoryChapter }) {
  return (
    <div className="chapter-artifact" data-mode={chapter.visualMode}>
      <div className="chapter-artifact__drawing">
        <ArtifactDrawing mode={chapter.visualMode} />
      </div>
      <div className="chapter-artifact__media">
        {chapter.media.map((media) => (
          <figure className="archive-figure" key={media.src}>
            <div className="archive-figure__image">
              <Image
                src={media.src}
                alt={media.alt}
                width={media.width}
                height={media.height}
                sizes="(max-width: 780px) 88vw, (max-width: 1060px) 68vw, 42vw"
                loading="lazy"
              />
            </div>
            <figcaption>
              Photo: {media.credit ?? "Credit not supplied"}
              {media.date ? ` · ${media.date}` : null}
            </figcaption>
          </figure>
        ))}
      </div>
      {chapter.annotations?.map((annotation) => (
        <details className="exhibit-label" key={annotation.label}>
          <summary>
            <span>Open object label</span>
            <i aria-hidden="true">+</i>
          </summary>
          <div>
            <span>{annotation.label}</span>
            <p>{annotation.text}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
