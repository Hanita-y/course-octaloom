"use client";

import { useState } from "react";
import PromptCard from "@/components/PromptCard";
import type { PromptGroup } from "@/content/profile-photo";

// Tab switcher (e.g. נשים / גברים), each tab showing its style prompts as PromptCards.
export default function PromptTabs({ groups }: { groups: PromptGroup[] }) {
  const [active, setActive] = useState(groups[0]?.id);
  const current = groups.find((g) => g.id === active) ?? groups[0];

  return (
    <div>
      <div className="prompt-tabs">
        {groups.map((g) => (
          <button
            key={g.id}
            className={`ptab${g.id === active ? " on" : ""}`}
            onClick={() => setActive(g.id)}
          >
            {g.label}
          </button>
        ))}
      </div>
      {current?.prompts.map((p, i) => (
        <PromptCard key={`${current.id}-${i}`} title={p.title} tag={p.tag} body={p.body} />
      ))}
    </div>
  );
}
