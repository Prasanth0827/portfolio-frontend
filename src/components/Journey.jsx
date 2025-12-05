import { motion } from 'framer-motion'
import { FaUser, FaLinkedin, FaGithub } from 'react-icons/fa'
import { usePortfolio } from '../context/PortfolioContext'
import background from '../assets/background.png'
import Timeline from './Timeline'

function Journey() {
    const { profile, darkMode } = usePortfolio()

    return (
        <div className="min-h-screen font-inter relative">
            {/* Background Image with Overlay */}
            <div
                className="fixed inset-0 z-0"
                style={{
                    backgroundImage: `url(${background})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className={`absolute inset-0 ${darkMode ? 'bg-slate-950/85' : 'bg-white/85'}`}></div>
            </div>

            <div className="relative z-10 pt-20">
                {/* Profile Section */}
                <section className="py-12">
                    <div className="w-full px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className={`p-8 rounded-2xl ${darkMode ? 'bg-slate-900/70 border border-purple-900/30' : 'bg-white border border-gray-200'} shadow-2xl backdrop-blur-sm`}
                        >
                            {/* Profile Header */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                                    <FaUser className="w-8 h-8 text-white" />
                                </div>
                                <h2 className={`text-3xl font-space font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    PROFILE
                                </h2>
                            </div>

                            {/* Profile Bio */}
                            <div className={`leading-relaxed text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                <p className="mb-4">
                                    I'm <span className="font-bold text-purple-400">{profile.name}</span>, a passionate <span className="font-semibold">{profile.role}</span> who enjoys building real-world, user-focused web applications.
                                </p>
                                <p className="mb-4">
                                    {profile.bio}
                                </p>
                                <p>
                                    I love solving complex problems, optimizing performance, and continuously learning new technologies to improve my craft. My goal is to build scalable, reliable, and clean full-stack solutions that make an impact.
                                </p>
                            </div>

                            {/* Social Links */}
                            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-700">
                                <a
                                    href={profile.social.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-3 rounded-lg transition-colors ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-blue-600 hover:text-gray-900'}`}
                                    title="LinkedIn"
                                >
                                    <FaLinkedin className="w-6 h-6" />
                                </a>
                                <a
                                    href={profile.social.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-3 rounded-lg transition-colors ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'}`}
                                    title="GitHub"
                                >
                                    <FaGithub className="w-6 h-6" />
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Timeline Section */}
                <Timeline />
            </div>
        </div>
    )
}

export default Journey
