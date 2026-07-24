import { InteractiveArchiveFigure } from "@/components/story/interactive-archive-figure";
import type { HistoryChapter } from "@/types/content";

export function ChapterArtifact({ chapter }: { chapter: HistoryChapter }) {
  return (
    <div className="chapter-artifact" data-mode={chapter.visualMode}>
      <div className="chapter-artifact__media">
        {chapter.media.map((media) => (
          <InteractiveArchiveFigure media={media} key={media.src} />
        ))}
      </div>
    </div>
  );
}
