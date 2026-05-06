"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import savedCertificates from "../data/certificates.json";
import savedProjects from "../data/projects.json";

type SectionId = "home" | "about" | "skills" | "experience" | "projects" | "certificates" | "contact";
type Accent = "cyan" | "violet" | "blue" | "green";

type Project = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  accent: Accent;
  image: string;
  projectUrl: string;
  codeUrl: string;
};

type Certificate = {
  id: string;
  title: string;
  issuer: string;
  issuedAt: string;
  category: string;
  imageUrl: string;
  fileUrl: string;
};

const navItems: { id: SectionId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Me" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "certificates", label: "Certificates" },
  { id: "contact", label: "Contact" }
];

const fallbackProjects: Project[] = [
  {
    id: "optiflow",
    title: "Optiflow",
    description: "AI-powered traffic flow optimization project with a backend-focused system workflow.",
    tech: ["Supabase", "Node.js", "React"],
    accent: "cyan",
    image: "/optiflow.png",
    projectUrl: "https://github.com/dager33x/SystemOptiflow",
    codeUrl: "https://github.com/dager33x/SystemOptiflow"

    
  }
  
];

const initialProjects = (savedProjects as Project[]).length ? (savedProjects as Project[]) : fallbackProjects;

const skills = [
  {
    group: "Backend",
    icon: "</>",
    code: "BE",
    description: "Building server-side logic, RESTful services, and application functionality.",
    items: [{ name: "Python", level: 78 }, { name: ".NET", level: 80 }, { name: "Java", level: 75 }, { name: "Flutter", level: 38 }]
  },
  {
    group: "Frontend",
    icon: "UI",
    code: "FE",
    description: "Creating responsive and interactive user interfaces with modern technologies.",
    items: [{ name: "TypeScript", level: 72 }, { name: "Razor", level: 68 }]
  },
  {
    group: "Database",
    icon: "DB",
    code: "DB",
    description: "Designing schemas, writing efficient queries, and managing structured data.",
    items: [{ name: "MySQL", level: 80 }, { name: "Supabase", level: 60 }, { name: "Firebase", level: 60 }]
  },
  {
    group: "Tools & Others",
    icon: "TL",
    code: "TL",
    description: "Using essential tools that improve productivity, collaboration, and development workflow.",
    items: [{ name: "Git", level: 74 }, { name: "VS Code", level: 80 }, { name: "Visual Studio", level: 60 }, { name: "Docker", level: 50 }, { name: "Figma", level: 50 }]
  }
];

const exploringTools = ["Node.js", "Next.js", "PostgreSQL", "Docker"];

const experiences = [
  {
    period: "Aug 2025 - Dec 2025",
    role: "Software Development Trainee – Jumpstart Training Program",
    place: "Trainee Developer Internship",
    summary: [
      "Completed an intensive full-stack development training program focused on building practical web applications using C#, ASP.NET MVC, Razor Pages, Tailwind CSS, and Supabase while following Agile development workflows and industry-standard coding practices.",
      "Served as an Admin, Back-End, and Front-End Developer in a team-based internal development project, assisting in system implementation, user interface development, database management, and administrative functionalities to support efficient system operations and user management.",
      "Contributed to the development of core system features by integrating responsive front-end interfaces with back-end logic, maintaining organized database structures in Supabase, applying clean coding practices, and collaborating closely with the project manager and technical specialist through testing, debugging, and code reviews.",
    ],
    highlights: ["Backend development", "Database management", "Service logic"]
  },
  {
    period: "Sep 2025 - Nov 2025",
    role: "SAP Advanced Business Application Programming Trainee",
    place: "Sap Abap Developer Training",
    summary: [
      "Completed a 320-hour SAP ABAP training program covering ABAP fundamentals, Open SQL, modularization techniques, Object-Oriented ABAP concepts, and report development using ALV/SALV.",
      "Assigned to develop the MMR Storage Location module for SAP MM, implementing selection screens, input validations, and SALV-based report output with optimized columns, sorting functionality, and hotspot navigation integration to MM03.",
      "Applied structured debugging, testing, and documentation practices to build a maintainable and organized report architecture using reusable classes and clean separation between model and view components."

    ],
    highlights: ["Sap Abap development", "Database design"]
  },
  {
    period: "Dec 10",
    role: "TOPCIT LEVEL 2",
    place: "Coursework and Self-study",
    summary: [
      "Took the TOPCIT (Test of Practical Competency in IT) examination on December 10, 2025, assessing practical knowledge and problem-solving skills in software development, databases, networking, and IT business fundamentals.",
      "Achieved Level 2 proficiency, demonstrating foundational competency in core information technology concepts, system understanding, and practical software-related problem solving."
    ],
    highlights: []
  }
];

const fallbackCertificates: Certificate[] = [
  {
    id: "certificate-of-completion",
    title: "Certificate of Completion",
    issuer: "Learning Achievement",
    issuedAt: "2026",
    category: "Achievement",
    fileUrl: "/certificate.pdf",
    imageUrl: ""
  }
];

const initialCertificates = (savedCertificates as Certificate[]).length
  ? (savedCertificates as Certificate[])
  : fallbackCertificates;

const socialLinks = [
  {
    label: "GitHub",
    handle: "@dager33x",
    description: "Code, systems, and project repositories",
    href: "https://github.com/dager33x",
    icon: "GH"
  },
  {
    label: "LinkedIn",
    handle: "Daryl Darnayla",
    description: "Professional profile and internship updates",
    href: "https://www.linkedin.com/in/daryl-darnayla-889122365/",
    icon: "IN"
  },
  {
    label: "Email",
    handle: "Contact form",
    description: "For project questions or opportunities",
    href: "#contact",
    icon: "EM"
  }
];

const aboutServices = [
  {
    icon: "BOX",
    title: "Backend Development",
    description: "Building server-side logic and application features."
  },
  {
    icon: "DB",
    title: "Database Design",
    description: "Structuring data models and writing efficient queries."
  },
  {
    icon: "SYS",
    title: "System Logic",
    description: "Creating reliable and maintainable service logic."
  }
];

const aboutTech = ["JavaScript", "Node.js", "Express.js", "MySQL", "MongoDB", "Git"];

const aboutStats = [
  { icon: "</>", label: "Focused On", value: "Backend Development" },
  { icon: "DB", label: "Building", value: "Robust Systems & Clean Foundations" },
  { icon: ">_", label: "Driven By", value: "Logic, Structure & Purpose" }
];

export default function Home() {
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const [typedText, setTypedText] = useState("");
  const [formStatus, setFormStatus] = useState("Ready to build something useful?");
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [projectsStatus, setProjectsStatus] = useState("");
  const [certificates, setCertificates] = useState<Certificate[]>(initialCertificates);
  const [certificatesStatus, setCertificatesStatus] = useState("");
  const headline = "Where ideas become working systems.";
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  function loadProjects() {
    setProjectsStatus("Loading projects...");
    fetch(`/api/projects?updated=${Date.now()}`, {
      cache: "no-store"
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Projects unavailable");
        }
        return response.json() as Promise<Project[]>;
      })
      .then((data) => {
        if (data.length > 0) {
          setProjects(data);
          setProjectsStatus("");
        } else {
          setProjectsStatus("No projects yet. Add one from the admin page.");
        }
      })
      .catch(() => {
        setProjectsStatus("Showing saved projects while the latest project data loads.");
      });
  }

  function loadCertificates() {
    setCertificatesStatus("Loading certificates...");
    fetch(`/api/certificates?updated=${Date.now()}`, {
      cache: "no-store"
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Certificates unavailable");
        }
        return response.json() as Promise<Certificate[]>;
      })
      .then((data) => {
        if (data.length > 0) {
          setCertificates(data);
          setCertificatesStatus("");
        } else {
          setCertificatesStatus("No certificates yet. Add one from the admin page.");
        }
      })
      .catch(() => {
        setCertificatesStatus("Showing saved certificates while the latest certificate data loads.");
      });
  }

  useEffect(() => {
    let index = 0;
    const timer = window.setInterval(() => {
      setTypedText(headline.slice(0, index + 1));
      index += 1;
      if (index === headline.length) {
        window.clearInterval(timer);
      }
    }, 48);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    loadProjects();
    loadCertificates();

    function refreshWhenVisible() {
      if (document.visibilityState === "visible") {
        loadProjects();
        loadCertificates();
      }
    }

    function refreshContent() {
      loadProjects();
      loadCertificates();
    }

    window.addEventListener("focus", refreshContent);
    window.addEventListener("pageshow", refreshContent);
    window.addEventListener("storage", refreshContent);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      window.removeEventListener("focus", refreshContent);
      window.removeEventListener("pageshow", refreshContent);
      window.removeEventListener("storage", refreshContent);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as SectionId);
            entry.target.classList.add("section-visible");
          }
        });
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: 0.12 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData))
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Message failed");
        }
        setFormStatus("Message saved to the admin dashboard inbox.");
        form.reset();
      })
      .catch(() => setFormStatus("Message failed. Please try again."));
  }

  return (
    <main>
      <nav className="navbar" aria-label="Primary navigation">
        <a className="brand" href="#home">
          DARYL
        </a>
        <div className="nav-links">
          {navItems.map((item) => (
            <a key={item.id} className={activeSection === item.id ? "active" : ""} href={`#${item.id}`}>
              {item.label}
            </a>
          ))}
          <a className="resume-link" href="/CV.pdf" download>
            Resume
          </a>
        </div>
      </nav>

      <section className="hero section-shell section-visible" id="home">
        <div className="hero-cinematic">
          <p className="availability-pill">
            <span className="pulse" />
            Available for work opportunities
          </p>
          <p className="hero-kicker">Aspiring Backend Developer / Systems Learner</p>
          <h1 className="hero-title">
            <span className="hero-title-line">Hello,</span>
            <span className="hero-title-line">I'm <strong>Daryl.</strong></span>
          </h1>
          <div className="hero-code-divider" aria-hidden="true">
            <span>&lt;/&gt;</span>
          </div>
          <p className="intro">
            <span>I focus on building practical backend systems,</span>
            <span>turning complex ideas into organized data</span>
            <span>and reliable service logic.</span>
          </p>
          <p className="typing hero-type-line">
            Where ideas become <strong>working systems.</strong>
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#projects">View Projects</a>
            <a className="secondary-button" href="#contact">Contact Me</a>
            <a className="secondary-button" href="/CV.pdf" download>Resume</a>
          </div>
          <a className="scroll-cue" href="#about" aria-label="Scroll to about section" />
        </div>
        <div className="hero-wave" aria-hidden="true" />
      </section>

      <section className="section-shell reveal-section" id="about">
        <div className="about-profile">
          <div className="about-visual">
            <div className="about-dot-grid" aria-hidden="true" />
            <div className="about-photo">
              <img src="/images.png" alt="Daryl portrait" />
            </div>
            <div className="about-stats">
              {aboutStats.map((stat) => (
                <article key={stat.label}>
                  <span>{stat.icon}</span>
                  <strong>{stat.label}</strong>
                  <small>{stat.value}</small>
                </article>
              ))}
            </div>
          </div>

          <div className="about-content">
            <p className="eyebrow">About Me</p>
            <h2>Building the foundation behind every system.</h2>
            <span className="heading-rule" />
            <div className="about-paragraphs">
              <p>
                I am a computer science student with a strong interest in backend development and
                system design. I enjoy turning ideas into functional systems with clean logic,
                structured data, and scalable architecture.
              </p>
              <p>
                I focus on writing efficient code, designing database workflows, and building
                services that are reliable and maintainable.
              </p>
            </div>



            <div className="about-block">
              <p className="panel-kicker">What Drives Me</p>
              <blockquote>
                I enjoy solving problems and continuously learning to build better systems.
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell reveal-section" id="skills">
        <div className="skills-layout">
          <div className="skills-intro">
            <p className="eyebrow">Skills</p>
            <h2>What I Work With</h2>
            <span className="heading-rule" />
            <p>
              A collection of technologies and tools I use to build, learn, and ship better systems.
            </p>
            <div className="skill-rail">
              {skills.map((skill) => (
                <article className="skill-overview" key={skill.group}>
                  <span className="skill-overview-icon">{skill.icon}</span>
                  <div>
                    <h3>{skill.group}</h3>
                    <p>{skill.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="skills-workspace">
            <section className="technical-panel" aria-label="Technical skills">
              <p className="panel-kicker">Technical Skills</p>
              <div className="technical-grid">
                {skills.map((skill) => (
                  <article className="technical-group" key={skill.group}>
                    <div className="technical-head">
                      <h3>{skill.group.replace(" & Others", "")}</h3>
                      <span>{skill.code}</span>
                    </div>
                    {skill.items.map((item) => (
                      <div className="technical-meter" key={item.name}>
                        <span>{item.name}</span>
                        <div className="meter-track">
                          <span style={{ width: `${item.level}%` }} />
                        </div>
                        <small>{item.level}%</small>
                      </div>
                    ))}
                  </article>
                ))}
              </div>
            </section>

            <section className="exploring-panel" aria-label="Currently exploring">
              <p className="panel-kicker">Currently Exploring</p>
              <div className="exploring-list">
                {exploringTools.map((tool) => (
                  <span key={tool}>{tool}</span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="section-shell reveal-section section-visible" id="experience">
        <div className="section-heading">
          <p className="eyebrow">Experience</p>
          <h2>Learning By Building</h2>
        </div>
        <div className="experience-layer">
          {experiences.map((experience, index) => (
            <article className="experience-card" key={experience.role}>
              <div className="experience-marker">
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="experience-copy">
                <div className="experience-topline">
                  <span>{experience.period}</span>
                  <span>{experience.place}</span>
                </div>
                <h3>{experience.role}</h3>
                <ul className="experience-summary">
                  {experience.summary.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="experience-tags">
                  {experience.highlights.map((highlight) => (
                    <span key={highlight}>{highlight}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell reveal-section section-visible" id="projects">
        <div className="section-heading projects-heading">
          <p className="eyebrow">Projects</p>
          <h2>Undergraduate Projects</h2>
          <span className="heading-rule" />
          <p>
            A collection of systems and applications built to solve real problems and sharpen my skills.
          </p>
        </div>
        {projectsStatus ? <p className="form-status">{projectsStatus}</p> : null}
        <div className="project-grid">
          {projects.map((project) => (
            <article className={`project-card ${project.accent}`} key={project.id}>
              <div className="project-image">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="project-image-fallback">
                    <strong>{project.title}</strong>
                    <span>{project.tech.slice(0, 2).join(" / ") || "Project"}</span>
                  </div>
                )}
              </div>
              <div className="project-copy">
                <div className="project-topline">
                  <span>Featured</span>
                  <span>System Design</span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tech-stack">
                  {project.tech.map((tech) => <span key={tech}>{tech}</span>)}
                </div>
                <div className="project-actions">
                  <a href={project.projectUrl || "#"}>View Project</a>
                  <a href={project.codeUrl || "#"}>View Code</a>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="more-projects">
          <span>More Projects Coming Soon</span>
        </div>
      </section>

      <section className="section-shell reveal-section section-visible" id="certificates">
        <div className="certificates-heading">
          <div>
            <p className="eyebrow">Certificates</p>
            <h2>My Certificates</h2>
            <span className="heading-rule" />
            <p>
              A collection of my learning achievements and certifications that represent my
              skills and dedication.
            </p>
          </div>
          <span className="certificate-note">Always learning. Always building.</span>
        </div>
        {certificatesStatus ? <p className="form-status">{certificatesStatus}</p> : null}
        <div className="certificate-grid">
          {certificates.map((certificate) => (
            <article className="certificate-card" key={certificate.id}>
              <div className="certificate-preview">
                {certificate.imageUrl ? (
                  <img
                    src={certificate.imageUrl.startsWith("/") ? certificate.imageUrl : `/${certificate.imageUrl}`}
                    alt={`${certificate.title} preview`}
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="certificate-placeholder">
                    <span>Certificate</span>
                    <strong>Daryl Darnayla</strong>
                    <small>{certificate.issuer}</small>
                  </div>
                )}
              </div>
              <div className="certificate-copy">
                <div className="certificate-topline">
                  <span>{certificate.issuer}</span>
                </div>
                <h3>{certificate.title}</h3>
                <p>Issued on {certificate.issuedAt}</p>
                <span className="certificate-category">{certificate.category}</span>
                {certificate.fileUrl && certificate.fileUrl !== "#" ? (
                  <a className="certificate-link" href={certificate.fileUrl} target="_blank" rel="noreferrer">
                    View Certificate
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell reveal-section" id="contact">
        <div className="section-heading">
          <p className="eyebrow">Contact</p>
        <h2>MY CONTACT INFORMATION</h2>
        </div>
        <div className="contact-grid">
          <form className="contact-form" onSubmit={handleSubmit}>
            <label>Name<input name="name" placeholder="Your name" required suppressHydrationWarning /></label>
            <label>Email<input name="email" placeholder="you@example.com" required type="email" suppressHydrationWarning /></label>
            <label>Message<textarea name="message" placeholder="Tell me about the project or opportunity" required suppressHydrationWarning /></label>
            <button type="submit" suppressHydrationWarning>Send Message</button>
            <p className="form-status">{formStatus}</p>
          </form>
          <aside className="social-panel">
            <div className="social-panel-head">
              <div>
                <p className="eyebrow">Socials</p>
                <h3>Find me online</h3>
              </div>
              <span>Open</span>
            </div>
            <p className="social-intro">
              The fastest way to review my work, connect professionally, or send a direct message.
            </p>
            <div className="social-links">
              {socialLinks.map((link) => (
                <a
                  className="social-link-card"
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  key={link.label}
                >
                  <span className="social-icon">{link.icon}</span>
                  <span>
                    <strong>{link.label}</strong>
                    <small>{link.handle}</small>
                    <em>{link.description}</em>
                  </span>
                </a>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <footer>
        <span>Daryl Darnayla Copyright {currentYear}.</span>
      </footer>
    </main>
  );
}
