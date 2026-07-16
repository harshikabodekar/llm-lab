import Link from "next/link";
import { getChapter, CHAPTERS } from "../../../lib/chapters";
import ChapterShell from "../../../components/ChapterShell";

export function generateStaticParams() {
  return CHAPTERS.map((c) => ({ id: c.id }));
}

export default function ChapterPage({ params }) {
  const chapter = getChapter(params.id);
  if (!chapter) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-20">
        <p className="font-mono">chapter not found.</p>
        <Link className="text-inkblue underline" href="/">
          back to the map
        </Link>
      </main>
    );
  }
  return <ChapterShell chapter={chapter} />;
}
