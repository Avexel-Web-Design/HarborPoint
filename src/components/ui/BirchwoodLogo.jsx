const BirchwoodLogo = ({ className = "h-8 w-8", ...props }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Birch tree trunk with characteristic bark marks */}
      <rect x="42" y="20" width="16" height="60" fill="currentColor" rx="2" />
      
      {/* Birch bark horizontal lines */}
      <line x1="42" y1="30" x2="58" y2="30" stroke="white" strokeWidth="1" />
      <line x1="42" y1="40" x2="58" y2="40" stroke="white" strokeWidth="1" />
      <line x1="42" y1="50" x2="58" y2="50" stroke="white" strokeWidth="1" />
      <line x1="42" y1="60" x2="58" y2="60" stroke="white" strokeWidth="1" />
      <line x1="42" y1="70" x2="58" y2="70" stroke="white" strokeWidth="1" />
      
      {/* Small birch bark spots */}
      <ellipse cx="46" cy="35" rx="1" ry="2" fill="white" />
      <ellipse cx="54" cy="45" rx="1" ry="2" fill="white" />
      <ellipse cx="48" cy="55" rx="1" ry="2" fill="white" />
      <ellipse cx="52" cy="65" rx="1" ry="2" fill="white" />
      
      {/* Leaves/branches - elegant and simple */}
      <path 
        d="M35 25 Q30 20 25 25 Q30 30 35 25" 
        fill="currentColor" 
        opacity="0.8"
      />
      <path 
        d="M65 25 Q70 20 75 25 Q70 30 65 25" 
        fill="currentColor" 
        opacity="0.8"
      />
      <path 
        d="M30 35 Q25 30 20 35 Q25 40 30 35" 
        fill="currentColor" 
        opacity="0.6"
      />
      <path 
        d="M70 35 Q75 30 80 35 Q75 40 70 35" 
        fill="currentColor" 
        opacity="0.6"
      />
      <path 
        d="M38 15 Q33 10 28 15 Q33 20 38 15" 
        fill="currentColor" 
        opacity="0.7"
      />
      <path 
        d="M62 15 Q67 10 72 15 Q67 20 62 15" 
        fill="currentColor" 
        opacity="0.7"
      />
      
      {/* Golf ball at base - subtle nod to the golf course */}
      <circle cx="50" cy="85" r="4" fill="white" stroke="currentColor" strokeWidth="1" />
      <circle cx="48" cy="83" r="0.5" fill="currentColor" />
      <circle cx="52" cy="83" r="0.5" fill="currentColor" />
      <circle cx="50" cy="87" r="0.5" fill="currentColor" />
    </svg>
  )
}

export default BirchwoodLogo
