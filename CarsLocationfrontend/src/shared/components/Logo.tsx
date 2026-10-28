import { FC, CSSProperties } from 'react'

interface LogoProps {
  className?: string
  style?: CSSProperties
  variant?: 'light' | 'dark' | 'auto'
  height?: number | string
}

export const Logo: FC<LogoProps> = ({
  className = '',
  style,
  variant = 'auto',
  height = 38,
}) => {
  const isLightVariant = variant === 'light'
  const isDarkVariant = variant === 'dark'

  // Text color: Light (white) for dark backgrounds, dark (#1A1A1A) for light backgrounds
  const textColor = isLightVariant
    ? '#FFFFFF'
    : isDarkVariant
    ? '#1A1A1A'
    : 'var(--logo-text, #1A1A1A)'

  // Subtitle color: Silver (#9E988F) for dark backgrounds, muted brown (#6B665E) for light backgrounds
  const subColor = isLightVariant
    ? '#9E988F'
    : isDarkVariant
    ? '#6B665E'
    : 'var(--logo-sub, #6B665E)'

  // Subtle border around icon badge on dark backgrounds for crisp separation
  const badgeStroke = isLightVariant
    ? 'rgba(255, 255, 255, 0.16)'
    : 'rgba(255, 255, 255, 0.08)'

  return (
    <div
      className={`brand-logo-wrapper inline-flex items-center shrink-0 ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        lineHeight: 1,
        ...style,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 136"
        style={{
          height: typeof height === 'number' ? `${height}px` : height,
          width: 'auto',
          display: 'block',
          overflow: 'visible',
        }}
        role="img"
        aria-label="Nova Drive Enterprise Fleet"
      >
        <style>
          {`
            .nd-sl { animation: ndSlide 2.8s cubic-bezier(.3,.7,.2,1) infinite; }
            .nd-sl2 { animation-delay: .15s; }
            .nd-sl3 { animation-delay: .3s; }
            .nd-st { animation: ndSlide 2.8s cubic-bezier(.3,.7,.2,1) infinite; }
            @keyframes ndSlide {
              0% { transform: translateX(-14px); opacity: 0; }
              25% { opacity: 1; }
              60%, 100% { transform: translateX(0); opacity: 1; }
            }
            @media (prefers-reduced-motion: reduce) {
              .nd-sl, .nd-st { animation: none; }
            }
          `}
        </style>

        {/* 1. Icon Badge (112x112 rounded square with speed lines & slanted N) */}
        <g transform="translate(12,12)">
          <rect
            width="112"
            height="112"
            rx="28"
            fill="#1A1A1A"
            stroke={badgeStroke}
            strokeWidth="1.5"
          />

          {/* Three orange speed lines on the left */}
          <g className="nd-sl">
            <rect x="20" y="40" width="20" height="5" rx="2.5" fill="#E8710A" />
          </g>
          <g className="nd-sl nd-sl2">
            <rect x="10" y="55" width="30" height="5" rx="2.5" fill="#E8710A" />
          </g>
          <g className="nd-sl nd-sl3">
            <rect x="20" y="70" width="20" height="5" rx="2.5" fill="#E8710A" />
          </g>

          {/* Slanted N geometric emblem */}
          <g transform="translate(13.96,0) skewX(-14)">
            <rect x="46" y="28" width="11" height="56" rx="2" fill="#F4F1EA" />
            <rect x="73" y="28" width="11" height="56" rx="2" fill="#F4F1EA" />
            <polygon points="46,28 58,28 84,84 72,84" fill="#E8710A" />
          </g>
        </g>

        {/* 2. Brand Typography: NOVA DRIVE */}
        <text
          x="162"
          y="68"
          transform="translate(0,0) skewX(-10)"
          fontFamily="'Space Grotesk', 'Helvetica Neue', Arial, sans-serif"
          fontSize="48"
          fontWeight="800"
          letterSpacing="5"
          fill={textColor}
        >
          NOVA DRIVE
        </text>

        {/* 3. Underline Accent Speed Dashes & ENTERPRISE FLEET */}
        <g transform="skewX(-10)">
          <g className="nd-st">
            <rect x="165" y="84" width="70" height="4" rx="2" fill="#E8710A" />
          </g>
          <g className="nd-st nd-sl2">
            <rect x="243" y="84" width="30" height="4" rx="2" fill="#E8710A" />
          </g>
          <g className="nd-st nd-sl3">
            <rect x="281" y="84" width="12" height="4" rx="2" fill="#E8710A" />
          </g>
          <text
            x="170"
            y="112"
            fontFamily="'Space Grotesk', 'Helvetica Neue', Arial, sans-serif"
            fontSize="14"
            fontWeight="500"
            letterSpacing="6.5"
            fill={subColor}
          >
            ENTERPRISE FLEET
          </text>
        </g>
      </svg>
    </div>
  )
}

export default Logo
