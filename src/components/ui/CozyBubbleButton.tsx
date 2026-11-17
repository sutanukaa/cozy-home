'use client';

import React from 'react';
import Link from 'next/link';

export interface CozyBubbleButtonProps {
  /** The accessible label and tooltip text */
  label: string;
  /** The icon inside the button (SVG or element) */
  icon?: React.ReactNode;
  /** Click handler */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Link navigation if used as a router link */
  href?: string;
  /** Size variant: sm (room door/detail), md (standard bedroom/cabinet hotspot), lg (prominent) */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the glowing pulsing outer halo is active (defaults to true) */
  pulse?: boolean;
  /** Tooltip position (defaults to 'top') */
  tooltipPosition?: 'top' | 'bottom';
  /** Whether to show the floating tooltip on hover (defaults to true) */
  showTooltip?: boolean;
  /** Optional active/pressed state (e.g. music playing) */
  isActive?: boolean;
  /** Extra children (e.g. audio wave bars) */
  children?: React.ReactNode;
  /** Extra class names */
  className?: string;
  /** Type of button */
  type?: 'button' | 'submit' | 'reset';
  /** Test/Accessibility id */
  id?: string;
}

/**
 * Standardized Cozy Hotspot Bubble Button
 *
 * Implements the signature aesthetic across all rooms:
 * - Radiant pulsing outer halo (`#FF3377/55`)
 * - Secondary breathing white ring
 * - Vibrant rose-berry gradient disc with crisp white border
 * - Glossy top-left bubble reflection highlight
 * - Crisp white drop-shadowed icon
 * - Soft floating paper tooltip
 */
export default function CozyBubbleButton({
  label,
  icon,
  onClick,
  href,
  size = 'md',
  pulse = true,
  tooltipPosition = 'top',
  showTooltip = true,
  isActive = false,
  children,
  className = '',
  type = 'button',
  id,
}: CozyBubbleButtonProps) {
  // Dimension tokens
  const dimensions = {
    sm: {
      outer: 'h-8 w-8 sm:h-9 sm:w-9',
      disc: 'h-6.5 w-6.5 sm:h-7 sm:w-7',
      iconSize: 'h-3.5 w-3.5',
      highlight: 'top-0.5 left-0.5 h-1 w-1.5',
    },
    md: {
      outer: 'h-9 w-9 sm:h-10 sm:w-10',
      disc: 'h-7.5 w-7.5 sm:h-8 sm:w-8',
      iconSize: 'h-4 w-4',
      highlight: 'top-0.5 left-1 h-1.5 w-2',
    },
    lg: {
      outer: 'h-11 w-11 sm:h-12 sm:w-12',
      disc: 'h-9 w-9 sm:h-10 sm:w-10',
      iconSize: 'h-5 w-5',
      highlight: 'top-1 left-1.5 h-2 w-2.5',
    },
  }[size];

  const tooltipClasses =
    tooltipPosition === 'top'
      ? 'bottom-full mb-2.5 left-1/2 -translate-x-1/2'
      : 'top-full mt-2.5 left-1/2 -translate-x-1/2';

  const innerContent = (
    <div className={`relative flex ${dimensions.outer} items-center justify-center select-none`}>
      {/* 1. Outer pulsing radiant halo */}
      {pulse && (
        <span
          aria-hidden="true"
          className={`absolute inset-0 rounded-full bg-[#FF3377]/55 ${
            isActive ? 'animate-ping' : 'animate-ping-soft'
          }`}
        />
      )}

      {/* 2. Secondary breathing ring */}
      <span
        aria-hidden="true"
        className="absolute inset-0.5 rounded-full bg-white/70 animate-pulse"
      />

      {/* 3. Main vibrant rose-berry button */}
      <span
        className={`relative flex ${dimensions.disc} items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[#FF4D88] via-[#E81E63] to-[#B7004B] text-white shadow-[0_0_12px_rgba(232,30,99,0.7),0_3px_8px_rgba(0,0,0,0.3)] transition-all duration-300 group-hover:scale-115 group-hover:shadow-[0_0_18px_rgba(255,77,136,0.95)] ${
          isActive ? 'scale-110 shadow-[0_0_18px_rgba(255,77,136,0.95)]' : ''
        }`}
      >
        {/* Glossy top-left bubble highlight */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute ${dimensions.highlight} rounded-full bg-white/60 blur-[0.3px] -rotate-12`}
        />

        {/* Crisp White Icon */}
        {icon && (
          <span className="relative z-10 flex items-center justify-center text-white drop-shadow-sm transition-transform duration-300 group-hover:scale-110">
            {icon}
          </span>
        )}

        {/* Extra children (e.g. animated music wave bars) */}
        {children}
      </span>

      {/* 4. Floating paper tooltip on hover */}
      {showTooltip && (
        <span
          className={`pointer-events-none absolute z-30 ${tooltipClasses} whitespace-nowrap rounded-full border border-pink-300/80 bg-paper/95 px-3 py-1 font-hand text-xs sm:text-sm font-bold text-cocoa opacity-0 shadow-cozy backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 dark:border-white/20 dark:bg-black/85 dark:text-pink-100`}
        >
          {label}
        </span>
      )}
    </div>
  );

  const buttonClasses = `group relative inline-flex items-center justify-center cursor-pointer touch-manipulation focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-full ${className}`;

  if (href) {
    return (
      <Link href={href} aria-label={label} id={id} className={buttonClasses}>
        {innerContent}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={label}
      aria-pressed={isActive ? true : undefined}
      id={id}
      className={buttonClasses}
    >
      {innerContent}
    </button>
  );
}
