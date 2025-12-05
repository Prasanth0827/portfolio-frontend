import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { portfolioAPI } from '../services/api';
import {
    FaCode,
    FaServer,
    FaMobileAlt,
    FaCloud,
    FaShieldAlt,
    FaChartLine,
    FaBars
} from 'react-icons/fa';
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
    SiCloudflare
} from 'react-icons/si';
import defaultProfileImage from '../assets/prasanth.jpg';

const PortfolioContext = createContext();

export const usePortfolio = () => useContext(PortfolioContext);

export const PortfolioProvider = ({ children }) => {
    // Default Data
    const defaultProfile = {
        name: "Hemaprasanth V",
        role: "Full-Stack Developer",
        showProjectIntro: true,
        bio: "I am a Full Stack MERN Developer skilled in building modern, scalable web applications that deliver exceptional user experiences.",
        aboutMe: "I'm Hemaprasanth, a dedicated Frontend / MERN Stack Developer who loves building clean, responsive, and user-focused web applications. I specialize in React, JavaScript, HTML, CSS, and Tailwind. I focus on writing clean, scalable code and creating visually engaging interfaces. I enjoy solving problems, improving UI/UX, and continuously learning new technologies. My goal is to build scalable and user-friendly applications that make an impact.",
        aboutHome1: "I am a Full Stack MERN Developer skilled in building modern, scalable web applications that deliver exceptional user experiences.",
        aboutHome2: "I develop secure backend APIs using Express.js, MongoDB, and JWT authentication. On the frontend, I work with React and Next.js to create fast, user-friendly interfaces.",
        aboutHome3: "I have hands-on experience deploying applications on AWS with Nginx and Cloudflare. I'm passionate about building real-world products, optimizing performance, and learning advanced full-stack architecture.",
        image: defaultProfileImage,
        logo: null,
        social: {
            linkedin: "https://linkedin.com",
            github: "https://github.com"
        },
        techStack: [
            'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express',
            'MongoDB', 'Next.js', 'Tailwind CSS', 'AWS', 'Nginx', 'Cloudflare', 'JWT'
        ],
        badges: ['AI Enthusiast', 'Tech Blogger'] // Default badges
    };

    const defaultServices = [
        {
            iconName: "FaCode",
            title: "Frontend Development",
            description: "Building responsive, interactive UIs with React, Next.js, and modern CSS frameworks"
        },
        {
            iconName: "FaServer",
            title: "Backend Development",
            description: "Creating robust APIs and server-side logic with Node.js, Express, and MongoDB"
        },
        {
            iconName: "FaMobileAlt",
            title: "Full-Stack Solutions",
            description: "End-to-end development from database design to deployment and maintenance"
        },
        {
            iconName: "FaCloud",
            title: "Cloud Deployment",
            description: "Deploying applications on AWS with Nginx, Cloudflare, and CI/CD pipelines"
        },
        {
            iconName: "FaShieldAlt",
            title: "Security & Auth",
            description: "Implementing JWT authentication, secure APIs, and best security practices"
        },
        {
            iconName: "FaChartLine",
            title: "Performance Optimization",
            description: "Optimizing applications for speed, scalability, and better user experience"
        }
    ];

    const defaultProjects = [
        {
            title: "Festival Management Platform",
            description: "A complete film-festival management platform designed and developed end-to-end. It enables festivals to manage submissions, entries, and contests efficiently.",
            image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=600&fit=crop",
            demoLink: "https://example.com"
        },
        {
            title: "Shortfundly OTT Hub",
            description: "A centralized OTT discovery and comparison platform built to help users explore, compare, and subscribe to various streaming services.",
            image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=600&fit=crop",
            demoLink: "https://example.com"
        },
        {
            title: "BrioTv OTT",
            description: "I enhanced the BRIO OTT backend with advanced rate-limiting, creating separate policies for web and mobile platforms to optimize performance.",
            image: "https://images.unsplash.com/photo-1601142634808-38923eb7c560?w=800&h=600&fit=crop",
            demoLink: "https://example.com"
        },
        {
            title: "E-Commerce Platform",
            description: "A full-stack e-commerce solution with payment integration, inventory management, and admin dashboard built with MERN stack.",
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
            demoLink: "https://example.com"
        },
        {
            title: "Task Management App",
            description: "A collaborative task management application with real-time updates, team collaboration features, and project tracking capabilities.",
            image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
            demoLink: "https://example.com"
        },
        {
            title: "Social Media Dashboard",
            description: "A comprehensive social media analytics dashboard that aggregates data from multiple platforms and provides insights and analytics.",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
            demoLink: "https://example.com"
        }
    ];

    const defaultContact = {
        email: "hemaprasanth08@gmail.com",
        phone: "+91 8608278739",
        location: "Tamil Nadu, India"
    };

    const defaultExperience = {
        projectsCompleted: "3+",
        technologies: "14+",
        yearsExperience: "2+"
    };

    const defaultTimeline = [
        {
            period: "Mar 2025 - PRESENT",
            title: "Full Stack Developer",
            company: "Shortfundly",
            description: "Shortfundly is a creative platform that connects short filmmakers, audiences, and film festivals across the globe. It helps filmmakers showcase, promote, and monetize their short films while engaging with a passionate film community."
        },
        {
            period: "Aug 2024 - Jan 2025",
            title: "MERN Stack Developer",
            company: "Code99 Academy",
            description: "MERN Stack Developer Certification Completed: full-stack development training using MongoDB, Express.js, React, and Node.js."
        },
        {
            period: "Aug 2020 - May 2024",
            title: "BE in Computer Science",
            company: "University College of Engineering, Ramanathapuram",
            description: "BE in Computer Science and Engineering"
        }
    ];

    // Helper to map icon names back to components
    const iconMap = {
        FaCode, FaServer, FaMobileAlt, FaCloud, FaShieldAlt, FaChartLine, FaBars,
        SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiTailwindcss, SiNodedotjs, SiExpress, SiMongodb, SiNginx, SiCloudflare
    };

    const getIconComponent = (iconName) => {
        return iconMap[iconName] || FaCode;
    };

    // State Initialization
    const [profile, setProfile] = useState(defaultProfile);
    const [services, setServices] = useState(defaultServices);
    const [projects, setProjects] = useState(defaultProjects);
    const [contact, setContact] = useState(defaultContact);
    const [experience, setExperience] = useState(defaultExperience);
    const [timeline, setTimeline] = useState(defaultTimeline);
    const [resume, setResume] = useState({ fileName: null, fileData: null });

    const [darkMode, setDarkMode] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const pollingIntervalRef = useRef(null);

    const toggleTheme = () => setDarkMode(prev => !prev);

    // Load data from MongoDB Backend
    const loadData = async (showLoader = false) => {
        if (showLoader) setIsLoading(true);

        try {
            console.log('📡 Loading data from MongoDB backend...');

            // Fetch all data from backend
            const [aboutRes, projectsRes, skillsRes] = await Promise.all([
                portfolioAPI.about.get().catch(() => ({ data: { data: null } })),
                portfolioAPI.projects.getAll().catch(() => ({ data: { data: [] } })),
                portfolioAPI.skills.getAll().catch(() => ({ data: { data: {} } }))
            ]);

            // Update profile from About endpoint
            if (aboutRes.data.data) {
                const aboutData = aboutRes.data.data;

                // Ensure techStack is always an array
                const backendTechStack = Array.isArray(aboutData.techStack)
                    ? aboutData.techStack.filter(t => t && typeof t === 'string' && t.trim().length > 0)
                    : [];

                console.log('📡 Raw techStack from backend:', aboutData.techStack);
                console.log('📦 Processed techStack:', backendTechStack);
                console.log('📊 TechStack count:', backendTechStack.length);

                const mappedProfile = {
                    ...defaultProfile,
                    name: aboutData.title || defaultProfile.name,
                    role: aboutData.shortBio || defaultProfile.role,
                    showProjectIntro: aboutData.showProjectIntro !== undefined ? aboutData.showProjectIntro : true,
                    bio: aboutData.bio || defaultProfile.bio,
                    aboutMe: aboutData.bio || defaultProfile.aboutMe,
                    aboutHome1: aboutData.aboutHome1 || defaultProfile.aboutHome1,
                    aboutHome2: aboutData.aboutHome2 || defaultProfile.aboutHome2,
                    aboutHome3: aboutData.aboutHome3 || defaultProfile.aboutHome3,
                    image: aboutData.profileImage || defaultProfile.image,
                    logo: aboutData.logo || null,
                    social: aboutData.socialLinks || defaultProfile.social,
                    techStack: backendTechStack, // NO DEMO - only from backend, properly filtered
                    badges: Array.isArray(aboutData.badges) ? aboutData.badges.filter(b => b && typeof b === 'string' && b.trim().length > 0) : (defaultProfile.badges || [])
                };
                console.log('✅ Final mappedProfile techStack:', mappedProfile.techStack);
                console.log('✅ Final mappedProfile badges:', mappedProfile.badges);
                setProfile(mappedProfile);

                // Update resume if available
                if (aboutData.resume) {
                    setResume(aboutData.resume);
                }

                // Update contact if available
                if (aboutData.contact) {
                    setContact(aboutData.contact);
                }

                // Update experience stats if available
                if (aboutData.experienceStats) {
                    setExperience(aboutData.experienceStats);
                }

                // Map experience/education to timeline
                const experienceCount = aboutData.experience?.length || 0;
                const educationCount = aboutData.education?.length || 0;

                console.log('📡 Backend data received:');
                console.log('  - Experience items:', experienceCount);
                console.log('  - Education items:', educationCount);

                const timelineData = [
                    ...(aboutData.experience || []).map(exp => {
                        const startDate = exp.startDate ? new Date(exp.startDate) : new Date();
                        const endDate = exp.endDate ? new Date(exp.endDate) : null;
                        const startStr = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                        const endStr = endDate ? endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'PRESENT';

                        return {
                            type: 'experience',
                            period: `${startStr} - ${endStr}`,
                            title: exp.position || '',
                            company: exp.company || '',
                            description: exp.description || '',
                            startDate: startDate, // Keep for sorting
                            order: exp.order // Keep for manual sorting
                        };
                    }),
                    ...(aboutData.education || []).map(edu => {
                        const startDate = edu.startDate ? new Date(edu.startDate) : new Date();
                        const endDate = edu.endDate ? new Date(edu.endDate) : new Date();
                        const startStr = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                        const endStr = endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

                        return {
                            type: 'education',
                            period: `${startStr} - ${endStr}`,
                            title: edu.degree || '',
                            company: edu.institution || '',
                            description: edu.description || '',
                            startDate: startDate, // Keep for sorting
                            order: edu.order // Keep for manual sorting
                        };
                    })
                ];

                // Sort by order if available, otherwise by startDate descending
                timelineData.sort((a, b) => {
                    if (a.order !== undefined && b.order !== undefined) {
                        const orderDiff = a.order - b.order;
                        if (orderDiff !== 0) return orderDiff;
                    }
                    return b.startDate - a.startDate;
                });

                console.log('📋 Loaded timeline from backend:', timelineData.length, 'items');
                console.log('📋 Timeline items:', timelineData.map((t, i) => `${i + 1}. [${t.type}] ${t.company} - ${t.title}`).join(', '));
                setTimeline(timelineData);
            }

            if (projectsRes.data.data) {
                const projectsData = Array.isArray(projectsRes.data.data)
                    ? projectsRes.data.data
                    : [];

                const mappedProjects = projectsData.map(project => ({
                    _id: project._id,
                    title: project.title,
                    description: project.description,
                    image: project.images?.[0] || 'https://via.placeholder.com/400x300',
                    demoLink: project.liveUrl || '',
                    repoLink: project.repoUrl || '',
                    tech: project.tech || []
                }));
                setProjects(mappedProjects);
            }

            // Update skills (comes as grouped object)
            if (skillsRes.data.data) {
                const skillsData = Object.values(skillsRes.data.data).flat();
                // Map to services format if needed
                setServices(defaultServices);
            }

            console.log('✅ Data loaded from MongoDB backend');
            setIsLoading(false);
        } catch (error) {
            console.error('❌ Error loading data from backend:', error);
            // Use defaults on error
            setProfile(defaultProfile);
            setProjects(defaultProjects);
            setServices(defaultServices);
            setContact(defaultContact);
            setExperience(defaultExperience);
            setTimeline(defaultTimeline);
            setIsLoading(false);
        }
    };

    // Initial load and polling setup
    useEffect(() => {
        loadData(true);

        // Poll for updates every 30 seconds (reduced from 5s to avoid rate limits)
        // But only poll on non-admin pages to avoid overwriting user edits
        const isAdminPage = window.location.pathname.includes('/admin');

        if (!isAdminPage) {
            pollingIntervalRef.current = setInterval(() => {
                loadData(false); // Don't show loader on polling
            }, 30000); // 30 seconds
        }

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, []);

    // Update Functions (Write to MongoDB Backend)
    const updateProfile = async (newProfile) => {
        try {
            console.log('💾 Updating profile in MongoDB...');

            // Ensure techStack is an array
            const techStackArray = Array.isArray(newProfile.techStack)
                ? newProfile.techStack.filter(t => t && typeof t === 'string' && t.trim().length > 0)
                : [];

            console.log('📦 Tech Stack to save:', techStackArray);
            console.log('📊 Tech Stack count:', techStackArray.length);

            // Map to backend About model
            const aboutData = {
                title: newProfile.name,
                bio: newProfile.aboutMe || newProfile.bio,
                shortBio: newProfile.role,
                showProjectIntro: newProfile.showProjectIntro,
                profileImage: newProfile.image,
                logo: newProfile.logo,
                aboutHome1: newProfile.aboutHome1,
                aboutHome2: newProfile.aboutHome2,
                aboutHome3: newProfile.aboutHome3,
                socialLinks: newProfile.social,
                techStack: techStackArray, // Ensure it's a clean array
                badges: Array.isArray(newProfile.badges) ? newProfile.badges.filter(b => b && typeof b === 'string' && b.trim().length > 0) : []
            };

            await portfolioAPI.about.update(aboutData);
            console.log('✅ Profile updated successfully in MongoDB');
            console.log('✅ Tech Stack saved:', techStackArray.length, 'technologies');

            // Refresh data after update
            await loadData(false);
        } catch (error) {
            console.error('❌ Error updating profile:', error);
            throw new Error(error.response?.data?.error || error.message || 'Failed to update profile');
        }
    };

    const updateServices = async (newServices) => {
        try {
            // Services are typically static in this implementation
            setServices(newServices);
            console.log('Services updated successfully');
        } catch (error) {
            console.error('Error updating services:', error);
            throw error;
        }
    };

    const updateProjects = async (newProjects) => {
        try {
            console.log('💾 Updating projects in MongoDB...');

            // Get current projects from backend
            const currentRes = await portfolioAPI.projects.getAll();
            const currentProjects = currentRes.data.data || [];
            const currentIds = currentProjects.map(p => p._id);

            // Update or create each project
            for (const project of newProjects) {
                const projectData = {
                    title: project.title,
                    description: project.description,
                    images: [project.image],
                    liveUrl: project.demoLink || '',
                    repoUrl: project.repoLink || '',
                    tech: project.tech || [],
                    status: 'published',
                    featured: project.featured || false
                };

                if (project._id && currentIds.includes(project._id)) {
                    // Update existing project
                    await portfolioAPI.projects.update(project._id, projectData);
                } else {
                    // Create new project
                    await portfolioAPI.projects.create(projectData);
                }
            }

            // Delete projects that were removed
            const newProjectIds = newProjects.map(p => p._id).filter(Boolean);
            for (const currentProject of currentProjects) {
                if (!newProjectIds.includes(currentProject._id)) {
                    await portfolioAPI.projects.delete(currentProject._id);
                }
            }

            console.log('✅ Projects updated successfully in MongoDB');

            // Refresh data after update
            await loadData(false);
        } catch (error) {
            console.error('❌ Error updating projects:', error);
            throw new Error(error.response?.data?.error || error.message || 'Failed to update projects');
        }
    };

    const updateContact = async (newContact) => {
        try {
            console.log('💾 Updating contact in MongoDB...');

            await portfolioAPI.about.update({
                contact: newContact
            });

            setContact(newContact);
            console.log('✅ Contact updated successfully in MongoDB');

            // Refresh data after update
            await loadData(false);
        } catch (error) {
            console.error('❌ Error updating contact:', error);
            throw new Error(error.response?.data?.error || error.message || 'Failed to update contact');
        }
    };

    const updateExperience = async (newExperience) => {
        try {
            console.log('💾 Updating experience stats in MongoDB...');

            await portfolioAPI.about.update({
                experienceStats: newExperience
            });

            setExperience(newExperience);
            console.log('✅ Experience stats updated successfully in MongoDB');

            // Refresh data after update
            await loadData(false);
        } catch (error) {
            console.error('❌ Error updating experience:', error);
            throw new Error(error.response?.data?.error || error.message || 'Failed to update experience');
        }
    };

    const updateTimeline = async (newTimeline) => {
        try {
            console.log('💾 Updating timeline in MongoDB...', newTimeline.length, 'items');
            console.log('📋 Timeline data:', newTimeline);

            // Helper function to parse period string to Date
            const parsePeriodToDate = (periodStr) => {
                if (!periodStr) return new Date();

                // Handle "PRESENT" case
                if (periodStr.includes('PRESENT')) {
                    return null;
                }

                // Parse format like "Mar 2025" or "Jan 2024"
                const parts = periodStr.trim().split(' ');
                if (parts.length >= 2) {
                    const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
                    const inputMonth = parts[0].toLowerCase().substring(0, 3);
                    const month = monthNames.indexOf(inputMonth);
                    const year = parseInt(parts[1]);

                    if (month !== -1 && !isNaN(year)) {
                        return new Date(year, month, 1).toISOString();
                    }
                }

                // Fallback to current date
                return new Date().toISOString();
            };

            // Split timeline into experience and education
            const experiences = [];
            const educations = [];

            newTimeline.forEach((item, index) => {
                const periodParts = item.period?.split(' - ') || [];
                const startDateStr = periodParts[0]?.trim() || '';
                const endDateStr = periodParts[1]?.trim() || '';

                const isPresent = endDateStr.includes('PRESENT') || endDateStr === 'PRESENT';
                const startDate = parsePeriodToDate(startDateStr);
                const endDate = isPresent ? null : parsePeriodToDate(endDateStr);

                if (item.type === 'education') {
                    educations.push({
                        institution: item.company || '',
                        degree: item.title || '',
                        startDate: startDate,
                        endDate: endDate || new Date(), // Education usually has an end date
                        description: item.description || '',
                        order: index // Save order
                    });
                } else {
                    // Default to experience
                    experiences.push({
                        company: item.company || '',
                        position: item.title || '',
                        startDate: startDate,
                        endDate: endDate,
                        current: isPresent,
                        description: item.description || '',
                        order: index // Save order
                    });
                }
            });

            console.log('📤 Sending to backend:');
            console.log('  - Experience:', experiences.length);
            console.log('  - Education:', educations.length);

            // Send both experience and education arrays to backend
            const response = await portfolioAPI.about.update({
                experience: experiences,
                education: educations
            });

            console.log('✅ Timeline updated successfully in MongoDB');
            console.log('✅ Backend response:', response.data);

            // Update local timeline state immediately
            setTimeline(newTimeline);
            console.log('✅ Context timeline state updated to:', newTimeline.length, 'items');

            // Don't reload immediately - let the natural polling handle it
            // The state is already updated, so UI will show correct data
        } catch (error) {
            console.error('❌ Error updating timeline:', error);
            console.error('❌ Error details:', error.response?.data);
            throw new Error(error.response?.data?.error || error.message || 'Failed to update timeline');
        }
    };

    const updateResume = async (newResume) => {
        try {
            console.log('💾 Updating resume in MongoDB...');

            // Save resume to MongoDB (part of About document)
            await portfolioAPI.about.update({
                resume: newResume
            });

            setResume(newResume);
            console.log('✅ Resume updated successfully in MongoDB');

            // Refresh data after update
            await loadData(false);
        } catch (error) {
            console.error('❌ Error updating resume:', error);
            throw new Error(error.response?.data?.error || error.message || 'Failed to update resume');
        }
    };

    const value = {
        darkMode,
        toggleTheme,
        profile,
        services,
        projects,
        contact,
        experience,
        timeline,
        resume,
        updateProfile,
        updateServices,
        updateProjects,
        updateContact,
        updateExperience,
        updateTimeline,
        updateResume,
        getIconComponent,
        isLoading
    };

    return (
        <PortfolioContext.Provider value={value}>
            {children}
        </PortfolioContext.Provider>
    );
};
