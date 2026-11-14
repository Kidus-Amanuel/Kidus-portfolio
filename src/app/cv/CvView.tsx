"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CvData } from "@/lib/cv-data";
import Link from "next/link";

export function CvView({ data }: { data: CvData }) {
  const searchParams = useSearchParams();
  const { profile, experience, education, skills, projects, certifications } = data;

  useEffect(() => {
    if (searchParams.get("print") === "true") {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const websiteDisplay = profile.websiteUrl
    ? profile.websiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : "kidus-portfolio-gray.vercel.app";

  const websiteHref = profile.websiteUrl || "https://kidus-portfolio-gray.vercel.app";

  return (
    <>
      {/* External Web Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap"
        rel="stylesheet"
      />

      <style jsx global>{`
        :root {
          --ink: #111827;
          --muted: #6b7280;
          --accent: #1e3a5f;
          --hair: #e5e7eb;
          --paper: #ffffff;
          --bg: #0b1220;
          --serif: "Playfair Display", Georgia, "Times New Roman", serif;
          --sans: Inter, system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
        }

        body {
          margin: 0;
          background: var(--bg);
          font-family: var(--sans);
          color: var(--ink);
          font-size: 13px;
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
        }

        nav,
        .navbar {
          display: none !important;
        }

        .cv-toolbar {
          max-width: 840px;
          margin: 20px auto 0;
          padding: 0 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cv-btn-back {
          font: 500 13px var(--sans);
          color: #94a3b8;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s;
        }

        .cv-btn-back:hover {
          color: #ffffff;
        }

        .cv-btn-print {
          font: 600 13px var(--sans);
          background: #2563eb;
          color: #ffffff;
          border: 0;
          border-radius: 999px;
          padding: 10px 22px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: opacity 0.2s, transform 0.1s;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .cv-btn-print:hover {
          opacity: 0.95;
          transform: translateY(-1px);
        }

        .cv-paper {
          max-width: 840px;
          margin: 16px auto 40px;
          background: var(--paper);
          color: var(--ink);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.35);
          position: relative;
          border-radius: 4px;
          overflow: hidden;
        }

        .cv-top-bar {
          height: 6px;
          background: var(--accent);
        }

        .cv-inner {
          padding: 38px 48px 30px;
        }

        .cv-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          flex-wrap: wrap;
        }

        h1.cv-name {
          font: 700 38px/1.1 var(--serif);
          color: var(--ink);
          margin: 0;
          letter-spacing: -0.5px;
        }

        .cv-role {
          margin-top: 6px;
          font-weight: 600;
          font-size: 12.5px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--accent);
        }

        .cv-contact {
          text-align: right;
          font-size: 12px;
          color: var(--muted);
          line-height: 1.6;
        }

        .cv-contact a {
          color: var(--accent);
          text-decoration: none;
          font-weight: 500;
        }

        .cv-contact a:hover {
          text-decoration: underline;
        }

        .cv-rule {
          border: 0;
          border-top: 1px solid var(--hair);
          margin: 18px 0;
        }

        h2.cv-section-title {
          font: 600 12px var(--sans);
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: var(--accent);
          margin: 22px 0 10px;
          padding-bottom: 5px;
          border-bottom: 1px solid var(--hair);
          break-after: avoid;
        }

        .cv-entry {
          margin-bottom: 14px;
          break-inside: avoid;
        }

        .cv-line {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: baseline;
        }

        .cv-org {
          font-weight: 600;
          font-size: 13.5px;
          color: var(--ink);
        }

        .cv-date {
          font-size: 12px;
          color: var(--muted);
          white-space: nowrap;
        }

        .cv-title {
          font: italic 600 13px var(--serif);
          color: #374151;
          margin-top: 2px;
        }

        ul.cv-bullets {
          margin: 6px 0 0;
          padding: 0;
          list-style: none;
        }

        ul.cv-bullets li {
          position: relative;
          padding-left: 14px;
          margin-bottom: 3px;
          font-size: 12.5px;
          color: #374151;
          line-height: 1.45;
        }

        ul.cv-bullets li::before {
          content: "";
          position: absolute;
          left: 2px;
          top: 0.6em;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--accent);
        }

        .cv-skills-grid {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 6px 12px;
          font-size: 12.5px;
          line-height: 1.45;
        }

        .cv-skills-grid b {
          font-weight: 600;
          color: var(--ink);
        }

        .cv-skills-grid span {
          color: #374151;
        }

        .cv-tech {
          font-size: 11.5px;
          color: var(--muted);
        }

        .cv-live-link {
          font-size: 11.5px;
          font-weight: 600;
          margin-left: 8px;
          color: var(--accent);
          text-decoration: none;
        }

        .cv-live-link:hover {
          text-decoration: underline;
        }

        p.cv-summary {
          margin: 4px 0 0;
          color: #374151;
          font-size: 12.5px;
          line-height: 1.55;
        }

        footer.cv-sheet-foot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin: 0 48px;
          padding: 12px 0 20px;
          border-top: 0.75px solid var(--hair);
          font-size: 10.5px;
          color: var(--muted);
        }

        footer.cv-sheet-foot span {
          flex: 1;
        }

        footer.cv-sheet-foot span:nth-child(2) {
          text-align: center;
        }

        footer.cv-sheet-foot span:nth-child(3) {
          text-align: right;
        }

        footer.cv-sheet-foot a {
          color: var(--accent);
          text-decoration: none;
        }

        @media (max-width: 600px) {
          .cv-inner {
            padding: 24px 20px;
          }
          h1.cv-name {
            font-size: 30px;
          }
          .cv-contact {
            text-align: left;
          }
          .cv-skills-grid {
            grid-template-columns: 1fr;
          }
          footer.cv-sheet-foot {
            margin: 0 20px;
            flex-direction: column;
            align-items: flex-start;
          }
          footer.cv-sheet-foot span {
            text-align: left !important;
          }
        }

        @page {
          size: A4;
          margin: 14mm 12mm 16mm;
          @bottom-left {
            content: "Kidus Amanuel · Curriculum Vitae";
            font: 7.5pt Inter, Arial, sans-serif;
            color: #6b7280;
          }
          @bottom-center {
            content: "${websiteDisplay}";
            font: 7.5pt Inter, Arial, sans-serif;
            color: #1e3a5f;
          }
          @bottom-right {
            content: "Page " counter(page) " of " counter(pages);
            font: 7.5pt Inter, Arial, sans-serif;
            color: #6b7280;
          }
        }

        @media print {
          html {
            padding: 0;
          }
          body {
            background: #fff !important;
            font-size: 10pt;
          }
          .cv-toolbar {
            display: none !important;
          }
          .cv-paper {
            margin: 0 !important;
            max-width: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          .cv-inner {
            padding: 0 !important;
          }
          .cv-top-bar {
            height: 4pt !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          h1.cv-name {
            font-size: 26pt !important;
          }
          .cv-inner {
            padding-top: 10pt !important;
          }
          footer.cv-sheet-foot {
            margin: 0 !important;
            padding: 8px 0 0 !important;
            border-top: 0.5pt solid #e5e7eb !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* Floating Toolbar (Hidden when printing) */}
      <div className="cv-toolbar">
        <Link href="/" className="cv-btn-back">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Portfolio
        </Link>
        <button className="cv-btn-print" onClick={() => window.print()}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PDF / Print
        </button>
      </div>

      {/* Main Printable Sheet */}
      <main className="cv-paper">
        <div className="cv-top-bar" />
        <div className="cv-inner">
          <header>
            <div className="cv-header-row">
              <div>
                <h1 className="cv-name">{profile.fullName}</h1>
                <div className="cv-role">{profile.headline}</div>
              </div>
              <div className="cv-contact">
                {profile.contactEmail && (
                  <>
                    <a href={`mailto:${profile.contactEmail}`}>{profile.contactEmail}</a>
                    <br />
                  </>
                )}
                {profile.phone && (
                  <>
                    <span>{profile.phone}</span>
                    <br />
                  </>
                )}
                {profile.location && (
                  <>
                    <span>{profile.location}</span>
                    <br />
                  </>
                )}
                <span>
                  <a href={websiteHref} target="_blank" rel="noreferrer">
                    {websiteDisplay}
                  </a>
                  {profile.linkedinUrl && (
                    <>
                      {" · "}
                      <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">
                        LinkedIn
                      </a>
                    </>
                  )}
                  {profile.githubUrl && (
                    <>
                      {" · "}
                      <a href={profile.githubUrl} target="_blank" rel="noreferrer">
                        GitHub
                      </a>
                    </>
                  )}
                </span>
              </div>
            </div>
            <hr className="cv-rule" />
          </header>

          {/* Summary */}
          {profile.summary && (
            <section>
              <h2 className="cv-section-title" style={{ marginTop: 0 }}>
                Summary
              </h2>
              <p className="cv-summary">{profile.summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <h2 className="cv-section-title">Experience</h2>
              {experience.map((exp) => (
                <div key={exp.id} className="cv-entry">
                  <div className="cv-line">
                    <span className="cv-org">{exp.company}</span>
                    <span className="cv-date">
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                  <div className="cv-title">{exp.role}</div>
                  {exp.bullets.length > 0 ? (
                    <ul className="cv-bullets">
                      {exp.bullets.map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="cv-summary">{exp.description}</p>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className="cv-section-title">Technical Skills</h2>
              <div className="cv-skills-grid">
                {skills.map((group, i) => (
                  <React.Fragment key={i}>
                    <b>{group.category}</b>
                    <span>{group.skills.join(", ")}</span>
                  </React.Fragment>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section>
              <h2 className="cv-section-title">Key Projects</h2>
              {projects.map((proj) => (
                <div key={proj.id} className="cv-entry">
                  <div className="cv-line">
                    <span>
                      <span className="cv-org">{proj.title}</span>
                      {proj.link && (
                        <a className="cv-live-link" href={proj.link} target="_blank" rel="noreferrer">
                          [Live]
                        </a>
                      )}
                      {proj.github && (
                        <a className="cv-live-link" href={proj.github} target="_blank" rel="noreferrer">
                          [Code]
                        </a>
                      )}
                    </span>
                    {proj.tags && proj.tags.length > 0 && (
                      <span className="cv-tech">{proj.tags.join(" · ")}</span>
                    )}
                  </div>
                  <p className="cv-summary">{proj.description}</p>
                </div>
              ))}
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="cv-section-title">Education</h2>
              {education.map((edu) => (
                <div key={edu.id} className="cv-entry">
                  <div className="cv-line">
                    <span className="cv-org">{edu.school}</span>
                    <span className="cv-date">
                      {edu.startDate} – {edu.endDate}
                    </span>
                  </div>
                  <div className="cv-title">{edu.degree}</div>
                  {edu.description && <p className="cv-summary">{edu.description}</p>}
                </div>
              ))}
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section>
              <h2 className="cv-section-title">Certifications &amp; Awards</h2>
              {certifications.map((cert) => (
                <div key={cert.id} className="cv-line" style={{ marginBottom: 6 }}>
                  <span className="cv-org">
                    {cert.name} · {cert.issuer}
                  </span>
                  <span className="cv-date">{cert.date}</span>
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Sheet Footer */}
        <footer className="cv-sheet-foot">
          <span>{profile.fullName} · Curriculum Vitae</span>
          <span>
            <a href={websiteHref} target="_blank" rel="noreferrer">
              {websiteDisplay}
            </a>
          </span>
          <span>Page 1 of 1</span>
        </footer>
      </main>
    </>
  );
}
