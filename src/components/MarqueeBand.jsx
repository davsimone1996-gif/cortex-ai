export default function MarqueeBand({ items = [], className = '' }) {
  const doubled = [...items, ...items]

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className="inline-flex animate-marquee">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-4 px-6 text-sm lg:text-base font-semibold tracking-widest uppercase"
          >
            {item}
            <span className="text-accent text-lg">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
