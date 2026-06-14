"use client";

import { useState } from "react";

type HomeFaqItem = {
  question: string;
  answer: string;
};

type HomeFaqListProps = {
  items: HomeFaqItem[];
};

export function HomeFaqList({ items }: HomeFaqListProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  function toggle(question: string) {
    setOpenItems((current) => {
      const next = new Set(current);
      if (next.has(question)) {
        next.delete(question);
      } else {
        next.add(question);
      }
      return next;
    });
  }

  return (
    <div className="home-faq-list">
      {items.map((item) => {
        const isOpen = openItems.has(item.question);
        const panelId = `faq-${item.question.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;

        return (
          <article className="home-faq-item" data-open={isOpen} key={item.question}>
            <button type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => toggle(item.question)}>
              <span>{item.question}</span>
            </button>
            <div className="faq-answer" id={panelId}>
              <div>
                <p>{item.answer}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
