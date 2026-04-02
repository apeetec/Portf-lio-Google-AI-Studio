/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { Github, Linkedin, Mail, Twitter, ArrowUpRight, Files, Search, GitBranch, Play, LayoutGrid, Settings, ChevronRight, ChevronDown, X, FileCode2 } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

const ParticleWave = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false }); // Optimization: Disable alpha for faster compositing if background is solid, but here we need it. Let's keep it default but optimize drawing.
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    let isVisible = true;

    // Mouse interaction state
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize from -1 to 1
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const resize = () => {
      const parent = canvas.parentElement;
      const dpr = window.devicePixelRatio || 1;
      let w, h;
      if (parent) {
        w = parent.clientWidth;
        h = parent.clientHeight;
      } else {
        w = window.innerWidth;
        h = window.innerHeight;
      }
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", resize);
    resize();

    const render = () => {
      if (!isVisible) return;
      time += 0.0015; // Slower time step
      
      // Smoothly interpolate current mouse position
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Calculate scroll factor (1 at top, 0 when scrolled down)
      const scrollY = window.scrollY;
      const scrollFactor = Math.max(0, 1 - scrollY / 500);

      // Apply mouse influence scaled by scroll factor
      const mouseInfluenceX = currentMouseX * 150 * scrollFactor;
      const mouseInfluenceY = currentMouseY * 150 * scrollFactor;

      // Optimization: Use a semi-transparent fill instead of clearRect for a trailing effect, 
      // but clearRect is generally faster. We'll stick to clearRect but optimize the loop.
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // Slightly more opaque

      const cx = canvas.width * 0.85 + mouseInfluenceX;
      const cy = canvas.height * 0.5 + mouseInfluenceY;

      // Aggressive Optimization: Further reduce rings and increase spacing
      const numRings = 30; // Reduced from 40
      const ringSpacing = 18; // Increased from 14
      const dotSpacing = 14; // Increased from 10

      // Pre-calculate some values outside the inner loop
      const tilt = Math.PI / 3.5;
      const cosTilt = Math.cos(tilt);
      const sinTilt = Math.sin(tilt);

      ctx.beginPath(); // Optimization: Batch drawing operations

      for (let i = 0; i < numRings; i++) {
        const radius = i * ringSpacing;
        const numDots = Math.max(8, Math.floor((Math.PI * 2 * radius) / dotSpacing));
        
        for (let j = 0; j < numDots; j++) {
          const angle = (j / numDots) * Math.PI * 2;
          
          // Simplified math
          const z = Math.sin(angle * 2 + time) * 40 + Math.cos(i * 0.1 - time) * 40;
          const scale = 800 / (800 + z);
          
          const yRotated = Math.sin(angle) * radius * cosTilt - z * sinTilt;
          
          // Add some individual particle movement based on mouse
          const particleMouseOffsetX = currentMouseX * (radius * 0.3) * scrollFactor;
          const particleMouseOffsetY = currentMouseY * (radius * 0.3) * scrollFactor;

          const px = cx + Math.cos(angle) * radius * scale - particleMouseOffsetX;
          const py = cy + yRotated * scale - particleMouseOffsetY;

          // Optimization: Stricter culling
          if (px > canvas.width * 0.3 && px < canvas.width && py > 0 && py < canvas.height) {
            const size = 1.2 * scale;
            // Instead of fillRect in the loop, we use rect to batch them
            ctx.rect(px, py, size, size);
          }
        }
      }
      
      ctx.fill(); // Draw all rects at once

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
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-70 z-0"
      style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}
    />
  );
};

const GlowingOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}>
    <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#E8175D]/5 blur-[120px]" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-[#E8175D]/5 blur-[100px]" />
    <div className="absolute top-[20%] right-[15%] w-[30vw] h-[30vw] border border-[#E8175D]/20 rounded-full animate-[spin_20s_linear_infinite] opacity-30" />
    <div className="absolute top-[20%] right-[15%] w-[30vw] h-[30vw] border border-[#E8175D]/10 rounded-full animate-[spin_15s_linear_infinite_reverse] opacity-30 scale-110" />
    <div className="absolute top-[20%] right-[15%] w-[30vw] h-[30vw] border border-[#E8175D]/5 rounded-full animate-[spin_25s_linear_infinite] opacity-30 scale-90" />
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

const SectionHeader = ({ number, title }: { number: string; title: string }) => {
  const headerRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!headerRef.current) return;
    const text = new SplitType(headerRef.current, { types: 'chars' });
    
    gsap.from(text.chars, {
      scrollTrigger: {
        trigger: headerRef.current,
        start: "top 85%",
      },
      y: 50,
      opacity: 0,
      rotateX: -90,
      stagger: 0.02,
      duration: 0.8,
      ease: "power4.out"
    });
  }, { scope: headerRef });

  return (
    <div className="section-header flex items-center gap-4 mb-12">
      <span className="font-mono text-xs text-gray-600 shrink-0">{number}</span>
      <div className="h-[1px] flex-1 bg-gray-800 min-w-[20px]" />
      <h2 ref={headerRef} className="font-display text-3xl sm:text-4xl md:text-6xl uppercase tracking-tighter overflow-hidden break-words whitespace-normal shrink">
        {title}
      </h2>
    </div>
  );
};

const ContactForm = ({ lang, t }: { lang: 'pt' | 'en', t: any }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  if (submitted) {
    return (
      <div className="h-full flex flex-col items-center justify-center border border-gray-800 p-12 text-center bg-black/20 backdrop-blur-sm">
        <h3 className="font-display text-3xl mb-4 text-[#E8175D] uppercase">{t[lang].contact.form.thanks}</h3>
        <p className="font-mono text-xs text-gray-400 uppercase">{t[lang].contact.form.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-black/20 backdrop-blur-sm p-8 border border-gray-800/50">
      <div className="flex flex-col gap-2">
        <label className="font-mono text-[10px] text-gray-500 uppercase">{t[lang].contact.form.name}</label>
        <input required type="text" className="bg-transparent border-b border-gray-800 pb-2 text-white font-mono text-sm focus:outline-none focus:border-[#E8175D] transition-colors" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-mono text-[10px] text-gray-500 uppercase">{t[lang].contact.form.email}</label>
        <input required type="email" className="bg-transparent border-b border-gray-800 pb-2 text-white font-mono text-sm focus:outline-none focus:border-[#E8175D] transition-colors" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-mono text-[10px] text-gray-500 uppercase">{t[lang].contact.form.message}</label>
        <textarea required rows={4} className="bg-transparent border-b border-gray-800 pb-2 text-white font-mono text-sm focus:outline-none focus:border-[#E8175D] transition-colors resize-none" />
      </div>
      <button type="submit" className="mt-4 w-full py-6 border border-white font-display text-xl uppercase hover:bg-[#E8175D] hover:border-[#E8175D] hover:text-white transition-all duration-300">
        {t[lang].contact.form.send}
      </button>
    </form>
  );
};

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Optimization: Use GSAP quickTo for highly performant mouse tracking
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power2.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power2.out" });

    const onMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    // Optimization: Use event delegation instead of attaching listeners to many elements
    // and definitely avoid MutationObserver which is too heavy.
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, textarea, .group, .tech-card, .project-item')) {
        setIsHovering(true);
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, textarea, .group, .tech-card, .project-item')) {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseover", onMouseOver);
    document.body.addEventListener("mouseout", onMouseOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.body.removeEventListener("mouseover", onMouseOver);
      document.body.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
    >
      <div className={`relative transition-all duration-500 ${isHovering ? 'scale-150' : 'scale-100'}`}>
        {/* Crosshair Brackets */}
        <div className={`absolute -top-5 -left-5 w-3 h-3 border-t-2 border-l-2 border-[#E8175D] transition-all duration-500 ${isHovering ? 'translate-x-[-4px] translate-y-[-4px]' : ''}`} />
        <div className={`absolute -top-5 -right-5 w-3 h-3 border-t-2 border-r-2 border-[#E8175D] transition-all duration-500 ${isHovering ? 'translate-x-[4px] translate-y-[-4px]' : ''}`} />
        <div className={`absolute -bottom-5 -left-5 w-3 h-3 border-b-2 border-l-2 border-[#E8175D] transition-all duration-500 ${isHovering ? 'translate-x-[-4px] translate-y-[4px]' : ''}`} />
        <div className={`absolute -bottom-5 -right-5 w-3 h-3 border-b-2 border-r-2 border-[#E8175D] transition-all duration-500 ${isHovering ? 'translate-x-[4px] translate-y-[4px]' : ''}`} />
        
        {/* Crosshair Lines */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-[1px] bg-[#E8175D] transition-all duration-300 ${isHovering ? 'w-12 opacity-100' : 'w-4 opacity-50'}`} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-[1px] bg-[#E8175D] transition-all duration-300 ${isHovering ? 'h-12 opacity-100' : 'h-4 opacity-50'}`} />
        
        {/* Center Point */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_#E8175D]" />
      </div>
    </div>
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

const TechBackground = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
    {/* Top Left */}
    <svg className="absolute top-0 left-0 w-96 h-96" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 0 100 L 150 100 L 200 50 L 350 50" stroke="#E8175D" strokeWidth="1" strokeDasharray="4 4" />
      <circle cx="150" cy="100" r="3" fill="#E8175D" />
      <circle cx="200" cy="50" r="3" fill="#E8175D" />
      <circle cx="350" cy="50" r="4" stroke="#E8175D" strokeWidth="2" />
      <path d="M 50 0 L 50 150 L 100 200 L 100 350" stroke="#4ade80" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
      <circle cx="50" cy="150" r="3" fill="#4ade80" opacity="0.5" />
      <circle cx="100" cy="200" r="3" fill="#4ade80" opacity="0.5" />
    </svg>

    {/* Top Right */}
    <svg className="absolute top-0 right-0 w-96 h-96" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 400 150 L 250 150 L 200 200 L 50 200" stroke="#4ade80" strokeWidth="1" strokeDasharray="4 4" />
      <circle cx="250" cy="150" r="3" fill="#4ade80" />
      <circle cx="200" cy="200" r="3" fill="#4ade80" />
      <circle cx="50" cy="200" r="4" stroke="#4ade80" strokeWidth="2" />
      <path d="M 350 0 L 350 100 L 300 150 L 300 300" stroke="#E8175D" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
      <circle cx="350" cy="100" r="3" fill="#E8175D" opacity="0.5" />
      <circle cx="300" cy="150" r="3" fill="#E8175D" opacity="0.5" />
    </svg>

    {/* Bottom Left */}
    <svg className="absolute bottom-0 left-0 w-96 h-96" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 50 400 L 50 250 L 100 200 L 100 50" stroke="#4ade80" strokeWidth="1" strokeDasharray="4 4" />
      <circle cx="50" cy="250" r="3" fill="#4ade80" />
      <circle cx="100" cy="200" r="3" fill="#4ade80" />
      <circle cx="100" cy="50" r="4" stroke="#4ade80" strokeWidth="2" />
      <path d="M 0 300 L 150 300 L 200 250 L 350 250" stroke="#E8175D" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
      <circle cx="150" cy="300" r="3" fill="#E8175D" opacity="0.5" />
      <circle cx="200" cy="250" r="3" fill="#E8175D" opacity="0.5" />
    </svg>

    {/* Bottom Right */}
    <svg className="absolute bottom-0 right-0 w-96 h-96" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 300 400 L 300 250 L 250 200 L 250 50" stroke="#E8175D" strokeWidth="1" strokeDasharray="4 4" />
      <circle cx="300" cy="250" r="3" fill="#E8175D" />
      <circle cx="250" cy="200" r="3" fill="#E8175D" />
      <circle cx="250" cy="50" r="4" stroke="#E8175D" strokeWidth="2" />
      <path d="M 400 300 L 250 300 L 200 250 L 50 250" stroke="#4ade80" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
      <circle cx="250" cy="300" r="3" fill="#4ade80" opacity="0.5" />
      <circle cx="200" cy="250" r="3" fill="#4ade80" opacity="0.5" />
    </svg>
  </div>
);

const EducationSection = ({ lang, t }: { lang: 'pt' | 'en', t: any }) => {
  return (
    <section id="education" className="relative z-10 py-32 px-8 md:px-12">
      <TechBackground />
      <div className="max-w-7xl w-full mx-auto relative z-10">
        <SectionHeader number="04" title={t[lang].sections.education} />
        
        {/* Editor Window */}
        <div className="mt-12 rounded-lg overflow-hidden border border-[#333333] bg-[#1e1e1e] shadow-2xl flex flex-col relative font-sans">
          
          {/* Title Bar */}
          <div className="h-8 bg-[#323233] flex items-center px-4 justify-between select-none">
            {/* Window Controls (Mac) */}
            <div className="flex gap-2 w-20">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
            {/* Title */}
            <div className="text-[#cccccc] text-xs flex-1 text-center">
              App.tsx - GabrielDev - Visual Studio Code
            </div>
            {/* Spacer for balance */}
            <div className="w-20"></div>
          </div>
          
          <div className="flex flex-1 h-[600px]">
            {/* Activity Bar */}
            <div className="w-12 bg-[#333333] flex flex-col items-center py-4 justify-between">
              <div className="flex flex-col gap-6 text-[#858585]">
                <Files size={24} className="text-white cursor-pointer" />
                <Search size={24} className="cursor-pointer hover:text-white transition-colors" />
                <GitBranch size={24} className="cursor-pointer hover:text-white transition-colors" />
                <Play size={24} className="cursor-pointer hover:text-white transition-colors" />
                <LayoutGrid size={24} className="cursor-pointer hover:text-white transition-colors" />
              </div>
              <div className="flex flex-col gap-6 text-[#858585]">
                <Settings size={24} className="cursor-pointer hover:text-white transition-colors" />
              </div>
            </div>

            {/* Sidebar (Explorer) */}
            <div className="w-60 bg-[#252526] flex-col hidden md:flex border-r border-[#333333]">
              <div className="text-[#cccccc] text-[11px] uppercase tracking-wider px-4 py-3">
                Explorer
              </div>
              <div className="flex flex-col text-[#cccccc] text-sm">
                <div className="flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-[#2a2d2e]">
                  <ChevronDown size={16} />
                  <span className="font-bold text-xs">PORTFOLIO</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 px-4 py-1 cursor-pointer hover:bg-[#2a2d2e]">
                    <ChevronDown size={16} />
                    <span>src</span>
                  </div>
                  <div className="flex items-center gap-2 px-8 py-1 bg-[#37373d] text-white cursor-pointer">
                    <FileCode2 size={16} className="text-[#519aba]" />
                    <span>App.tsx</span>
                  </div>
                  <div className="flex items-center gap-2 px-8 py-1 cursor-pointer hover:bg-[#2a2d2e]">
                    <FileCode2 size={16} className="text-[#519aba]" />
                    <span>index.css</span>
                  </div>
                  <div className="flex items-center gap-2 px-8 py-1 cursor-pointer hover:bg-[#2a2d2e]">
                    <FileCode2 size={16} className="text-[#cbcb41]" />
                    <span>main.tsx</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden">
              {/* Tabs */}
              <div className="flex h-9 bg-[#252526] overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2 px-4 bg-[#1e1e1e] border-t border-[#E8175D] text-white cursor-pointer min-w-fit">
                  <FileCode2 size={16} className="text-[#519aba]" />
                  <span className="text-sm">App.tsx</span>
                  <X size={14} className="ml-2 text-[#858585] hover:text-white rounded hover:bg-[#333333]" />
                </div>
                <div className="flex items-center gap-2 px-4 text-[#858585] hover:bg-[#2d2d2d] cursor-pointer min-w-fit">
                  <FileCode2 size={16} className="text-[#519aba]" />
                  <span className="text-sm">index.css</span>
                </div>
              </div>

              {/* Breadcrumbs */}
              <div className="flex items-center gap-1 px-4 h-6 text-[#cccccc] text-xs border-b border-[#333333]">
                <span>src</span>
                <ChevronRight size={14} />
                <FileCode2 size={14} className="text-[#519aba]" />
                <span>App.tsx</span>
                <ChevronRight size={14} />
                <span>AcademicBackground</span>
              </div>

              {/* Code Area */}
              <div className="flex-1 flex overflow-auto p-4 font-mono text-[13px] md:text-sm leading-[1.6]">
                {/* Line Numbers */}
                <div className="flex flex-col text-[#858585] text-right pr-6 select-none">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <span key={i}>{i + 1}</span>
                  ))}
                </div>
                
                {/* Code Content */}
                <div className="flex flex-col text-[#d4d4d4] whitespace-pre">
                  <div><span className="text-[#808080]">&lt;</span><span className="text-[#569cd6]">AcademicBackground</span><span className="text-[#808080]">&gt;</span></div>
                  
                  {/* Item 1 */}
                  <div className="ml-4"><span className="text-[#808080]">&lt;</span><span className="text-[#4ec9b0]">Degree</span></div>
                  <div className="ml-8"><span className="text-[#9cdcfe]">title</span><span className="text-[#d4d4d4]">=</span><span className="text-[#ce9178]">"{t[lang].education.degree1.title}"</span></div>
                  <div className="ml-8"><span className="text-[#9cdcfe]">period</span><span className="text-[#d4d4d4]">=</span><span className="text-[#ce9178]">"{t[lang].education.degree1.period}"</span></div>
                  <div className="ml-8"><span className="text-[#9cdcfe]">institution</span><span className="text-[#d4d4d4]">=</span><span className="text-[#ce9178]">"{t[lang].education.degree1.inst}"</span><span className="text-[#808080]">&gt;</span></div>
                  <div className="ml-8"><span className="text-[#808080]">&lt;</span><span className="text-[#4ec9b0]">Skills</span><span className="text-[#808080]">&gt;</span></div>
                  <div className="ml-12 text-[#ce9178] whitespace-normal max-w-xl">{t[lang].education.degree1.skills}</div>
                  <div className="ml-8"><span className="text-[#808080]">&lt;/</span><span className="text-[#4ec9b0]">Skills</span><span className="text-[#808080]">&gt;</span></div>
                  <div className="ml-4"><span className="text-[#808080]">&lt;/</span><span className="text-[#4ec9b0]">Degree</span><span className="text-[#808080]">&gt;</span></div>
                  <div></div>

                  {/* Item 2 */}
                  <div className="ml-4"><span className="text-[#808080]">&lt;</span><span className="text-[#4ec9b0]">Degree</span></div>
                  <div className="ml-8"><span className="text-[#9cdcfe]">title</span><span className="text-[#d4d4d4]">=</span><span className="text-[#ce9178]">"{t[lang].education.degree2.title}"</span></div>
                  <div className="ml-8"><span className="text-[#9cdcfe]">period</span><span className="text-[#d4d4d4]">=</span><span className="text-[#ce9178]">"{t[lang].education.degree2.period}"</span></div>
                  <div className="ml-8"><span className="text-[#9cdcfe]">institution</span><span className="text-[#d4d4d4]">=</span><span className="text-[#ce9178]">"{t[lang].education.degree2.inst}"</span><span className="text-[#808080]">&gt;</span></div>
                  <div className="ml-8"><span className="text-[#808080]">&lt;</span><span className="text-[#4ec9b0]">Skills</span><span className="text-[#808080]">&gt;</span></div>
                  <div className="ml-12 text-[#ce9178] whitespace-normal max-w-xl">{t[lang].education.degree2.skills}</div>
                  <div className="ml-8"><span className="text-[#808080]">&lt;/</span><span className="text-[#4ec9b0]">Skills</span><span className="text-[#808080]">&gt;</span></div>
                  <div className="ml-4"><span className="text-[#808080]">&lt;/</span><span className="text-[#4ec9b0]">Degree</span><span className="text-[#808080]">&gt;</span></div>
                  <div></div>

                  {/* Item 3 */}
                  <div className="ml-4"><span className="text-[#808080]">&lt;</span><span className="text-[#4ec9b0]">Degree</span></div>
                  <div className="ml-8"><span className="text-[#9cdcfe]">title</span><span className="text-[#d4d4d4]">=</span><span className="text-[#ce9178]">"{t[lang].education.degree3.title}"</span></div>
                  <div className="ml-8"><span className="text-[#9cdcfe]">period</span><span className="text-[#d4d4d4]">=</span><span className="text-[#ce9178]">"{t[lang].education.degree3.period}"</span></div>
                  <div className="ml-8"><span className="text-[#9cdcfe]">institution</span><span className="text-[#d4d4d4]">=</span><span className="text-[#ce9178]">"{t[lang].education.degree3.inst}"</span><span className="text-[#808080]">&gt;</span></div>
                  <div className="ml-8"><span className="text-[#808080]">&lt;</span><span className="text-[#4ec9b0]">Description</span><span className="text-[#808080]">&gt;</span></div>
                  <div className="ml-12 text-[#ce9178] whitespace-normal max-w-2xl">{t[lang].education.degree3.desc}</div>
                  <div className="ml-8"><span className="text-[#808080]">&lt;/</span><span className="text-[#4ec9b0]">Description</span><span className="text-[#808080]">&gt;</span></div>
                  <div className="ml-4"><span className="text-[#808080]">&lt;/</span><span className="text-[#4ec9b0]">Degree</span><span className="text-[#808080]">&gt;</span></div>

                  <div><span className="text-[#808080]">&lt;/</span><span className="text-[#569cd6]">AcademicBackground</span><span className="text-[#808080]">&gt;</span></div>
                </div>
              </div>
            </div>

            {/* Right Panel (Minimap simulation) */}
            <div className="hidden lg:block w-16 bg-[#1e1e1e] border-l border-[#333333] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-32 bg-[#ffffff05] border-l-2 border-[#85858540]"></div>
              {/* Minimap lines */}
              <div className="p-2 opacity-30 flex flex-col gap-[2px]">
                <div className="w-full h-[2px] bg-[#569cd6]"></div>
                <div className="w-3/4 h-[2px] bg-[#4ec9b0] ml-2"></div>
                <div className="w-1/2 h-[2px] bg-[#9cdcfe] ml-4"></div>
                <div className="w-1/2 h-[2px] bg-[#9cdcfe] ml-4"></div>
                <div className="w-1/2 h-[2px] bg-[#9cdcfe] ml-4"></div>
                <div className="w-3/4 h-[2px] bg-[#4ec9b0] ml-4"></div>
                <div className="w-full h-[2px] bg-[#ce9178] ml-6"></div>
                <div className="w-3/4 h-[2px] bg-[#4ec9b0] ml-4"></div>
                <div className="w-3/4 h-[2px] bg-[#4ec9b0] ml-2"></div>
                <div className="h-2"></div>
                <div className="w-3/4 h-[2px] bg-[#4ec9b0] ml-2"></div>
                <div className="w-1/2 h-[2px] bg-[#9cdcfe] ml-4"></div>
                <div className="w-1/2 h-[2px] bg-[#9cdcfe] ml-4"></div>
                <div className="w-1/2 h-[2px] bg-[#9cdcfe] ml-4"></div>
                <div className="w-3/4 h-[2px] bg-[#4ec9b0] ml-4"></div>
                <div className="w-full h-[2px] bg-[#ce9178] ml-6"></div>
                <div className="w-3/4 h-[2px] bg-[#4ec9b0] ml-4"></div>
                <div className="w-3/4 h-[2px] bg-[#4ec9b0] ml-2"></div>
                <div className="h-2"></div>
                <div className="w-3/4 h-[2px] bg-[#4ec9b0] ml-2"></div>
                <div className="w-1/2 h-[2px] bg-[#9cdcfe] ml-4"></div>
                <div className="w-1/2 h-[2px] bg-[#9cdcfe] ml-4"></div>
                <div className="w-1/2 h-[2px] bg-[#9cdcfe] ml-4"></div>
                <div className="w-3/4 h-[2px] bg-[#4ec9b0] ml-4"></div>
                <div className="w-full h-[2px] bg-[#ce9178] ml-6"></div>
                <div className="w-3/4 h-[2px] bg-[#4ec9b0] ml-4"></div>
                <div className="w-3/4 h-[2px] bg-[#4ec9b0] ml-2"></div>
                <div className="w-full h-[2px] bg-[#569cd6]"></div>
              </div>
            </div>
          </div>
          
          {/* Status Bar */}
          <div className="h-6 bg-[#007acc] flex items-center justify-between px-3 text-white text-xs select-none">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 cursor-pointer hover:bg-white/20 px-1 rounded">
                <GitBranch size={12} />
                <span>main*</span>
              </div>
              <div className="flex items-center gap-1 cursor-pointer hover:bg-white/20 px-1 rounded">
                <X size={12} />
                <span>0</span>
                <span className="ml-1">⚠</span>
                <span>0</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden md:inline cursor-pointer hover:bg-white/20 px-1 rounded">Ln 1, Col 1</span>
              <span className="hidden md:inline cursor-pointer hover:bg-white/20 px-1 rounded">Spaces: 2</span>
              <span className="hidden md:inline cursor-pointer hover:bg-white/20 px-1 rounded">UTF-8</span>
              <span className="hidden md:inline cursor-pointer hover:bg-white/20 px-1 rounded">CRLF</span>
              <span className="cursor-pointer hover:bg-white/20 px-1 rounded">TypeScript React</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function App() {
  const container = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const techSectionRef = useRef<HTMLDivElement>(null);
  const techContainerRef = useRef<HTMLDivElement>(null);

  const [activeSection, setActiveSection] = useState("home");
  const [lang, setLang] = useState<"pt" | "en">("pt");

  const t = {
    pt: {
      nav: { home: "INÍCIO", projects: "PROJETOS", experience: "EXPERIÊNCIA", education: "FORMAÇÃO", technologies: "TECNOLOGIAS", contact: "CONTATO" },
      hero: {
        title1: "Desenvolvedor Web",
        title2: "FullStack",
        subtitle: "Gabriel / Desenvolvedor Web FullStack",
        tagline: "// SOLUÇÕES WEB ESCALÁVEIS.",
        explore: "Explore meu trabalho",
        description: "Desenvolvedor Web Fullstack com mais de 4 anos de experiência em desenvolvimento de aplicações escaláveis, APIs RESTful e integrações com sistemas ERP. Expertise em PHP, Laravel, JavaScript, React.js e Vue.js, com sólida atuação em ambientes ágeis (Scrum/Kanban). Histórico comprovado de melhoria de performance — redução de 60% no tempo de carregamento de páginas e 40% no tempo de emissão de documentos fiscais via automação. Experiência com Docker, CI/CD, Redis e desenvolvimento de soluções de Business Intelligence."
      },
      sections: {
        projects: "PROJETOS SELECIONADOS",
        experience: "CARREIRA & EXPERIÊNCIA",
        education: "FORMAÇÃO ACADÊMICA",
        technologies: "TECNOLOGIAS",
        contact: "ENTRE EM CONTATO"
      },
      contact: {
        title: "Vamos construir algo <span class='text-[#E8175D]'>extraordinário</span> juntos.",
        status: "Disponível para freelance & colaborações",
        form: { name: "Nome", email: "E-mail", message: "Mensagem", send: "Enviar", thanks: "OBRIGADO", success: "Sua mensagem foi recebida. Entrarei em contato em breve." }
      },
      education: {
        title: "Formação Acadêmica",
        degree1: { title: "Análise e Desenvolvimento de Sistemas", period: "2022 – 2024", inst: "Universidade Anhembi Morumbi", skills: "Desenvolvimento web avançado, segurança da informação, modelagem de software" },
        degree2: { title: "Informática para Internet (Técnico)", period: "2020 – 2021", inst: "ETEC Centro Paula Souza", skills: "Programação, banco de dados, integração de sistemas, front-end/back-end" },
        degree3: { title: "Mecatrônica", period: "2013 – 2015", inst: "Senai Roberto Mange", desc: "Formação voltada à implementação, manutenção e desenvolvimento de sistemas e equipamentos automatizados, com foco em normas técnicas, qualidade, segurança do trabalho e sustentabilidade." }
      }
    },
    en: {
      nav: { home: "HOME", projects: "PROJECTS", experience: "EXPERIENCE", education: "EDUCATION", technologies: "TECHNOLOGIES", contact: "CONTACT" },
      hero: {
        title1: "Web Developer",
        title2: "FullStack",
        subtitle: "Gabriel / Web Developer FullStack",
        tagline: "// SCALABLE WEB SOLUTIONS.",
        explore: "Explore my work",
        description: "Fullstack Web Developer with over 4 years of experience in developing scalable applications, RESTful APIs, and ERP system integrations. Expertise in PHP, Laravel, JavaScript, React.js, and Vue.js, with solid performance in agile environments (Scrum/Kanban). Proven track record of performance improvement — 60% reduction in page load time and 40% in tax document issuance via automation. Experience with Docker, CI/CD, Redis, and Business Intelligence solutions development."
      },
      sections: {
        projects: "SELECTED PROJECTS",
        experience: "CAREER & EXPERIENCE",
        education: "ACADEMIC BACKGROUND",
        technologies: "TECHNOLOGIES",
        contact: "GET IN TOUCH"
      },
      contact: {
        title: "Let's build something <span class='text-[#E8175D]'>extraordinary</span> together.",
        status: "Available for freelance & collaborations",
        form: { name: "Name", email: "Email", message: "Message", send: "Send", thanks: "THANK YOU", success: "Your message has been received. I'll get back to you soon." }
      },
      education: {
        title: "Academic Background",
        degree1: { title: "Systems Analysis and Development", period: "2022 - 2024", inst: "Anhembi Morumbi University", skills: "Advanced web development, information security, software modeling" },
        degree2: { title: "Internet Informatics (Technician)", period: "2020 - 2021", inst: "ETEC Centro Paula Souza", skills: "Programming, databases, systems integration, front-end/back-end" },
        degree3: { title: "Mechatronics", period: "2013 - 2015", inst: "Senai Roberto Mange", desc: "Training focused on the implementation, maintenance, and development of automated systems and equipment, with a focus on technical standards, quality, workplace safety, and sustainability." }
      }
    }
  };

  useGSAP(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // Sync ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    // Use GSAP's ticker for Lenis to ensure they are perfectly synced
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Experience Section Lighting Effect Optimization
    const expLight = document.querySelector('.experience-light') as HTMLElement;
    let updateLight: (e: MouseEvent) => void;
    
    if (expLight && experienceRef.current) {
      updateLight = (e: MouseEvent) => {
        const rect = experienceRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // Only update if mouse is over the section
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
          expLight.style.background = `radial-gradient(circle 300px at ${x}px ${y}px, rgba(232, 23, 93, 0.15), transparent 80%)`;
        }
      };
      window.addEventListener('mousemove', updateLight);
    }

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

    // 3D Tunnel Scroll for Technologies
    if (techSectionRef.current && techContainerRef.current) {
      const cards = gsap.utils.toArray<HTMLElement>('.tech-card');
      const zGap = 1000; // Reduced gap for tighter scroll
      const totalZ = cards.length * zGap;

      // Pre-create quickSetters for maximum performance
      const setters = cards.map(card => ({
        z: gsap.quickSetter(card, "z", "px"),
        opacity: gsap.quickSetter(card, "opacity"),
        scale: gsap.quickSetter(card, "scale"),
        display: gsap.quickSetter(card, "display"),
        pointerEvents: gsap.quickSetter(card, "pointerEvents")
      }));

      // Set initial positions
      cards.forEach((card, i) => {
        setters[i].z(-i * zGap);
        setters[i].opacity(0);
        setters[i].scale(0.5);
        setters[i].display('none');
      });

      ScrollTrigger.create({
        trigger: techSectionRef.current,
        start: "top top",
        end: `+=${cards.length * 80}%`, // Slightly shorter scroll distance
        pin: true,
        scrub: 0.5, // Reduced scrub for snappier feel
        onUpdate: (self) => {
          const progress = self.progress;
          const currentZ = progress * totalZ;
          
          cards.forEach((card, i) => {
            const itemZ = -i * zGap + currentZ;
            
            // Optimization: Only process cards within a visible range
            if (itemZ > -2000 && itemZ < 1000) {
              let opacity = 0;
              let scale = 0.5;
              
              if (itemZ <= 0) {
                // Approaching
                const ratio = Math.max(0, 1 - (Math.abs(itemZ) / 1500));
                opacity = ratio;
                scale = 0.5 + (ratio * 0.5); // Scale from 0.5 to 1
              } else {
                // Passing
                const ratio = Math.max(0, 1 - (itemZ / 800));
                opacity = ratio;
                scale = 1 + ((1 - ratio) * 0.5); // Scale from 1 to 1.5
              }

              setters[i].z(itemZ);
              setters[i].opacity(opacity);
              setters[i].scale(scale);
              
              if (card.style.display !== 'flex') setters[i].display('flex');
              
              const isInteractive = itemZ > -100 && itemZ < 100;
              if (card.style.pointerEvents !== (isInteractive ? 'auto' : 'none')) {
                  setters[i].pointerEvents(isInteractive ? 'auto' : 'none');
              }

            } else {
              // Hide cards out of range to save rendering
              if (card.style.display !== 'none') {
                setters[i].display('none');
              }
            }
          });

          // Update HUD readouts (throttled implicitly by RAF)
          const velReadout = document.getElementById('vel-readout');
          if (velReadout) velReadout.innerText = (self.getVelocity() / 100).toFixed(2);
        }
      });

      // Background text parallax optimization
      const bgText = document.querySelector('.tech-bg-text') as HTMLElement;
      if (bgText) {
        const ySetter = gsap.quickSetter(bgText, "y", "px");
        const scaleSetter = gsap.quickSetter(bgText, "scale");
        const opacitySetter = gsap.quickSetter(bgText, "opacity");

        ScrollTrigger.create({
          trigger: techSectionRef.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const p = self.progress;
            ySetter(-100 * p);
            scaleSetter(1 + (0.2 * p));
            opacitySetter(0.05 * (1 - p));
          }
        });
      }
    }

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

    // Optimization: Use batch for project items to reduce ScrollTrigger overhead
    ScrollTrigger.batch('.project-item', {
      start: "top 90%",
      onEnter: (elements) => {
        gsap.from(elements, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out"
        });
      },
      once: true // Only animate once
    });

    // Optimization: Use batch for experience cards
    ScrollTrigger.batch('.experience-card-wrapper', {
      start: "top 80%",
      onEnter: (elements) => {
        gsap.from(elements, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out"
        });
      },
      once: true
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

    return () => {
      lenis.destroy();
      if (updateLight) {
        window.removeEventListener('mousemove', updateLight);
      }
    };
  }, { scope: container });

  const navItems = [
    { id: "01", label: t[lang].nav.home, href: "#home" },
    { id: "02", label: t[lang].nav.projects, href: "#projects" },
    { id: "03", label: t[lang].nav.experience, href: "#experience" },
    { id: "04", label: t[lang].nav.education, href: "#education" },
    { id: "05", label: t[lang].nav.technologies, href: "#skills" },
    { id: "06", label: t[lang].nav.contact, href: "#contact" },
  ];

  const experiences = lang === 'pt' ? [
    {
      role: "WEB DEVELOPER FULLSTACK",
      company: "HOSPITAL MATERNIDADE DE CAMPINAS",
      year: "DEZ 2025 – PRESENTE",
      description: "Desenvolvi painéis de BI com WeKnow para análise de dados hospitalares (+5 departamentos). Otimizei queries SQL no banco MV. Criei aplicações React.js para processos administrativos e integrações via APIs RESTful. Refatorei sistemas legados e gerenciei versionamento com GitLab."
    },
    {
      role: "WEB DEVELOPER FULLSTACK",
      company: "AGROSS INSUMOS AGRÍCOLAS",
      year: "JUL 2025 – DEZ 2025",
      description: "Desenvolvimento Vue.js 3 em ciclos ágeis. Implementei sistema de recompensas, APIs REST para sistemas internos e administrei containers Docker. Integrei APIs de IA para automação de processos."
    },
    {
      role: "WEB DEVELOPER FULLSTACK",
      company: "VITABE",
      year: "FEV 2025 – ABR 2025",
      description: "Automatizei processos com PHP/Laravel (redução de 40% no tempo de NF). Integrei Uappi e Vindi via APIs. Desenvolvi interfaces Vue.js e iniciei integração com Shopify API."
    },
    {
      role: "WEB DEVELOPER FULLSTACK",
      company: "C4 PUBLICIDADE",
      year: "2021 – 2024",
      description: "Desenvolvi +20 sites com PHP/JS. Otimizei performance front-end (redução de 60% no carregamento). Automatizei tarefas com PHP/jQuery e colaborei em UX/Acessibilidade."
    },
    {
      role: "SUPORTE TÉCNICO E DESENV. WEB",
      company: "LUMINOSOS CAMPINAS",
      year: "2019 – 2021",
      description: "Manutenção de ERP em Visual Basic/SQL. Desenvolvi novo site institucional e realizei suporte de infraestrutura."
    }
  ] : [
    {
      role: "FULLSTACK WEB DEVELOPER",
      company: "HOSPITAL MATERNIDADE DE CAMPINAS",
      year: "DEC 2025 – PRESENT",
      description: "Developed BI dashboards with WeKnow for hospital data analysis (+5 departments). Optimized SQL queries in MV database. Created React.js apps for administrative processes and RESTful API integrations. Refactored legacy systems and managed versioning with GitLab."
    },
    {
      role: "FULLSTACK WEB DEVELOPER",
      company: "AGROSS INSUMOS AGRÍCOLAS",
      year: "JUL 2025 – DEC 2025",
      description: "Vue.js 3 development in agile cycles. Implemented rewards system, REST APIs for internal systems, and managed Docker containers. Integrated AI APIs for process automation."
    },
    {
      role: "FULLSTACK WEB DEVELOPER",
      company: "VITABE",
      year: "FEB 2025 – APR 2025",
      description: "Automated processes with PHP/Laravel (40% reduction in invoice time). Integrated Uappi and Vindi via APIs. Developed Vue.js interfaces and started Shopify API integration."
    },
    {
      role: "FULLSTACK WEB DEVELOPER",
      company: "C4 PUBLICIDADE",
      year: "2021 – 2024",
      description: "Developed +20 sites with PHP/JS. Optimized front-end performance (60% reduction in load time). Automated tasks with PHP/jQuery and collaborated on UX/Accessibility."
    },
    {
      role: "TECH SUPPORT & WEB DEV",
      company: "LUMINOSOS CAMPINAS",
      year: "2019 – 2021",
      description: "ERP maintenance in Visual Basic/SQL. Developed new institutional website and provided infrastructure support."
    }
  ];

  const skills = [
    "PHP", "Laravel", "JavaScript", "React.js", "Vue.js", "Docker", "CI/CD", "Redis", "SQL", "Git", "HTML5", "CSS3", "jQuery", "Visual Basic", "WeKnow", "MV", "Shopify API"
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
        <div className="text-xl font-black tracking-tighter">GABRIELDEV</div>
        <div className="hidden md:flex gap-8 items-center">
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
          <button 
            onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
            className="ml-4 px-2 py-1 border border-gray-700 font-mono text-[10px] tracking-widest hover:border-[#E8175D] hover:text-[#E8175D] transition-all rounded uppercase"
          >
            {lang === 'pt' ? 'EN' : 'PT'}
          </button>
        </div>
        {/* Mobile Language Toggle */}
        <button 
          onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
          className="md:hidden px-2 py-1 border border-gray-700 font-mono text-[10px] tracking-widest hover:border-[#E8175D] hover:text-[#E8175D] transition-all rounded uppercase"
        >
          {lang === 'pt' ? 'EN' : 'PT'}
        </button>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative z-10 flex flex-col justify-center min-h-screen px-8 md:px-12 pt-20">
        <ParticleWave />
        <GlowingOrbs />
        <div className="max-w-7xl w-full mx-auto relative z-10">
          <div className="relative mb-12">
            <h1 className="hero-text text-[11vw] md:text-[9vw] font-black leading-[0.85] tracking-tighter uppercase">
              {t[lang].hero.title1}
            </h1>
            <div className="flex items-start gap-4 md:gap-8">
              <div className="hero-line w-[1px] bg-gray-700 self-stretch mt-4" />
              <h1 className="hero-text text-[11vw] md:text-[9vw] font-black leading-[0.85] tracking-tighter uppercase text-[#E8175D]">
                {t[lang].hero.title2}
              </h1>
            </div>
            <div className="absolute right-0 bottom-0 text-right">
              <p className="hero-text font-mono text-[10px] tracking-widest text-gray-400">
                {t[lang].hero.subtitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end mt-24">
            <div className="space-y-12">
              <div className="h-[1px] w-full bg-gray-800" />
              <div className="font-mono text-[11px] tracking-[0.2em] text-gray-400">
                {t[lang].hero.tagline}
              </div>
              <a href="#projects" className="group flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase hover:text-[#E8175D] transition-colors">
                {t[lang].hero.explore}
                <span className="inline-block transform group-hover:translate-y-1 transition-transform">
                  ↓
                </span>
              </a>
            </div>
            <div className="flex flex-col items-end text-right">
              <p className="max-w-md font-mono text-[11px] leading-relaxed text-gray-500 uppercase tracking-tight">
                {t[lang].hero.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative z-10 py-32 px-8 md:px-12">
        <div className="max-w-7xl w-full mx-auto">
          <SectionHeader number="02" title={t[lang].sections.projects} />
          
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
        className="relative z-10 py-32 px-8 md:px-12 bg-[#050505] overflow-hidden"
      >
        {/* Background Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        {/* Grid Lighting Effect */}
        <div 
          className="experience-light absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 300px at 0px 0px, rgba(232, 23, 93, 0.15), transparent 80%)`
          }}
        />
        
        {/* Decorative Crosshairs in background */}
        <div className="absolute top-20 left-20 text-gray-700 font-mono text-xs">+</div>
        <div className="absolute bottom-20 right-20 text-gray-700 font-mono text-xs">+</div>

        <div className="max-w-7xl w-full mx-auto relative z-10">
          <SectionHeader number="03" title={t[lang].sections.experience} />
          
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

      <EducationSection lang={lang} t={t} />

      {/* Technologies Section */}
      <section 
        id="skills" 
        ref={techSectionRef}
        className="relative z-10 bg-[#030303] overflow-hidden min-h-screen flex flex-col justify-center"
        style={{ perspective: '1000px' }}
      >
        <div className="absolute top-20 left-0 right-0 px-8 md:px-12 z-20 w-full max-w-7xl mx-auto">
          <SectionHeader number="05" title={t[lang].sections.technologies} />
        </div>

        {/* Post Processing Overlays */}
        <div className="scanlines z-30" />
        <div className="vignette z-30" />

        {/* Background Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
          <h2 className="tech-bg-text font-display text-[20vw] text-white/[0.02] leading-none select-none whitespace-nowrap uppercase">
            Deep Stack
          </h2>
        </div>

        {/* 3D World Container */}
        <div 
          ref={techContainerRef} 
          className="relative w-full h-screen flex items-center justify-center z-10"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {skills.map((skill, index) => (
            <div
              key={index}
              className="tech-card absolute flex flex-col justify-between w-[300px] md:w-[380px] h-[450px] bg-[#0a0a0a]/40 backdrop-blur-md border border-white/10 p-8 md:p-10 group hover:border-[#E8175D]"
              style={{ transformOrigin: 'center center' }}
            >
              {/* Corner Accents */}
              <div className="absolute -top-px -left-px w-4 h-4 border-t border-l border-white/30 group-hover:border-[#E8175D] transition-colors" />
              <div className="absolute -bottom-px -right-px w-4 h-4 border-b border-r border-white/30 group-hover:border-[#E8175D] transition-colors" />
              
              <div className="card-header border-b border-white/10 pb-4 flex justify-between items-center">
                <span className="font-mono text-[10px] text-[#E8175D] tracking-widest">
                  ID-{Math.floor(1000 + Math.random() * 9000)}
                </span>
                <div className="w-2 h-2 bg-[#E8175D] shadow-[0_0_10px_#E8175D]" />
              </div>

              <div className="flex-1 flex items-center justify-center">
                <h3 className="font-display text-5xl md:text-6xl tracking-tighter uppercase leading-none text-center group-hover:text-[#E8175D] transition-colors mix-blend-hard-light">
                  {skill}
                </h3>
              </div>

              <div className="card-footer pt-4 border-t border-white/10 flex justify-between items-end">
                <div className="font-mono text-[8px] text-gray-500 space-y-1">
                  <div>GRID: {Math.floor(Math.random() * 10)}x{Math.floor(Math.random() * 10)}</div>
                  <div>DATA_SIZE: {(Math.random() * 100).toFixed(1)}MB</div>
                </div>
                <span className="font-mono text-4xl text-white/5 group-hover:text-white/10 transition-colors font-black">
                  0{index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* HUD Elements */}
        <div className="absolute inset-8 pointer-events-none z-20 flex flex-col justify-between font-mono text-[10px] text-white/30 uppercase">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-[#E8175D]">SYS.READY</span>
              <div className="w-24 h-px bg-white/20 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#E8175D]" />
              </div>
            </div>
            <span>LOC: 37.7749° N, 122.4194° W</span>
          </div>
          <div className="flex justify-between items-center">
            <span>SCROLL_VELOCITY // <span id="vel-readout" className="text-[#E8175D]">0.00</span></span>
            <div className="flex items-center gap-4">
              <div className="w-24 h-px bg-white/20 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#E8175D]" />
              </div>
              <span>FPS: <span id="fps">60</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-32 px-8 md:px-12">
        <div className="max-w-7xl w-full mx-auto">
          <SectionHeader number="06" title={t[lang].sections.contact} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
            <div className="space-y-8">
              <p 
                className="font-display text-5xl md:text-7xl leading-[0.9] tracking-tighter uppercase"
                dangerouslySetInnerHTML={{ __html: t[lang].contact.title }}
              />
              <div className="flex flex-col gap-4">
                <a href="mailto:gabriel938@gmail.com" className="font-mono text-xl md:text-2xl hover:text-[#E8175D] transition-colors underline underline-offset-8 decoration-gray-800 hover:decoration-[#E8175D]">
                  gabriel938@gmail.com
                </a>
                <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">
                  {t[lang].contact.status}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col justify-end gap-12">
              <ContactForm lang={lang} t={t} />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-gray-900 px-8 md:px-12">
        <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-mono text-[10px] text-gray-600 uppercase tracking-widest">
            © 2024 GABRIELDEV / ALL RIGHTS RESERVED
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
