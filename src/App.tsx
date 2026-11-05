import { useEffect, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { processVisuals, serviceVisuals } from "./Visuals";

type FormData = {
  name: string;
  field: string;
  contact: string;
  details: string;
  website: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const initialForm: FormData = {
  name: "",
  field: "",
  contact: "",
  details: "",
  website: "",
};

const priceDisplay = "$99";
const fallbackEmail = "alihamoudiu18@gmail.com";

const handledServices = [
  { name: "DOMAIN", status: "managed." },
  { name: "DESIGN", status: "made yours." },
  { name: "DEVELOPMENT", status: "built with care." },
  { name: "HOSTING", status: "taken care of." },
  { name: "DEPLOYMENT", status: "handled." },
  { name: "MAINTENANCE", status: "looked after." },
  { name: "UPDATES", status: "when you need them." },
];

function useScrollExperience() {
  useEffect(() => {
    const root = document.documentElement;
    const intro = document.getElementById("intro");
    let animationFrame = 0;

    const updateScrollState = () => {
      if (animationFrame) return;
      animationFrame = requestAnimationFrame(() => {
        const scrollableHeight = root.scrollHeight - window.innerHeight;
        const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        root.style.setProperty("--scroll-progress", String(progress));

        if (intro) {
          const introDistance = Math.max(intro.offsetHeight * 0.72, 1);
          const introProgress = Math.min(Math.max(window.scrollY / introDistance, 0), 1);
          root.style.setProperty("--intro-shift", `${introProgress * -22}px`);
          root.style.setProperty("--intro-scale", `${1 - introProgress * 0.025}`);
        }
        animationFrame = 0;
      });
    };

    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    updateScrollState();
    return () => {
      window.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      if (animationFrame) cancelAnimationFrame(animationFrame);
      root.style.removeProperty("--scroll-progress");
      root.style.removeProperty("--intro-shift");
      root.style.removeProperty("--intro-scale");
    };
  }, []);
}

const processSteps = [
  { title: "Tell me about you", text: "A two-minute survey. Your name, what you do, how to reach you. That's all I need to start." },
  { title: "We hop on a call", text: "A short, friendly video call. You talk about your work, I listen and plan everything." },
  { title: "I design & build", text: "Your site takes shape: custom design, clean code, your colors, your story. No work on your side." },
  { title: "You review, I refine", text: "Leave notes right on the preview. I revise until it feels exactly like you." },
  { title: "Launch & forever care", text: "Domain, hosting, security, updates. It goes live and stays looked after." },
];

const includedGroups = [
  { label: "CREATION", items: ["Custom design, built for you", "Domain & hosting set up", "Mobile-ready and fast", "Unlimited revisions until launch"] },
  { label: "MAINTENANCE", items: ["Hosting & SSL managed", "Backups & security checks", "Uptime monitoring", "Speed & bug fixes"] },
  { label: "UPDATES", items: ["Swap photos, text, projects", "Add new pages when you grow", "Replies within a day", "Nothing technical, ever"] },
];

const monthlyPrice = "$X";

function useSceneStep(id: string, count: number) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const scene = document.getElementById(id);
    if (!scene) return;
    let animationFrame = 0;

    const update = () => {
      if (animationFrame) return;
      animationFrame = requestAnimationFrame(() => {
        animationFrame = 0;
        const top = scene.getBoundingClientRect().top + window.scrollY;
        const span = Math.max(scene.offsetHeight - window.innerHeight, 1);
        const g = Math.min(Math.max((window.scrollY - top) / span, 0), 0.9999);
        scene.style.setProperty("--g", g.toFixed(4));
        setActiveStep(Math.floor(g * count));
      });
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [id, count]);

  return activeStep;
}

function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.18 },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
}

function validate(form: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Please add your name.";

  const contact = form.contact.trim();
  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  const phoneDigits = contact.replace(/\D/g, "");
  const looksLikePhone = phoneDigits.length >= 7 && /^[+\d\s().-]+$/.test(contact);
  if (!contact) {
    errors.contact = "Add an email address or phone number so I can reach you.";
  } else if (!looksLikeEmail && !looksLikePhone) {
    errors.contact = "Enter a usable email address or phone number.";
  }
  return errors;
}

function App() {
  useScrollExperience();
  const activeStep = useSceneStep("handled", handledServices.length);
  const processStep = useSceneStep("process", processSteps.length);
  useReveal();
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formMessage, setFormMessage] = useState("");

  function updateField(field: keyof FormData, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;

    const nextErrors = validate(form);
    setErrors(nextErrors);
    setFormMessage("");

    if (form.website.trim()) {
      setStatus("error");
      setFormMessage("We couldn't send your message. Please try again.");
      return;
    }
    if (Object.keys(nextErrors).length > 0) {
      document.getElementById(Object.keys(nextErrors)[0])?.focus();
      return;
    }

    setStatus("loading");
    try {
      const submission = new URLSearchParams({
        "form-name": "portfolio-note",
        name: form.name.trim(),
        field: form.field.trim(),
        contact: form.contact.trim(),
        details: form.details.trim(),
        website: form.website,
      });
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: submission.toString(),
      });
      if (!response.ok) throw new Error(`Netlify Forms returned ${response.status}`);
      setStatus("success");
    } catch (error) {
      console.error("Portfolio inquiry could not be delivered.", error);
      setStatus("error");
      setFormMessage("Your message couldn't be sent. Your details are still here—please try again or email me directly.");
    }
  }

  const activeService = handledServices[activeStep];
  const requiredDone = Number(Boolean(form.name.trim())) + Number(Boolean(form.contact.trim()));
  const doneClass = (value: string) => (value.trim() ? "field field-done" : "field");
  const fallbackMailto = `mailto:${fallbackEmail}?subject=${encodeURIComponent(`Portfolio inquiry from ${form.name.trim() || "website visitor"}`)}&body=${encodeURIComponent([
    `Name: ${form.name.trim()}`,
    `What do you do?: ${form.field.trim()}`,
    `Contact: ${form.contact.trim()}`,
    `Anything else?: ${form.details.trim()}`,
  ].join("\n"))}`;

  return (
    <>
      <div className="reading-line" aria-hidden="true"><span /></div>

      <main>
        <section className="intro-scene" id="intro" aria-labelledby="intro-title">
          <div className="intro-frame">
            <div className="intro-top">
              <span className="micro-brand"><span>G</span> GETMYPORTFOLIO</span>
              <span className="micro-index">INDEPENDENT PORTFOLIO SERVICE&nbsp; / &nbsp;001</span>
            </div>
            <div className="intro-center">
              <h1 className="intro-price" id="intro-title">{priceDisplay}</h1>
              <p className="intro-word">PORTFOLIOS</p>
              <a className="intro-cta" href="#apply"><span>GET YOURS</span><span aria-hidden="true">↘</span></a>
            </div>
            <div className="intro-bottom">
              <span>DESIGNED, BUILT & LOOKED AFTER FOR YOU.</span>
              <a href="#process"><span className="scroll-mark" aria-hidden="true">↓</span> SCROLL TO SEE</a>
              <span>NO TECHNICAL HASSLE.</span>
            </div>
          </div>
        </section>

        <section className="process-scene" id="process" aria-label="How it works">
          <div className="process-sticky">
            <div className="handled-meta">
              <span>01 — 04&nbsp;&nbsp; / &nbsp;&nbsp;HOW IT WORKS</span>
              <span>FIVE STEPS. ONE OF THEM IS YOURS.</span>
            </div>
            <div className="process-layout">
              <div className="process-text">
                <ol className="process-list">
                  {processSteps.map((step, index) => (
                    <li className={index === processStep ? "is-active" : index < processStep ? "is-past" : ""} key={step.title}>
                      <span>0{index + 1}</span>{step.title}
                    </li>
                  ))}
                </ol>
                <p className="process-desc" key={processStep}>{processSteps[processStep].text}</p>
              </div>
              <div className="process-stage" aria-hidden="true">
                {processVisuals.map((Visual, index) => (
                  <div
                    className={`pv${index === processStep ? " pv-active" : ""}${index < processStep ? " pv-past" : ""}`}
                    key={index}
                    style={{ "--i": index } as CSSProperties}
                  >
                    <Visual />
                  </div>
                ))}
              </div>
            </div>
            <div className="handled-footer">
              <span>STEP 0{processStep + 1} / 0{processSteps.length}</span>
              <span className="service-progress">
                {processSteps.map((step, index) => (
                  <span className={index === processStep ? "service-progress-active" : ""} key={step.title} />
                ))}
              </span>
              <span>KEEP SCROLLING&nbsp; ↓</span>
            </div>
          </div>
        </section>

        <section className="handled-scene" id="handled" aria-label="Everything handled for you">
          <div className="handled-sticky">
            <div className="handled-meta">
              <span>02 — 04&nbsp;&nbsp; / &nbsp;&nbsp;WHAT I HANDLE</span>
              <span>YOU GIVE ME A LITTLE. I TAKE CARE OF THE REST.</span>
            </div>
            <div className="handled-layout">
              <div className="handled-left">
                <h2 className="handled-promise">YOU DON'T HAVE<br />TO DO ANYTHING<span>.</span></h2>
                <div className="service-reveal" aria-live="polite" aria-atomic="true">
                  <span className="service-count">0{activeStep + 1}&nbsp; / &nbsp;0{handledServices.length}</span>
                  <p className="service-word" key={activeService.name}>{activeService.name}</p>
                  <p className="service-status" key={`${activeService.name}-status`}>{activeService.status}</p>
                </div>
              </div>
              <div className="service-stage" aria-hidden="true" key={activeService.name}>
                {(() => {
                  const Visual = serviceVisuals[activeStep];
                  return <Visual />;
                })()}
              </div>
            </div>
            <div className="handled-footer">
              <span>YOUR WORK, IN GOOD HANDS.</span>
              <span className="service-progress">
                {handledServices.map((service, index) => (
                  <span
                    className={index === activeStep ? "service-progress-active" : ""}
                    key={service.name}
                  />
                ))}
              </span>
              <span>KEEP SCROLLING&nbsp; ↓</span>
            </div>
          </div>
        </section>

        <section className="pricing-scene" id="pricing" aria-labelledby="pricing-title">
          <div className="pricing-inner">
            <p className="pricing-kicker reveal">03 — 04&nbsp;&nbsp; / &nbsp;&nbsp;ONE SIMPLE RATE</p>
            <h2 className="pricing-title reveal" id="pricing-title">CREATED.<br />MAINTAINED.<br /><em>UPDATED.</em></h2>
            <div className="price-card reveal">
              <div className="price-line">
                <div><span className="price-big">{priceDisplay}</span><small>ONE-TIME, TO CREATE IT</small></div>
                <span className="price-plus" aria-hidden="true">+</span>
                <div><span className="price-big">{monthlyPrice}</span><small>PER MONTH, TO KEEP IT PERFECT</small></div>
              </div>
              <p className="price-note">A flat rate. No hourly billing, no surprise invoices, no hosting bills, no “plugin renewals.” Cancel anytime.</p>
              <a className="submit-link price-cta" href="#apply"><span>START WITH A CONVERSATION</span><span aria-hidden="true">↗</span></a>
            </div>
            <div className="included">
              {includedGroups.map((group, index) => (
                <div className="included-col reveal" style={{ "--d": `${index * 120}ms` } as CSSProperties} key={group.label}>
                  <h3>{group.label}</h3>
                  <ul>
                    {group.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="application-scene" id="apply" aria-labelledby="application-title">
          <div className="application-heading">
            <div>
              <p className="application-kicker">04 — 04&nbsp;&nbsp; / &nbsp;&nbsp;THE FIRST STEP</p>
              <h2 id="application-title">LET'S MAKE<br /><em>YOURS.</em></h2>
            </div>
            <p className="application-note">A few details.<br />I’ll take it from here.</p>
          </div>

          <div className="application-body">
            <div className="form-aside">
              <span>YOU BRING THE WORK.</span>
              <span>I’LL HANDLE THE REST.</span>
            </div>
            <div className="form-wrap">
              {status === "success" ? (
                <div className="success-state" role="status" aria-live="polite">
                  <span className="success-kicker">MESSAGE RECEIVED&nbsp; / &nbsp;THANK YOU</span>
                  <h3>YOU'RE<br /><em>IN.</em></h3>
                  <p>I’ll personally be in touch to learn a little about you and what you’re looking for.</p>
                </div>
              ) : (
                <form
                  name="portfolio-note"
                  method="POST"
                  data-netlify="true"
                  data-netlify-honeypot="website"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <input type="hidden" name="form-name" value="portfolio-note" />
                  <div className="form-progress" aria-hidden="true">
                    <span>{requiredDone === 2 ? "READY" : `0${requiredDone} / 02`}</span>
                    <span className="form-progress-track"><span style={{ transform: `scaleX(${requiredDone / 2})` }} /></span>
                  </div>
                  <div className={doneClass(form.name)}>
                    <label htmlFor="name">NAME <span>*</span></label>
                    <input
                      id="name"
                      name="name"
                      autoComplete="name"
                      placeholder="First and last"
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      aria-required="true"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "name-error" : undefined}
                    />
                    {errors.name && <p className="field-error" id="name-error">{errors.name}</p>}
                  </div>
                  <div className={doneClass(form.field)}>
                    <label htmlFor="field">WHAT DO YOU DO? <span className="field-optional">OPTIONAL</span></label>
                    <input
                      id="field"
                      name="field"
                      autoComplete="organization-title"
                      placeholder="Designer, student, developer..."
                      value={form.field}
                      onChange={(event) => updateField("field", event.target.value)}
                    />
                  </div>
                  <div className={doneClass(form.contact)}>
                    <label htmlFor="contact">HOW CAN I REACH YOU? <span>*</span></label>
                    <input
                      id="contact"
                      name="contact"
                      autoComplete="email"
                      placeholder="Email or phone"
                      value={form.contact}
                      onChange={(event) => updateField("contact", event.target.value)}
                      aria-required="true"
                      aria-invalid={Boolean(errors.contact)}
                      aria-describedby={errors.contact ? "contact-error" : "contact-hint"}
                    />
                    <span className="field-hint" id="contact-hint">Whichever you check most often.</span>
                    {errors.contact && <p className="field-error" id="contact-error">{errors.contact}</p>}
                  </div>
                  <div className={doneClass(form.details)}>
                    <label htmlFor="details">ANYTHING ELSE? <span className="field-optional">OPTIONAL</span></label>
                    <textarea
                      id="details"
                      name="details"
                      rows={2}
                      placeholder="Anything you'd like me to know..."
                      value={form.details}
                      onChange={(event) => updateField("details", event.target.value)}
                    />
                  </div>
                  <div className="honeypot" aria-hidden="true">
                    <label htmlFor="website">Leave this field empty</label>
                    <input
                      id="website"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={(event) => updateField("website", event.target.value)}
                    />
                  </div>
                  {formMessage && (
                    <p className="form-error" role="alert">
                      {formMessage}{" "}
                      {status === "error" && <a href={fallbackMailto}>Email me instead ↗</a>}
                    </p>
                  )}
                  <button className="submit-link" type="submit" disabled={status === "loading"}>
                    <span>{status === "loading" ? "SENDING" : "GET MY PORTFOLIO"}</span>
                    <span aria-hidden="true">{status === "loading" ? "…" : "↗"}</span>
                  </button>
                  <p className="form-reassurance">NO COMMITMENT. NO TECHNICAL SKILLS. JUST A CONVERSATION.</p>
                </form>
              )}
            </div>
          </div>
          <footer className="scene-footer">
            <a className="micro-brand" href="#intro"><span>G</span> GETMYPORTFOLIO</a>
            <span>A GOOD HOME FOR GOOD WORK.</span>
            <span>© {new Date().getFullYear()}</span>
          </footer>
        </section>
      </main>
    </>
  );
}

export default App;
