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
      className={`relative inline-block transition-all duration-300 hover:scale-110 group ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Glass background */}
      <div 
        className="absolute inset-0 rounded-full transition-all duration-300 border border-solid"
        style={{
          backgroundColor: filled ? 'rgba(255, 255, 255, 0.8)' : '#E0E7F0',
          backdropFilter: 'blur(8px)',
          borderColor: filled ? 'rgba(255, 255, 255, 0.6)' : 'rgba(224, 231, 240, 0.8)',
          boxShadow: filled 
            ? '0 6px 24px rgba(255, 255, 255, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.4)' 
            : '0 4px 16px rgba(224, 231, 240, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
        }}
      />
      
      {/* Star icon */}
      <svg 
        width={size * 0.45} 
        height={size * 0.45} 
        viewBox="0 0 24 24" 
        className="absolute inset-0 m-auto transition-all duration-300"
      >
        <path
          d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
          fill={filled ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)'}
          className="transition-all duration-300"
          style={{
            filter: filled 
              ? 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.3))' 
              : 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))'
          }}
        />
      </svg>
      
      {/* Highlight gloss */}
      <div 
        className={`absolute top-0 left-0 w-full h-1/2 rounded-full transition-opacity duration-300 ${
          filled ? 'opacity-70' : 'opacity-50 group-hover:opacity-70'
        }`}
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, transparent 100%)',
          borderRadius: '50% 50% 0 0'
        }}
      />
    </button>
  );
}
