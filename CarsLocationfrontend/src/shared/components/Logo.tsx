import { FC } from 'react'

interface LogoProps {
  className?: string
  variant?: 'light' | 'dark'
}

export const Logo: FC<LogoProps> = ({ className = '', variant = 'dark' }) => {
  const isLight = variant === 'light'
  const textColor = isLight ? '#ffffff' : '#171817'
  const subColor = isLight ? '#9aa09c' : '#788078'
  const iconBg = isLight ? '#222624' : '#171817'
  const iconStroke = '#ffffff'
  const accentFill = '#d9693b'

  return (
    <div className={`brand-logo ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
      <div
        className="brand-logo-mark"
        style={{
          width: '38px',
          height: '38px',
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Architectural geometric car & fleet emblem */}
          <path
            d="M3 13.5L5.5 6.5H18.5L21 13.5V18.5H19V20H16.5V18.5H7.5V20H5V18.5H3V13.5Z"
            stroke={iconStroke}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M5.5 11.5H18.5" stroke={iconStroke} strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="7.5" cy="15" r="1.5" fill={accentFill} />
          <circle cx="16.5" cy="15" r="1.5" fill={accentFill} />
          <path d="M9.5 6.5L10.5 11.5" stroke={iconStroke} strokeWidth="1.2" strokeLinecap="round" />
          <path d="M14.5 6.5L13.5 11.5" stroke={iconStroke} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="brand-logo-typography" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <span
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '15px',
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: textColor,
            textTransform: 'uppercase',
          }}
        >
          Nova Drive
        </span>
        <span
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.22em',
            color: subColor,
            textTransform: 'uppercase',
            marginTop: '2px',
          }}
        >
          Enterprise Fleet
        </span>
      </div>
    </div>
  )
}

export default Logo
