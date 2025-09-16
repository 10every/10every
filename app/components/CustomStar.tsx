interface CustomStarProps {
  filled?: boolean;
  onClick?: () => void;
  className?: string;
  size?: number;
}

export function CustomStar({ filled = false, onClick, className = "", size = 24 }: CustomStarProps) {
  return (
    <button
      onClick={onClick}
      className={`relative inline-block transition-all duration-300 hover:scale-110 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Star icon */}
      <svg 
        width={size * 0.8} 
        height={size * 0.8} 
        viewBox="0 0 24 24" 
        className="absolute inset-0 m-auto transition-all duration-300"
      >
        <path
          d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
          fill={filled ? '#000000' : '#E0E7F0'}
          className="transition-all duration-300"
          style={{
            filter: filled 
              ? 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4))' 
              : 'drop-shadow(0 1px 3px rgba(224, 231, 240, 0.4))'
          }}
        />
      </svg>
      
      {/* Reflective sheen - always present */}
      <div 
        className="absolute inset-0 transition-all duration-300"
        style={{
          background: filled 
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.2) 30%, transparent 60%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.1) 30%, transparent 60%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}
      />
      
      {/* Glossy highlight for filled stars */}
      {filled && (
        <div 
          className="absolute inset-0 transition-all duration-300"
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
