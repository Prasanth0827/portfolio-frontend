import { motion, useReducedMotion } from 'framer-motion';
import {
    Code2,
    FileCode2,
    Server,
    Database,
    Cloud,
    Shield,
    Download,
    Github,
    Linkedin,
    Twitter,
    FileText
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import background from '../assets/background.png';

// Function to get icon and color for a technology
const getTechIcon = (techName) => {
    const tech = techName.toLowerCase();

    // Map tech names to their respective icons and colors
    if (tech.includes('javascript') || tech.includes('js')) {
        return { icon: Code2, color: 'text-yellow-400' };
    } else if (tech.includes('typescript') || tech.includes('ts')) {
        return { icon: FileCode2, color: 'text-blue-400' };
    } else if (tech.includes('react')) {
        return { icon: Code2, color: 'text-cyan-400' };
    } else if (tech.includes('node')) {
        return { icon: Server, color: 'text-green-400' };
    } else if (tech.includes('express')) {
        return { icon: Server, color: 'text-gray-400' };
    } else if (tech.includes('mongo')) {
        return { icon: Database, color: 'text-green-500' };
    } else if (tech.includes('next')) {
        return { icon: Code2, color: 'text-white' };
    } else if (tech.includes('tailwind') || tech.includes('css')) {
        return { icon: Code2, color: 'text-cyan-300' };
    } else if (tech.includes('aws')) {
        return { icon: Cloud, color: 'text-orange-400' };
    } else if (tech.includes('nginx')) {
        return { icon: Server, color: 'text-green-400' };
    } else if (tech.includes('cloudflare')) {
        return { icon: Cloud, color: 'text-orange-500' };
    } else if (tech.includes('jwt')) {
        return { icon: Shield, color: 'text-red-400' };
    } else if (tech.includes('database') || tech.includes('sql')) {
        return { icon: Database, color: 'text-blue-500' };
    } else if (tech.includes('server') || tech.includes('api')) {
        return { icon: Server, color: 'text-gray-400' };
    } else if (tech.includes('cloud')) {
        return { icon: Cloud, color: 'text-blue-400' };
    } else {
        return { icon: Code2, color: 'text-purple-400' };
    }
};

export default function About() {
    const { profile, darkMode, resume } = usePortfolio();
    const prefersReducedMotion = useReducedMotion();

    // Animation variants (respect reduced motion preference)
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: prefersReducedMotion ? 0 : 0.1,
                delayChildren: prefersReducedMotion ? 0 : 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: prefersReducedMotion ? 0 : 0.5,
                ease: 'easeOut'
            }
        }
    };

    const cardHoverVariants = {
        rest: { scale: 1, y: 0 },
        hover: {
            scale: prefersReducedMotion ? 1 : 1.05,
            y: prefersReducedMotion ? 0 : -5,
            transition: {
                duration: 0.3,
                ease: 'easeOut'
            }
        }
    };

    return (
        <div className={`min-h-screen font-inter relative ${darkMode ? 'bg-slate-950' : 'bg-gray-50'}`}>
            {/* Background Image with Overlay */}
            <div
                className="fixed inset-0 z-0"
                style={{
                    backgroundImage: `url(${background})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className={`absolute inset-0 ${darkMode ? 'bg-slate-950/90' : 'bg-white/90'}`}></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 pt-20 pb-12">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
                >
                    {/* Hero Section - Two Column Layout */}
                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 mb-10"
                    >
                        {/* Left Column - About Text */}
                        <div className="flex flex-col justify-center">
                            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-space font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                About Me
                            </h1>
                            <div className={`space-y-3 text-sm sm:text-base leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                <p className="whitespace-pre-line">
                                    {profile.aboutMe || `I'm ${profile.name}, a dedicated Frontend / MERN Stack Developer who loves building clean, responsive, and user-focused web applications. I specialize in React, JavaScript, HTML, CSS, and Tailwind. I focus on writing clean, scalable code and creating visually engaging interfaces. I enjoy solving problems, improving UI/UX, and continuously learning new technologies. My goal is to build scalable and user-friendly applications that make an impact.`}
                                </p>
                            </div>
                        </div>

                        {/* Right Column - Profile Image */}
                        <motion.div
                            variants={itemVariants}
                            className="flex items-center justify-center lg:justify-end"
                        >
                            <div className={`relative rounded-xl overflow-hidden ${darkMode ? 'bg-slate-800 border-2 border-purple-900/30' : 'bg-white border-2 border-gray-200'} shadow-xl max-w-sm w-full`}>
                                {profile.image ? (
                                    <img
                                        src={profile.image}
                                        alt={`${profile.name} - Profile`}
                                        className="w-full h-auto object-cover"
                                    />
                                ) : (
                                    <div className={`w-full aspect-square flex items-center justify-center ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                                        <span className={`text-5xl font-bold ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>
                                            {profile.name?.charAt(0) || 'H'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Resume Download Card */}
                    <motion.div
                        variants={itemVariants}
                        className={`mb-10 p-5 sm:p-6 rounded-xl ${darkMode ? 'bg-slate-900/70 border border-purple-900/30' : 'bg-white border border-gray-200'} shadow-lg backdrop-blur-sm`}
                    >
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                            {/* Left: File Info */}
                            <div className="flex items-center gap-3">
                                <div className={`p-2.5 rounded-lg ${darkMode ? 'bg-purple-600/20' : 'bg-purple-100'}`}>
                                    <FileText className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} aria-hidden="true" />
                                </div>
                                <div>
                                    <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Download My Resume
                                    </h3>
                                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {resume.fileName || 'Hemaprasanth_Resume.pdf'}
                                    </p>
                                </div>
                            </div>

                            {/* Right: Download Button */}
                            {resume.fileData ? (
                                <motion.a
                                    href={resume.fileData}
                                    download={resume.fileName}
                                    whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
                                    whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${darkMode ? 'focus:ring-offset-slate-900' : 'focus:ring-offset-white'}`}
                                    aria-label="Download resume PDF"
                                >
                                    <Download className="w-4 h-4" aria-hidden="true" />
                                    Download Resume
                                </motion.a>
                            ) : (
                                <motion.a
                                    href="/resume/Hemaprasanth_Resume.pdf"
                                    download="Hemaprasanth_Resume.pdf"
                                    whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
                                    whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${darkMode ? 'focus:ring-offset-slate-900' : 'focus:ring-offset-white'}`}
                                    aria-label="Download resume PDF"
                                >
                                    <Download className="w-4 h-4" aria-hidden="true" />
                                    Download Resume
                                </motion.a>
                            )}
                        </div>
                    </motion.div>

                    {/* Skills Section */}
                    <motion.div variants={itemVariants}>
                        <h2 className={`text-2xl sm:text-3xl font-space font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            My Skills
                        </h2>

                        {/* Skills Grid */}
                        {profile.techStack && profile.techStack.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                                {profile.techStack.map((tech, index) => {
                                    if (!tech || typeof tech !== 'string') return null;
                                    const { icon: TechIcon, color } = getTechIcon(tech);
                                    return (
                                        <motion.div
                                            key={`${tech}-${index}`}
                                            variants={cardHoverVariants}
                                            initial="rest"
                                            whileHover="hover"
                                            tabIndex={0}
                                            role="article"
                                            aria-label={`${tech} skill`}
                                            className={`p-4 rounded-lg ${darkMode ? 'bg-slate-800/70 border border-gray-700 hover:border-purple-500/50' : 'bg-white border border-gray-200 hover:border-purple-400'} shadow-md transition-all cursor-default focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                        >
                                            <div className="flex flex-col items-center text-center gap-2">
                                                <TechIcon
                                                    className={`w-8 h-8 ${color}`}
                                                    aria-hidden="true"
                                                />
                                                <span className={`font-semibold text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                                    {tech}
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Add your technologies in the Admin Panel to see them here.
                                </p>
                            </div>
                        )}
                    </motion.div>

                    {/* Footer */}
                    {/* <motion.footer
                        variants={itemVariants}
                        className={`mt-12 pt-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}
                    >
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3"> */}
                    {/* Copyright */}
                    {/* <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                                © {new Date().getFullYear()} {profile.name}. All rights reserved.
                            </p> */}

                    {/* Social Links */}
                    {/* <div className="flex items-center gap-3" role="list" aria-label="Social media links">
                                <motion.a
                                    href={profile.social?.github || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: prefersReducedMotion ? 1 : 1.15 }}
                                    className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full p-1`}
                                    aria-label="GitHub profile"
                                >
                                    <Github className="w-4 h-4" aria-hidden="true" />
                                </motion.a>
                                <motion.a
                                    href={profile.social?.linkedin || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: prefersReducedMotion ? 1 : 1.15 }}
                                    className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full p-1`}
                                    aria-label="LinkedIn profile"
                                >
                                    <Linkedin className="w-4 h-4" aria-hidden="true" />
                                </motion.a>
                                <motion.a
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: prefersReducedMotion ? 1 : 1.15 }}
                                    className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full p-1`}
                                    aria-label="Twitter profile"
                                >
                                    <Twitter className="w-4 h-4" aria-hidden="true" />
                                </motion.a>
                            </div>
                        </div>
                    </motion.footer>*/}
                </motion.div>
            </div>
        </div>
    );
}
