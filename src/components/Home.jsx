import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
    FaExternalLinkAlt,
    FaArrowRight,
    FaCode,
    FaCloud,
    FaBars,
    FaRocket,
    FaAward,
    FaShieldAlt
} from 'react-icons/fa'
import {
    SiReact,
    SiNextdotjs,
    SiTypescript,
    SiJavascript,
    SiTailwindcss,
    SiNodedotjs,
    SiExpress,
    SiMongodb,
    SiNginx,
    SiCloudflare,
    SiAngular,
    SiSocketdotio
} from 'react-icons/si'
import { usePortfolio } from '../context/PortfolioContext'
import background from '../assets/background.png'

function Home() {
    const { profile, services, projects, experience, getIconComponent, darkMode } = usePortfolio()
    const [showAllProjects, setShowAllProjects] = useState(false)

    const servicesRef = useRef(null)
    const servicesInView = useInView(servicesRef, { once: true, amount: 0.2 })
    const experienceRef = useRef(null)
    const experienceInView = useInView(experienceRef, { once: true, amount: 0.2 })
    const projectsRef = useRef(null)
    const projectsInView = useInView(projectsRef, { once: true, amount: 0.2 })
    const techStackRef = useRef(null)
    const techStackInView = useInView(techStackRef, { once: true, amount: 0.2 })

    const handleViewAllProjects = () => {
        setShowAllProjects(true)
    }



    // Tech Stack from profile (MongoDB) - Dynamic!
    // Map tech stack strings to icons
    const getTechIcon = (techName) => {
        const techLower = techName.toLowerCase();
        const iconMap = {
            'react': { icon: SiReact, color: 'text-blue-400' },
            'next.js': { icon: SiNextdotjs, color: 'text-white' },
            'nextjs': { icon: SiNextdotjs, color: 'text-white' },
            'angular': { icon: SiAngular, color: 'text-red-500' },
            'typescript': { icon: SiTypescript, color: 'text-blue-500' },
            'javascript': { icon: SiJavascript, color: 'text-yellow-400' },
            'tailwind css': { icon: SiTailwindcss, color: 'text-cyan-400' },
            'tailwind': { icon: SiTailwindcss, color: 'text-cyan-400' },
            'node.js': { icon: SiNodedotjs, color: 'text-green-500' },
            'nodejs': { icon: SiNodedotjs, color: 'text-green-500' },
            'express': { icon: SiExpress, color: 'text-white' },
            'mongodb': { icon: SiMongodb, color: 'text-green-400' },
            'socket.io': { icon: SiSocketdotio, color: 'text-black' },
            'socketio': { icon: SiSocketdotio, color: 'text-black' },
            'socket': { icon: SiSocketdotio, color: 'text-black' },
            'jwt': { icon: FaShieldAlt, color: 'text-red-400' },
            'nginx': { icon: SiNginx, color: 'text-green-500' },
            'cloudflare': { icon: SiCloudflare, color: 'text-orange-500' },
            'aws': { icon: FaCloud, color: 'text-orange-400' }
        };

        // Try exact match first
        if (iconMap[techLower]) {
            return iconMap[techLower];
        }

        // Try partial match
        for (const [key, value] of Object.entries(iconMap)) {
            if (techLower.includes(key) || key.includes(techLower)) {
                return value;
            }
        }

        // Default icon
        return { icon: FaCode, color: 'text-purple-400' };
    };

    // Organize tech stack into categories
    const organizeTechStack = (techArray) => {
        // NO DEMO DATA - Only show what's in backend
        if (!techArray || !Array.isArray(techArray) || techArray.length === 0) {
            return []; // Return empty array - no demo technologies
        }

        // Expanded keyword lists to catch more variations
        const frontendKeywords = [
            'react', 'next', 'angular', 'vue', 'svelte', 'ember',
            'typescript', 'javascript', 'js', 'ts',
            'tailwind', 'css', 'html', 'sass', 'scss', 'less',
            'bootstrap', 'material', 'ant design', 'chakra',
            'redux', 'mobx', 'zustand', 'recoil',
            'webpack', 'vite', 'parcel', 'rollup'
        ];

        const backendKeywords = [
            'node', 'express', 'koa', 'fastify', 'nest',
            'mongodb', 'mongoose', 'postgresql', 'postgres', 'mysql', 'sqlite', 'redis',
            'jwt', 'oauth', 'passport', 'bcrypt',
            'graphql', 'apollo', 'rest', 'api',
            'socket', 'websocket', 'socket.io', 'socketio',
            'prisma', 'sequelize', 'typeorm', 'drizzle'
        ];

        const devopsKeywords = [
            'aws', 'azure', 'gcp', 'google cloud',
            'nginx', 'apache', 'caddy',
            'cloudflare', 'vercel', 'netlify',
            'docker', 'kubernetes', 'k8s', 'helm',
            'jenkins', 'github actions', 'gitlab ci', 'circleci', 'travis',
            'terraform', 'ansible', 'puppet', 'chef',
            'linux', 'ubuntu', 'debian', 'centos'
        ];

        const categorized = {
            frontend: [],
            backend: [],
            devops: [],
            other: []
        };

        // Process ALL technologies - ensure nothing is missed
        techArray.forEach(tech => {
            if (!tech || typeof tech !== 'string') return; // Skip invalid entries

            const techLower = tech.toLowerCase().trim();
            const { icon, color } = getTechIcon(tech);

            const techObj = { name: tech.trim(), icon, color };

            // More flexible matching - check if tech contains any keyword
            const isFrontend = frontendKeywords.some(keyword =>
                techLower.includes(keyword) || keyword.includes(techLower)
            );
            const isBackend = backendKeywords.some(keyword =>
                techLower.includes(keyword) || keyword.includes(techLower)
            );
            const isDevops = devopsKeywords.some(keyword =>
                techLower.includes(keyword) || keyword.includes(techLower)
            );

            // Categorize (priority: frontend > backend > devops > other)
            if (isFrontend) {
                categorized.frontend.push(techObj);
            } else if (isBackend) {
                categorized.backend.push(techObj);
            } else if (isDevops) {
                categorized.devops.push(techObj);
            } else {
                categorized.other.push(techObj);
            }
        });

        const techStack = [];

        if (categorized.frontend.length > 0) {
            techStack.push({
                category: "Frontend",
                icon: FaCode,
                technologies: categorized.frontend
            });
        }

        if (categorized.backend.length > 0) {
            techStack.push({
                category: "Backend",
                icon: FaBars,
                technologies: categorized.backend
            });
        }

        if (categorized.devops.length > 0) {
            techStack.push({
                category: "DevOps & Cloud",
                icon: FaCloud,
                technologies: categorized.devops
            });
        }

        if (categorized.other.length > 0) {
            techStack.push({
                category: "Other Technologies",
                icon: FaRocket,
                technologies: categorized.other
            });
        }

        // If no categories match, put all in "Technologies" category
        if (techStack.length === 0 && techArray.length > 0) {
            techStack.push({
                category: "Technologies",
                icon: FaCode,
                technologies: techArray.map(tech => {
                    const { icon, color } = getTechIcon(tech);
                    return { name: tech, icon, color };
                })
            });
        }

        // Validation: Ensure all technologies are included
        const totalCategorized = categorized.frontend.length +
            categorized.backend.length +
            categorized.devops.length +
            categorized.other.length;
        const totalInput = techArray.filter(t => t && typeof t === 'string').length;

        if (totalCategorized !== totalInput) {
            console.warn(`⚠️ Tech stack mismatch: ${totalInput} input, ${totalCategorized} categorized`);
        }

        console.log(`✅ Tech Stack Summary: Frontend(${categorized.frontend.length}), Backend(${categorized.backend.length}), DevOps(${categorized.devops.length}), Other(${categorized.other.length}), Total(${totalCategorized})`);

        return techStack; // Return only what's in backend - NO DEMO
    };

    // Debug: Log tech stack from profile
    const profileTechStack = Array.isArray(profile?.techStack) ? profile.techStack : [];
    console.log('🔍 Tech Stack from Profile:', profileTechStack);
    console.log('📊 Profile TechStack Count:', profileTechStack.length);

    const techStack = organizeTechStack(profileTechStack);

    // Debug: Log organized tech stack
    console.log('📦 Organized Tech Stack:', techStack);
    console.log('📊 Total Technologies Displayed:', profileTechStack.length);

    // Import FaShieldAlt locally for the tech stack array above if needed, 
    // but since it's used in the static array, we need to make sure it's imported.
    // It is imported in the top block.
    // However, for the Services section, we use getIconComponent.

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
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
                <div className={`absolute inset-0 ${darkMode ? 'bg-slate-950/85' : 'bg-white/40'}`}></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10">


                {/* Home Section */}
                <section id="home" className="min-h-screen flex items-center">
                    <div className="w-full px-4 sm:px-6 lg:px-8 py-20 w-full">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            {/* Left Side - Profile Picture and Name */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="flex flex-col items-center space-y-6"
                            >
                                {/* Profile Picture */}
                                <div className="relative">
                                    <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl overflow-hidden border-4 border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-1">
                                        <div className="w-full h-full rounded-2xl overflow-hidden bg-gray-800">
                                            <img
                                                src={profile.image}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Name and Greeting */}
                                <div className="text-center space-y-3">
                                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-space font-bold">
                                        <span className={`text-xl font-light ${darkMode ? 'text-gray-400' : 'text-gray-800'}`}>
                                            Hello, I'm{' '}
                                        </span>
                                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                                            {profile.name}
                                        </span>
                                    </h1>

                                    {/* Role Tags */}
                                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                                        <span className={`px-3 py-1.5 rounded-full text-sm ${darkMode ? 'bg-purple-900/30 text-purple-300 border border-purple-700/50' : 'bg-blue-100 text-blue-700 border border-blue-200'} font-medium`}>
                                            {profile.role}
                                        </span>
                                        {Array.isArray(profile.badges) && profile.badges.length > 0 && profile.badges.map((badge, index) => {
                                            // Different colors for different badges
                                            const badgeColors = [
                                                { dark: 'bg-pink-900/30 text-pink-300 border-pink-700/50', light: 'bg-pink-100 text-pink-700 border-pink-200' },
                                                { dark: 'bg-blue-900/30 text-blue-300 border-blue-700/50', light: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
                                                { dark: 'bg-green-900/30 text-green-300 border-green-700/50', light: 'bg-green-100 text-green-700 border-green-200' },
                                                { dark: 'bg-orange-900/30 text-orange-300 border-orange-700/50', light: 'bg-orange-100 text-orange-700 border-orange-200' },
                                                { dark: 'bg-cyan-900/30 text-cyan-300 border-cyan-700/50', light: 'bg-cyan-100 text-cyan-700 border-cyan-200' }
                                            ];
                                            const colorIndex = index % badgeColors.length;
                                            const colors = badgeColors[colorIndex];

                                            return (
                                                <span
                                                    key={index}
                                                    className={`px-3 py-1.5 rounded-full text-sm ${darkMode ? colors.dark : colors.light} border font-medium`}
                                                >
                                                    {badge}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Right Side - About and Social */}
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="flex flex-col justify-center space-y-6"
                            >
                                {/* About Section */}
                                <div className="space-y-4">
                                    <h2 className={`text-3xl font-space font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        About <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Me</span>
                                    </h2>
                                    <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-800'} text-base leading-relaxed font-medium`}>
                                        <div className={`p-6 rounded-xl ${darkMode ? 'bg-black/20 backdrop-blur-sm border border-purple-900/30' : 'bg-white/80 backdrop-blur-sm border border-gray-300 shadow-md'}`}>
                                            <p>
                                                {profile.aboutHome1 || "I am a Full Stack MERN Developer skilled in building modern, scalable web applications that deliver exceptional user experiences."}
                                            </p>
                                        </div>
                                        <div className={`p-6 rounded-xl ${darkMode ? 'bg-black/20 backdrop-blur-sm border border-purple-900/30' : 'bg-white/80 backdrop-blur-sm border border-gray-300 shadow-md'}`}>
                                            <p>
                                                {profile.aboutHome2 || "I develop secure backend APIs using Express.js, MongoDB, and JWT authentication. On the frontend, I work with React and Next.js to create fast, user-friendly interfaces."}
                                            </p>
                                        </div>
                                        <div className={`p-6 rounded-xl ${darkMode ? 'bg-black/20 backdrop-blur-sm border border-purple-900/30' : 'bg-white/80 backdrop-blur-sm border border-gray-300 shadow-md'}`}>
                                            <p>
                                                {profile.aboutHome3 || "I have hands-on experience deploying applications on AWS with Nginx and Cloudflare. I'm passionate about building real-world products, optimizing performance, and learning advanced full-stack architecture."}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Media Links */}
                                <div className="flex items-center gap-4 pt-4">
                                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-800'}`}>Connect:</span>
                                    <a
                                        href={profile.social.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center"
                                        aria-label="LinkedIn"
                                    >
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    </a>
                                    <a
                                        href={profile.social.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center"
                                        aria-label="GitHub"
                                    >
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* What I Do Section */}
                <section id="services" ref={servicesRef} className="min-h-screen flex items-center py-20">
                    <div className="w-full px-4 sm:px-6 lg:px-8 w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={servicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-space font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                What I Do
                            </h2>
                            <p className={`text-base font-medium ${darkMode ? 'text-gray-400' : 'text-gray-800'}`}>
                                Full-stack development services to bring your ideas to life
                            </p>
                        </motion.div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate={servicesInView ? "visible" : "hidden"}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {services.map((service, index) => {
                                const IconComponent = getIconComponent(service.iconName)
                                return (
                                    <motion.div
                                        key={index}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        className={`p-6 rounded-xl ${darkMode ? 'bg-black/20 backdrop-blur-sm border border-purple-900/30' : 'bg-white/80 backdrop-blur-sm border border-gray-300'} shadow-lg`}
                                    >
                                        <div className="w-14 h-14 rounded-xl bg-purple-600 flex items-center justify-center mb-4">
                                            <IconComponent className="w-7 h-7 text-white" />
                                        </div>
                                        <h3 className={`text-xl font-space font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {service.title}
                                        </h3>
                                        <p className={`text-base leading-relaxed font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                                            {service.description}
                                        </p>
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    </div>
                </section>

                {/* Experience Section */}
                <section id="experience" ref={experienceRef} className="min-h-screen flex items-center py-20">
                    <div className="w-full px-4 sm:px-6 lg:px-8 w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={experienceInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-space font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Experience
                            </h2>
                        </motion.div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate={experienceInView ? "visible" : "hidden"}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
                        >
                            <motion.div
                                variants={itemVariants}
                                className={`p-6 rounded-xl text-center ${darkMode ? 'bg-black/20 backdrop-blur-sm border border-purple-900/30' : 'bg-white/60 backdrop-blur-sm border border-gray-200'} shadow-lg`}
                            >
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-6">
                                    <FaCode className="w-8 h-8 text-white" />
                                </div>
                                <div className={`text-5xl font-space font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {experience.projectsCompleted}
                                </div>
                                <p className={`text-base font-medium ${darkMode ? 'text-gray-400' : 'text-gray-800'}`}>
                                    Projects Completed
                                </p>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                className={`p-6 rounded-xl text-center ${darkMode ? 'bg-black/20 backdrop-blur-sm border border-purple-900/30' : 'bg-white/60 backdrop-blur-sm border border-gray-200'} shadow-lg`}
                            >
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-6">
                                    <FaRocket className="w-8 h-8 text-white" />
                                </div>
                                <div className={`text-5xl font-space font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {profile?.techStack?.length ? `${profile.techStack.length}+` : '0+'}
                                </div>
                                <p className={`text-base font-medium ${darkMode ? 'text-gray-400' : 'text-gray-800'}`}>
                                    Technologies
                                </p>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                className={`p-6 rounded-xl text-center ${darkMode ? 'bg-black/20 backdrop-blur-sm border border-purple-900/30' : 'bg-white/60 backdrop-blur-sm border border-gray-200'} shadow-lg`}
                            >
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-6">
                                    <FaAward className="w-8 h-8 text-white" />
                                </div>
                                <div className={`text-5xl font-space font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {experience.yearsExperience}
                                </div>
                                <p className={`text-base font-medium ${darkMode ? 'text-gray-400' : 'text-gray-800'}`}>
                                    Years Experience
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Featured Projects Section */}
                <section id="projects" ref={projectsRef} className="py-20">
                    <div className="w-full px-4 sm:px-6 lg:px-8 w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={projectsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-space font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Featured Projects
                            </h2>
                            <p className={`text-base font-medium ${darkMode ? 'text-gray-400' : 'text-gray-800'}`}>
                                Check out some of my recent work and projects
                            </p>
                        </motion.div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate={projectsInView ? "visible" : "hidden"}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {(showAllProjects ? projects : projects.slice(0, 3)).map((project, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    initial={showAllProjects && index >= 3 ? { opacity: 0, y: 20 } : false}
                                    animate={showAllProjects && index >= 3 ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: (index - 3) * 0.1 }}
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    className={`rounded-xl overflow-hidden ${darkMode ? 'bg-black/20 backdrop-blur-sm border border-purple-900/30' : 'bg-white/80 backdrop-blur-sm border border-gray-300'} shadow-lg`}
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className={`text-xl font-space font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {project.title}
                                        </h3>
                                        <p className={`text-base leading-relaxed mb-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                                            {project.description}
                                        </p>
                                        <a
                                            href={project.demoLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`inline-flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors`}
                                        >
                                            <span>Live Demo</span>
                                            <FaExternalLinkAlt className="w-4 h-4" />
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {!showAllProjects && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={projectsInView ? { opacity: 1 } : { opacity: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-center mt-12"
                            >
                                <button
                                    onClick={handleViewAllProjects}
                                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-base ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'} transition-colors`}
                                >
                                    <span>View All Projects</span>
                                    <FaArrowRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* Tech Stack Section */}
                <section id="tech-stack" ref={techStackRef} className="py-20">
                    <div className="w-full px-4 sm:px-6 lg:px-8 w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={techStackInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-space font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Tech Stack
                            </h2>
                            <p className={`text-base font-medium ${darkMode ? 'text-gray-400' : 'text-gray-800'}`}>
                                Technologies and tools I use to build amazing digital experiences
                            </p>
                        </motion.div>

                        {techStack.length > 0 ? (
                            <div className="space-y-12">
                                {techStack.map((stack, categoryIndex) => {
                                    const CategoryIcon = stack.icon
                                    return (
                                        <motion.div
                                            key={categoryIndex}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={techStackInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                            transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
                                            className="space-y-6"
                                        >
                                            <div className="flex items-center gap-3 mb-6">
                                                <CategoryIcon className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                                                <h3 className={`text-2xl font-space font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {stack.category}
                                                </h3>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
                                                {stack.technologies.map((tech, techIndex) => {
                                                    const TechIcon = tech.icon
                                                    return (
                                                        <motion.div
                                                            key={`${categoryIndex}-${techIndex}`}
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={techStackInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                                                            transition={{ duration: 0.4, delay: (categoryIndex * 0.2) + (techIndex * 0.05) }}
                                                            whileHover={{ scale: 1.1, y: -5 }}
                                                            className={`p-6 rounded-xl text-center ${darkMode ? 'bg-black/20 backdrop-blur-sm border border-purple-900/30' : 'bg-white/60 backdrop-blur-sm border border-gray-200'} shadow-lg`}
                                                        >
                                                            <div className="flex justify-center mb-3">
                                                                <TechIcon className={`w-12 h-12 ${tech.color}`} />
                                                            </div>
                                                            <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                                                {tech.name}
                                                            </p>
                                                        </motion.div>
                                                    )
                                                })}
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={techStackInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.6 }}
                                className="text-center py-12"
                            >
                                <p className={`text-lg font-medium ${darkMode ? 'text-gray-400' : 'text-gray-800'}`}>
                                    Add your technologies in the Admin Panel to see them here.
                                </p>
                            </motion.div>
                        )}
                    </div>
                </section>

            </div>
        </div>
    )
}

export default Home
// Updated Home component
