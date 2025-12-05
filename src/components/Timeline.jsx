import { motion } from 'framer-motion'
import { FaBriefcase, FaGraduationCap, FaArrowRight } from 'react-icons/fa'
import { usePortfolio } from '../context/PortfolioContext'

function Timeline() {
    const { timeline, darkMode } = usePortfolio()

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: {
            opacity: 0,
            x: -100,
            scale: 0.8
        },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    }

    const arrowVariants = {
        hidden: {
            pathLength: 0,
            opacity: 0
        },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
                duration: 2,
                ease: "easeInOut"
            }
        }
    }

    return (
        <section id="timeline" className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-space font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        My <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Journey</span>
                    </h2>
                    <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Career Timeline & Milestones
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="relative space-y-6"
                >
                    {/* Timeline Items */}
                    {timeline.map((item, index) => {
                        const isEducation = item.type === 'education' ||
                            (!item.type && (
                                item.company?.toLowerCase().includes('university') ||
                                item.company?.toLowerCase().includes('college') ||
                                item.title?.toLowerCase().includes('degree') ||
                                item.title?.toLowerCase().includes('bachelor') ||
                                item.title?.toLowerCase().includes('master')
                            ));

                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02, x: 10 }}
                                className="relative"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Period Badge */}
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        className={`flex-shrink-0 min-w-[140px] px-4 py-3 rounded-lg text-center font-bold ${darkMode
                                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                                            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                            } shadow-lg`}
                                    >
                                        {item.period.split(' - ')[0]}
                                        {item.period.includes(' - ') && item.period.split(' - ')[1] !== item.period.split(' - ')[0] && (
                                            <div className="text-xs font-normal opacity-90 mt-1">
                                                {item.period.split(' - ')[1]}
                                            </div>
                                        )}
                                    </motion.div>

                                    {/* Content Card with Arrow */}
                                    <div className="flex-1 relative">
                                        <motion.div
                                            className={`p-6 rounded-xl ${darkMode
                                                ? 'bg-slate-800/70 border border-purple-900/30'
                                                : 'bg-white border border-gray-200'
                                                } shadow-xl backdrop-blur-sm relative overflow-hidden group`}
                                        >
                                            {/* Background gradient on hover */}
                                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${darkMode ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gradient-to-r from-purple-400 to-blue-400'
                                                }`}></div>

                                            <div className="relative z-10">
                                                {/* Icon */}
                                                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-3 ${isEducation
                                                    ? 'bg-gradient-to-r from-green-500 to-teal-500'
                                                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                                                    }`}>
                                                    {isEducation ? (
                                                        <FaGraduationCap className="w-5 h-5 text-white" />
                                                    ) : (
                                                        <FaBriefcase className="w-5 h-5 text-white" />
                                                    )}
                                                </div>

                                                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {item.title}
                                                </h3>
                                                <h4 className={`text-base font-semibold mb-3 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                                    {item.company}
                                                </h4>
                                                <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    {item.description}
                                                </p>
                                            </div>

                                            {/* Arrow decoration */}
                                            <motion.div
                                                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-40 transition-opacity"
                                                animate={{ x: [0, 10, 0] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            >
                                                <FaArrowRight className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                            </motion.div>
                                        </motion.div>

                                        {/* Dotted connecting line */}
                                        {index < timeline.length - 1 && (
                                            <motion.div
                                                initial={{ scaleY: 0 }}
                                                whileInView={{ scaleY: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.5, delay: 0.2 }}
                                                className="absolute left-1/2 -bottom-6 w-0.5 h-6 origin-top"
                                                style={{
                                                    background: darkMode
                                                        ? 'linear-gradient(to bottom, rgba(168, 85, 247, 0.4), rgba(59, 130, 246, 0.4))'
                                                        : 'linear-gradient(to bottom, rgba(147, 51, 234, 0.4), rgba(37, 99, 235, 0.4))',
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}

                    {/* Animated Path SVG (decorative curved arrow on the side) */}
                    <motion.div className="hidden lg:block absolute -right-20 top-0 h-full w-32 pointer-events-none">
                        <svg viewBox="0 0 100 400" className="w-full h-full">
                            <motion.path
                                d="M 20 20 Q 80 100, 20 180 Q -40 260, 20 340 Q 60 380, 50 400"
                                fill="none"
                                stroke={darkMode ? 'rgba(168, 85, 247, 0.3)' : 'rgba(147, 51, 234, 0.3)'}
                                strokeWidth="3"
                                strokeDasharray="5,5"
                                variants={arrowVariants}
                            />
                        </svg>
                    </motion.div>
                </motion.div>

                {/* Bottom Stats */}
                {/* <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-16 text-center"
                >
                    <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${darkMode ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-700/30' : 'bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200'
                        }`}>
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {timeline.length} milestones achieved
                        </span>
                        <FaArrowRight className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                    </div>
                </motion.div> */}
            </div>
        </section>
    )
}

export default Timeline
