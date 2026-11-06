import type { CSSProperties, ReactNode } from "react";

function Win({ url, children, className = "" }: { url: string; children: ReactNode; className?: string }) {
  return (
    <div className={`win ${className}`}>
      <div className="win-bar">
        <i /><i /><i />
        <span className="win-url">{url}</span>
      </div>
      <div className="win-body">{children}</div>
    </div>
  );
}

/* ---------- Process visuals (driven by scroll through --p) ---------- */

function SurveyVisual() {
  return (
    <Win url="getmyportfolio.com/hello">
      <div className="sv">
        <p className="sv-title">Tell me about you<em>.</em></p>
        <div className="sv-field"><small>NAME</small><b className="type t1">Alex Rivera</b><u className="sv-tick k1" /></div>
        <div className="sv-field"><small>WHAT DO YOU DO?</small><b className="type t2">Photographer</b><u className="sv-tick k2" /></div>
        <div className="sv-field"><small>HOW CAN I REACH YOU?</small><b className="type t3">alex@riverastudio.com</b><u className="sv-tick k3" /></div>
        <div className="sv-btn"><span>SEND</span><span className="sv-btn-done">SENT ✓</span></div>
      </div>
      <span className="cursor" />
    </Win>
  );
}

function CallVisual() {
  return (
    <div className="win call">
      <div className="win-bar">
        <i /><i /><i />
        <span className="win-url"><b className="rec" /> QUICK CALL · 15 MIN</span>
      </div>
      <div className="call-grid">
        <div className="tile tile-a">
          <span className="ring ring-a" />
          <span className="person"><i /><i /></span>
          <small>ALEX</small>
          <span className="wave"><i /><i /><i /><i /><i /></span>
        </div>
        <div className="tile tile-b">
          <span className="ring ring-b" />
          <span className="person"><i /><i /></span>
          <small>ALI · GETMYPORTFOLIO</small>
          <span className="wave wave-b"><i /><i /><i /><i /><i /></span>
        </div>
      </div>
      <div className="captions">
        <p className="cap cap1"><b>ALEX</b> I just need somewhere to show my work.</p>
        <p className="cap cap2"><b>ALI</b> Perfect — leave the rest to me.</p>
      </div>
      <div className="call-bar">
        <span>🎤</span><span>📹</span><span className="call-end">END</span>
      </div>
    </div>
  );
}

function BuildVisual() {
  return (
    <div className="build">
      <div className="win code">
        <div className="win-bar"><i /><i /><i /><span className="win-url">portfolio.tsx</span></div>
        <div className="code-lines">
          {[60, 38, 74, 52, 30, 66, 44, 58, 36, 70].map((w, i) => (
            <span key={i} style={{ "--w": `${w}%`, "--n": i } as CSSProperties} />
          ))}
        </div>
      </div>
      <Win url="alexrivera.studio" className="pv-site">
        <div className="site">
          <div className="site-nav"><b /><span /><span /><span /></div>
          <div className="site-hero"><h4>Alex<br />Rivera</h4><p /></div>
          <div className="site-grid"><i /><i /><i /><i /></div>
        </div>
      </Win>
    </div>
  );
}

function ReviewVisual() {
  return (
    <Win url="preview.getmyportfolio.com/alex">
      <div className="site rv">
        <div className="site-nav"><b /><span /><span /><span /></div>
        <div className="site-hero"><h4>Alex<br />Rivera</h4><p /></div>
        <div className="site-grid"><i /><i /><i /><i /></div>
        <span className="pin pin1">1</span>
        <span className="pin pin2">2</span>
        <div className="note note1"><b>YOU</b> Make the photos bigger?</div>
        <div className="note note2"><b>ALI</b> Done — take a look ✓</div>
        <div className="approve"><span>APPROVE</span><span className="approve-done">APPROVED ✓</span></div>
      </div>
    </Win>
  );
}

function LaunchVisual() {
  return (
    <Win url="alexrivera.studio">
      <div className="lv">
        <div className="lv-load" />
        <div className="lv-live"><b /> LIVE</div>
        <p className="lv-title">Alex Rivera<br /><em>Photographer.</em></p>
        <div className="lv-chips">
          <span className="chip c1">DOMAIN ✓</span>
          <span className="chip c2">HOSTING ✓</span>
          <span className="chip c3">BACKUPS ✓</span>
          <span className="chip c4">UPDATES ✓</span>
        </div>
        <div className="lv-bars">
          {[40, 62, 48, 76, 58, 88, 70, 94, 82, 100].map((h, i) => (
            <i key={i} style={{ "--h": `${h}%`, "--n": i } as CSSProperties} />
          ))}
        </div>
        <small className="lv-foot">100% UPTIME · ALWAYS LOOKED AFTER</small>
      </div>
    </Win>
  );
}

export const processVisuals = [SurveyVisual, CallVisual, BuildVisual, ReviewVisual, LaunchVisual];

/* ---------- Service visuals (autoplay when the step becomes active) ---------- */

function DomainVisual() {
  return (
    <Win url="domains">
      <div className="sx">
        <div className="sx-search"><span className="sx-type">alexrivera.studio</span><i className="sx-caret" /></div>
        <div className="sx-badge">✓ AVAILABLE — REGISTERED FOR YOU</div>
        <div className="sx-rows">
          <span><b>A</b>@<em>76.76.21.21</em></span>
          <span><b>CNAME</b>www<em>alexrivera.studio</em></span>
          <span><b>SSL</b>https<em>active ✓</em></span>
        </div>
      </div>
    </Win>
  );
}

function DesignVisual() {
  return (
    <Win url="design-system">
      <div className="sx sx-design">
        <div className="sx-swatches"><i /><i /><i /><i /></div>
        <div className="sx-type-spec"><b>Aa</b><span>Manrope · Display</span></div>
        <div className="sx-wire"><i /><i /><i /></div>
      </div>
    </Win>
  );
}

function DevVisual() {
  return (
    <div className="build sx-build">
      <div className="win code">
        <div className="win-bar"><i /><i /><i /><span className="win-url">code</span></div>
        <div className="code-lines auto">
          {[60, 38, 74, 52, 30, 66, 44, 58].map((w, i) => (
            <span key={i} style={{ "--w": `${w}%`, "--n": i } as CSSProperties} />
          ))}
        </div>
      </div>
      <Win url="localhost" className="pv-site auto">
        <div className="site">
          <div className="site-nav"><b /><span /><span /><span /></div>
          <div className="site-hero"><h4>Alex<br />Rivera</h4><p /></div>
          <div className="site-grid"><i /><i /><i /><i /></div>
        </div>
      </Win>
    </div>
  );
}

function HostingVisual() {
  return (
    <Win url="servers">
      <div className="sx sx-host">
        {["EDGE · NORTH AMERICA", "EDGE · EUROPE", "BACKUP · STORAGE"].map((l, i) => (
          <div className="rack" key={l} style={{ "--n": i } as CSSProperties}>
            <span className="led" /><b>{l}</b><em>ONLINE</em>
          </div>
        ))}
        <div className="sx-up">99.99% <small>UPTIME</small></div>
      </div>
    </Win>
  );
}

function DeployVisual() {
  return (
    <Win url="deploy">
      <div className="sx sx-deploy">
        {["BUILD", "TEST", "DEPLOY"].map((l, i) => (
          <div className="step" key={l} style={{ "--n": i } as CSSProperties}>
            <span>{l}</span><i><u /></i><em>✓</em>
          </div>
        ))}
        <div className="sx-live"><b /> LIVE — alexrivera.studio</div>
      </div>
    </Win>
  );
}

function MaintainVisual() {
  return (
    <Win url="care-dashboard">
      <div className="sx sx-maint">
        <svg viewBox="0 0 200 70" preserveAspectRatio="none" aria-hidden="true">
          <path className="line" d="M0 52 C20 48 30 20 55 30 S95 58 120 32 S165 12 200 18" />
        </svg>
        <div className="sx-checks">
          <span style={{ "--n": 0 } as CSSProperties}>BACKUPS ✓</span>
          <span style={{ "--n": 1 } as CSSProperties}>SECURITY ✓</span>
          <span style={{ "--n": 2 } as CSSProperties}>SPEED ✓</span>
        </div>
      </div>
    </Win>
  );
}

function UpdatesVisual() {
  return (
    <Win url="messages">
      <div className="sx sx-chat">
        <p className="bubble b-you">Can you swap my bio and add the new project?</p>
        <p className="bubble b-me">On it. ✓ Live in 12 minutes.</p>
        <p className="bubble b-done">UPDATED · $9 FLAT</p>
      </div>
    </Win>
  );
}

export const serviceVisuals = [
  DomainVisual,
  DesignVisual,
  DevVisual,
  HostingVisual,
  DeployVisual,
  MaintainVisual,
  UpdatesVisual,
];
