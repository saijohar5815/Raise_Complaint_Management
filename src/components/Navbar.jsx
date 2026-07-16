import { Link } from 'react-router-dom'
import { Moon, Sun, Zap } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg/90 backdrop-blur-md border-b border-border-theme">
      <div className="container-custom h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
         <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm shrink-0">
  <img src="https://images.seeklogo.com/logo-png/37/1/bni-2020-logo-png_seeklogo-378515.png" alt="ResolveX logo" className="w-full h-full object-cover" />
</div>
          <span className="text-lg font-bold text-text-theme">
            Resolve<span className="text-primary">X</span>
          </span>
        </Link>

        {/* Theme toggle only */}
        <button
          onClick={toggleTheme}
          className="h-9 w-9 rounded-xl flex items-center justify-center hover:bg-bg-alt transition-colors" 
          aria-label="Toggle theme"
        >
          {theme === 'light'
            ? <Moon className="h-4 w-4 text-muted-theme" />
            : <Sun className="h-4 w-4 text-muted-theme" />}
        </button>
      </div>
    </header>
  )
}
