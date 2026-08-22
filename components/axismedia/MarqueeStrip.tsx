const WORDS = ["Branding", "Websites", "Applications", "Marketing"];

export function MarqueeStrip() {
  const run = [...WORDS, ...WORDS];
  return (
    <div className="axm-frame overflow-hidden py-8" aria-hidden="true">
      <div className="axm-marquee-track items-center gap-10">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center gap-10 pr-10">
            {run.map((w, i) => (
              <span key={`${half}-${i}`} className="flex items-center gap-10">
                <span className="axm-display whitespace-nowrap text-5xl uppercase lg:text-7xl">
                  <span className={i % 2 === 0 ? "" : "axm-outline-text"}>{w}</span>
                </span>
                <span className="axm-heartbeat text-2xl text-[var(--axm-green)]">✚</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
