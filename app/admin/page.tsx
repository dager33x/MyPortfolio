"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

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

type ProjectForm = Omit<Project, "id" | "tech"> & {
  tech: string;
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

type CertificateForm = Omit<Certificate, "id">;

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  receivedAt: string;
};

const emptyForm: ProjectForm = {
  title: "",
  description: "",
  tech: "",
  accent: "cyan",
  image: "",
  projectUrl: "#",
  codeUrl: "#"
};

const emptyCertificateForm: CertificateForm = {
  title: "",
  issuer: "",
  issuedAt: "",
  category: "",
  imageUrl: "",
  fileUrl: "#"
};

const apiBase = "/api/projects";
const certificateApi = "/api/certificates";
const contactApi = "/api/contact";
const adminPassword = "Agayka123!";
const adminAccessKey = "portfolio-admin-access";

function markProjectsUpdated() {
  localStorage.setItem("portfolio-projects-updated", String(Date.now()));
}

function markCertificatesUpdated() {
  localStorage.setItem("portfolio-certificates-updated", String(Date.now()));
}

export default function AdminPage() {
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [adminAccessGranted, setAdminAccessGranted] = useState(false);
  const [adminAccessStatus, setAdminAccessStatus] = useState("Enter the admin password to continue.");
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [certificateForm, setCertificateForm] = useState<CertificateForm>(emptyCertificateForm);
  const [editingCertificateId, setEditingCertificateId] = useState<string | null>(null);
  const [certificateStatus, setCertificateStatus] = useState("Loading certificates...");
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messageStatus, setMessageStatus] = useState("Loading inbox...");
  const [status, setStatus] = useState("Loading projects...");
  const projectPanelRef = useRef<HTMLElement | null>(null);
  const totalTech = new Set(projects.flatMap((project) => project.tech)).size;

  useEffect(() => {
    setAdminAccessGranted(sessionStorage.getItem(adminAccessKey) === "granted");
  }, []);

  useEffect(() => {
    if (!adminAccessGranted) {
      return;
    }

    loadProjects();
    loadCertificates();
    loadMessages();
  }, [adminAccessGranted]);

  function unlockAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (adminPasswordInput === adminPassword) {
      sessionStorage.setItem(adminAccessKey, "granted");
      setAdminAccessGranted(true);
      setAdminAccessStatus("Access granted.");
      setAdminPasswordInput("");
      return;
    }

    setAdminAccessStatus("Incorrect password. Please try again.");
    setAdminPasswordInput("");
  }

  function loadProjects() {
    fetch(apiBase)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load projects");
        }
        return response.json() as Promise<Project[]>;
      })
      .then((data) => {
        setProjects(data);
        setStatus("Projects loaded. You can update your portfolio from here.");
      })
      .catch(() => {
        setStatus("Cannot load projects. Check that the Next dev server is running.");
      });
  }

  function loadCertificates() {
    fetch(certificateApi)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load certificates");
        }
        return response.json() as Promise<Certificate[]>;
      })
      .then((data) => {
        setCertificates(data);
        setCertificateStatus("Certificates loaded. You can add learning achievements from here.");
      })
      .catch(() => {
        setCertificateStatus("Cannot load certificates. Check that the Next dev server is running.");
      });
  }

  function loadMessages() {
    fetch(`${contactApi}?updated=${Date.now()}`, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load messages");
        }
        return response.json() as Promise<ContactMessage[]>;
      })
      .then((data) => {
        setMessages(data);
        setMessageStatus(data.length ? `${data.length} message${data.length === 1 ? "" : "s"} received.` : "No messages yet.");
      })
      .catch(() => {
        setMessageStatus("Cannot load messages. Check that the Next dev server is running.");
      });
  }

  function formatDate(value: string) {
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(value));
  }

  function updateField<Key extends keyof ProjectForm>(field: Key, value: ProjectForm[Key]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateCertificateField<Key extends keyof CertificateForm>(field: Key, value: CertificateForm[Key]) {
    setCertificateForm((current) => ({ ...current, [field]: value }));
  }

  function editProject(project: Project) {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      tech: project.tech.join(", "),
      accent: project.accent,
      image: project.image,
      projectUrl: project.projectUrl,
      codeUrl: project.codeUrl
    });
    projectPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function editCertificate(certificate: Certificate) {
    setEditingCertificateId(certificate.id);
    setCertificateForm({
      title: certificate.title,
      issuer: certificate.issuer,
      issuedAt: certificate.issuedAt,
      category: certificate.category,
      imageUrl: certificate.imageUrl,
      fileUrl: certificate.fileUrl
    });
  }

  function resetCertificateForm() {
    setEditingCertificateId(null);
    setCertificateForm(emptyCertificateForm);
  }

  function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const endpoint = editingId ? `${apiBase}/${editingId}` : apiBase;

    fetch(endpoint, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Save failed");
        }
        return response.json() as Promise<Project>;
      })
      .then(() => {
        setStatus(editingId ? "Project updated." : "Project added.");
        markProjectsUpdated();
        resetForm();
        loadProjects();
      })
      .catch(() => {
        setStatus("Save failed. Check that the Next dev server is running.");
      });
  }

  function deleteProject(id: string) {
    if (!window.confirm("Delete this project from your portfolio?")) {
      return;
    }

    fetch(`${apiBase}/${id}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Delete failed");
        }
        setStatus("Project deleted.");
        markProjectsUpdated();
        loadProjects();
      })
      .catch(() => {
        setStatus("Delete failed. Check that the Next dev server is running.");
      });
  }

  function saveCertificate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const endpoint = editingCertificateId ? `${certificateApi}/${editingCertificateId}` : certificateApi;

    fetch(endpoint, {
      method: editingCertificateId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(certificateForm)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Save failed");
        }
        return response.json() as Promise<Certificate>;
      })
      .then(() => {
        setCertificateStatus(editingCertificateId ? "Certificate updated." : "Certificate added.");
        markCertificatesUpdated();
        resetCertificateForm();
        loadCertificates();
      })
      .catch(() => {
        setCertificateStatus("Certificate save failed. Check that the Next dev server is running.");
      });
  }

  function deleteCertificate(id: string) {
    if (!window.confirm("Delete this certificate from your portfolio?")) {
      return;
    }

    fetch(`${certificateApi}/${id}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Delete failed");
        }
        setCertificateStatus("Certificate deleted.");
        markCertificatesUpdated();
        loadCertificates();
      })
      .catch(() => {
        setCertificateStatus("Certificate delete failed. Check that the Next dev server is running.");
      });
  }

  function deleteMessage(id: string) {
    if (!window.confirm("Delete this inbox message?")) {
      return;
    }

    fetch(`${contactApi}/${id}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Delete failed");
        }
        setMessageStatus("Message removed.");
        loadMessages();
      })
      .catch(() => {
        setMessageStatus("Message delete failed. Please try again.");
      });
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <a href="/" className="brand">
          <span>D</span>Daryl
        </a>
        <a className="secondary-button" href="/">
          View Portfolio
        </a>
      </header>

      {!adminAccessGranted ? (
        <section className="admin-lock-shell">
          <form className="admin-lock-card" onSubmit={unlockAdmin}>
            <p className="eyebrow">Admin Access</p>
            <h1>Password Required</h1>
            <label>
              Password
              <input
                autoFocus
                required
                type="password"
                value={adminPasswordInput}
                onChange={(event) => setAdminPasswordInput(event.target.value)}
                placeholder="Enter password"
              />
            </label>
            <button type="submit">Unlock Dashboard</button>
            <p className="form-status">{adminAccessStatus}</p>
          </form>
        </section>
      ) : (

      <section className="admin-shell">
        <div className="admin-hero">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Portfolio Dashboard</h1>
            <p>Review messages, clean up content, and update featured work from one place.</p>
          </div>
          <div className="admin-quick-actions">
            <a href="#admin-inbox">Inbox</a>
            <a href="#admin-projects">Projects</a>
            <a href="#admin-certificates">Certificates</a>
          </div>
        </div>

        <div className="admin-stat-grid">
          <article>
            <span>Projects</span>
            <strong>{projects.length}</strong>
            <small>Published cards</small>
          </article>
          <article>
            <span>Messages</span>
            <strong>{messages.length}</strong>
            <small>Inbox items</small>
          </article>
          <article>
            <span>Tech</span>
            <strong>{totalTech}</strong>
            <small>Unique tools</small>
          </article>
          <article>
            <span>Certificates</span>
            <strong>{certificates.length}</strong>
            <small>Learning records</small>
          </article>
        </div>

        <section className="admin-inbox" id="admin-inbox">
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">Inbox</p>
              <h2>Messages from your portfolio contact form.</h2>
            </div>
            <button type="button" onClick={loadMessages}>
              Refresh
            </button>
          </div>
          <p className="form-status">{messageStatus}</p>
          <div className="message-list">
            {messages.length ? messages.map((contactMessage) => (
              <article className="message-card" key={contactMessage.id}>
                <div className="message-card-head">
                  <div>
                    <strong>{contactMessage.name}</strong>
                    <a href={`mailto:${contactMessage.email}`}>{contactMessage.email}</a>
                  </div>
                  <time dateTime={contactMessage.receivedAt}>{formatDate(contactMessage.receivedAt)}</time>
                </div>
                <p>{contactMessage.message}</p>
                <div className="message-actions">
                  <a href={`mailto:${contactMessage.email}`}>Reply</a>
                  <button type="button" onClick={() => deleteMessage(contactMessage.id)}>
                    Delete
                  </button>
                </div>
              </article>
            )) : (
              <div className="admin-empty">No contact messages yet.</div>
            )}
          </div>
        </section>

        <section className="admin-project-panel" id="admin-certificates">
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">Certificates</p>
              <h2>{editingCertificateId ? "Edit selected certificate." : "Add or update certificates."}</h2>
            </div>
          </div>

          <form className="admin-form" onSubmit={saveCertificate}>
            <div className="admin-form-grid">
              <label>
                Certificate title
                <input
                  required
                  value={certificateForm.title}
                  onChange={(event) => updateCertificateField("title", event.target.value)}
                  placeholder="Back End Development"
                />
              </label>
              <label>
                Issuer
                <input
                  required
                  value={certificateForm.issuer}
                  onChange={(event) => updateCertificateField("issuer", event.target.value)}
                  placeholder="freeCodeCamp"
                />
              </label>
            </div>

            <div className="admin-form-grid">
              <label>
                Issued date
                <input
                  value={certificateForm.issuedAt}
                  onChange={(event) => updateCertificateField("issuedAt", event.target.value)}
                  placeholder="June 20, 2024"
                />
              </label>
              <label>
                Category
                <input
                  value={certificateForm.category}
                  onChange={(event) => updateCertificateField("category", event.target.value)}
                  placeholder="Backend Development"
                />
              </label>
            </div>

            <div className="admin-form-grid">
              <label>
                Preview image path
                <input
                  value={certificateForm.imageUrl}
                  onChange={(event) => updateCertificateField("imageUrl", event.target.value)}
                  placeholder="/certificates/backend.png"
                />
              </label>
              <label>
                Certificate link
                <input
                  value={certificateForm.fileUrl}
                  onChange={(event) => updateCertificateField("fileUrl", event.target.value)}
                  placeholder="/certificate.pdf"
                />
              </label>
            </div>

            <div className="admin-actions">
              <button type="submit">{editingCertificateId ? "Save Changes" : "Add Certificate"}</button>
              {editingCertificateId ? (
                <button type="button" className="ghost-button" onClick={resetCertificateForm}>
                  Cancel Edit
                </button>
              ) : null}
            </div>
            <p className="form-status">{certificateStatus}</p>
          </form>

          <div className="admin-list">
            {certificates.length ? certificates.map((certificate) => (
              <article className="admin-project" key={certificate.id}>
                <div>
                  <span>{certificate.issuer}</span>
                  <h2>{certificate.title}</h2>
                  <p>{certificate.category || "Certificate"} / {certificate.issuedAt || "Recent"}</p>
                  <small>{certificate.imageUrl || "No preview image yet"}</small>
                </div>
                <div className="admin-project-actions">
                  <button type="button" onClick={() => editCertificate(certificate)}>
                    Edit
                  </button>
                  <button type="button" className="danger-button" onClick={() => deleteCertificate(certificate.id)}>
                    Delete
                  </button>
                </div>
              </article>
            )) : (
              <div className="admin-empty">No certificates yet. Add your first certificate above.</div>
            )}
          </div>
        </section>

        <section className="admin-project-panel" id="admin-projects" ref={projectPanelRef}>
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">Projects</p>
              <h2>{editingId ? "Edit selected project." : "Add or update portfolio projects."}</h2>
            </div>
          </div>

          <form className="admin-form" onSubmit={saveProject}>
            <div className="admin-form-grid">
              <label>
                Project title
                <input
                  required
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="OptiFlow"
                />
              </label>
              <label>
                Accent
                <select
                  value={form.accent}
                  onChange={(event) => updateField("accent", event.target.value as Accent)}
                >
                  <option value="cyan">Cyan</option>
                  <option value="green">Green</option>
                  <option value="blue">Teal</option>
                  <option value="violet">Mint</option>
                </select>
              </label>
            </div>

            <label>
              Description
              <textarea
                required
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="Short, professional project summary"
              />
            </label>

            <div className="admin-form-grid">
              <label>
                Tech stack
                <input
                  required
                  value={form.tech}
                  onChange={(event) => updateField("tech", event.target.value)}
                  placeholder="Node.js, Express, MySQL, React"
                />
              </label>
              <label>
                Screenshot path
                <input
                  value={form.image}
                  onChange={(event) => updateField("image", event.target.value)}
                  placeholder="/tutor-match.png"
                />
              </label>
            </div>

            <div className="admin-form-grid">
              <label>
                Project link
                <input
                  value={form.projectUrl}
                  onChange={(event) => updateField("projectUrl", event.target.value)}
                  placeholder="https://your-demo-link.com"
                />
              </label>
              <label>
                Code link
                <input
                  value={form.codeUrl}
                  onChange={(event) => updateField("codeUrl", event.target.value)}
                  placeholder="https://github.com/your-repo"
                />
              </label>
            </div>

            <div className="admin-actions">
              <button type="submit">{editingId ? "Save Changes" : "Add Project"}</button>
              {editingId ? (
                <button type="button" className="ghost-button" onClick={resetForm}>
                  Cancel Edit
                </button>
              ) : null}
            </div>
            <p className="form-status">{status}</p>
          </form>

          <div className="admin-list">
            {projects.length ? projects.map((project) => (
              <article className="admin-project" key={project.id}>
                <div>
                  <span>{project.accent}</span>
                  <h2>{project.title}</h2>
                  <p>{project.description}</p>
                  <small>{project.tech.join(" / ")}</small>
                </div>
                <div className="admin-project-actions">
                  <button type="button" onClick={() => editProject(project)}>
                    Edit
                  </button>
                  <button type="button" className="danger-button" onClick={() => deleteProject(project.id)}>
                    Delete
                  </button>
                </div>
              </article>
            )) : (
              <div className="admin-empty">No projects yet. Add your first portfolio card above.</div>
            )}
          </div>
        </section>
      </section>
      )}
    </main>
  );
}
