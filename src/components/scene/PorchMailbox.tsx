'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { soundscape } from '@/lib/soundEngine';
import { site } from '@/data/site';

type FormPhase = 'writing' | 'depositing' | 'zooming_out';
const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;

// Mailbox position on the horizontal wooden bracket of the post (X: ~67.5%, Y: ~56.5%)
const MAILBOX_POS = { left: '67.5%', top: '56.5%' };
const BUTTON_POS  = { left: '67.5%', top: '43%' };

export default function PorchMailbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formPhase, setFormPhase] = useState<FormPhase>('writing');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [justSent, setJustSent] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Manage body class to hide header/footer when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('mailbox-modal-open');
    } else {
      document.body.classList.remove('mailbox-modal-open');
    }
    return () => {
      document.body.classList.remove('mailbox-modal-open');
    };
  }, [isOpen]);

  const handleOpen = () => {
    soundscape.playClickSound();
    setFormPhase('writing');
    setErrorMessage('');
    setIsOpen(true);
    setTimeout(() => {
      soundscape.playPageTurnSound();
    }, 180);
  };

  const handleClose = () => {
    soundscape.playClickSound();
    setIsOpen(false);
    setFormPhase('writing');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    soundscape.playClickSound();
    setIsSubmitting(true);
    setErrorMessage('');

    // If Formspree ID is not configured, fallback to mailto
    if (!formspreeId) {
      const body = encodeURIComponent(`${message}\n\n— From: ${name} (${email})`);
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent('A postcard from your porch')}&body=${body}`;
      triggerDepositAnimation();
      return;
    }

    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error('bad response');
      triggerDepositAnimation();
    } catch {
      setIsSubmitting(false);
      setErrorMessage(`Could not send note. Try emailing ${site.email} directly!`);
    }
  };

  // Step 1: Show open mailbox with postcard inside
  // Step 2: Zoom back out smoothly to the porch scene
  const triggerDepositAnimation = () => {
    setIsSubmitting(false);
    setFormPhase('depositing');
    soundscape.playPageTurnSound();
    setTimeout(() => soundscape.playSparkleSound(), 250);

    // After 1.3s of showing the open mailbox with the postcard safely inside, zoom back out to porch
    setTimeout(() => {
      setFormPhase('zooming_out');

      // Modal closes when zoom completes
      setTimeout(() => {
        setIsOpen(false);
        setFormPhase('writing');
        setJustSent(true);
        setName('');
        setEmail('');
        setMessage('');

        // Toast stays on porch for 5s then fades
        setTimeout(() => {
          setJustSent(false);
        }, 5000);
      }, 700);
    }, 1400);
  };

  const handleQuickNote = (promptText: string) => {
    soundscape.playClickSound();
    setMessage((prev) => (prev ? `${prev} ${promptText}` : promptText));
  };

  return (
    <>
      {/* ---------------- 1. The Interactive Mailbox on the Wooden Bracket ---------------- */}
      <div
        onClick={handleOpen}
        className="group absolute z-20 -translate-x-1/2 -translate-y-[96%] cursor-pointer select-none"
        style={{ ...MAILBOX_POS, width: '12.5%' }}
      >
        {/* Soft contact shadow on wooden bracket */}
        <div
          aria-hidden="true"
          className="absolute -bottom-1 left-1/2 h-2.5 w-4/5 -translate-x-1/2 rounded-full bg-[#3D2516]/45 blur-[2.5px]"
        />

        {/* Day Mailbox (Closed or Open) */}
        <div className="only-day relative h-full w-full">
          <img
            src={isOpen && formPhase === 'writing' ? '/assets/objects/mailbox-open.png' : '/assets/objects/porch-mailbox.png'}
            alt="Vintage Cherry Blossom Cottage Mailbox"
            className="h-full w-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.18)]"
          />
        </div>

        {/* Night Mailbox (with warm lantern light reflection) */}
        <div className="only-night relative h-full w-full">
          <img
            src={isOpen && formPhase === 'writing' ? '/assets/objects/mailbox-open.png' : '/assets/objects/porch-mailbox-night.png'}
            alt="Vintage Cherry Blossom Cottage Mailbox at Night"
            className="h-full w-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
          />
        </div>

        {/* Small floating notification bubble after letter is sent */}
        <AnimatePresence>
          {justSent && !isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -top-14 left-1/2 -translate-x-1/2 z-40 whitespace-nowrap pointer-events-none"
            >
              <div className="rounded-2xl border-2 border-pink-300 bg-white/95 px-3.5 py-1.5 shadow-[0_4px_16px_rgba(214,70,118,0.3)] backdrop-blur-xs flex items-center gap-1.5">
                <span className="font-display text-xs sm:text-sm font-extrabold text-[#5B3A47]">
                  Letter delivered! 💌
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---------------- 2. Glossy Bubble Button Above Mailbox ---------------- */}
      {!isOpen && (
        <div
          className="absolute z-30 -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none"
          style={BUTTON_POS}
        >
          <button
            type="button"
            onClick={handleOpen}
            aria-label="Open the mailbox to send a handwritten postcard"
            className="group relative flex flex-col items-center focus:outline-none"
          >
            {/* Warm glowing aura */}
            <span
              aria-hidden="true"
              className="absolute -inset-2.5 rounded-full bg-amber-400/35 blur-md transition-opacity duration-300 animate-pulse group-hover:bg-pink-400/50"
            />

            {/* Breathing ping ring */}
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-pink-300/50 opacity-60 transition-opacity duration-300 animate-ping-soft group-hover:opacity-90 dark:bg-pink-400/30"
            />

            {/* Rose-berry glossy bubble button */}
            <span className="relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-white/95 bg-gradient-to-br from-[#FFB8CE] via-[#F482A5] to-[#D64676] text-white shadow-[0_4px_16px_rgba(214,70,118,0.45)] backdrop-blur-xs transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_22px_rgba(244,114,182,0.85)] group-active:scale-95">
              {/* Glossy top-left bubble highlight */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1.5 left-2 h-2.5 w-3.5 rounded-full bg-white/45 blur-[0.5px] -rotate-12"
              />

              {/* Custom SVG Postcard / Letter Envelope Icon */}
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6 text-white drop-shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </span>

            {/* Hover / focus tooltip pill */}
            <span
              role="tooltip"
              className="pointer-events-none absolute bottom-full mb-2 flex flex-col items-center whitespace-nowrap rounded-xl border border-pink-200/90 bg-paper/95 px-3 py-1 font-sans text-xs font-bold text-ink opacity-0 shadow-lg backdrop-blur-xs transition-all duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 group-hover:-translate-y-0.5 dark:border-white/20 dark:bg-[#25182E]/95 dark:text-pink-100"
            >
              <span className="font-display text-xs text-pink-600 dark:text-pink-300 font-extrabold tracking-wide">
                Send a Postcard
              </span>
              <span className="font-hand text-[11px] text-ink-soft">
                Drop a note in the mailbox &bull; Click to write
              </span>
            </span>
          </button>
        </div>
      )}

      {/* ---------------- 3. The Fullscreen Postcard & Depositing Animation Modal ---------------- */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-3 pt-7 sm:p-5 select-none overflow-y-auto">
                {/* Backdrop Blur & Scrim */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={formPhase === 'writing' ? handleClose : undefined}
                  className="fixed inset-0 bg-[#2B1B26]/65 backdrop-blur-md"
                />

                {/* ================= STAGE A: WRITING THE POSTCARD ================= */}
                {formPhase === 'writing' && (
                  <motion.div
                    key="postcard-writing-card"
                    initial={{ opacity: 0, scale: 0.8, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', damping: 24, stiffness: 280 }}
                    className="relative z-10 w-full max-w-[340px] sm:max-w-xl md:max-w-2xl lg:max-w-3xl flex flex-col items-center justify-center my-auto"
                  >
                    {/* Close Pill Button - Snug with top rim of the card */}
                    <button
                      type="button"
                      onClick={handleClose}
                      aria-label="Put postcard back in mailbox"
                      className="group absolute -top-2.5 right-2 sm:-top-2.5 sm:right-3 z-30 flex items-center gap-1.5 rounded-full border-2 border-pink-200/90 bg-white/95 px-3 py-1 font-display text-xs font-extrabold text-[#5B3A47] shadow-md transition-all hover:scale-105 active:scale-95 hover:bg-pink-50"
                    >
                      <span>Put back in mailbox</span>
                      <span className="text-pink-500 font-bold ml-0.5 text-sm leading-none">&times;</span>
                    </button>

                    {/* ================= DESKTOP / TABLET POSTCARD (Horizontal 3:2) ================= */}
                    <form
                      onSubmit={handleSubmit}
                      className="relative w-full aspect-[3/2] hidden sm:block drop-shadow-[0_16px_36px_rgba(0,0,0,0.35)]"
                    >
                      {/* Illustrated Postcard Background Artwork */}
                      <img
                        src="/assets/objects/porch-postcard.png"
                        alt="Handmade Postcard Stationery"
                        className="absolute inset-0 h-full w-full object-contain pointer-events-none"
                      />

                      {/* --- Section 1: Sender Name & Email (Positioned clearly between roses and postmark) --- */}
                      <div
                        className="absolute flex flex-col justify-center space-y-1"
                        style={{
                          left: '27%',
                          top: '12%',
                          width: '36%',
                          height: '21%',
                        }}
                      >
                        {/* Name Line */}
                        <div className="flex items-baseline gap-2 border-b border-pink-400/60 pb-1">
                          <span className="font-hand text-sm font-bold text-[#5B3A47] shrink-0">From:</span>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                            className="w-full bg-transparent font-hand text-sm md:text-base font-bold text-[#5B3A47] placeholder:text-[#5B3A47]/45 focus:outline-none"
                          />
                        </div>

                        {/* Email Line */}
                        <div className="flex items-baseline gap-2 border-b border-pink-400/60 pb-1">
                          <span className="font-hand text-sm font-bold text-[#5B3A47] shrink-0">Email:</span>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="yourname@gmail.com"
                            className="w-full bg-transparent font-hand text-sm md:text-base font-bold text-[#5B3A47] placeholder:text-[#5B3A47]/45 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* --- Section 2: Quick Stamps Row (Cleanly placed in the space above handwriting lines) --- */}
                      <div
                        className="absolute flex items-center gap-1.5"
                        style={{
                          left: '16%',
                          top: '30%',
                          width: '68%',
                        }}
                      >
                        <span className="font-hand text-xs font-bold text-[#5B3A47]/80">Quick stamps:</span>
                        <button
                          type="button"
                          onClick={() => handleQuickNote('Saying a warm hello!')}
                          className="group rounded-full bg-white/95 border border-pink-300 px-2.5 py-0.5 font-hand text-xs font-bold text-[#5B3A47] shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:rotate-[-1.5deg] hover:bg-pink-50 hover:border-pink-400 hover:shadow-sm active:scale-95 active:rotate-0"
                        >
                          <span>Saying hello</span>
                          <span className="inline-block ml-1 transition-transform duration-200 group-hover:scale-125">🌸</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickNote('Have an engineering role/project in mind!')}
                          className="group rounded-full bg-white/95 border border-pink-300 px-2.5 py-0.5 font-hand text-xs font-bold text-[#5B3A47] shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:rotate-[1.5deg] hover:bg-pink-50 hover:border-pink-400 hover:shadow-sm active:scale-95 active:rotate-0"
                        >
                          <span>Work inquiry</span>
                          <span className="inline-block ml-1 transition-transform duration-200 group-hover:scale-125">💼</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickNote('Would love to connect over tea!')}
                          className="group rounded-full bg-white/95 border border-pink-300 px-2.5 py-0.5 font-hand text-xs font-bold text-[#5B3A47] shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:rotate-[-1.5deg] hover:bg-pink-50 hover:border-pink-400 hover:shadow-sm active:scale-95 active:rotate-0"
                        >
                          <span>Tea chat</span>
                          <span className="inline-block ml-1 transition-transform duration-200 group-hover:scale-125">☕</span>
                        </button>
                      </div>

                      {/* --- Section 3: Handwritten Message (Sits directly ON the pink ruled lines) --- */}
                      <div
                        className="absolute"
                        style={{
                          left: '16%',
                          top: '41%',
                          width: '68%',
                          height: '38%',
                        }}
                      >
                        <textarea
                          required
                          rows={4}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Dear Sutanuka,&#10;Write a cozy note here..."
                          style={{
                            lineHeight: '2.6rem', // Accurately aligns each line of writing onto the ruled pink lines
                          }}
                          className="w-full h-full resize-none bg-transparent font-hand text-base md:text-lg font-bold text-[#5B3A47] placeholder:text-[#5B3A47]/45 focus:outline-none pt-3 sm:pt-3.5"
                        />
                      </div>

                      {/* --- Section 4: The Prominent "Post in Mailbox" Button (Moved comfortably up from bottom rim) --- */}
                      <div
                        className="absolute flex items-center justify-center"
                        style={{
                          left: '50%',
                          bottom: '8.5%',
                          transform: 'translateX(-50%)',
                        }}
                      >
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="group flex items-center gap-2 rounded-full border-2 border-white bg-[#D64676] hover:bg-[#BE3460] px-7 py-2 font-display text-sm font-extrabold text-white shadow-[0_4px_18px_rgba(214,70,118,0.55)] transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(214,70,118,0.7)] active:scale-95 disabled:opacity-70 whitespace-nowrap"
                        >
                          <span>Post in Mailbox</span>
                          <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </div>

                      {/* Error notice if needed */}
                      {errorMessage && (
                        <p className="absolute bottom-1 left-1/2 -translate-x-1/2 font-hand text-xs text-rose-600 font-bold whitespace-nowrap">
                          {errorMessage}
                        </p>
                      )}
                    </form>

                    {/* ================= MOBILE POSTCARD (Vertical 2:3) ================= */}
                    <form
                      onSubmit={handleSubmit}
                      style={{ containerType: 'inline-size' }}
                      className="relative w-full max-w-[340px] aspect-[2/3] block sm:hidden drop-shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
                    >
                      <img
                        src="/assets/objects/porch-postcard-mobile.png"
                        alt="Handmade Postcard Stationery Mobile"
                        className="absolute inset-0 h-full w-full object-contain pointer-events-none"
                      />

                      {/* --- Section 1: Line 1 - From: Your Name (Sits right on ruled line 1 at Y=28.7%) --- */}
                      <div
                        className="absolute flex items-baseline gap-1.5"
                        style={{
                          left: '11%',
                          width: '78%',
                          top: '23.8%',
                          height: '5.2%',
                        }}
                      >
                        <span className="font-hand text-xs font-bold text-[#5B3A47] shrink-0">From:</span>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full bg-transparent font-hand text-xs font-bold text-[#5B3A47] placeholder:text-[#5B3A47]/45 focus:outline-none"
                        />
                      </div>

                      {/* --- Section 2: Line 2 - Email: yourname@gmail.com (Sits right on ruled line 2 at Y=34.2%) --- */}
                      <div
                        className="absolute flex items-baseline gap-1.5"
                        style={{
                          left: '11%',
                          width: '78%',
                          top: '29.3%',
                          height: '5.2%',
                        }}
                      >
                        <span className="font-hand text-xs font-bold text-[#5B3A47] shrink-0">Email:</span>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="yourname@gmail.com"
                          className="w-full bg-transparent font-hand text-xs font-bold text-[#5B3A47] placeholder:text-[#5B3A47]/45 focus:outline-none"
                        />
                      </div>

                      {/* --- Section 3: Lines 3 to 8 - Handwritten Message Textarea (Aligned on ruled lines) --- */}
                      <div
                        className="absolute"
                        style={{
                          left: '11%',
                          width: '78%',
                          top: '35.0%',
                          height: '35.5%',
                        }}
                      >
                        <textarea
                          required
                          rows={5}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Dear Sutanuka,&#10;Write a warm note here..."
                          style={{
                            lineHeight: '8.55cqw',
                          }}
                          className="w-full h-full resize-none bg-transparent font-hand text-xs font-bold text-[#5B3A47] placeholder:text-[#5B3A47]/45 focus:outline-none pt-1"
                        />
                      </div>

                      {/* --- Section 4: Quick Stamps Row (Compact pills above submit button) --- */}
                      <div
                        className="absolute flex items-center justify-center gap-1.5"
                        style={{
                          left: '8%',
                          width: '84%',
                          top: '71.5%',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleQuickNote('Saying a warm hello!')}
                          className="rounded-full bg-white/95 border border-pink-300 px-2 py-0.5 font-hand text-[10px] font-bold text-[#5B3A47] shadow-2xs hover:bg-pink-50 active:scale-95"
                        >
                          <span>Saying hello</span>
                          <span className="ml-0.5">🌸</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickNote('Have an engineering role/project in mind!')}
                          className="rounded-full bg-white/95 border border-pink-300 px-2 py-0.5 font-hand text-[10px] font-bold text-[#5B3A47] shadow-2xs hover:bg-pink-50 active:scale-95"
                        >
                          <span>Work inquiry</span>
                          <span className="ml-0.5">💼</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickNote('Would love to connect over tea!')}
                          className="rounded-full bg-white/95 border border-pink-300 px-2 py-0.5 font-hand text-[10px] font-bold text-[#5B3A47] shadow-2xs hover:bg-pink-50 active:scale-95"
                        >
                          <span>Tea chat</span>
                          <span className="ml-0.5">☕</span>
                        </button>
                      </div>

                      {/* --- Section 5: The Prominent "Post in Mailbox" Button (No emoji, centered) --- */}
                      <div
                        className="absolute flex items-center justify-center"
                        style={{
                          left: '50%',
                          top: '80.5%',
                          transform: 'translateX(-50%)',
                          width: '74%',
                        }}
                      >
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full flex items-center justify-center gap-2 rounded-full border-2 border-white bg-[#D64676] hover:bg-[#BE3460] py-2 font-display text-xs font-extrabold text-white shadow-[0_4px_16px_rgba(214,70,118,0.55)] transition-all active:scale-95 disabled:opacity-70 whitespace-nowrap"
                        >
                          <span>Post in Mailbox</span>
                          <svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </div>

                      {/* Error notice if needed */}
                      {errorMessage && (
                        <p className="absolute bottom-1 left-1/2 -translate-x-1/2 font-hand text-[10px] text-rose-600 font-bold whitespace-nowrap">
                          {errorMessage}
                        </p>
                      )}
                    </form>

                    {/* Sutanuka's Quick Socials Bar - Snug underneath the postcard with tactile microanimations */}
                    <div className="mt-0.5 sm:-mt-1 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
                      {site.socials.map((s, idx) => (
                        <a
                          key={s.label}
                          href={s.href}
                          target={s.href.startsWith('http') ? '_blank' : undefined}
                          rel="noopener noreferrer"
                          className={`group inline-flex items-center gap-1.5 rounded-full border border-pink-300/80 bg-white/95 px-3.5 py-1 font-hand text-xs sm:text-sm font-bold text-[#5B3A47] shadow-xs backdrop-blur-xs transition-all duration-200 hover:-translate-y-1 ${
                            idx % 2 === 0 ? 'hover:rotate-[-1.5deg]' : 'hover:rotate-[1.5deg]'
                          } hover:bg-pink-50 hover:border-pink-400 hover:shadow-md active:scale-95 active:rotate-0`}
                        >
                          <span className="transition-transform duration-200 group-hover:scale-105">{s.label}</span>
                          <svg className="h-3 w-3 text-pink-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ))}
                      <a
                        href="/resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 rounded-full border border-pink-400 bg-pink-100/95 px-3.5 py-1 font-hand text-xs sm:text-sm font-bold text-pink-800 shadow-xs backdrop-blur-xs transition-all duration-200 hover:-translate-y-1 hover:rotate-[-1deg] hover:bg-pink-200 hover:shadow-md active:scale-95 active:rotate-0"
                      >
                        <span className="transition-transform duration-200 group-hover:scale-105">Resume PDF</span>
                        <svg className="h-3 w-3 text-pink-600 transition-transform duration-200 group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </a>
                    </div>
                  </motion.div>
                )}

                {/* ================= STAGE B: SHOWING OPEN MAILBOX WITH POSTCARD INSIDE, THEN ZOOMING OUT ================= */}
                {(formPhase === 'depositing' || formPhase === 'zooming_out') && (
                  <motion.div
                    key="postcard-depositing-card"
                    initial={{ scale: 0.65, opacity: 0, y: 30 }}
                    animate={
                      formPhase === 'depositing'
                        ? { scale: 1, opacity: 1, x: 0, y: 0 }
                        : {
                            // Zoom back out towards the wooden post on the porch!
                            scale: 0.18,
                            x: '24vw',
                            y: '10vh',
                            opacity: 0,
                          }
                    }
                    transition={
                      formPhase === 'depositing'
                        ? { type: 'spring', damping: 20, stiffness: 240 }
                        : { duration: 0.65, ease: [0.32, 0, 0.67, 0] }
                    }
                    className="relative z-20 flex flex-col items-center justify-center pointer-events-none select-none"
                  >
                    {/* The Open Mailbox Graphic with Postcard Inside */}
                    <div className="relative w-72 sm:w-88 md:w-[26rem] aspect-square flex items-center justify-center">
                      {/* Radiating soft sparkle ring */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: [0, 0.8, 0.4], scale: [0.7, 1.25, 1.1] }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-300/35 via-amber-200/40 to-pink-400/35 blur-xl"
                      />

                      <img
                        src="/assets/objects/mailbox-open.png"
                        alt="Letter placed inside the cherry blossom mailbox"
                        className="relative z-10 w-full h-full object-contain drop-shadow-[0_20px_48px_rgba(0,0,0,0.5)]"
                      />
                    </div>

                    {/* Congratulatory caption */}
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="mt-3 text-center"
                    >
                      <span className="inline-block rounded-2xl border-2 border-pink-300/90 bg-white/95 px-4 py-1.5 font-display text-sm sm:text-base font-extrabold text-[#5B3A47] shadow-lg backdrop-blur-xs">
                        Letter placed in mailbox! 💌
                      </span>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
