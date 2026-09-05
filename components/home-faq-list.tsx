type HomeFaqItem = { question: string; answer: string };
export function HomeFaqList({ items }: { items: HomeFaqItem[] }) {
  return <div className="faq-list">{items.map(item => <details key={item.question} name="live-orbit-faq"><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>;
}
