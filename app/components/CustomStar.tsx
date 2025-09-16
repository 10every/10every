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
          fill={filled ? '#E0E7F0' : 'rgba(224, 231, 240, 0.4)'}
          className="transition-all duration-300"
          style={{
            filter: filled 
              ? 'drop-shadow(0 2px 4px rgba(224, 231, 240, 0.6))' 
              : 'drop-shadow(0 1px 2px rgba(224, 231, 240, 0.3))'
          }}
        />
      </svg>
    </button>
  );
}
