interface CustomStarProps {
  filled?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
  size?: number;
  isHovered?: boolean;
}

export function CustomStar({ filled = false, onClick, onMouseEnter, onMouseLeave, className = "", size = 24, isHovered = false }: CustomStarProps) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`relative inline-block transition-all duration-200 hover:scale-125 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Star icon */}
      <svg 
        width={size * 0.8} 
        height={size * 0.8} 
        viewBox="0 0 24 24" 
        className="absolute inset-0 m-auto transition-all duration-200"
      >
        <path
          d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
          fill={filled ? '#000000' : (isHovered ? '#000000' : '#E0E7F0')}
          className="transition-all duration-200"
          style={{
            filter: filled || isHovered
              ? 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))' 
              : 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1))'
          }}
        />
      </svg>
      
      {/* Reflective sheen - always present */}
      <div 
        className="absolute inset-0 transition-all duration-200"
        style={{
          background: filled || isHovered
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.2) 30%, transparent 60%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.1) 30%, transparent 60%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}
      />
      
      {/* Glossy highlight for filled or hovered stars */}
      {(filled || isHovered) && (
        <div 
          className="absolute inset-0 transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.3) 20%, transparent 50%)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}
        />
      )}
    </button>
  );
}
