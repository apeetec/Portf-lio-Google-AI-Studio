/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { Github, Linkedin, Mail, Twitter, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ParticleWave = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    let isVisible = true;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener("resize", resize);
    resize();

    const render = () => {
      if (!isVisible) return;
      time += 0.002; // Slightly slower for a calmer feel
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";

      // Position the mesh further to the right
      const cx = canvas.width * 0.85;
      const cy = canvas.height * 0.5;

      // Optimization: Reduce number of rings and increase spacing
      const numRings = 40; // Was 80
      const ringSpacing = 14; // Was 8
      const dotSpacing = 10; // Was 6

      for (let i = 0; i < numRings; i++) {
        const radius = i * ringSpacing;
        const numDots = Math.max(10, Math.floor((Math.PI * 2 * radius) / dotSpacing));
        
        for (let j = 0; j < numDots; j++) {
          const angle = (j / numDots) * Math.PI * 2;
          
          // Complex wavy surface math
          const z = Math.sin(angle * 3 + time) * 50 + Math.cos(i * 0.1 - time) * 50;
          const scale = 800 / (800 + z);
          
          // Tilt the surface
          const tilt = Math.PI / 3.5;
          const yRotated = Math.sin(angle) * radius * Math.cos(tilt) - z * Math.sin(tilt);
          
          const px = cx + Math.cos(angle) * radius * scale;
          const py = cy + yRotated * scale;

          // Optimization: Only draw if it's on the right half (from 45% to the right edge)
          // and use fillRect instead of arc for massive performance gain
          if (px > canvas.width * 0.45 && px < canvas.width && py > 0 && py < canvas.height) {
            const size = 1.5 * scale;
            ctx.fillRect(px, py, size, size);
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            render();
          } else {
            cancelAnimationFrame(animationFrameId);
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(canvas);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-[120%] pointer-events-none opacity-40 z-0"
    />
  );
};

const GlowingOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#E8175D]/5 blur-[120px] will-change-transform" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-[#E8175D]/5 blur-[100px] will-change-transform" />
    <div className="absolute top-[20%] right-[15%] w-[30vw] h-[30vw] border border-[#E8175D]/20 rounded-full animate-[spin_20s_linear_infinite] opacity-30 will-change-transform" />
    <div className="absolute top-[20%] right-[15%] w-[30vw] h-[30vw] border border-[#E8175D]/10 rounded-full animate-[spin_15s_linear_infinite_reverse] opacity-30 scale-110 will-change-transform" />
    <div className="absolute top-[20%] right-[15%] w-[30vw] h-[30vw] border border-[#E8175D]/5 rounded-full animate-[spin_25s_linear_infinite] opacity-30 scale-90 will-change-transform" />
  </div>
);

const SocialBar = () => {
  return (
    <div className="fixed left-6 bottom-0 z-50 hidden lg:flex flex-col items-center gap-6 pb-12">
      <div className="social-icons flex flex-col gap-6">
        <a href="#" className="text-gray-500 hover:text-[#E8175D] transition-colors"><Github size={18} /></a>
        <a href="#" className="text-gray-500 hover:text-[#E8175D] transition-colors"><Linkedin size={18} /></a>
        <a href="#" className="text-gray-500 hover:text-[#E8175D] transition-colors"><Twitter size={18} /></a>
        <a href="#" className="text-gray-500 hover:text-[#E8175D] transition-colors"><Mail size={18} /></a>
      </div>
      <div className="w-[1px] h-24 bg-gray-800 mt-4" />
    </div>
  );
};

const SectionHeader = ({ number, title }: { number: string; title: string }) => (
  <div className="section-header flex items-center gap-4 mb-12">
    <span className="font-mono text-xs text-gray-600">{number}</span>
    <div className="h-[1px] flex-1 bg-gray-800" />
    <h2 className="font-display text-4xl md:text-6xl uppercase tracking-tighter">{title}</h2>
  </div>
);

const ContactForm = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  if (submitted) {
    return (
      <div className="h-full flex flex-col items-center justify-center border border-gray-800 p-12 text-center bg-black/20 backdrop-blur-sm">
        <h3 className="font-display text-3xl mb-4 text-[#E8175D]">THANK YOU</h3>
        <p className="font-mono text-xs text-gray-400">Your message has been received. I'll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-black/20 backdrop-blur-sm p-8 border border-gray-800/50">
      <div className="flex flex-col gap-2">
        <label className="font-mono text-[10px] text-gray-500 uppercase">Name</label>
        <input required type="text" className="bg-transparent border-b border-gray-800 pb-2 text-white font-mono text-sm focus:outline-none focus:border-[#E8175D] transition-colors" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-mono text-[10px] text-gray-500 uppercase">Email</label>
        <input required type="email" className="bg-transparent border-b border-gray-800 pb-2 text-white font-mono text-sm focus:outline-none focus:border-[#E8175D] transition-colors" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-mono text-[10px] text-gray-500 uppercase">Message</label>
        <textarea required rows={4} className="bg-transparent border-b border-gray-800 pb-2 text-white font-mono text-sm focus:outline-none focus:border-[#E8175D] transition-colors resize-none" />
      </div>
      <button type="submit" className="mt-4 w-full py-6 border border-white font-display text-xl uppercase hover:bg-[#E8175D] hover:border-[#E8175D] hover:text-white transition-all duration-300">
        Send Message
      </button>
    </form>
  );
};

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: "power3.out"
      });
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out"
      });
    };

    const onMouseEnter = () => setIsHovering(true);
    const onMouseLeave = () => setIsHovering(false);

    window.addEventListener("mousemove", onMouseMove);
    
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .group');
    interactiveElements.forEach(el => {
      el.addEventListener("mouseenter", onMouseEnter);
      el.addEventListener("mouseleave", onMouseLeave);
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener("mouseenter", onMouseEnter);
        el.removeEventListener("mouseleave", onMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 w-10 h-10 border border-[#E8175D] rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 mix-blend-difference ${isHovering ? 'scale-150 bg-[#E8175D]/10' : 'scale-100'}`}
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1 h-1 bg-[#E8175D] rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
      />
    </>
  );
};

const ExperienceCard = ({ exp, status, pos }: { exp: any, status: string, pos: string }) => (
  <div className="relative group">
    {/* Red Badge */}
    <div className="absolute -top-3 left-6 bg-[#E8175D] text-white px-4 py-1.5 font-mono text-[10px] font-bold tracking-widest shadow-[0_0_15px_rgba(232,23,93,0.5)] rounded-sm z-20">
      {exp.year}
    </div>

    {/* Outer wrapper for border effect */}
    <div className="p-[1px] bg-gray-800 group-hover:bg-gray-600 transition-colors duration-500 [clip-path:polygon(0_0,calc(100%-20px)_0,100%_20px,100%_100%,20px_100%,0_calc(100%-20px))]">
      {/* Inner content area */}
      <div className="bg-[#0a0a0a] p-8 pt-12 h-full [clip-path:polygon(0_0,calc(100%-20px)_0,100%_20px,100%_100%,20px_100%,0_calc(100%-20px))] relative">
        
        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Top Right Micro-text */}
        <div className="absolute top-4 right-6 font-mono text-[8px] text-gray-500 tracking-widest uppercase hidden sm:block">
          {status}
        </div>

        {/* Content */}
        <h3 className="font-display text-2xl md:text-3xl uppercase tracking-tighter text-white mb-1 relative z-10">
          {exp.role}
        </h3>
        <div className="font-mono text-xs text-[#E8175D] uppercase tracking-widest mb-6 relative z-10">
          {exp.company}
        </div>
        <p className="font-mono text-xs text-gray-400 leading-relaxed mb-8 relative z-10">
          {exp.description}
        </p>

        {/* Bottom Left Micro-text */}
        <div className="absolute bottom-4 left-6 font-mono text-[8px] text-gray-600 tracking-widest">
          POS: {pos}
        </div>
        
        {/* Tech Accents inside */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#E8175D] opacity-50" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#E8175D] opacity-50" />
      </div>
    </div>
    
    {/* Crosshairs outside */}
    <div className="absolute top-1/2 -left-2 w-4 h-[1px] bg-gray-700 z-10" />
    <div className="absolute top-1/2 -right-2 w-4 h-[1px] bg-gray-700 z-10" />
  </div>
);

export default function App() {
  const container = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleExperienceMouseMove = (e: React.MouseEvent) => {
    if (!experienceRef.current) return;
    const rect = experienceRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const [activeSection, setActiveSection] = useState("home");

  useGSAP(() => {
    // Hero Animations
    gsap.from(".hero-text", {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power4.out",
      delay: 0.2
    });

    gsap.from(".hero-line", {
      height: 0,
      duration: 1,
      ease: "power3.inOut",
      delay: 0.5
    });

    gsap.from(".social-icons a", {
      x: -20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      delay: 1,
      ease: "power2.out"
    });

    // Scroll Animations
    gsap.utils.toArray('.section-header').forEach((header: any) => {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: "top 85%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });
    });

    gsap.utils.toArray('.project-item').forEach((item: any, i) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: "top 90%",
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
      });
    });

    gsap.from('.experience-card-wrapper', {
      scrollTrigger: {
        trigger: '#experience',
        start: "top 70%",
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out"
    });

    gsap.utils.toArray('.skill-item').forEach((item: any, i) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: "top 90%",
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.4,
        ease: "back.out(1.5)"
      });
    });

    // Scrollspy
    const sections = ["home", "projects", "experience", "skills", "contact"];
    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: `#${section}`,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveSection(section),
        onEnterBack: () => setActiveSection(section),
      });
    });

  }, { scope: container });

  const navItems = [
    { id: "01", label: "HOME", href: "#home" },
    { id: "02", label: "PROJECTS", href: "#projects" },
    { id: "03", label: "EXPERIENCE", href: "#experience" },
    { id: "04", label: "SKILLS", href: "#skills" },
    { id: "05", label: "CONTACT", href: "#contact" },
  ];

  const experiences = [
    {
      role: "SENIOR FRONTEND ENGINEER",
      company: "TECH CORP",
      year: "2022 - PRESENT",
      description: "Leading the frontend architecture for high-traffic web applications. Implementing complex UI/UX designs with React and GSAP, improving performance by 40%."
    },
    {
      role: "FULLSTACK DEVELOPER",
      company: "DIGITAL AGENCY",
      year: "2019 - 2022",
      description: "Developed scalable e-commerce solutions and interactive marketing sites. Managed database architecture and API integrations."
    },
    {
      role: "JUNIOR DEVELOPER",
      company: "STARTUP INC",
      year: "2018 - 2019",
      description: "Assisted in building internal tools and maintaining legacy systems. Gained strong foundational skills in JavaScript and PHP."
    }
  ];

  const skills = [
    "PHP", "HTML", "CSS", "JAVASCRIPT", "SQL", "PYTHON", "C#", "REACT"
  ];

  const projects = [
    {
      title: "NEURAL NETWORK VISUALIZER",
      category: "AI / FRONTEND",
      year: "2024",
      tech: ["REACT", "D3.JS", "PYTHON"],
      image: "https://picsum.photos/seed/neural/600/400"
    },
    {
      title: "E-COMMERCE CORE ENGINE",
      category: "BACKEND / DATABASE",
      year: "2023",
      tech: ["PHP", "SQL", "REDIS"],
      image: "https://picsum.photos/seed/ecommerce/600/400"
    },
    {
      title: "CLOUD INFRA DASHBOARD",
      category: "FULLSTACK",
      year: "2023",
      tech: ["C#", "REACT", "AZURE"],
      image: "https://picsum.photos/seed/cloud/600/400"
    }
  ];

  return (
    <div ref={container} className="relative min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#E8175D] selection:text-white">
      <CustomCursor />
      <SocialBar />
      
      <div className="noise-overlay fixed inset-0 z-0 pointer-events-none" />
      <div className="wavy-overlay fixed inset-0 z-0 pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-6 md:px-12 bg-gradient-to-b from-[#0a0a0a] to-transparent">
        <div className="text-xl font-black tracking-tighter">OSAMI.IO</div>
        <div className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`group flex items-center gap-1 text-[10px] font-mono tracking-widest transition-colors ${activeSection === item.href.substring(1) ? 'text-[#E8175D]' : 'text-gray-400 hover:text-[#E8175D]'}`}
            >
              <span className={`transition-colors ${activeSection === item.href.substring(1) ? 'text-[#E8175D]' : 'text-gray-600 group-hover:text-[#E8175D]'}`}>
                {item.id}
              </span>
              <span>/{item.label}</span>
            </a>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative z-10 flex flex-col justify-center min-h-screen px-8 md:px-12 pt-20">
        <ParticleWave />
        <GlowingOrbs />
        <div className="max-w-7xl w-full mx-auto relative z-10">
          <div className="relative mb-12">
            <h1 className="hero-text text-[12vw] md:text-[10vw] font-black leading-[0.85] tracking-tighter uppercase">
              Creative
            </h1>
            <div className="flex items-start gap-4 md:gap-8">
              <div className="hero-line w-[1px] bg-gray-700 self-stretch mt-4" />
              <h1 className="hero-text text-[12vw] md:text-[10vw] font-black leading-[0.85] tracking-tighter uppercase text-[#E8175D]">
                Developer
              </h1>
            </div>
            <div className="absolute right-0 bottom-0 text-right">
              <p className="hero-text font-mono text-[10px] tracking-widest text-gray-400">
                Chris Allow / Web Developer
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end mt-24">
            <div className="space-y-12">
              <div className="h-[1px] w-full bg-gray-800" />
              <div className="font-mono text-[11px] tracking-[0.2em] text-gray-400">
                // SCALABLE WEB SOLUTIONS.
              </div>
              <a href="#projects" className="group flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase hover:text-[#E8175D] transition-colors">
                Explore my work
                <span className="inline-block transform group-hover:translate-y-1 transition-transform">
                  ↓
                </span>
              </a>
            </div>
            <div className="flex flex-col items-end text-right">
              <p className="max-w-md font-mono text-[11px] leading-relaxed text-gray-500 uppercase tracking-tight">
                Full-stack developer and hacker driven by a passion for building
                efficient, secure applications. Expertise in web development, with a
                focus on performance and security, pushing boundaries in code.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative z-10 py-32 px-8 md:px-12">
        <div className="max-w-7xl w-full mx-auto">
          <SectionHeader number="02" title="SELECTED PROJECTS" />
          
          <div className="flex flex-col">
            {projects.map((project, index) => (
              <div
                key={index}
                className="project-item group relative border-b border-gray-800 py-12 flex flex-col md:flex-row md:items-center justify-between hover:bg-white/5 px-4 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  <div className="w-0 opacity-0 group-hover:w-32 group-hover:opacity-100 transition-all duration-500 ease-out hidden md:block overflow-hidden h-20">
                    <img src={project.image} alt={project.title} className="w-32 h-20 object-cover grayscale group-hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-[10px] text-gray-600">{project.year}</span>
                    <h3 className="font-display text-4xl md:text-6xl tracking-tighter group-hover:translate-x-4 group-hover:text-[#E8175D] transition-all duration-500">
                      {project.title}
                    </h3>
                  </div>
                </div>
                
                <div className="flex flex-col md:items-end gap-4 mt-6 md:mt-0">
                  <div className="flex gap-2">
                    {project.tech.map((t, i) => (
                      <span key={i} className="font-mono text-[9px] border border-gray-700 px-2 py-1 text-gray-500 group-hover:border-[#E8175D]/30 group-hover:text-gray-300 transition-colors">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="font-mono text-[10px] tracking-widest text-gray-400 uppercase">
                    {project.category}
                  </span>
                </div>
                
                <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight size={32} className="text-[#E8175D]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section 
        id="experience" 
        ref={experienceRef}
        onMouseMove={handleExperienceMouseMove}
        className="relative z-10 py-32 px-8 md:px-12 bg-[#050505] overflow-hidden"
      >
        {/* Background Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        {/* Grid Lighting Effect */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, rgba(232, 23, 93, 0.15), transparent 80%)`
          }}
        />
        
        {/* Decorative Crosshairs in background */}
        <div className="absolute top-20 left-20 text-gray-700 font-mono text-xs">+</div>
        <div className="absolute bottom-20 right-20 text-gray-700 font-mono text-xs">+</div>

        <div className="max-w-7xl w-full mx-auto relative z-10">
          <SectionHeader number="03" title="CAREER & EXPERIENCE" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 relative mt-16">
            
            {/* Left Column (Item 0) */}
            <div className="lg:col-span-5 lg:col-start-1 flex items-center relative z-10 experience-card-wrapper">
              <div className="w-full">
                <ExperienceCard exp={experiences[0]} status="DATA STREAM 03 // LIVE" pos="X:450 Y:220" />
              </div>
              {/* Horizontal line connecting to center */}
              <div className="hidden lg:block absolute top-1/2 -right-8 lg:-right-16 w-8 lg:w-16 h-[1px] border-t border-dashed border-[#E8175D] opacity-30" />
            </div>

            {/* Right Column (Items 1 & 2) */}
            <div className="lg:col-span-6 lg:col-start-7 flex flex-col gap-16 relative z-10">
              {/* Vertical connecting line in the gap */}
              <div className="hidden lg:block absolute top-[20%] bottom-[20%] -left-8 lg:-left-16 w-[1px] border-l border-dashed border-[#E8175D] opacity-30" />
              
              <div className="w-full experience-card-wrapper relative">
                {/* Horizontal branch */}
                <div className="hidden lg:block absolute top-1/2 -left-8 lg:-left-16 w-8 lg:w-16 h-[1px] border-t border-dashed border-[#E8175D] opacity-30" />
                <ExperienceCard exp={experiences[1]} status="SYSTEM STATUS: OPTIMAL" pos="X:520 Y:310" />
              </div>
              
              <div className="w-full experience-card-wrapper lg:ml-12 relative">
                {/* Horizontal branch */}
                <div className="hidden lg:block absolute top-1/2 -left-8 lg:-left-[76px] w-8 lg:w-[76px] h-[1px] border-t border-dashed border-[#E8175D] opacity-30" />
                <ExperienceCard exp={experiences[2]} status="DATA STREAM 02 // LIVE" pos="X:1150 Y:580" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="relative z-10 py-32 px-8 md:px-12 bg-white/5">
        <div className="max-w-7xl w-full mx-auto">
          <SectionHeader number="04" title="TECHNOLOGIES" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-800 border border-gray-800">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="skill-item bg-[#0a0a0a] p-12 flex flex-col items-center justify-center group hover:bg-[#E8175D] transition-colors duration-500"
              >
                <span className="font-mono text-[10px] text-gray-600 mb-4 group-hover:text-white/70 transition-colors">0{index + 1}</span>
                <span className="font-display text-2xl md:text-3xl tracking-tighter group-hover:text-white transition-colors">
                  {skill}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-32 px-8 md:px-12">
        <div className="max-w-7xl w-full mx-auto">
          <SectionHeader number="05" title="GET IN TOUCH" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
            <div className="space-y-8">
              <p className="font-display text-5xl md:text-7xl leading-[0.9] tracking-tighter uppercase">
                Let's build something <span className="text-[#E8175D]">extraordinary</span> together.
              </p>
              <div className="flex flex-col gap-4">
                <a href="mailto:hello@osami.io" className="font-mono text-xl md:text-2xl hover:text-[#E8175D] transition-colors underline underline-offset-8 decoration-gray-800 hover:decoration-[#E8175D]">
                  hello@osami.io
                </a>
                <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">
                  Available for freelance & collaborations
                </p>
              </div>
            </div>
            
            <div className="flex flex-col justify-end gap-12">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-gray-900 px-8 md:px-12">
        <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-mono text-[10px] text-gray-600 uppercase tracking-widest">
            © 2024 OSAMI.IO / ALL RIGHTS RESERVED
          </div>
          <div className="flex gap-8 font-mono text-[10px] text-gray-600 uppercase tracking-widest">
            <a href="#" className="hover:text-[#E8175D] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#E8175D] transition-colors">Terms of Service</a>
          </div>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-mono text-[10px] text-gray-400 hover:text-[#E8175D] transition-colors flex items-center gap-2"
          >
            BACK TO TOP ↑
          </button>
        </div>
      </footer>
    </div>
  );
}
