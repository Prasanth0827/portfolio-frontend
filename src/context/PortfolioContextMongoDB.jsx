/**
 * MongoDB-based Portfolio Context
 * 
 * This replaces Firebase with MongoDB backend
 * Provides real-time updates via polling
 */

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { portfolioAPI } from '../services/api';
import defaultProfileImage from '../assets/prasanth.jpg';

const PortfolioContext = createContext();

export const usePortfolio = () => useContext(PortfolioContext);

export const PortfolioProvider = ({ children }) => {
  // State
  const [profile, setProfile] = useState({
    name: "Loading...",
    role: "Developer",
    bio: "",
    aboutMe: "",
    image: defaultProfileImage,
    social: { linkedin: "", github: "" },
    techStack: []
  });
  
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [services, setServices] = useState([]);
  const [contact, setContact] = useState({});
  const [experience, setExperience] = useState({});
  const [timeline, setTimeline] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  const pollingIntervalRef = useRef(null);

  // Load all data from MongoDB backend
  const loadData = async (showLoader = false) => {
    if (showLoader) setIsLoading(true);
    
    try {
      // Fetch all data in parallel
      const [aboutRes, projectsRes, skillsRes] = await Promise.all([
        portfolioAPI.about.get().catch(() => ({ data: { data: null } })),
        portfolioAPI.projects.getAll().catch(() => ({ data: { data: [] } })),
        portfolioAPI.skills.getAll().catch(() => ({ data: { data: {} } }))
      ]);

      // Update profile from About endpoint
      if (aboutRes.data.data) {
        const aboutData = aboutRes.data.data;
        setProfile({
          name: aboutData.title || "Your Name",
          role: aboutData.shortBio || "Developer",
          bio: aboutData.bio || "",
          aboutMe: aboutData.bio || "",
          image: aboutData.profileImage || defaultProfileImage,
          social: aboutData.socialLinks || { linkedin: "", github: "" },
          techStack: []
        });
        
        // Set timeline from experience/education
        if (aboutData.experience || aboutData.education) {
          const timelineData = [
            ...(aboutData.experience || []).map(exp => ({
              period: `${exp.startDate} - ${exp.endDate || 'PRESENT'}`,
              title: exp.position,
              company: exp.company,
              description: exp.description
            })),
            ...(aboutData.education || []).map(edu => ({
              period: `${edu.startDate} - ${edu.endDate}`,
              title: edu.degree,
              company: edu.institution,
              description: edu.description
            }))
          ];
          setTimeline(timelineData);
        }
      }

      // Update projects
      if (projectsRes.data.data) {
        const projectsData = projectsRes.data.data.map(project => ({
          _id: project._id,
          title: project.title,
          description: project.description,
          image: project.images?.[0] || 'https://via.placeholder.com/400x300',
          demoLink: project.liveUrl,
          repoLink: project.repoUrl,
          tech: project.tech || []
        }));
        setProjects(projectsData);
      }

      // Update skills
      if (skillsRes.data.data) {
        const skillsData = Object.values(skillsRes.data.data).flat();
        setSkills(skillsData);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading data from backend:', error);
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadData(true);
    
    // Set up polling for real-time updates (every 5 seconds)
    pollingIntervalRef.current = setInterval(() => {
      loadData(false); // Don't show loader on polling
    }, 5000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // ==================== UPDATE FUNCTIONS ====================

  const updateProfile = async (newProfile) => {
    try {
      // Map to backend About model
      const aboutData = {
        title: newProfile.name,
        bio: newProfile.aboutMe || newProfile.bio,
        shortBio: newProfile.role,
        profileImage: newProfile.image,
        socialLinks: newProfile.social
      };

      await portfolioAPI.about.update(aboutData);
      await loadData(false); // Refresh data
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const updateProjects = async (newProjects) => {
    try {
      // Update or create each project
      for (const project of newProjects) {
        const projectData = {
          title: project.title,
          description: project.description,
          images: [project.image],
          liveUrl: project.demoLink,
          repoUrl: project.repoLink,
          tech: project.tech || [],
          status: 'published'
        };

        if (project._id) {
          // Update existing
          await portfolioAPI.projects.update(project._id, projectData);
        } else {
          // Create new
          await portfolioAPI.projects.create(projectData);
        }
      }

      // Remove deleted projects
      const currentProjectIds = newProjects.map(p => p._id).filter(Boolean);
      const existingProjects = projects;
      
      for (const existing of existingProjects) {
        if (existing._id && !currentProjectIds.includes(existing._id)) {
          await portfolioAPI.projects.delete(existing._id);
        }
      }

      await loadData(false); // Refresh data
    } catch (error) {
      console.error('Error updating projects:', error);
      throw error;
    }
  };

  const updateServices = async (newServices) => {
    // Services are typically static, but you can implement if needed
    setServices(newServices);
  };

  const updateContact = async (newContact) => {
    setContact(newContact);
  };

  const updateExperience = async (newExperience) => {
    setExperience(newExperience);
  };

  const updateTimeline = async (newTimeline) => {
    try {
      // Map timeline to experience/education in About
      const experiences = newTimeline
        .filter(item => item.title && item.company)
        .map(item => ({
          company: item.company,
          position: item.title,
          startDate: item.period?.split(' - ')[0] || new Date().toISOString(),
          endDate: item.period?.includes('PRESENT') ? null : item.period?.split(' - ')[1],
          current: item.period?.includes('PRESENT') || false,
          description: item.description
        }));

      await portfolioAPI.about.update({ experience: experiences });
      await loadData(false);
    } catch (error) {
      console.error('Error updating timeline:', error);
      throw error;
    }
  };

  const updateResume = async (newResume) => {
    // Resume storage - you might want to handle this differently
    // Could upload to backend or keep in localStorage
    localStorage.setItem('portfolio_resume', JSON.stringify(newResume));
  };

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  const getIconComponent = (iconName) => {
    // Icon mapping utility
    return iconName;
  };

  // Context value
  const value = {
    darkMode,
    toggleTheme,
    profile,
    services,
    projects,
    contact,
    experience,
    timeline,
    resume: JSON.parse(localStorage.getItem('portfolio_resume') || '{"fileName":null,"fileData":null}'),
    updateProfile,
    updateServices,
    updateProjects,
    updateContact,
    updateExperience,
    updateTimeline,
    updateResume,
    getIconComponent,
    isLoading,
    refreshData: () => loadData(false)
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};

export default PortfolioContext;

