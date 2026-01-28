import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaExternalLinkAlt, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { usePortfolio } from '../context/PortfolioContext'
import background from '../assets/background.png'

function Projects() {
    const { projects, darkMode } = usePortfolio()
    const [selectedProject, setSelectedProject] = useState(null)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

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

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            transition: {
                duration: 0.2
            }
        }
    }

    const truncateText = (text, lines = 4) => {
        const words = text.split(' ')
        const wordsPerLine = 15 // Approximate words per line
        const maxWords = lines * wordsPerLine
        if (words.length <= maxWords) return text
        return words.slice(0, maxWords).join(' ') + '...'
    }

    const openProjectDetails = (project) => {
        setSelectedProject(project)
        setCurrentImageIndex(0)
    }

    const closeProjectDetails = () => {
        setSelectedProject(null)
        setCurrentImageIndex(0)
    }

    const nextImage = () => {
        if (selectedProject?.images && selectedProject.images.length > 0) {
            setCurrentImageIndex((prev) =>
                prev === selectedProject.images.length - 1 ? 0 : prev + 1
            )
        }
    }

    const prevImage = () => {
        if (selectedProject?.images && selectedProject.images.length > 0) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? selectedProject.images.length - 1 : prev - 1
            )
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
                <div className={`absolute inset-0 ${darkMode ? 'bg-slate-950/85' : 'bg-white/75'}`}></div>
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
                            <p className={`text-base max-w-2xl mx-auto font-medium ${darkMode ? 'text-gray-400' : 'text-gray-800'}`}>
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
                                        <p className={`text-sm mb-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                                            {truncateText(project.description, 4)}
                                        </p>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 flex-wrap">
                                            <button
                                                onClick={() => openProjectDetails(project)}
                                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${darkMode ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white' : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'} shadow-lg hover:shadow-xl`}
                                            >
                                                Full Details
                                            </button>
                                            {project.demoLink && (
                                                <a
                                                    href={project.demoLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-white border border-purple-900/30' : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'}`}
                                                >
                                                    Live Demo <FaExternalLinkAlt className="w-3 h-3" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Empty State */}
                        {projects.length === 0 && (
                            <div className="text-center py-20">
                                <p className={`text-lg font-medium ${darkMode ? 'text-gray-400' : 'text-gray-800'}`}>
                                    No projects yet. Check back soon!
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Project Details Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={closeProjectDetails}
                    >
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e) => e.stopPropagation()}
                            className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl ${darkMode ? 'bg-slate-900 border border-purple-900/30' : 'bg-white border border-gray-200'} shadow-2xl`}
                        >
                            {/* Close Button */}
                            <button
                                onClick={closeProjectDetails}
                                className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>

                            {/* Modal Content */}
                            <div className="p-8">
                                {/* Title */}
                                <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {selectedProject.title}
                                </h2>

                                {/* Image Gallery */}
                                {selectedProject.images && selectedProject.images.length > 0 && (
                                    <div className="mb-6">
                                        <div className="relative rounded-xl overflow-hidden bg-gray-900 mb-4">
                                            <img
                                                src={selectedProject.images[currentImageIndex]}
                                                alt={`${selectedProject.title} - Image ${currentImageIndex + 1}`}
                                                className="w-full h-auto max-h-96 object-contain"
                                            />

                                            {/* Image Navigation */}
                                            {selectedProject.images.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={prevImage}
                                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all"
                                                    >
                                                        <FaChevronLeft className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={nextImage}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all"
                                                    >
                                                        <FaChevronRight className="w-5 h-5" />
                                                    </button>

                                                    {/* Image Counter */}
                                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/70 text-white text-sm">
                                                        {currentImageIndex + 1} / {selectedProject.images.length}
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Thumbnail Gallery */}
                                        {selectedProject.images.length > 1 && (
                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                {selectedProject.images.map((img, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setCurrentImageIndex(idx)}
                                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${idx === currentImageIndex
                                                                ? 'border-purple-500 scale-105'
                                                                : 'border-transparent opacity-60 hover:opacity-100'
                                                            }`}
                                                    >
                                                        <img
                                                            src={img}
                                                            alt={`Thumbnail ${idx + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Full Description */}
                                <div className="mb-6">
                                    <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                        About This Project
                                    </h3>
                                    <p className={`text-base leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {selectedProject.description}
                                    </p>
                                </div>

                                {/* Technologies */}
                                {selectedProject.tech && selectedProject.tech.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                            Technologies Used
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProject.tech.map((technology, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${darkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-700'}`}
                                                >
                                                    {technology}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Links */}
                                <div className="flex gap-4 flex-wrap">
                                    {selectedProject.demoLink && (
                                        <a
                                            href={selectedProject.demoLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${darkMode ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white' : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'} shadow-lg hover:shadow-xl`}
                                        >
                                            View Live Demo <FaExternalLinkAlt className="w-4 h-4" />
                                        </a>
                                    )}
                                    {selectedProject.repoUrl && (
                                        <a
                                            href={selectedProject.repoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-white border border-purple-900/30' : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'}`}
                                        >
                                            View Repository <FaExternalLinkAlt className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Projects
