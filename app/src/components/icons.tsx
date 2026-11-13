import type { SVGProps } from 'react';

// Ícones de traço usados nos layouts de design/*.dc.html.
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number, strokeWidth: number): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
});

export const FormIcon = ({ size = 22, ...props }: IconProps) => (
  <svg {...base(size, 2)} {...props}>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M8 8h8M8 12h8M8 16h5" />
  </svg>
);

export const CheckIcon = ({ size = 20, ...props }: IconProps) => (
  <svg {...base(size, 2.4)} {...props}>
    <path d="M5 12l5 5L20 7" />
  </svg>
);

export const AlertCircleIcon = ({ size = 14, ...props }: IconProps) => (
  <svg {...base(size, 2.4)} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5M12 16.5v.5" />
  </svg>
);

export const PlusIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size, 2.4)} {...props}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const SearchIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size, 2)} {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);

export const LinkIcon = ({ size = 15, ...props }: IconProps) => (
  <svg {...base(size, 2)} {...props}>
    <path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1" />
    <path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1" />
  </svg>
);

export const ArrowLeftIcon = ({ size = 16, ...props }: IconProps) => (
  <svg {...base(size, 2.2)} {...props}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export const TrashIcon = ({ size = 17, ...props }: IconProps) => (
  <svg {...base(size, 2)} {...props}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
  </svg>
);

export const CloseIcon = ({ size = 16, ...props }: IconProps) => (
  <svg {...base(size, 2.2)} {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const InfoIcon = ({ size = 20, ...props }: IconProps) => (
  <svg {...base(size, 2)} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v6M12 7.5v.5" />
  </svg>
);

export const TextTypeIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size, 2)} {...props}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);

export const MultipleTypeIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size, 2)} {...props}>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <path d="M8 12l3 3 5-6" />
  </svg>
);

export const SingleTypeIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size, 2)} {...props}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3.5" fill="var(--color-primary)" stroke="none" />
  </svg>
);

export const CopyIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size, 2)} {...props}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a1 1 0 011-1h10" />
  </svg>
);

export const DownloadIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size, 2)} {...props}>
    <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
  </svg>
);

export const ChevronRightIcon = ({ size = 16, ...props }: IconProps) => (
  <svg {...base(size, 2.2)} {...props}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);
