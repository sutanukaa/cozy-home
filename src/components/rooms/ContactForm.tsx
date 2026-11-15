'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { site } from '@/data/site';

type Status = 'idle' | 'sending' | 'sent' | 'error';
const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;

/** Sends via Formspree if NEXT_PUBLIC_FORMSPREE_ID is set, otherwise opens the visitor's mail app. */
export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '');
    const email = String(data.get('email') ?? '');
    const message = String(data.get('message') ?? '');

    if (!formspreeId) {
      const body = encodeURIComponent(`${message}\n\n- ${name} (${email})`);
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent('Hello from your portfolio')}&body=${body}`;
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error('bad response');
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  const field = 'w-full rounded-2xl border-2 border-ink/15 bg-cream/70 px-4 py-2.5 text-cocoa placeholder:text-cocoa/50 dark:bg-plum/40 dark:text-cream dark:placeholder:text-cream/50';

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="mb-1 block font-hand text-xl">Your name</span>
        <input name="name" required autoComplete="name" className={field} placeholder="Ada Lovelace" />
      </label>
      <label className="block">
        <span className="mb-1 block font-hand text-xl">Your email</span>
        <input name="email" type="email" required autoComplete="email" className={field} placeholder="ada@example.com" />
      </label>
      <label className="block">
        <span className="mb-1 block font-hand text-xl">Your note</span>
        <textarea name="message" required rows={5} className={field} placeholder="Say hi, ask about a project, or tell me about a role..." />
      </label>
      <Button type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending...' : 'Post it in the mailbox'}</Button>
      <p role="status" aria-live="polite" className="min-h-6 font-hand text-xl">
        {status === 'sent' && 'Delivered! I will write back soon. 💌'}
        {status === 'error' && `That note did not go through. Try emailing ${site.email} instead.`}
      </p>
    </form>
  );
}
