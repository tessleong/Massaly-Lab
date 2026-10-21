import { useEffect, useRef, useState } from "react";

interface SubSection {
  id: string;
  title: string;
}

const subSections: SubSection[] = [
  {
    id: "dynorphin-circuits",
    title: "Brain Regions of Focus",
  },
  {
    id: "optogenetics",
    title: "Optogenetics",
  },
  {
    id: "wireless-equipment",
    title: "Wireless Equipment for Autonomous Rodent Infusion Tasks",
  },
];

const projects = [
  {
    id: "circuit",
    number: "01",
    label: "Circuit architecture",
    title: "Where do NAc dynorphin neurons send information?",
    summary:
      "We map the long-range outputs of dynorphin-expressing neurons in the nucleus accumbens to understand how this population can influence motivated behavior.",
    note: "Anterograde tracing · projection density · target validation",
  },
  {
    id: "photometry",
    number: "02",
    label: "Population dynamics",
    title: "When is this circuit active?",
    summary:
      "Fiber photometry lets us follow calcium-dependent fluorescence from a genetically defined population while an animal encounters noxious and innocuous stimuli, rewards, choices, and changing internal states.",
    note: "GCaMP · fiber photometry · behavioral alignment",
  },
  {
    id: "causality",
    number: "03",
    label: "Causal function",
    title: "What does pathway activity do?",
    summary:
      "Pathway-selective perturbations test whether specific NAc dynorphin outputs are necessary or sufficient for components of motivation.",
    note: "Projection targeting · closed-loop tests · behavior",
  },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M14 7l5 5-5 5" />
    </svg>
  );
}

const projectionHypotheses = {
  vp: {
    title: "NAc dynorphin → VP",
    text: "We hypothesize that this pathway contributes to pain-related negative affect and reduced motivation by altering ventral pallidal output.",
  },
  lh: {
    title: "NAc dynorphin → LH",
    text: "We hypothesize that this pathway links pain state to homeostatic and motivated behaviors, including feeding, arousal, and action selection.",
  },
  vta: {
    title: "NAc dynorphin → VTA",
    text: "We hypothesize that this pathway shapes reward valuation and motivational drive by modulating midbrain dopamine circuitry.",
  },
} as const;

type ProjectionTarget = keyof typeof projectionHypotheses;

function CircuitMap({ active }: { active: string }) {
  const circuitActive = active === "circuit";
  const [focusedProjection, setFocusedProjection] = useState<ProjectionTarget | null>(null);
  const hypothesis = focusedProjection ? projectionHypotheses[focusedProjection] : null;

  return (
    <div className={`visual-panel circuit-map ${circuitActive ? "is-active" : ""}`}>
      <div className="visual-head">
        <span>Sagittal mouse brain</span>
        <span>Not to stereotaxic scale</span>
      </div>
      <div className="brain-map-wrap">
        <svg
          className="brain-map"
          viewBox="0 0 820 510"
          role="group"
          aria-labelledby="brain-title brain-desc"
        >
          <title id="brain-title">NAc dynorphin neuron projection map</title>
          <desc id="brain-desc">
            Sagittal mouse brain diagram showing three interactive projections from the nucleus
            accumbens to the ventral pallidum, lateral hypothalamus, and ventral tegmental area.
          </desc>
          <defs>
            <marker
              id="projection-arrow"
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path className="projection-arrow" d="M0 0 8 4 0 8Z" />
            </marker>
          </defs>
          <image
            className="brain-reference-image brain-reference-image-main"
            href="/mouse-brain-reference-pink.png"
            x="55"
            y="55"
            width="650"
            height="385"
            preserveAspectRatio="xMidYMid meet"
          />

          <path className="projection projection-vp" d="M285 334C310 340 325 349 333 354" />
          <path className="projection projection-lh" d="M285 329C330 322 380 333 421 347" />
          <path className="projection projection-vta" d="M283 322C350 280 430 288 499 318" />

          <ellipse className="region region-nac" cx="266" cy="332" rx="20" ry="16" />
          <g
            className="projection-target"
            role="button"
            tabIndex={0}
            aria-label="Ventral pallidum projection hypothesis"
            onMouseEnter={() => setFocusedProjection("vp")}
            onMouseLeave={() => setFocusedProjection(null)}
            onFocus={() => setFocusedProjection("vp")}
            onBlur={() => setFocusedProjection(null)}
          >
            <ellipse className="region-hit-area" cx="344" cy="356" rx="30" ry="27" />
            <ellipse className="region region-vp" cx="344" cy="356" rx="15" ry="11" />
            <g className="map-label">
              <text x="344" y="390" textAnchor="middle">VP</text>
            </g>
          </g>
          <g
            className="projection-target"
            role="button"
            tabIndex={0}
            aria-label="Lateral hypothalamus projection hypothesis"
            onMouseEnter={() => setFocusedProjection("lh")}
            onMouseLeave={() => setFocusedProjection(null)}
            onFocus={() => setFocusedProjection("lh")}
            onBlur={() => setFocusedProjection(null)}
          >
            <ellipse className="region-hit-area" cx="433" cy="350" rx="31" ry="28" />
            <ellipse className="region region-lh" cx="433" cy="350" rx="17" ry="12" />
            <g className="map-label">
              <text x="433" y="386" textAnchor="middle">LH</text>
            </g>
          </g>
          <g
            className="projection-target"
            role="button"
            tabIndex={0}
            aria-label="Ventral tegmental area projection hypothesis"
            onMouseEnter={() => setFocusedProjection("vta")}
            onMouseLeave={() => setFocusedProjection(null)}
            onFocus={() => setFocusedProjection("vta")}
            onBlur={() => setFocusedProjection(null)}
          >
            <ellipse className="region-hit-area" cx="511" cy="323" rx="32" ry="28" />
            <ellipse className="region region-vta" cx="511" cy="323" rx="18" ry="11" />
            <g className="map-label">
              <text x="511" y="358" textAnchor="middle">VTA</text>
            </g>
          </g>

          <g className="map-label label-nac">
            <text x="266" y="370" textAnchor="middle">NAc</text>
          </g>
          <text className="orientation" x="130" y="490">
            Anterior
          </text>
          <path className="orientation-line" d="M130 456H216M130 456l11-8M130 456l11 8" />
          <text className="orientation" x="530" y="490">
            Posterior
          </text>
          <path className="orientation-line" d="M530 456H616M616 456l-11-8M616 456l-11 8" />
        </svg>
        <div className="brain-key-panel" aria-label="Brain region abbreviation key">
          <span>Abbreviation key</span>
          <dl>
            <div>
              <dt>NAc</dt>
              <dd>nucleus accumbens</dd>
            </div>
            <div>
              <dt>VP</dt>
              <dd>ventral pallidum</dd>
            </div>
            <div>
              <dt>LH</dt>
              <dd>lateral hypothalamus</dd>
            </div>
            <div>
              <dt>VTA</dt>
              <dd>ventral tegmental area</dd>
            </div>
          </dl>
        </div>
        {hypothesis && (
          <div className="projection-tooltip" role="status" aria-live="polite">
            <span>Working hypothesis</span>
            <strong>{hypothesis.title}</strong>
            <p>{hypothesis.text}</p>
          </div>
        )}
      </div>
      <div className="visual-caption">
        <span className="caption-key">
          <i /> Dynorphin-expressing NAc neurons
        </span>
        <p>
          Dense projections reach the VP, LH, and VTA—three anatomically distinct nodes implicated
          in motivation.
        </p>
      </div>
    </div>
  );
}

function PhotometryVisual({ active }: { active: string }) {
  return (
    <div className={`visual-panel photometry ${active === "photometry" ? "is-active" : ""}`}>
      <div className="visual-head">
        <span>Fiber photometry</span>
        <span>Population-level signal</span>
      </div>
      <div className="photo-layout">
        <svg
          className="photo-rig"
          viewBox="0 0 620 420"
          role="img"
          aria-labelledby="photo-title photo-desc"
        >
          <title id="photo-title">Fiber photometry optical path</title>
          <desc id="photo-desc">
            Excitation light travels through an optical fiber to fluorescent calcium indicators in
            the targeted neuronal population. Emitted fluorescence returns through the same fiber
            to a detector.
          </desc>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="brain-recolor-photo" colorInterpolationFilters="sRGB">
              <feColorMatrix type="saturate" values="0" result="grayBrain" />
              <feComponentTransfer in="grayBrain">
                <feFuncR type="discrete" tableValues="0 0 0 .16 1 1 1 1" />
                <feFuncG type="discrete" tableValues="0 0 0 .08 .76 .82 .9 1" />
                <feFuncB type="discrete" tableValues="0 0 0 .1 .82 .87 .93 1" />
              </feComponentTransfer>
            </filter>
          </defs>
          <rect className="rig-box light-source" x="18" y="90" width="132" height="50" rx="4" />
          <text className="rig-label" x="84" y="110" textAnchor="middle">470 nm LED</text>
          <text className="rig-sub" x="84" y="128" textAnchor="middle">Ca²⁺-dependent</text>
          <rect className="rig-box light-source" x="470" y="90" width="132" height="50" rx="4" />
          <text className="rig-label" x="536" y="110" textAnchor="middle">405 nm LED</text>
          <text className="rig-sub" x="536" y="128" textAnchor="middle">reference signal</text>

          <rect className="rig-box detector" x="250" y="5" width="120" height="40" rx="4" />
          <text className="rig-label" x="310" y="23" textAnchor="middle">photodetector</text>
          <text className="rig-sub" x="310" y="38" textAnchor="middle">525 nm emission</text>

          <rect className="optical-bench" x="198" y="60" width="224" height="130" rx="3" />
          <rect className="optical-filter excitation-filter" x="198" y="103" width="12" height="24" />
          <rect className="optical-filter reference-filter" x="410" y="103" width="12" height="24" />
          <rect className="optical-filter emission-filter" x="299" y="60" width="22" height="11" />
          <path className="excitation-line" d="M150 115H235L310 170" />
          <path className="reference-line" d="M470 115H385L310 170" />
          <path className="emission-line" d="M310 350V45" />
          <path className="fiber-line" d="M310 190V350" />

          <image
            className="brain-reference-image"
            href="/mouse-brain-reference.jpeg"
            x="185"
            y="270"
            width="250"
            height="148"
            preserveAspectRatio="xMidYMid meet"
            filter="url(#brain-recolor-photo)"
          />
          <rect className="fiber-cannula" x="304" y="246" width="12" height="104" rx="3" />
          <path className="implant" d="M310 246V350" />
          <ellipse className="signal-halo" cx="310" cy="350" rx="30" ry="17" />
          <ellipse className="signal-node" cx="310" cy="350" rx="20" ry="10" filter="url(#glow)" />
          <circle className="cell-dot" cx="292" cy="356" r="4" />
          <circle className="cell-dot" cx="303" cy="365" r="3" />
          <circle className="cell-dot" cx="322" cy="363" r="4" />
          <circle className="cell-dot" cx="330" cy="351" r="3" />
          <text className="anatomical-note" x="438" y="405">
            sagittal mouse brain
          </text>

          <rect className="rig-box callout-box" x="24" y="200" width="142" height="43" rx="3" />
          <text className="rig-label" x="95" y="220" textAnchor="middle">fiber optic cable</text>
          <text className="rig-sub" x="95" y="235" textAnchor="middle">straight optical path</text>
          <path className="label-leader" d="M166 222H298" />

          <rect className="rig-box callout-box" x="446" y="238" width="158" height="45" rx="3" />
          <text className="rig-label" x="525" y="258" textAnchor="middle">fiber optic cannula</text>
          <text className="rig-sub" x="525" y="274" textAnchor="middle">implanted target</text>
          <path className="label-leader" d="M446 261H322" />

          <circle className="light-pulse pulse-blue" r="5" filter="url(#glow)">
            <animate
              attributeName="opacity"
              dur="4s"
              repeatCount="indefinite"
              values="1;1;0;0"
              keyTimes="0;.44;.45;1"
            />
            <animateMotion
              dur="4s"
              repeatCount="indefinite"
              keyPoints="0;1;1"
              keyTimes="0;.45;1"
              calcMode="linear"
              path="M150 115H235L310 170"
            />
          </circle>
          <circle className="light-pulse pulse-purple" r="5" filter="url(#glow)">
            <animate
              attributeName="opacity"
              dur="4s"
              repeatCount="indefinite"
              values="1;1;0;0"
              keyTimes="0;.44;.45;1"
            />
            <animateMotion
              dur="4s"
              repeatCount="indefinite"
              keyPoints="0;1;1"
              keyTimes="0;.45;1"
              calcMode="linear"
              path="M470 115H385L310 170"
            />
          </circle>
          <circle className="light-pulse pulse-red" r="5" filter="url(#glow)">
            <animate
              attributeName="opacity"
              dur="4s"
              repeatCount="indefinite"
              values="0;0;1;1"
              keyTimes="0;.44;.45;1"
            />
            <animateMotion
              dur="4s"
              repeatCount="indefinite"
              keyPoints="0;0;1"
              keyTimes="0;.45;1"
              calcMode="linear"
              path="M310 170V45"
            />
          </circle>
          <circle className="light-junction" cx="310" cy="170" r="7" />
          <circle className="light-pulse pulse-combined" r="6" filter="url(#glow)">
            <animate
              attributeName="opacity"
              dur="4s"
              repeatCount="indefinite"
              values="0;0;1;1"
              keyTimes="0;.44;.45;1"
            />
            <animateMotion
              dur="4s"
              repeatCount="indefinite"
              keyPoints="0;0;1"
              keyTimes="0;.45;1"
              calcMode="linear"
              path="M310 170V350"
            />
          </circle>
        </svg>
        <div className="signal-chart">
          <div className="signal-label">
            <span>ΔF/F</span>
            <span>aligned to behavior</span>
          </div>
          <svg viewBox="0 0 580 112" role="img" aria-label="Example fluorescence trace">
            <path className="chart-grid" d="M0 56h580M145 0v112M290 0v112M435 0v112" />
            <path
              className="chart-line"
              pathLength="1"
              d="M0 61L7 65L14 63L21 71L28 69L35 76L42 66L49 60L56 68L63 64L70 73L77 67L84 70L91 58L98 67L105 75L112 68L119 73L126 64L133 62L140 70L147 66L154 72L161 76L168 67L175 69L182 61L189 71L196 73L203 65L210 70L217 58L224 66L231 74L238 69L245 72L252 63L259 70L266 66L273 75L280 68L287 71L294 61L300 45L306 27L311 12L316 30L322 43L328 39L334 50L340 45L346 56L352 50L358 59L364 54L370 63L376 57L382 65L388 60L394 68L400 58L406 55L412 62L418 50L424 47L430 56L436 51L442 60L448 54L454 63L460 58L466 67L472 61L478 56L484 64L490 59L496 69L502 62L508 55L514 60L520 49L526 56L532 52L538 61L544 55L550 64L556 58L562 48L568 54L574 46L580 53"
            />
            <path className="event-line" d="M290 0v112" />
            <text className="event-label" x="355" y="24">event</text>
          </svg>
        </div>
      </div>
      <div className="visual-caption">
        <span className="caption-key">
          <i /> Calcium-dependent fluorescence
        </span>
        <p>
          Photometry reports a bulk signal from the sampled fluorescent population—not the activity
          of individual neurons.
        </p>
      </div>
    </div>
  );
}

function CausalityVisual({ active }: { active: string }) {
  return (
    <div className={`visual-panel causality ${active === "causality" ? "is-active" : ""}`}>
      <div className="visual-head">
        <span>Experimental logic</span>
        <span>Pathway-selective</span>
      </div>
      <div className="logic-flow">
        <div className="logic-step">
          <span>01</span>
          <div className="logic-icon neurons" aria-hidden="true">
            <i /><i /><i /><i />
          </div>
          <strong>Define</strong>
          <p>Dynorphin-expressing NAc population</p>
        </div>
        <div className="logic-arrow"><ArrowIcon /></div>
        <div className="logic-step">
          <span>02</span>
          <div className="logic-icon pathway" aria-hidden="true">
            <i /><i /><i />
          </div>
          <strong>Isolate</strong>
          <p>One projection-defined output pathway</p>
        </div>
        <div className="logic-arrow"><ArrowIcon /></div>
        <div className="logic-step">
          <span>03</span>
          <div className="logic-icon outcome" aria-hidden="true">
            <i />
          </div>
          <strong>Test</strong>
          <p>Consequences for motivated behavior</p>
        </div>
      </div>
      <div className="question-card">
        <span>Core question</span>
        <p>
          Do distinct projection targets carry separable motivational functions—or coordinate as a
          distributed network?
        </p>
      </div>
      <div className="visual-caption">
        <span className="caption-key">
          <i /> Causal inference
        </span>
        <p>
          Necessity and sufficiency require perturbation experiments and appropriate behavioral,
          anatomical, and optical controls.
        </p>
      </div>
    </div>
  );
}

function App() {
  const [stacked, setStacked] = useState(() => window.matchMedia("(max-width: 980px)").matches);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 980px)");
    const sync = () => setStacked(query.matches);
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  const [activeProject, setActiveProject] = useState("circuit");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    let animationFrame = 0;

    const syncActiveProject = () => {
      animationFrame = 0;
      const activationLine = window.innerHeight / 2;
      const sections = projects
        .map((project) => sectionRefs.current[project.id])
        .filter((section): section is HTMLElement => section !== null);

      const activeSection =
        sections.find((section) => {
          const rect = section.getBoundingClientRect();
          return rect.top <= activationLine && rect.bottom > activationLine;
        }) ??
        sections.reduce<HTMLElement | null>((closest, section) => {
          if (!closest) return section;
          const sectionRect = section.getBoundingClientRect();
          const closestRect = closest.getBoundingClientRect();
          const sectionDistance = Math.abs(
            sectionRect.top + sectionRect.height / 2 - activationLine,
          );
          const closestDistance = Math.abs(
            closestRect.top + closestRect.height / 2 - activationLine,
          );
          return sectionDistance < closestDistance ? section : closest;
        }, null);

      if (activeSection) {
        setActiveProject((current) =>
          current === activeSection.id ? current : activeSection.id,
        );
      }
    };

    const queueSync = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(syncActiveProject);
    };

    syncActiveProject();
    window.addEventListener("scroll", queueSync, { passive: true });
    window.addEventListener("resize", queueSync);

    return () => {
      window.removeEventListener("scroll", queueSync);
      window.removeEventListener("resize", queueSync);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  const scrollToProject = (id: string) => {
    const section = sectionRefs.current[id];
    if (!section) return;

    const sectionRect = section.getBoundingClientRect();
    const visual = document.querySelector<HTMLElement>(".project-visual");
    const isStackedLayout = window.matchMedia("(max-width: 980px)").matches;
    const visualHeight = isStackedLayout && visual ? visual.getBoundingClientRect().height : 0;
    const viewportAnchor =
      visualHeight + (window.innerHeight - visualHeight) / 2;
    const destination =
      window.scrollY + sectionRect.top + sectionRect.height / 2 - viewportAnchor;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    setActiveProject(id);
    window.scrollTo({
      top: Math.max(0, destination),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const projectIds = projects.map((p) => p.id);

  const goToNext = () => {
    const currentIndex = projectIds.indexOf(activeProject);
    if (currentIndex < projectIds.length - 1) {
      scrollToProject(projectIds[currentIndex + 1]);
    }
  };

  const goToPrev = () => {
    const currentIndex = projectIds.indexOf(activeProject);
    if (currentIndex > 0) {
      scrollToProject(projectIds[currentIndex - 1]);
    }
  };

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;

    // Detect horizontal swipe with minimum threshold and more horizontal than vertical
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div className="research-interactive-content">
      <div className="projects">
        {!stacked && <div
          className="project-visual"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="visual-stack">
            <CircuitMap active={activeProject} />
            <PhotometryVisual active={activeProject} />
            <CausalityVisual active={activeProject} />
          </div>
          <div className="project-dots" aria-label="Project progress">
            {projects.map((project) => (
              <button
                key={project.id}
                className={activeProject === project.id ? "active" : ""}
                onClick={() => scrollToProject(project.id)}
                aria-current={activeProject === project.id ? "step" : undefined}
                aria-label={`View project ${project.number}: ${project.label}`}
              />
            ))}
          </div>
        </div>}

        <div className="project-stories">
          {projects.map((project) => (
            <article
              id={project.id}
              key={project.id}
              ref={(node) => {
                sectionRefs.current[project.id] = node;
              }}
              className="project-story"
            >
              {stacked && <div className="mobile-project-visual">
                {project.id === "circuit" ? <CircuitMap active="circuit" /> : project.id === "photometry" ? <PhotometryVisual active="photometry" /> : <CausalityVisual active="causality" />}
              </div>}
              <div className="story-number">{project.number}</div>
              <p className="story-label">{project.label}</p>
              <h3 className={project.id === "circuit" ? "story-title-spaced" : undefined}>
                {project.title}
              </h3>
              <p className="story-summary">{project.summary}</p>
              <div className="story-note">{project.note}</div>
            </article>
          ))}
        </div>
      </div>

      <section className="accuracy-note">
        <p className="eyebrow">A note on interpretation</p>
        <div>
          <h2>Precise about what each method can tell us.</h2>
          <p>
            Our illustrations communicate experimental logic. Brain-region positions are
            conceptual and should not be used as a stereotaxic atlas. Projection density does not
            by itself establish synaptic strength or behavioral function, and fiber photometry
            measures fluorescence from a population within the sampled volume.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
