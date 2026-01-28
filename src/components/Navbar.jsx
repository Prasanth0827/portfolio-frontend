import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'
import { usePortfolio } from '../context/PortfolioContext'

function Navbar() {
    const { darkMode, toggleTheme, profile } = usePortfolio()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? (darkMode ? 'bg-black/30 backdrop-blur-md border-b border-purple-900/30' : 'bg-white/80 backdrop-blur-md border-b border-gray-200/50') : 'bg-transparent border-transparent'}`}>
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link
                        to="/"
                        className="flex items-center gap-2"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        {profile?.logo ? (
                            <div className="relative">
                                <img
                                    src={profile.logo}
                                    alt="Logo"
                                    className={`h-10 w-auto object-contain max-w-[150px] ${darkMode ? 'drop-shadow-lg' : 'drop-shadow-2xl brightness-110 contrast-125'}`}
                                    style={{
                                        filter: darkMode 
                                            ? 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))' 
                                            : 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25)) brightness(1.1) contrast(1.25)'
                                    }}
                                />
                                {!darkMode && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg pointer-events-none"></div>
                                )}
                            </div>
                        ) : (
                            <h1 className={`text-2xl font-space font-bold ${darkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400' : 'text-gray-900'}`}>
                                HV
                            </h1>
                        )}
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        <Link
                            to="/"
                            className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${darkMode ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-800 hover:text-gray-900 hover:bg-gray-100'}`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/about"
                            className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${darkMode ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-800 hover:text-gray-900 hover:bg-gray-100'}`}
                        >
                            About
                        </Link>
                        <Link
                            to="/projects"
                            className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${darkMode ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-800 hover:text-gray-900 hover:bg-gray-100'}`}
                        >
                            Projects
                        </Link>
                        <Link
                            to="/journey"
                            className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${darkMode ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-800 hover:text-gray-900 hover:bg-gray-100'}`}
                        >
                            My Journey
                        </Link>
                        <Link
                            to="/contact"
                            className={`px-4 py-2 rounded-lg font-medium text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:scale-105`}
                        >
                            Contact
                        </Link>
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-lg transition-all duration-300 ${darkMode ? 'text-yellow-300 hover:bg-white/10' : 'text-gray-800 hover:bg-gray-100'}`}
                            aria-label="Toggle theme"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-lg transition-all duration-300 ${darkMode ? 'text-yellow-300 hover:bg-white/10' : 'text-gray-800 hover:bg-gray-100'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className={`md:hidden border-t ${darkMode ? 'bg-slate-900/95 border-purple-900/30' : 'bg-white/95 border-gray-200'} backdrop-blur-xl`}>
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <Link
                            to="/"
                            onClick={() => setIsMenuOpen(false)}
                            className={`block px-3 py-3 rounded-lg font-semibold text-base ${darkMode ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-800 hover:text-gray-900 hover:bg-gray-100'}`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/about"
                            onClick={() => setIsMenuOpen(false)}
                            className={`block px-3 py-3 rounded-lg font-semibold text-base ${darkMode ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-800 hover:text-gray-900 hover:bg-gray-100'}`}
                        >
                            About
                        </Link>
                        <Link
                            to="/projects"
                            onClick={() => setIsMenuOpen(false)}
                            className={`block px-3 py-3 rounded-lg font-semibold text-base ${darkMode ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-800 hover:text-gray-900 hover:bg-gray-100'}`}
                        >
                            Projects
                        </Link>
                        <Link
                            to="/journey"
                            onClick={() => setIsMenuOpen(false)}
                            className={`block px-3 py-3 rounded-lg font-semibold text-base ${darkMode ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-800 hover:text-gray-900 hover:bg-gray-100'}`}
                        >
                            My Journey
                        </Link>
                        <Link
                            to="/contact"
                            onClick={() => setIsMenuOpen(false)}
                            className={`block px-3 py-3 rounded-lg font-medium text-base bg-gradient-to-r from-blue-600 to-purple-600 text-white mt-4 text-center`}
                        >
                            Contact
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar
