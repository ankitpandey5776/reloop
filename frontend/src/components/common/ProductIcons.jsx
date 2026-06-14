/**
 * Category-specific product silhouette SVGs.
 * Used as fallbacks when item.image_url is null and as conveyor belt assets.
 * All take a `className` prop and inherit currentColor for theming.
 */

export function PhoneIcon({ className = '', size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="18" y="6" width="28" height="52" rx="4" />
      <rect x="22" y="12" width="20" height="34" rx="1" fill="currentColor" opacity="0.15" />
      <circle cx="32" cy="52" r="2" />
      <line x1="29" y1="9" x2="35" y2="9" />
    </svg>
  )
}

export function ShirtIcon({ className = '', size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12 L12 18 L18 28 L22 26 V52 H42 V26 L46 28 L52 18 L44 12 L36 16 Q32 20 28 16 Z" fill="currentColor" fillOpacity="0.1" />
      <path d="M28 12 Q32 18 36 12" />
    </svg>
  )
}

export function BookIcon({ className = '', size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 12 H30 Q32 12 32 14 V54 Q32 52 30 52 H10 Z" fill="currentColor" fillOpacity="0.12" />
      <path d="M54 12 H34 Q32 12 32 14 V54 Q32 52 34 52 H54 Z" fill="currentColor" fillOpacity="0.08" />
      <line x1="14" y1="20" x2="26" y2="20" />
      <line x1="14" y1="26" x2="26" y2="26" />
      <line x1="38" y1="20" x2="50" y2="20" />
      <line x1="38" y1="26" x2="50" y2="26" />
    </svg>
  )
}

export function HomeApplianceIcon({ className = '', size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="14" width="44" height="38" rx="3" fill="currentColor" fillOpacity="0.1" />
      <circle cx="32" cy="33" r="10" />
      <circle cx="32" cy="33" r="4" fill="currentColor" fillOpacity="0.3" />
      <circle cx="46" cy="20" r="1.5" fill="currentColor" />
      <circle cx="50" cy="20" r="1.5" fill="currentColor" />
    </svg>
  )
}

export function BoxIcon({ className = '', size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M32 6 L56 18 V46 L32 58 L8 46 V18 Z" fill="currentColor" fillOpacity="0.12" />
      <path d="M32 6 L32 32" />
      <path d="M8 18 L32 32 L56 18" />
      <path d="M32 32 L32 58" opacity="0.6" />
    </svg>
  )
}

export function HeadphonesIcon({ className = '', size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 36 V32 Q12 14 32 14 Q52 14 52 32 V36" fill="none" />
      <rect x="8"  y="34" width="10" height="18" rx="3" fill="currentColor" fillOpacity="0.18" />
      <rect x="46" y="34" width="10" height="18" rx="3" fill="currentColor" fillOpacity="0.18" />
    </svg>
  )
}

/**
 * Pick the right icon for a category.
 * Used everywhere a product placeholder is needed.
 */
export function CategoryIcon({ category, className = '', size = 48 }) {
  const Icon = {
    electronics: PhoneIcon,
    fashion:     ShirtIcon,
    home:        HomeApplianceIcon,
    books:       BookIcon,
  }[category] || BoxIcon
  return <Icon className={className} size={size} />
}
