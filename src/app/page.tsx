const pathways = [
  { number: "01", title: "Find creative talent", description: "Discover photographers, filmmakers, designers, developers and other independent creatives.", status: "Marketplace foundation" },
  { number: "02", title: "Equip your practice", description: "Explore the software, AI services and infrastructure that help creative work move forward.", status: "Supplier verification required" },
  { number: "03", title: "Build something together", description: "A clearer path from a project brief to proposals, delivery and a lasting working relationship.", status: "Workflow in development" }
];
export default function HomePage() {
  return <main>
    <header className="topbar">
      <a className="wordmark" href="/" aria-label="NJIRA home">NJIRA<span>®</span></a>
      <span className="topbar-note">A creative ecosystem / Malawi → Everywhere</span>
      <a className="prototype-link" href="/prototype.html">View design prototype <span aria-hidden="true">↗</span></a>
    </header>
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow"><span className="pulse" /> THE NEXT CHAPTER OF CREATIVE WORK</p>
        <h1>Make your<br /><em>way forward.</em></h1>
        <p className="intro">A connected space for the people who make things happen. Find talent, access the tools of the trade and turn ideas into work.</p>
        <div className="hero-actions"><a className="primary-action" href="#pathways">Explore the pathways <span>↘</span></a><span className="quiet-note">Built in Malawi. Open to the world.</span></div>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" /><div className="path-line" />
        <div className="art-core"><span>n</span></div><div className="art-label label-top">CREATIVE ENERGY / 13°59′S</div><div className="art-coordinate">A PATH, NOT A SHORTCUT.</div><div className="art-index">01 — 03</div>
      </div>
      <div className="hero-footer"><span>01 / A NEW CREATIVE INFRASTRUCTURE</span><span>SCROLL TO FIND YOUR WAY</span></div>
    </section>
    <section className="pathways" id="pathways">
      <div className="section-heading"><p className="eyebrow">THE NJIRA ECOSYSTEM</p><h2>One place.<br /><em>More possibilities.</em></h2><p className="section-intro">NJIRA is being built as more than a directory. Each pathway is designed to connect to the next, so creative work can move with less friction.</p></div>
      <div className="pathway-list">{pathways.map(item => <article className="pathway-card" key={item.number}><span className="card-number">{item.number}</span><div><h3>{item.title}</h3><p>{item.description}</p></div><span className="card-status">{item.status}</span><span className="card-arrow" aria-hidden="true">↗</span></article>)}</div>
    </section>
    <footer className="site-footer"><a className="wordmark" href="/">NJIRA<span>®</span></a><p>THE PATH IS BEING BUILT.</p><span>© {new Date().getFullYear()} NJIRA</span></footer>
  </main>;
}
