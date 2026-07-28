"use client";

import React, { useState, useEffect, useRef } from "react";
import { GitHubIcon, LinkedInIcon, EmailIcon, KubernetesIcon } from "./Icons";

// Typing alternate effect for rolling titles
function TypingAlternate({ tokens }: { tokens: string[] }) {
  const [text, setText] = useState("");
  const [tokenIndex, setTokenIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let timer: NodeJS.Timeout | undefined = undefined;

    const run = async () => {
      const token = tokens[tokenIndex];

      // Type forward
      for (let i = 0; i <= token.length; i++) {
        if (!isMounted) return;
        setText(token.slice(0, i));
        await new Promise((r) => setTimeout(r, 80));
      }

      // Hold
      await new Promise((r) => setTimeout(r, 1500));

      // Erase
      for (let i = token.length; i >= 0; i--) {
        if (!isMounted) return;
        setText(token.slice(0, i));
        await new Promise((r) => setTimeout(r, 30));
      }

      // Next token
      if (isMounted) {
        setTokenIndex((prev) => (prev + 1) % tokens.length);
      }
    };

    run();

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [tokenIndex, tokens]);

  return (
    <div className="font-subheader text-[#89ff69] text-responsive-sub-h1 min-h-[1.5em] flex items-center">
      <span>{text}</span>
      <span className="inline-block w-[12px] h-[24px] bg-[#89ff69] ml-1 animate-pulse"></span>
    </div>
  );
}

// Letter sorting scramble effect for headings
function SortText({ children }: { children: string }) {
  const [displayText, setDisplayText] = useState(children);
  const [isScrambling, setIsScrambling] = useState(false);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890/&$%#@![]{}";
  const ref = useRef<HTMLDivElement>(null);

  const scramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);
    let iterations = 0;

    const interval = setInterval(() => {
      setDisplayText((prev) =>
        children
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iterations) return children[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iterations >= children.length) {
        clearInterval(interval);
        setIsScrambling(false);
        setDisplayText(children);
      }
      iterations += 1 / 3;
    }, 25);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          scramble();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [children]);

  return (
    <div
      ref={ref}
      onMouseOver={scramble}
      className="cursor-default select-none"
    >
      {displayText}
    </div>
  );
}

// Header with delimiters
function SectionHeader({ title }: { title: string }) {
  return (
    <header className="mb-6 md:mb-10 flex gap-4 font-subheader text-[#f2ff5b] text-responsive-h2 items-center">
      <SortText>{title}</SortText>
      <span className="text-[#89ff69] font-light">{"{"}</span>
    </header>
  );
}

function SectionFooter() {
  return (
    <footer className="mt-6 md:mt-10 font-subheader text-[#89ff69] text-responsive-h2 font-light">
      {"}"}
    </footer>
  );
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("landing");
  const [emailFormStatus, setEmailFormStatus] = useState<"idle" | "success" | "error">("idle");
  const [activeExpTab, setActiveExpTab] = useState(0);

  const sections = [
    { id: "landing", label: "Landing" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "work", label: "Work" },
    { id: "talk", label: "Talk" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];

  // Set up intersection observer for scroll indicators
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailFormStatus("idle");
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    // Simulated email service post
    try {
      // In production, this can call `/api/email` or an external service
      console.log("Email form submitted:", data);
      setEmailFormStatus("success");
      e.currentTarget.reset();
      setTimeout(() => setEmailFormStatus("idle"), 5000);
    } catch (err) {
      setEmailFormStatus("error");
      setTimeout(() => setEmailFormStatus("idle"), 5000);
    }
  };

  // Resume details from consolidated_resume_master_final_9yrs.pdf
  const skillsData = [
    {
      title: "DevSecOps & Security",
      skills: ["HashiCorp Vault", "Kyverno / OPA", "Trivy", "Snyk", "Cosign / Signature Verification", "Secret Management", "SAST/DAST", "CIS Benchmarks", "RBAC / IAM"],
    },
    {
      title: "Platform & Orchestration",
      skills: ["AWS (EKS, Lambda, S3, Athena, Route 53)", "GCP (GKE)", "Kubernetes", "Docker & Containerization", "Terraform & Infrastructure as Code", "Helm", "GitOps (ArgoCD)", "Ansible", "DevPod"],
    },
    {
      title: "Observability & SRE",
      skills: ["OpenTelemetry (Otel)", "Prometheus & Grafana", "Loki & Tempo (Traces/Logs)", "New Relic & Elastic APM", "Dynatrace", "ELK Stack", "Sentry", "SLOs / SLAs & Alerting"],
    },
    {
      title: "Data Streaming & CDC",
      skills: ["Apache Kafka", "Debezium", "Change Data Capture", "Event-Driven Architecture"],
    },
    {
      title: "Messaging & Databases",
      skills: ["EMQX", "MQTT", "Valkey", "Redis", "PostgreSQL", "MySQL", "MongoDB"],
    },
    {
      title: "Programming & Scripts",
      skills: ["Go / Golang", "Python", "Node.js", "Bash scripting", "SQL"],
    },
  ];

  const experienceData = [
    {
      company: "Paytm",
      role: "Senior Lead DevOps",
      period: "Jun 2021 – Present",
      location: "Gurgaon, India",
      bullets: [
        "Messaging Backbone Migration: Led the end-to-end migration of Paytm's critical messaging backbone to in-house EMQX (MQTT) and Apache Kafka on Kubernetes, handling petabyte-scale event ingestion and achieving $300K/month in cloud cost savings.",
        "Platform & Kubernetes Scale: Co-architected and scaled EKS/GKE platforms supporting AI-driven consumer apps with 99.99% availability, leveraging HPA/VPA and AWS Graviton migrations (200+ instances) for optimized autoscaling.",
        "Agentic DevOps & SecOps: Designed 'Agentic DevOps' initiatives using LLM-backed AI agents to automate complex migrations, automated security scans, configuration compliance testing, and custom Go/Python Kubernetes controllers.",
        "Deep Observability & Caching: Designed and scaled native OpenTelemetry (Otel) observability pipelines (Grafana/Tempo/Loki) for real-time trace propagation, and orchestrated zero-downtime caching layer migrations to Valkey.",
      ],
    },
    {
      company: "G4S IT Services",
      role: "DevOps consultant",
      period: "Jul 2018 – May 2021",
      location: "Gurgaon, India",
      bullets: [
        "Enterprise Cloud Modernization: Led cloud modernization initiatives on GCP for enterprise-scale platforms, focusing on high availability, secure API design, and resilient distributed systems.",
        "Application Performance Monitoring (APM): Implemented comprehensive application performance monitoring using New Relic, OpenTelemetry, and Elastic APM, improving system throughput by 50% through data-driven tuning.",
        "DevSecOps & Compliance: Strengthened platform security posture and compliance across hybrid environments, integrating automated security guardrails (RBAC, TLS, secrets management, vulnerability scans) into CI/CD pipelines.",
      ],
    },
    {
      company: "Jugnoo / Clicklabs",
      role: "DevOps Engineer",
      period: "Jan 2017 – Jun 2018",
      location: "Chandigarh, India",
      bullets: [
        "High Availability & Failover: Owned DevOps for consumer-facing platforms, designing robust multi-AZ failover architectures using AWS (EC2, Route 53, ELB) to ensure 99.99% availability.",
        "Infrastructure Automation & SRE: Automated infrastructure provisioning and multi-AZ failover using Terraform/Bash, reducing MTTR and manual overhead, and built end-to-end alerting systems.",
      ],
    },
  ];

  const projectsData = [
    {
      name: "EMQX Messaging Migration",
      description: "Migration of Paytm's critical messaging backbone to EMQX/Kafka on K8s, handling petabyte-scale event ingestion and saving $300K/month.",
      tags: ["EMQX", "MQTT", "Kafka", "Kubernetes", "FinOps"],
    },
    {
      name: "DevSecOps GitOps Pipeline",
      description: "Designed secure GitOps deployment pipelines with automated Kyverno policies, Snyk vulnerability scanning, Cosign signature validation, and Vault secrets integration.",
      tags: ["DevSecOps", "Vault", "Kyverno", "ArgoCD", "Kubernetes"],
    },
    {
      name: "Agentic DevOps Platform",
      description: "Autonomous LLM-backed DevOps agents that automate complex infrastructure migration, system monitoring, and Jira epic grooming.",
      tags: ["LLM", "LangChain", "Agentic SDLC", "Python"],
    },
    {
      name: "Valkey Caching Layer",
      description: "Zero-downtime migration of Paytm's high-throughput caching layers to Valkey on Kubernetes, optimizing memory layouts and system latency.",
      tags: ["Valkey", "Redis", "Kubernetes", "SRE"],
    },
  ];

  const rollingTitles = [
    "SENIOR LEAD PLATFORM ENGINEER",
    "DEVSECOPS & SECURITY SPECIALIST",
    "SRE & AI INFRASTRUCTURE",
    "AGENTIC DEVOPS EXPERT",
    "MULTI-CLOUD ARCHITECT",
    "KUBERNETES & GITOPS CHAMPION",
  ];

  return (
    <div className="flex w-full select-none bg-[#0c0c0c] text-[#e1e1e1] font-main relative">
      {/* Background blobs */}
      <div className="blob-container fixed inset-0 z-0 overflow-hidden">
        <div className="blob-primary absolute -left-[10%] -top-[10%] h-[60vh] w-[60vw] rounded-full blur-[100px]"></div>
        <div className="blob-secondary absolute -right-[10%] -bottom-[10%] h-[70vh] w-[70vw] rounded-full blur-[120px]"></div>
      </div>

      {/* Desktop fixed sidebar */}
      <div className="fixed left-0 top-0 z-30 hidden w-full items-center justify-between bg-[#0c0c0c]/80 backdrop-blur-md px-6 py-4 md:flex lg:px-24 xl:px-40 py-6 border-b border-[#262626]">
        <div
          onClick={() => handleNavClick("landing")}
          className="font-headers text-xl font-bold cursor-pointer text-[#f2ff5b] hover:text-[#89ff69] transition-colors"
        >
          HY.DEV
        </div>
        <nav className="flex gap-8 uppercase font-terminal text-sm">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => handleNavClick(s.id)}
              className={`cursor-pointer transition-colors hover:text-[#f2ff5b] ${
                activeSection === s.id ? "text-[#89ff69] font-bold" : "text-[#c9c9c9]"
              }`}
            >
              {s.label}
            </button>
          ))}
          <a
            href="/resume.pdf"
            target="_blank"
            className="text-[#f2ff5b] hover:text-[#89ff69] transition-colors font-bold cursor-pointer"
          >
            RESUME
          </a>
        </nav>
      </div>

      {/* Mobile fixed header */}
      <div className="fixed left-0 top-0 z-30 flex w-full items-center justify-between bg-[#0c0c0c]/90 backdrop-blur px-6 py-4 md:hidden border-b border-[#262626]">
        <div
          onClick={() => handleNavClick("landing")}
          className="font-headers text-lg font-bold cursor-pointer text-[#f2ff5b]"
        >
          HY.DEV
        </div>
        <a
          href="/resume.pdf"
          target="_blank"
          className="text-xs text-[#89ff69] border border-[#89ff69]/30 rounded px-2 py-1 font-terminal"
        >
          RESUME
        </a>
      </div>

      {/* Fixed Scroll Dots (Right hand side) */}
      <div className="fixed right-6 lg:right-16 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-4 md:flex">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => handleNavClick(s.id)}
            title={s.label}
            className={`h-3 w-3 rounded-full border transition-all ${
              activeSection === s.id
                ? "bg-[#89ff69] border-[#89ff69] scale-125"
                : "border-[#c9c9c9] hover:bg-[#f2ff5b]/50 hover:border-[#f2ff5b]"
            }`}
          ></button>
        ))}
      </div>

      {/* Main Single Page Scroll-Snap Container */}
      <main className="scroll-snap-container w-full z-10">
        
        {/* LANDING SECTION */}
        <section
          id="landing"
          className="scroll-snap-section flex flex-col justify-center px-6 md:px-20 lg:px-28 xl:px-40 pt-16 md:pt-0"
        >
          <div className="max-w-4xl flex flex-col gap-6">
            <h1 className="font-headers text-responsive-h1 font-bold text-[#f2ff5b] leading-tight select-none">
              Himanshu Yadav
            </h1>
            <TypingAlternate tokens={rollingTitles} />
            <p className="text-responsive-h5 text-[#c9c9c9] max-w-2xl leading-relaxed font-light">
              Senior Lead Platform, SRE, and AI Infrastructure Engineer with 9 years of experience in building production-grade agentic platforms, event-driven messaging networks, and cost-efficient multi-cloud systems.
            </p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleNavClick("contact")}
                className="bg-[#89ff69] text-[#0c0c0c] hover:bg-[#f2ff5b] px-6 py-3 rounded-lg font-bold font-terminal transition-all shadow-lg shadow-[#89ff69]/10 hover:shadow-[#f2ff5b]/20 cursor-pointer"
              >
                Contact Me
              </button>
              <button
                onClick={() => handleNavClick("about")}
                className="border border-[#e1e1e1]/30 hover:border-[#89ff69] px-6 py-3 rounded-lg font-bold font-terminal transition-all cursor-pointer hover:text-[#89ff69]"
              >
                About Me
              </button>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section
          id="about"
          className="scroll-snap-section flex flex-col justify-center px-6 md:px-20 lg:px-28 xl:px-40"
        >
          <div className="max-w-5xl">
            <SectionHeader title="ABOUT" />
            <div className="flex flex-col gap-8 md:flex-row md:gap-16 xl:gap-24">
              <div className="flex-1 flex flex-col gap-6">
                <p className="text-[#89ff69] font-subheader text-responsive-h4 leading-snug">
                  Platform, SRE & AI Infrastructure architect specializing in production-grade reliability.
                </p>
                <div className="flex items-center gap-3 text-[#c9c9c9] font-terminal border border-[#262626] rounded-lg p-4 bg-[#141414]/30 w-fit">
                  <KubernetesIcon className="text-[#89ff69] animate-spin-slow" />
                  <span>Platform & SRE Architect</span>
                </div>
                <div className="flex flex-col gap-1.5 font-terminal text-sm text-[#c9c9c9] border border-[#262626] rounded-lg p-4 bg-[#141414]/30 w-fit">
                  <div className="text-[#f2ff5b] font-bold">EDUCATION</div>
                  <div>B.Tech in Computer Science</div>
                  <div className="opacity-80 text-xs">I.E.T, Alwar | 2013 – 2017</div>
                </div>
              </div>
              <div className="flex-[1.5] flex flex-col gap-6 text-[#c9c9c9] text-responsive-h5 font-light leading-relaxed">
                <p>
                  Ever since graduating in Computer Science in 2017, I have been obsessed with scalable systems. That passion evolved into a career managing high-traffic real-time infrastructures supporting millions of users.
                </p>
                <p>
                  I believe in active production ownership and data-driven SRE. From migrating petabyte-scale event pipelines to designing autonomous LLM-backed DevOps agents, I strive to eliminate operational toil and engineer bulletproof platforms.
                </p>
              </div>
            </div>
            <SectionFooter />
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section
          id="skills"
          className="scroll-snap-section flex flex-col justify-center px-6 md:px-20 lg:px-28 xl:px-40"
        >
          <div className="max-w-5xl">
            <SectionHeader title="SKILLS" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {skillsData.map((category) => (
                <div
                  key={category.title}
                  className="border border-[#262626] rounded-lg p-5 bg-[#141414]/40 hover:border-[#89ff69]/50 transition-colors"
                >
                  <h3 className="font-subheader text-responsive-h5 text-[#f2ff5b] mb-4">
                    {category.title}
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {category.skills.map((s) => (
                      <li
                        key={s}
                        className="bg-[#262626]/40 border border-[#262626] rounded px-3 py-1 font-terminal text-sm text-[#e1e1e1]"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <SectionFooter />
          </div>
        </section>

        {/* WORK SECTION */}
        <section
          id="work"
          className="scroll-snap-section flex flex-col justify-center px-6 md:px-20 lg:px-28 xl:px-40"
        >
          <div className="max-w-5xl w-full">
            <SectionHeader title="WORK" />
            <div className="flex flex-col md:flex-row gap-6 md:gap-12 min-h-[40vh] md:min-h-[50vh]">
              {/* Tabs list */}
              <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible border-b md:border-b-0 md:border-l border-[#262626] font-terminal text-sm md:text-base whitespace-nowrap md:whitespace-normal md:min-w-[180px]">
                {experienceData.map((exp, index) => (
                  <button
                    key={exp.company}
                    onClick={() => setActiveExpTab(index)}
                    className={`px-4 py-2.5 text-left border-b-2 md:border-b-0 md:border-l-2 transition-all cursor-pointer ${
                      activeExpTab === index
                        ? "text-[#89ff69] border-[#89ff69] bg-[#141414]/30"
                        : "text-[#c9c9c9] border-transparent hover:text-[#f2ff5b] hover:bg-[#141414]/10"
                    }`}
                  >
                    {exp.company}
                  </button>
                ))}
              </div>

              {/* Tab content panel */}
              <div className="flex-1 flex flex-col gap-4 bg-[#141414]/20 border border-[#262626] rounded-lg p-6 overflow-y-auto max-h-[42vh] md:max-h-[50vh] scrollbar-thin">
                <div>
                  <h3 className="font-headers text-responsive-h4 text-[#f2ff5b]">
                    {experienceData[activeExpTab].role}
                  </h3>
                  <div className="font-terminal text-[#89ff69] text-xs md:text-sm mt-1">
                    {experienceData[activeExpTab].company} | {experienceData[activeExpTab].period} | {experienceData[activeExpTab].location}
                  </div>
                </div>
                <ul className="text-[#c9c9c9] text-sm md:text-base leading-relaxed flex flex-col gap-2.5 list-disc pl-4 font-light">
                  {experienceData[activeExpTab].bullets.map((bullet, idx) => (
                    <li key={idx} className="hover:text-[#e1e1e1] transition-colors">{bullet}</li>
                  ))}
                </ul>
              </div>
            </div>
            <SectionFooter />
          </div>
        </section>

        {/* TALK SECTION */}
        <section
          id="talk"
          className="scroll-snap-section flex flex-col justify-center items-center px-6 md:px-20"
        >
          <div className="text-center max-w-4xl flex flex-col gap-6">
            <h2 className="font-headers text-[7vw] md:text-[5vw] font-extralight text-[#f2ff5b] leading-tight">
              “SIMPLICITY IS PREREQUISITE FOR RELIABILITY.”
            </h2>
            <div className="font-terminal text-[#89ff69] text-responsive-h4 mt-4">
              - Edsger W. Dijkstra
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section
          id="projects"
          className="scroll-snap-section flex flex-col justify-center px-6 md:px-20 lg:px-28 xl:px-40"
        >
          <div className="max-w-5xl">
            <SectionHeader title="PROJECTS" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projectsData.map((project) => (
                <div
                  key={project.name}
                  className="border border-[#262626] rounded-lg p-6 bg-[#141414]/50 flex flex-col justify-between hover:border-[#89ff69] transition-all"
                >
                  <div>
                    <h3 className="font-headers text-responsive-h4 text-[#f2ff5b] mb-3">
                      {project.name}
                    </h3>
                    <p className="text-[#c9c9c9] text-responsive-h5 font-light leading-relaxed mb-4">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#0c0c0c] border border-[#262626] rounded px-2.5 py-0.5 font-terminal text-xs text-[#89ff69]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <SectionFooter />
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section
          id="contact"
          className="scroll-snap-section flex flex-col justify-center px-6 md:px-20 lg:px-28 xl:px-40"
        >
          <div className="max-w-5xl w-full">
            <SectionHeader title="CONTACT" />
            <div className="flex flex-col gap-10 md:flex-row">
              <div className="flex-1 flex flex-col gap-6">
                <h3 className="font-headers text-responsive-h3 text-[#f2ff5b]">
                  Have a system in mind?
                </h3>
                <p className="text-[#c9c9c9] text-responsive-h5 font-light leading-relaxed">
                  My inbox is always open. Whether you have a platform challenge, questions about agentic infrastructure, or want to collaborate.
                </p>
                
                <div className="flex flex-col gap-4 font-terminal mt-6 text-base">
                  <a
                    href="mailto:himanshuyadav2k16@gmail.com"
                    className="flex w-fit items-center gap-3 text-[#c9c9c9] hover:text-[#89ff69] transition-colors"
                  >
                    <EmailIcon className="text-[#89ff69]" />
                    <span>himanshuyadav2k16@gmail.com</span>
                  </a>
                  <a
                    href="https://linkedin.com/in/himanshu-y/"
                    target="_blank"
                    className="flex w-fit items-center gap-3 text-[#c9c9c9] hover:text-[#89ff69] transition-colors"
                  >
                    <LinkedInIcon className="text-[#89ff69]" />
                    <span>linkedin.com/in/himanshu-y/</span>
                  </a>
                  <a
                    href="https://github.com/himanshu-y"
                    target="_blank"
                    className="flex w-fit items-center gap-3 text-[#c9c9c9] hover:text-[#89ff69] transition-colors"
                  >
                    <GitHubIcon className="text-[#89ff69]" />
                    <span>github.com/himanshu-y</span>
                  </a>
                </div>
              </div>
              
              <div className="flex-1">
                <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-terminal text-sm text-[#89ff69]">Email</label>
                    <input
                      required
                      type="email"
                      name="email"
                      placeholder="email@example.com"
                      className="w-full rounded-lg border border-[#262626] bg-[#141414]/50 px-4 py-2.5 text-[#e1e1e1] placeholder-[#a0a0a0] focus:border-[#89ff69] focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-terminal text-sm text-[#89ff69]">Subject</label>
                    <input
                      required
                      type="text"
                      name="subject"
                      placeholder="System Architecture Consult"
                      className="w-full rounded-lg border border-[#262626] bg-[#141414]/50 px-4 py-2.5 text-[#e1e1e1] placeholder-[#a0a0a0] focus:border-[#89ff69] focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-terminal text-sm text-[#89ff69]">Message</label>
                    <textarea
                      required
                      name="message"
                      rows={4}
                      placeholder="Hello, I'd like to discuss..."
                      className="w-full rounded-lg border border-[#262626] bg-[#141414]/50 px-4 py-2.5 text-[#e1e1e1] placeholder-[#a0a0a0] focus:border-[#89ff69] focus:outline-none transition-colors resize-none"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-[#89ff69] text-[#0c0c0c] hover:bg-[#f2ff5b] py-3 rounded-lg font-bold font-terminal transition-all cursor-pointer mt-2"
                  >
                    Submit
                  </button>

                  {emailFormStatus === "success" && (
                    <div className="text-[#89ff69] font-terminal text-sm mt-2 text-center animate-fade-in">
                      Message sent successfully! I will reply soon.
                    </div>
                  )}
                </form>
              </div>
            </div>
            <SectionFooter />
          </div>
        </section>
      </main>
    </div>
  );
}
