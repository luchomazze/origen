import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  onClick?: () => void
  variant?: 'gold' | 'outline-gold' | 'outline-ivory' | 'ivory'
  size?: 'sm' | 'md'
  className?: string
}

export default function Button({ children, onClick, variant = 'gold', size = 'md', className = '' }: Props) {
  const base = `inline-flex items-center justify-center font-sans font-medium tracking-widest uppercase transition-all duration-300 cursor-pointer border`
  const sizes = size === 'sm'
    ? 'text-[9px] px-5 py-2.5'
    : 'text-[10px] px-7 py-3.5'

  const variants = {
    gold: 'bg-gold text-navy border-gold hover:bg-transparent hover:text-gold',
    'outline-gold': 'bg-transparent text-gold border-gold hover:bg-gold hover:text-navy',
    'outline-ivory': 'bg-transparent text-ivory border-ivory/60 hover:bg-ivory hover:text-navy',
    ivory: 'bg-ivory text-navy border-ivory hover:bg-transparent hover:text-ivory',
  }

  return (
    <button onClick={onClick} className={`${base} ${sizes} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}
