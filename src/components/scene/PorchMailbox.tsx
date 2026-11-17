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
              <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 select-none">
                {/* Backdrop Blur & Scrim */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={formPhase === 'writing' ? handleClose : undefined}
                  className="absolute inset-0 bg-[#2B1B26]/65 backdrop-blur-md"
                />

                {/* ================= STAGE A: WRITING THE POSTCARD ================= */}
                {formPhase === 'writing' && (
                  <motion.div
                    key="postcard-writing-card"
                    initial={{ opacity: 0, scale: 0.8, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', damping: 24, stiffness: 280 }}
                    className="relative z-10 w-full max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[94vh] flex flex-col items-center justify-center"
                  >
                    {/* Close Pill Button */}
                    <button
                      type="button"
                      onClick={handleClose}
                      aria-label="Put postcard back in mailbox"
                      className="group absolute -top-4 right-2 sm:-top-5 sm:right-3 z-30 flex items-center gap-1 rounded-full border-2 border-pink-200/90 bg-white/95 px-3 py-1 font-display text-xs font-extrabold text-[#5B3A47] shadow-md transition-all hover:scale-105 active:scale-95 hover:bg-pink-50"
                    >
                      <span>Put back in mailbox</span>
                      <span className="text-pink-500 font-bold ml-0.5">&times;</span>
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

                      {/* --- Section 1: Sender Name & Email (Top-Center, avoiding washi tape on left and stamp on right) --- */}
                      <div
                        className="absolute flex flex-col justify-center space-y-1"
                        style={{
                          left: '21%',
                          top: '13%',
                          width: '38%',
                          height: '22%',
                        }}
                      >
                        {/* Name Line */}
                        <div className="flex items-baseline gap-1.5 border-b border-pink-300/80 pb-0.5">
                          <span className="font-hand text-xs font-bold text-pink-900/75 shrink-0">From:</span>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ada Lovelace"
                            className="w-full bg-transparent font-hand text-sm md:text-base font-bold text-[#5B3A47] placeholder:text-[#5B3A47]/30 focus:outline-none"
                          />
                        </div>

                        {/* Email Line */}
                        <div className="flex items-baseline gap-1.5 border-b border-pink-300/80 pb-0.5">
                          <span className="font-hand text-xs font-bold text-pink-900/75 shrink-0">Email:</span>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ada@example.com"
                            className="w-full bg-transparent font-hand text-sm md:text-base font-bold text-[#5B3A47] placeholder:text-[#5B3A47]/30 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* --- Section 2: Handwritten Message on Ruled Lines (Middle & Lower Portion) --- */}
                      <div
                        className="absolute"
                        style={{
                          left: '11%',
                          top: '37%',
                          width: '78%',
                          height: '46%',
                        }}
                      >
                        <textarea
                          required
                          rows={5}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Dear Sutanuka,&#10;Say hi, ask about a project, or tell me about a role..."
                          style={{
                            lineHeight: '2.25rem', // Aligns neatly with the painted ruled lines on the card
                          }}
                          className="w-full h-full resize-none bg-transparent font-hand text-base md:text-lg font-bold text-[#5B3A47] placeholder:text-[#5B3A47]/35 focus:outline-none"
                        />
                      </div>

                      {/* Hidden submit trigger for Enter key */}
                      <button type="submit" className="hidden" tabIndex={-1} />
                    </form>

                    {/* ================= MOBILE POSTCARD (Vertical 2:3) ================= */}
                    <form
                      onSubmit={handleSubmit}
                      className="relative w-full max-w-[340px] aspect-[2/3] block sm:hidden drop-shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
                    >
                      <img
                        src="/assets/objects/porch-postcard-mobile.png"
                        alt="Handmade Postcard Stationery Mobile"
                        className="absolute inset-0 h-full w-full object-contain pointer-events-none"
                      />

                      <div className="absolute inset-0 pt-[24%] pb-[14%] px-[12%] flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-baseline gap-1 border-b border-pink-300/80 pb-0.5">
                            <span className="font-hand text-xs font-bold text-pink-900/75 shrink-0">From:</span>
                            <input
                              type="text"
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Ada Lovelace"
                              className="w-full bg-transparent font-hand text-xs font-bold text-[#5B3A47] placeholder:text-[#5B3A47]/30 focus:outline-none"
                            />
                          </div>
                          <div className="flex items-baseline gap-1 border-b border-pink-300/80 pb-0.5">
                            <span className="font-hand text-xs font-bold text-pink-900/75 shrink-0">Email:</span>
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="ada@example.com"
                              className="w-full bg-transparent font-hand text-xs font-bold text-[#5B3A47] placeholder:text-[#5B3A47]/30 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="relative mt-2 flex-1">
                          <textarea
                            required
                            rows={5}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Dear Sutanuka,&#10;Write a warm note here..."
                            className="w-full h-full resize-none bg-transparent font-hand text-sm font-bold text-[#5B3A47] placeholder:text-[#5B3A47]/35 leading-6 focus:outline-none"
                          />
                        </div>
                      </div>

                      <button type="submit" className="hidden" tabIndex={-1} />
                    </form>

                    {/* ================= ACTION BAR: POST IN MAILBOX & QUICK STAMPS (Cleanly placed below the card) ================= */}
                    <div className="mt-3 w-full flex flex-col sm:flex-row items-center justify-between gap-2.5 px-2">
                      {/* Quick starter stamps */}
                      <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
                        <span className="font-hand text-xs font-bold text-pink-200">Quick stamps:</span>
                        <button
                          type="button"
                          onClick={() => handleQuickNote('Saying a warm hello!')}
                          className="rounded-full bg-white/90 border border-pink-200 px-2.5 py-0.5 font-hand text-xs font-bold text-[#5B3A47] shadow-xs transition-all hover:bg-pink-100 active:scale-95"
                        >
                          Saying hello 🌸
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickNote('Have an engineering role/project in mind!')}
                          className="rounded-full bg-white/90 border border-pink-200 px-2.5 py-0.5 font-hand text-xs font-bold text-[#5B3A47] shadow-xs transition-all hover:bg-pink-100 active:scale-95"
                        >
                          Work inquiry 💼
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickNote('Would love to connect over tea!')}
                          className="rounded-full bg-white/90 border border-pink-200 px-2.5 py-0.5 font-hand text-xs font-bold text-[#5B3A47] shadow-xs transition-all hover:bg-pink-100 active:scale-95"
                        >
                          Tea chat ☕
                        </button>
                      </div>

                      {/* The Big Wax Seal Send Button */}
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="relative flex items-center gap-2 rounded-full border-2 border-white/95 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 px-5 py-2 font-display text-xs sm:text-sm font-extrabold text-white shadow-[0_4px_16px_rgba(225,29,72,0.45)] transition-all hover:scale-105 active:scale-95 disabled:opacity-70"
                      >
                        <span>Post in Mailbox</span>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>

                    {/* Error notice if needed */}
                    {errorMessage && (
                      <p className="mt-1 font-hand text-xs text-rose-300 font-bold text-center">
                        {errorMessage}
                      </p>
                    )}

                    {/* Sutanuka's Quick Socials Bar */}
                    <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2">
                      {site.socials.map((s) => (
                        <a
                          key={s.label}
                          href={s.href}
                          target={s.href.startsWith('http') ? '_blank' : undefined}
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-pink-300/60 bg-white/85 px-3 py-0.5 font-hand text-xs font-bold text-[#5B3A47] shadow-xs backdrop-blur-xs transition-all hover:scale-105 hover:bg-pink-50 active:scale-95"
                        >
                          <span>{s.label}</span>
                          <svg className="h-2.5 w-2.5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ))}
                      <a
                        href="/resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-pink-400/80 bg-pink-100/90 px-3 py-0.5 font-hand text-xs font-bold text-pink-800 shadow-xs backdrop-blur-xs transition-all hover:scale-105 hover:bg-pink-200 active:scale-95"
                      >
                        <span>Resume PDF</span>
                        <svg className="h-2.5 w-2.5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
