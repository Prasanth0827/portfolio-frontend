import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Server, Database, CheckCircle, Terminal } from 'lucide-react';

const ProjectIntro = ({ onComplete }) => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const steps = [
            { time: 1000, action: () => setStep(1) }, // Show Frontend
            { time: 2500, action: () => setStep(2) }, // Show Backend
            { time: 4000, action: () => setStep(3) }, // Show Complete
            { time: 5500, action: () => onComplete() } // Finish
        ];

        const timers = steps.map(s => setTimeout(s.action, s.time));
        return () => timers.forEach(clearTimeout);
    }, [onComplete]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
        exit: { opacity: 0, y: -50, transition: { duration: 0.8, ease: "easeInOut" } }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.div
            className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center text-white font-mono"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <div className="w-full max-w-2xl p-8">
                <motion.div
                    className="flex items-center gap-3 mb-8 text-2xl font-bold text-cyan-400"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Terminal className="w-8 h-8 animate-pulse" />
                    <span>INITIALIZING SYSTEM ANALYSIS...</span>
                </motion.div>

                <div className="space-y-6">
                    {/* Frontend Step */}
                    {step >= 1 && (
                        <motion.div
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex items-center gap-4 p-4 border border-cyan-500/30 rounded-lg bg-cyan-950/20 backdrop-blur-sm"
                        >
                            <div className="p-3 bg-cyan-500/20 rounded-full">
                                <Code className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-cyan-300">Frontend Detected</h3>
                                <p className="text-gray-400">React v19 • Vite • Tailwind CSS • Framer Motion</p>
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="ml-auto"
                            >
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Backend Step */}
                    {step >= 2 && (
                        <motion.div
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex items-center gap-4 p-4 border border-purple-500/30 rounded-lg bg-purple-950/20 backdrop-blur-sm"
                        >
                            <div className="p-3 bg-purple-500/20 rounded-full">
                                <Server className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-purple-300">Backend Connected</h3>
                                <p className="text-gray-400">Node.js • Express • MongoDB Atlas • JWT</p>
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="ml-auto"
                            >
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Complete Step */}
                    {step >= 3 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-8 text-center"
                        >
                            <div className="inline-block px-6 py-2 border border-green-500/50 rounded-full bg-green-900/20 text-green-400 font-semibold tracking-wider shadow-[0_0_15px_rgba(74,222,128,0.3)]">
                                ANALYSIS COMPLETE
                            </div>
                            <p className="mt-4 text-gray-500 text-sm animate-pulse">Launching Application...</p>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Background Grid Effect */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </motion.div>
    );
};

export default ProjectIntro;
