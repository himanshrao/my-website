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
  const [focusedExperience, setFocusedExperience] = useState<number | null>(null);

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

  // Resume details from consolidated_resume_master.md
  const skillsData = [
    {
      title: "AI & Agentic Systems",
      skills: ["LangChain", "LangGraph", "Agentic SDLC", "LLM Canary Analysis", "Vector Stores & RAG", "MCP (Model Context)", "LangSmith / Observability"],
    },
    {
      title: "Cloud & Orchestration",
      skills: ["Kubernetes (EKS/GKE)", "Terraform & IaC", "ArgoCD & GitOps", "Docker & Helm", "AWS & GCP Cloud", "Ansible & DevPod"],
    },
    {
      title: "Observability & SRE",
      skills: ["OpenTelemetry (Otel)", "Prometheus & Grafana", "Tempo & Loki (Traces)", "New Relic & Elastic APM", "SLO/SLA Performance", "Linux System Debugging"],
    },
    {
      title: "Messaging & State",
      skills: ["Apache Kafka", "EMQX & MQTT Backbone", "Valkey / Redis Clusters", "PostgreSQL", "SQL Datastores"],
    },
    {
      title: "Programming",
      skills: ["Go / Golang", "Python", "Node.js (TS/JS)", "Bash scripting"],
    },
  ];

  const experienceData = [
    {
      company: "Paytm",
      role: "Senior Lead SRE & AI Infrastructure Engineer",
      period: "Jun 2021 – Present",
      location: "Gurgaon, India",
      bullets: [
        "Led critical messaging backbone migration to EMQX (MQTT) and Apache Kafka on Kubernetes, handling petabyte-scale event ingestion and saving $300K/month.",
        "Architected and scaled high-throughput EKS/GKE Kubernetes platforms supporting AI-driven consumer apps with 99.99% availability.",
        "Designed 'Agentic DevOps' initiatives using LLM-backed AI agents to automate complex migrations, monitoring, testing, and ticket grooming.",
        "Designed and scaled native OpenTelemetry pipelines with Grafana Tempo/Loki for real-time trace propagation and incident resolution.",
        "Orchestrated zero-downtime migration of high-throughput caching layers to Valkey on Kubernetes.",
        "Optimized infrastructure cost via AWS Graviton migration for 200+ production instances.",
      ],
    },
    {
      company: "G4S IT Services",
      role: "DevOps & Observability Consultant",
      period: "Jul 2018 – May 2021",
      location: "Gurgaon, India",
      bullets: [
        "Led GCP cloud modernization for enterprise-scale platforms, focusing on high availability, secure API design, and resilient distributed systems.",
        "Implemented APM using New Relic, OpenTelemetry, and Elastic APM, improving system throughput by 50% through data-driven tuning.",
        "Strengthened security postures, integrating RBAC, TLS, and secrets management into CI/CD pipelines.",
      ],
    },
    {
      company: "Jugnoo / Clicklabs",
      role: "DevOps Engineer",
      period: "Jan 2017 – Jun 2018",
      location: "Chandigarh, India",
      bullets: [
        "Owned DevOps for consumer platforms, designing robust multi-AZ failover architectures using AWS to ensure 99.99% availability.",
        "Automated provisioning and failover using Terraform and Bash, significantly reducing MTTR and manual overhead.",
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
      name: "Agentic DevOps Platform",
      description: "Autonomous LLM-backed DevOps agents that automate complex infrastructure migration, system monitoring, and Jira epic grooming.",
      tags: ["LLM", "LangChain", "Agentic SDLC", "Python"],
    },
    {
      name: "Valkey Caching Layer",
      description: "Zero-downtime migration of Paytm's high-throughput caching layers to Valkey on Kubernetes, optimizing memory layouts and system latency.",
      tags: ["Valkey", "Redis", "Kubernetes", "SRE"],
    },
    {
      name: "FinOps Graviton Migration",
      description: "Platform migration of 200+ EKS nodes to AWS Graviton, optimizing LLM token cost metrics and reducing infrastructure spend.",
      tags: ["AWS Graviton", "Athena", "Cloud Cost", "S3"],
    },
  ];

  const rollingTitles = [
    "SENIOR LEAD PLATFORM ENGINEER",
    "SRE & AI INFRASTRUCTURE",
    "AGENTIC DEVOPS EXPERT",
    "MULTI-CLOUD ARCHITECT",
    "FINOPS CHAMPION",
    "KUBERNETES SPECIALIST",
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
              Senior Lead Platform, SRE, and AI Infrastructure Engineer with 8+ years of experience in building production-grade agentic platforms, event-driven messaging networks, and cost-efficient multi-cloud systems.
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
                  <span>I run in production btw</span>
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
            <div className="relative flex flex-col gap-6 md:flex-row border-l md:border-l-0 md:border-t border-[#262626] pt-0 md:pt-8 pl-4 md:pl-0">
              {experienceData.map((exp, index) => (
                <div
                  key={exp.company}
                  onMouseEnter={() => setFocusedExperience(index)}
                  onMouseLeave={() => setFocusedExperience(null)}
                  className={`flex-1 relative cursor-default transition-all pb-6 md:pb-0 ${
                    focusedExperience === null || focusedExperience === index
                      ? "opacity-100"
                      : "opacity-40"
                  }`}
                >
                  {/* Decorative timeline node */}
                  <div className="absolute -left-[21px] md:-left-0 top-[2px] md:-top-[38px] h-3 w-3 rounded-full bg-[#89ff69]"></div>
                  
                  <h3 className="font-headers text-responsive-h4 text-[#f2ff5b]">
                    {exp.company}
                  </h3>
                  <div className="font-terminal text-sm text-[#89ff69] mt-1 mb-3">
                    {exp.role} | {exp.period}
                  </div>
                  <ul className="text-[#c9c9c9] text-sm md:text-base leading-relaxed flex flex-col gap-2 list-disc pl-4 font-light">
                    {exp.bullets.slice(0, 3).map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
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
