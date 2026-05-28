export default function TrustStrip() {
  const items = [
    { label: 'ANTI TARNISH', desc: 'LIFETIME SHINE GUARANTEE' },
    { label: 'FREE SHIPPING', desc: 'EXPRESS NATIONWIDE DELIVERY' },
    { label: 'HANDCRAFTED', desc: 'PURE WORKMANSHIP DETAIL' },
    { label: 'EASY RETURNS', desc: '7-DAY HASSLE FREE WINDOW' },
  ]

  return (
    <div className="grid grid-cols-2 border-y border-neutral-200 lg:grid-cols-4 bg-white text-black flex-shrink-0">
      {items.map((item) => (
        <div
          key={item.label}
          className="border-r border-neutral-200 py-8 px-4 text-center last:border-r-0 flex flex-col justify-center items-center gap-1.5"
        >
          <span className="text-[11px] tracking-[0.3em] font-bold text-black">
            {item.label}
          </span>
          <span className="text-[8px] tracking-[0.15em] font-mono text-neutral-400 uppercase font-semibold">
            {item.desc}
          </span>
        </div>
      ))}
    </div>
  )
}
