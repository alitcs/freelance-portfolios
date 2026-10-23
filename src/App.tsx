import { useEffect, useState } from "react";
import type { FormEvent } from "react";

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

function useHandledServiceStep() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const scene = document.getElementById("handled");
    if (!scene) return;
    let animationFrame = 0;

    const updateActiveStep = () => {
      if (animationFrame) return;
      animationFrame = requestAnimationFrame(() => {
        const sceneTop = scene.getBoundingClientRect().top + window.scrollY;
        const stepHeight = scene.offsetHeight / handledServices.length;
        const progress = window.scrollY - sceneTop + window.innerHeight / 2;
        const step = Math.floor(progress / stepHeight);
        setActiveStep(Math.min(Math.max(step, 0), handledServices.length - 1));
        animationFrame = 0;
      });
    };

    window.addEventListener("scroll", updateActiveStep, { passive: true });
    window.addEventListener("resize", updateActiveStep);
    updateActiveStep();
    return () => {
      window.removeEventListener("scroll", updateActiveStep);
      window.removeEventListener("resize", updateActiveStep);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  return activeStep;
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
  const activeStep = useHandledServiceStep();
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
              <span className="micro-brand"><span>N</span> NEWPORTFOLIO</span>
              <span className="micro-index">INDEPENDENT PORTFOLIO SERVICE&nbsp; / &nbsp;001</span>
            </div>
            <div className="intro-center">
              <h1 className="intro-price" id="intro-title">{priceDisplay}</h1>
              <p className="intro-word">PORTFOLIOS</p>
              <a className="intro-cta" href="#apply"><span>GET YOURS</span><span aria-hidden="true">↘</span></a>
            </div>
            <div className="intro-bottom">
              <span>DESIGNED, BUILT & LOOKED AFTER FOR YOU.</span>
              <a href="#handled"><span className="scroll-mark" aria-hidden="true">↓</span> SCROLL TO SEE</a>
              <span>NO TECHNICAL HASSLE.</span>
            </div>
          </div>
        </section>

        <section className="handled-scene" id="handled" aria-label="Everything handled for you">
          <div className="handled-sticky">
            <div className="handled-meta">
              <span>01 — 02&nbsp;&nbsp; / &nbsp;&nbsp;WHAT I HANDLE</span>
              <span>YOU GIVE ME A LITTLE. I TAKE CARE OF THE REST.</span>
            </div>
            <h2 className="handled-promise">YOU DON'T HAVE<br />TO DO ANYTHING<span>.</span></h2>
            <div className="service-reveal" aria-live="polite" aria-atomic="true">
              <span className="service-count">0{activeStep + 1}&nbsp; / &nbsp;0{handledServices.length}</span>
              <div className="service-word-wrap">
                <p className="service-word" key={activeService.name}>{activeService.name}</p>
              </div>
              <p className="service-status" key={`${activeService.name}-status`}>{activeService.status}</p>
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
          <div className="service-markers" aria-hidden="true">
            {handledServices.map((service, index) => (
              <span data-service-step={index} key={service.name} />
            ))}
          </div>
        </section>

        <section className="application-scene" id="apply" aria-labelledby="application-title">
          <div className="application-heading">
            <div>
              <p className="application-kicker">02 — 02&nbsp;&nbsp; / &nbsp;&nbsp;THE FIRST STEP</p>
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
            <a className="micro-brand" href="#intro"><span>N</span> NEWPORTFOLIO</a>
            <span>A GOOD HOME FOR GOOD WORK.</span>
            <span>© {new Date().getFullYear()}</span>
          </footer>
        </section>
      </main>
    </>
  );
}

export default App;
