import { useState } from 'react'

/**
 * Valutazione 0–5 stelle (mezze stelle incluse),
 * props:
 *  - value (number): rating corrente (es. 3.5)
 *  - onChange (fn): callback con nuovo valore
 *  - size (number): dimensione px (default 24)
 */
export default function StarRating({ value = 0, onChange, size = 24 }) {
  const [hover, setHover] = useState(null)

  // calcola il valore da click in base alla posizione (mezze stelle)
  function handleClick(e, i) {
    const rect = e.currentTarget.getBoundingClientRect()
    const isHalf = (e.clientX - rect.left) < rect.width / 2
    const next = i + (isHalf ? 0.5 : 1)
    onChange?.(next === value ? 0 : next)
  }

  function handleMove(e, i) {
    const rect = e.currentTarget.getBoundingClientRect()
    const isHalf = (e.clientX - rect.left) < rect.width / 2
    setHover(i + (isHalf ? 0.5 : 1))
  }

  return (
    <div style={{ display:'inline-flex', gap:4, cursor:'pointer' }}
         onMouseLeave={()=> setHover(null)}
         aria-label="Valutazione in stelle"
         role="slider"
         aria-valuemin={0} aria-valuemax={5} aria-valuenow={value}>
      {[0,1,2,3,4].map(i => {
        const active = (hover ?? value) - i
        const full = active >= 1
        const half = !full && active >= 0.5
        return (
          <svg key={i}
               width={size} height={size} viewBox="0 0 24 24"
               onMouseMove={(e)=>handleMove(e, i)}
               onClick={(e)=>handleClick(e, i)}
               style={{ filter: full||half ? 'drop-shadow(0 0 6px rgba(0,224,255,.35))' : 'none' }}
               aria-hidden="true">
            {/* stella contorno */}
            <path d="M12 17.3l-6.18 3.25 1.18-6.88L1 8.75l6.91-1 3.09-6.27 3.09 6.27 6.91 1-5 4.92 1.18 6.88z"
                  fill={full ? '#FFD56A' : half ? 'url(#half)' : 'none'}
                  stroke={full||half ? '#FFD56A' : '#7d93b8'} strokeWidth="1.2"/>
            {/* gradiente per mezza stella */}
            {half && (
              <defs>
                <linearGradient id="half">
                  <stop offset="50%" stopColor="#FFD56A"/>
                  <stop offset="50%" stopColor="transparent"/>
                </linearGradient>
              </defs>
            )}
          </svg>
        )
      })}
    </div>
  )
}
