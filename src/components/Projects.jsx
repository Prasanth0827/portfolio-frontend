import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { usePortfolio } from '../context/PortfolioContext'
import background from '../assets/background.png'

function Projects() {
    const { projects, darkMode } = usePortfolio()
    const [showAll, setShowAll] = useState(true)

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    }

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
                <section className="py-20">
                    <div className="w-full px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-16"
                        >
                            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-space font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                My <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Projects</span>
                            </h1>
                            <p className={`text-base max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                A collection of my recent work and personal projects showcasing my skills in full-stack development, UI/UX design, and problem-solving.
                            </p>
                        </motion.div>

                        {/* Projects Grid */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {projects.map((project, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                    className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-slate-900/50 border border-purple-900/30' : 'bg-white border border-gray-200'} shadow-xl backdrop-blur-sm group`}
                                >
                                    {/* Project Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>

                                    {/* Project Info */}
                                    <div className="p-6">
                                        <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {project.title}
                                        </h3>
                                        <p className={`text-sm mb-4 line-clamp-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {project.description}
                                        </p>

                                        {/* Demo Link */}
                                        {project.demoLink && (
                                            <a
                                                href={project.demoLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${darkMode ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'}`}
                                            >
                                                View Demo <FaExternalLinkAlt className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Empty State */}
                        {projects.length === 0 && (
                            <div className="text-center py-20">
                                <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    No projects yet. Check back soon!
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Projects
