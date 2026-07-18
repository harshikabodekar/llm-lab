"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { addClick } from "../lib/clickbook";

// "that clicked 💡" — drop this next to any concept section or code cell.
// figures out which chapter it's on from the URL so no chapter file needs
// to pass an id down by hand.
export default function ClickButton({ section }) {
  const pathname = usePathname();
  const chapterId = pathname?.split("/chapter/")[1];
  const [clicked, setClicked] = useState(false);

  if (!chapterId) return null;

  return (
    <button
      onClick={() => {
        if (clicked) return;
        addClick(chapterId, section);
        setClicked(true);
      }}
      className={`px-3 py-1.5 font-mono text-xs transition-colors ${
        clicked ? "border-[1.5px] border-signal bg-signal/10 text-signal" : "btn-paper"
      }`}
    >
      {clicked ? "✓ that clicked" : "that clicked 💡"}
    </button>
  );
}
