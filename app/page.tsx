'use client';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState, TouchEvent } from 'react';
import Link from 'next/link';
import { getCalApi } from "@calcom/embed-react";

interface Testimonial {
  name: string;
  role: string;
  text: string;
  image: string;
}

// Testimonials Carousel Component
const TestimonialsCarousel = ({ testimonials }: { testimonials: Testimonial[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }
    if (isRightSwipe) {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  return (
    <div 
      className="relative w-full overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex items-center justify-center">
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
          className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/[0.04] text-blue-100/70 hover:text-white hover:bg-white/10 transition-all"
        >
          ←
        </button>
        
        <div className="relative w-full max-w-2xl mx-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-6 sm:p-8"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-5 font-display text-5xl leading-none text-sky-300/40">&ldquo;</div>
                <p className="font-display text-lg sm:text-xl italic leading-relaxed text-white/90">
                  {testimonials[currentIndex].text}
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-400/15 text-base font-medium text-sky-300">
                    {testimonials[currentIndex].name[0]}
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-semibold text-white">
                      {testimonials[currentIndex].name}
                    </h3>
                    <p className="text-sm text-blue-100/50">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
          className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/[0.04] text-blue-100/70 hover:text-white hover:bg-white/10 transition-all"
        >
          →
        </button>
      </div>

      {/* Mobile Swipe Indicator */}
      <div className="sm:hidden flex justify-center mt-4 gap-2">
        {testimonials.map((_: Testimonial, index: number) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-white w-4' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  const servicesRef = useRef<HTMLElement>(null);
  const consultRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const buttonOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  const testimonials = [
    {
      name: "Susana Z.",
      role: "Mom of Adrian Zapatier",
      text: "My son Adrian is in a 5th grade gifted class that is both challenging and fast-paced, covering advanced math standards from sixth through eighth grade. Hemanshu has worked intensively with him to ensure he not only keeps up but also builds a strong foundation for future learning.",
      image: "/testimonial1.jpg"
    },
    {
      name: "Prajwal N.",
      role: "High School Senior",
      text: "The way Hemanshu helped me strategize for the SAT was incredible. He's helped me boost my score by 100 points in just a week and a half!",
      image: "/testimonial2.jpg"
    },
    {
      name: "Uma R.",
      role: "Former high school student",
      text: "Working with Hemanshu throughout my Honors Biology course in high school was a game changer. He explained complex concepts in a way that was easy to understand. Because of this, I was able to improve by a letter grade in that class!",
      image: "/testimonial3.jpg"
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 100) {
        // You can add any scroll-based logic here if needed
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const scrollToConsult = () => {
    consultRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({"namespace":"consultation"});
      cal("ui", {"theme":"dark","hideEventTypeDetails":false,"layout":"month_view"});
    })();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a1628]">
      {/* Hero Section — refined editorial redesign */}
      <section className="relative z-20 min-h-screen overflow-hidden bg-[#0a1628]">
        {/* Ambient glow + subtle grid */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-15%] h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[140px]" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)
              `,
              backgroundSize: '64px 64px',
              maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 75%)',
            }}
          />
        </div>

        {/* Nav */}
        <nav className="relative z-30 mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#0a1628]">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
              </svg>
            </span>
            <div className="leading-tight">
              <div className="text-sm font-medium text-white">Hemanshu Boppana</div>
              <div className="text-xs tracking-wide text-blue-200/60">Academic Tutor</div>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-medium text-blue-100/80 transition-colors hover:text-white"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-white px-5 py-2 text-sm font-medium text-[#0a1628] transition-all hover:-translate-y-0.5 hover:bg-blue-50"
            >
              Sign Up
            </Link>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-20 mx-auto flex min-h-[calc(100vh-92px)] max-w-4xl flex-col items-center justify-center px-6 py-16 text-center sm:px-8">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-sky-300/80"
          >
            K–12 Tutoring &amp; Test Prep
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{ fontFamily: 'var(--font-playfair)' }}
            className="text-5xl font-medium leading-[1.02] tracking-tight text-white sm:text-7xl md:text-8xl"
          >
            Where it finally{' '}
            <span className="italic text-sky-300">clicks.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-blue-100/70 sm:text-xl"
          >
            One-on-one tutoring in math, science, reading, and SAT/ACT prep —
            built around how your student actually learns. Real understanding,
            real improvement, real confidence.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          >
            <button
              onClick={scrollToServices}
              className="rounded-full bg-white px-7 py-3.5 text-base font-medium text-[#0a1628] transition-all hover:-translate-y-0.5 hover:bg-blue-50"
            >
              View Services
            </button>
            <button
              data-cal-namespace="consultation"
              data-cal-link="hemanshu-boppana-inqnfj/consultation"
              data-cal-config='{"layout":"month_view","theme":"dark"}'
              className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-base font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-white/5"
            >
              Book a free consultation
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </button>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.button
          style={{ opacity: buttonOpacity }}
          onClick={scrollToServices}
          aria-label="Scroll to services"
          className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-blue-200/50 transition-colors hover:text-white"
        >
          <svg className="h-6 w-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.button>
      </section>

      {/* About Section */}
      <section id="about" className="border-t border-white/5 py-24 px-6 sm:px-8 scroll-mt-20">
        <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-sky-300/80">
              About me
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-medium tracking-tight text-white">
              Hi, I&apos;m <span className="italic text-sky-300">Hemanshu.</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-blue-100/70">
              I love making hard things make sense. Over the past five years I&apos;ve
              worked one-on-one with K–12 students — turning frustration into
              understanding, one session at a time.
            </p>
            <p className="mt-4 leading-relaxed text-blue-100/60">
              I hold myself to the same standard I set for my students, and I build
              every session around how each one actually learns.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-blue-100/80">
              <svg className="h-4 w-4 text-sky-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Trusted by families across Central Florida
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { stat: '5+ yrs', label: 'One-on-one tutoring experience' },
              { stat: '1560', label: 'SAT score' },
              { stat: '4.7 / 3.95', label: 'GPA — high school / college' },
              { stat: '12 APs', label: '11 fives and 1 four' },
            ].map((s) => (
              <motion.div
                key={s.label}
                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
              >
                <div className="font-display text-3xl sm:text-4xl font-medium text-white">
                  {s.stat}
                </div>
                <div className="mt-2 text-sm leading-snug text-blue-100/60">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <motion.section
        ref={servicesRef}
        id="services"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="border-t border-white/5 py-24 px-6 sm:px-8 scroll-mt-20"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 max-w-2xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-sky-300/80">
              What I offer
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-medium tracking-tight text-white">
              Two ways to <span className="italic text-sky-300">work together.</span>
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {[
              {
                n: '01',
                title: 'General Instruction',
                price: '$30',
                desc: 'Comprehensive tutoring across subjects and topics — built for students who want steady, personalized academic support.',
              },
              {
                n: '02',
                title: 'SAT / ACT Prep',
                price: '$35',
                desc: 'Focused test prep: section strategy, timed practice tests, and targeted review that turns into real score gains.',
              },
            ].map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                viewport={{ once: true }}
                className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-8 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
              >
                <div className="mb-6 font-mono text-xs text-sky-300/70">{s.n}</div>
                <h3 className="mb-3 text-2xl font-semibold text-white">{s.title}</h3>
                <p className="mb-8 leading-relaxed text-blue-100/60">{s.desc}</p>
                <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-6">
                  <span className="text-lg text-white">
                    <span className="font-display text-3xl">{s.price}</span>
                    <span className="text-blue-100/50"> / hr</span>
                  </span>
                  <button onClick={scrollToConsult} className="btn-primary">
                    Book Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <section className="border-t border-white/5 py-24 px-6 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-sky-300/80">
              In their words
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-medium tracking-tight text-white">
              Results students <span className="italic text-sky-300">feel.</span>
            </h2>
          </div>
          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* Consultation Section */}
      <section ref={consultRef} className="border-t border-white/5 py-24 px-6 sm:px-8 scroll-mt-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-sky-300/80">
            Let&apos;s talk
          </p>
          <h2 className="font-display text-3xl sm:text-5xl font-medium tracking-tight text-white">
            Ready to get <span className="italic text-sky-300">started?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-blue-100/60">
            Book a free consultation and we&apos;ll map out a plan tailored to your goals — no commitment required.
          </p>

          <div className="mt-10 flex flex-col items-center gap-8">
            <button
              data-cal-namespace="consultation"
              data-cal-link="hemanshu-boppana-inqnfj/consultation"
              data-cal-config='{"layout":"month_view","theme":"dark"}'
              className="btn-primary text-lg px-8 py-4"
            >
              Schedule a Consultation
            </button>

            <div className="flex flex-col items-center gap-4 text-blue-100/70 sm:flex-row sm:gap-8">
              <a href="tel:+16304534655" className="flex items-center gap-2 transition-colors hover:text-white">
                <svg className="h-5 w-5 text-sky-300/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                (630) 453-4655
              </a>
              <a href="mailto:hboppana01@gmail.com" className="flex items-center gap-2 transition-colors hover:text-white">
                <svg className="h-5 w-5 text-sky-300/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                hboppana01@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-10 sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 text-sm text-blue-100/40 sm:flex-row">
          <span>© {new Date().getFullYear()} Hemanshu Boppana</span>
          <span>Personal Academic Tutoring</span>
        </div>
      </footer>
    </div>
  );
}
