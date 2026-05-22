"use client";
import React from "react";

type IconProps = { size?: number } & React.SVGProps<SVGSVGElement>;

const Icon = ({ children, size = 18, ...rest }: IconProps & { children: React.ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...rest}
  >
    {children}
  </svg>
);

export const IcChat = (p: IconProps) => <Icon {...p}><path d="M21 12c0 4.4-4 8-9 8-1.2 0-2.4-.2-3.5-.6L3 21l1.6-4.5C3.6 15.1 3 13.6 3 12c0-4.4 4-8 9-8s9 3.6 9 8Z" /></Icon>;
export const IcBook = (p: IconProps) => <Icon {...p}><path d="M4 5a2 2 0 0 1 2-2h13v17H6a2 2 0 0 0-2 2V5Z" /><path d="M4 19a2 2 0 0 1 2-2h13" /></Icon>;
export const IcLibrary = (p: IconProps) => <Icon {...p}><path d="M4 4h3v16H4zM10 4h3v16h-3zM16 6l3-1 3 14-3 1z" /></Icon>;
export const IcPlus = (p: IconProps) => <Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>;
export const IcSearch = (p: IconProps) => <Icon {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icon>;
export const IcSettings = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.3 17l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" /></Icon>;
export const IcSpark = (p: IconProps) => <Icon {...p}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></Icon>;
export const IcSliders = (p: IconProps) => <Icon {...p}><path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h14M20 18h0" /><circle cx="16" cy="6" r="2" /><circle cx="8" cy="12" r="2" /><circle cx="18" cy="18" r="2" /></Icon>;
export const IcArrowRight = (p: IconProps) => <Icon {...p}><path d="M5 12h14M13 5l7 7-7 7" /></Icon>;
export const IcArrowUp = (p: IconProps) => <Icon {...p}><path d="M12 19V5M5 12l7-7 7 7" /></Icon>;
export const IcMenu = (p: IconProps) => <Icon {...p}><path d="M4 6h16M4 12h16M4 18h16" /></Icon>;
export const IcClose = (p: IconProps) => <Icon {...p}><path d="M6 6l12 12M6 18 18 6" /></Icon>;
export const IcCheck = (p: IconProps) => <Icon {...p}><path d="m5 12 4 4L19 6" /></Icon>;
export const IcChevron = (p: IconProps) => <Icon {...p}><path d="m9 6 6 6-6 6" /></Icon>;
export const IcChevronD = (p: IconProps) => <Icon {...p}><path d="m6 9 6 6 6-6" /></Icon>;
export const IcDownload = (p: IconProps) => <Icon {...p}><path d="M12 4v12m-5-5 5 5 5-5M5 20h14" /></Icon>;
export const IcShare = (p: IconProps) => <Icon {...p}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></Icon>;
export const IcImage = (p: IconProps) => <Icon {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5L5 21" /></Icon>;
export const IcSlide = (p: IconProps) => <Icon {...p}><rect x="3" y="5" width="18" height="12" rx="2" /><path d="M8 21h8M12 17v4" /></Icon>;
export const IcType = (p: IconProps) => <Icon {...p}><path d="M4 7V5h16v2M9 5v14M15 12v7M7 19h4M13 19h4" /></Icon>;
export const IcOutline = (p: IconProps) => <Icon {...p}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></Icon>;
export const IcCross = (p: IconProps) => <Icon {...p}><path d="M12 3v18M7 8h10" /></Icon>;
export const IcCalendar = (p: IconProps) => <Icon {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></Icon>;
export const IcUser = (p: IconProps) => <Icon {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></Icon>;
export const IcEdit = (p: IconProps) => <Icon {...p}><path d="M16 3l5 5-12 12H4v-5L16 3Z" /></Icon>;
export const IcMore = (p: IconProps) => <Icon {...p}><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></Icon>;
export const IcTrash = (p: IconProps) => <Icon {...p}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></Icon>;
export const IcStar = (p: IconProps) => <Icon {...p}><path d="m12 3 2.9 6 6.6.6-5 4.6 1.5 6.5L12 17l-5.9 3.7L7.6 14l-5-4.6L9.1 9l2.9-6Z" /></Icon>;
export const IcBookmark = (p: IconProps) => <Icon {...p}><path d="M6 4h12v17l-6-4-6 4V4Z" /></Icon>;
export const IcSend = (p: IconProps) => <Icon {...p}><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" /></Icon>;
export const IcMic = (p: IconProps) => <Icon {...p}><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8" /></Icon>;
export const IcAttach = (p: IconProps) => <Icon {...p}><path d="M21 11.5 12.5 20a5 5 0 1 1-7-7L14 4.5a3.5 3.5 0 0 1 5 5L10.4 18a2 2 0 1 1-2.8-2.8L15 8" /></Icon>;
export const IcRefresh = (p: IconProps) => <Icon {...p}><path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5" /></Icon>;
export const IcEye = (p: IconProps) => <Icon {...p}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></Icon>;
export const IcGlobe = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></Icon>;
export const IcCopy = (p: IconProps) => <Icon {...p}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></Icon>;

export const ICONS: Record<string, (p: IconProps) => React.JSX.Element> = {
  IcChat, IcBook, IcLibrary, IcPlus, IcSearch, IcSettings, IcSpark, IcSliders,
  IcArrowRight, IcArrowUp, IcMenu, IcClose, IcCheck, IcChevron, IcChevronD,
  IcDownload, IcShare, IcImage, IcSlide, IcType, IcOutline, IcCross, IcCalendar,
  IcUser, IcEdit, IcMore, IcTrash, IcStar, IcBookmark, IcSend, IcMic, IcAttach,
  IcRefresh, IcEye, IcGlobe, IcCopy,
};
