import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { Link } from 'react-router-dom';
import { FaSave, FaPlus, FaTrash, FaArrowLeft, FaSignOutAlt, FaCheck, FaGripVertical } from 'react-icons/fa';
import Confetti from 'react-confetti';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

const AdminPanel = () => {
    const navigate = useNavigate();
    const {
        profile, updateProfile,
        projects, updateProjects,
        services, updateServices,
        contact, updateContact,
        experience, updateExperience,
        timeline, updateTimeline,
        resume, updateResume,
        isLoading
    } = usePortfolio();

    const [activeTab, setActiveTab] = useState('profile');
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    // Local state for forms to avoid constant re-renders on global context
    const [localProfile, setLocalProfile] = useState(profile);
    const [localProjects, setLocalProjects] = useState(projects);
    const [localServices, setLocalServices] = useState(services);
    const [localContact, setLocalContact] = useState(contact);
    const [localExperience, setLocalExperience] = useState(experience);
    const [localTimeline, setLocalTimeline] = useState(timeline);
    const [isInitialized, setIsInitialized] = useState(false);
    const [techStackText, setTechStackText] = useState(''); // Raw text for textarea
    const [badgesText, setBadgesText] = useState(''); // Raw text for badges textarea

    const justSavedTimelineRef = useRef(false); // Track if we just saved timeline

    // Sync local state with context data when it changes from backend
    useEffect(() => {
        // Initialize immediately with current data (don't wait for loading)
        if (!isInitialized && profile && services && projects) {
            const techStackArray = Array.isArray(profile.techStack) ? profile.techStack : [];
            const badgesArray = Array.isArray(profile.badges) ? profile.badges : [];
            setLocalProfile({
                ...profile,
                techStack: techStackArray,
                badges: badgesArray
            });
            setTechStackText(techStackArray.join('\n')); // Initialize textarea with newlines
            setBadgesText(badgesArray.join('\n')); // Initialize badges textarea with newlines
            setLocalProjects(projects);
            setLocalServices(services);
            setLocalContact(contact || { email: '', phone: '', location: '' });
            setLocalExperience(experience || { projectsCompleted: '', clientsSatisfied: '', yearsExperience: '' });

            // Ensure items have IDs for drag and drop
            setLocalTimeline(timeline.map(t => ({ ...t, id: t._id || t.id || Math.random().toString(36).substr(2, 9) })));

            setIsInitialized(true);
            console.log('✅ Admin Panel initialized');
        }

        // Update after successful save (when data comes back from backend)
        // Only update if we're not currently editing (not saving)
        // Don't update if user is on experience or timeline tabs to prevent auto-refresh while editing
        if (isInitialized && !isSaving && !isLoading && activeTab !== 'experience' && activeTab !== 'timeline') {
            const techStackArray = Array.isArray(profile.techStack) ? profile.techStack : [];
            const badgesArray = Array.isArray(profile.badges) ? profile.badges : [];

            setLocalProfile(prev => ({
                ...profile,
                techStack: techStackArray,
                badges: badgesArray
            }));
            setTechStackText(techStackArray.join('\n'));
            setBadgesText(badgesArray.join('\n'));
            setLocalProjects(projects);
            setLocalServices(services);
            setLocalContact(contact || { email: '', phone: '', location: '' });
            setLocalExperience(experience || { projectsCompleted: '', clientsSatisfied: '', yearsExperience: '' });
            // Don't update localTimeline from context when on timeline tab
            console.log('✅ Admin Panel data refreshed from backend');
        }

        // Update timeline when switching to timeline tab (only on initial load or when explicitly needed)
        // Don't overwrite if user has made changes or just saved
        if (isInitialized && activeTab === 'timeline' && !isSaving && Array.isArray(timeline)) {
            // Don't sync if we just saved (give it time to persist)
            if (justSavedTimelineRef.current) {
                console.log('⏸️ Skipping timeline sync - just saved, preserving local state');
                // Reset flag after 2 seconds
                setTimeout(() => {
                    justSavedTimelineRef.current = false;
                }, 2000);
                return;
            }

            // Only sync if:
            // 1. localTimeline is empty (initial load)
            // 2. OR timeline from backend has different length
            const shouldSync = localTimeline.length === 0 ||
                (localTimeline.length !== timeline.length);

            if (shouldSync) {
                console.log('📋 Syncing timeline from backend:', timeline.length, 'items');
                console.log('📋 Current local timeline:', localTimeline.length, 'items');
                // Ensure items have IDs for drag and drop
                setLocalTimeline(timeline.map(t => ({ ...t, id: t._id || t.id || Math.random().toString(36).substr(2, 9) })));
            } else {
                console.log('⏸️ Skipping timeline sync - lengths match, preserving local changes');
            }
        }
    }, [isLoading, profile, projects, services, contact, experience, timeline, isInitialized, isSaving, activeTab]);

    // Show loading only for a short time, then show the panel with default data
    if (isLoading && !isInitialized) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-purple-400 text-xl font-bold animate-pulse">Loading Admin Panel...</div>
            </div>
        );
    }

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setLocalProfile(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else if (name === 'techStack' && Array.isArray(value)) {
            // Handle techStack as array (from textarea onChange)
            setLocalProfile(prev => ({ ...prev, [name]: value }));
        } else {
            setLocalProfile(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (keep under 1MB for MongoDB)
            const maxSize = 1024 * 1024; // 1MB
            if (file.size > maxSize) {
                alert(`File is too large! Maximum size is ${(maxSize / 1024).toFixed(0)}KB. Please compress the image.`);
                e.target.value = '';
                return;
            }

            // Prevent duplicate uploads in React StrictMode
            if (e.target.value) {
                console.log('📤 Uploading profile image:', file.name);
                const reader = new FileReader();
                reader.onloadend = () => {
                    console.log('✅ Profile image loaded, size:', (reader.result.length / 1024).toFixed(2), 'KB');
                    setLocalProfile(prev => ({ ...prev, image: reader.result }));
                };
                reader.readAsDataURL(file);
            }
            // Reset input to allow same file to be selected again
            setTimeout(() => {
                e.target.value = '';
            }, 100);
        }
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (MongoDB limit is ~16MB per document, stay under 1MB for safety)
            const maxSize = 1024 * 1024; // 1MB
            if (file.size > maxSize) {
                alert(`File is too large! Maximum size is ${(maxSize / 1024).toFixed(0)}KB. Your file is ${(file.size / 1024).toFixed(0)}KB. Please compress the image.`);
                e.target.value = '';
                return;
            }

            // Prevent duplicate uploads in React StrictMode
            if (e.target.value) {
                console.log('📤 Uploading logo:', file.name, `(${(file.size / 1024).toFixed(2)} KB)`);
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64Size = reader.result.length;
                    const base64SizeKB = (base64Size / 1024).toFixed(2);
                    console.log('✅ Logo loaded, base64 size:', base64SizeKB, 'KB');

                    setLocalProfile(prev => ({ ...prev, logo: reader.result }));
                    setSaveError(null);
                };
                reader.onerror = () => {
                    console.error('❌ Error reading file');
                    alert('Error reading file. Please try again.');
                    e.target.value = '';
                };
                reader.readAsDataURL(file);
            }
            // Reset input to allow same file to be selected again
            setTimeout(() => {
                e.target.value = '';
            }, 100);
        }
    };

    const saveProfile = async () => {
        setIsSaving(true);
        setSaveError(null);
        const startTime = Date.now();

        try {
            // Finalize tech stack from textarea before saving
            const finalTechStack = techStackText
                .split(/\n|,/)
                .map(t => t.trim())
                .filter(t => t && t.length > 0);

            // Finalize badges from textarea before saving
            const finalBadges = badgesText
                .split(/\n|,/)
                .map(b => b.trim())
                .filter(b => b && b.length > 0);

            const profileToSave = {
                ...localProfile,
                techStack: finalTechStack,
                badges: finalBadges
            };

            console.log('💾 Saving profile...', {
                hasLogo: !!localProfile.logo,
                logoSize: localProfile.logo ? (localProfile.logo.length / 1024).toFixed(2) + ' KB' : 'N/A',
                techStackCount: finalTechStack.length
            });
            console.log('📦 Tech Stack to save:', finalTechStack);

            // Add timeout wrapper
            const savePromise = updateProfile(profileToSave);
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Save operation is taking too long. Please check your connection and try again.')), 15000)
            );

            await Promise.race([savePromise, timeoutPromise]);

            // Update local state with saved profile data
            setLocalProfile(profileToSave);
            setTechStackText(finalTechStack.join('\n'));
            setBadgesText(finalBadges.join('\n'));

            const duration = ((Date.now() - startTime) / 1000).toFixed(2);
            console.log(`✅ Profile saved successfully! (took ${duration}s)`);
            console.log('✅ Local state updated with saved data');
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 4000);
        } catch (error) {
            const duration = ((Date.now() - startTime) / 1000).toFixed(2);
            console.error(`❌ Error saving profile (after ${duration}s):`, error);
            const errorMessage = error.message || 'Failed to save. Please try again.';
            setSaveError(errorMessage);
            alert(`Failed to save: ${errorMessage}`);
        } finally {
            setIsSaving(false);
        }
    };

    // Projects Handlers
    const handleProjectChange = (index, field, value) => {
        const updated = [...localProjects];
        updated[index] = { ...updated[index], [field]: value };
        setLocalProjects(updated);
    };

    const addProject = () => {
        setLocalProjects([
            { title: "New Project", description: "Description", image: "", demoLink: "" },
            ...localProjects
        ]);
    };

    const removeProject = (index) => {
        const updated = localProjects.filter((_, i) => i !== index);
        setLocalProjects(updated);
    };

    const saveProjects = async () => {
        try {
            await updateProjects(localProjects);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 4000);
        } catch (error) {
            console.error('Error saving projects:', error);
            alert('Failed to save projects. Please try again.');
        }
    };

    const handleProjectImageUpload = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const maxSize = 1024 * 1024; // 1MB
            if (file.size > maxSize) {
                alert(`File is too large! Maximum size is ${(maxSize / 1024).toFixed(0)}KB. Please compress the image.`);
                e.target.value = '';
                return;
            }

            if (e.target.value) {
                console.log(`📤 Uploading image for project ${index}:`, file.name);
                const reader = new FileReader();
                reader.onloadend = () => {
                    handleProjectChange(index, 'image', reader.result);
                };
                reader.readAsDataURL(file);
            }
            setTimeout(() => {
                e.target.value = '';
            }, 100);
        }
    };

    // Services Handlers
    const handleServiceChange = (index, field, value) => {
        const updated = [...localServices];
        updated[index] = { ...updated[index], [field]: value };
        setLocalServices(updated);
    };

    const saveServices = async () => {
        try {
            await updateServices(localServices);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 4000);
        } catch (error) {
            console.error('Error saving services:', error);
            alert('Failed to save services. Please try again.');
        }
    };

    // Contact Handlers
    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setLocalContact(prev => ({ ...prev, [name]: value }));
    };

    const saveContact = async () => {
        try {
            await updateContact(localContact);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 4000);
        } catch (error) {
            console.error('Error saving contact:', error);
            alert('Failed to save contact info. Please try again.');
        }
    };

    // Experience Handlers
    const handleExperienceChange = (e) => {
        const { name, value } = e.target;
        setLocalExperience(prev => ({ ...prev, [name]: value }));
    };

    const saveExperience = async () => {
        try {
            console.log('💾 Saving experience:', localExperience);
            await updateExperience(localExperience);
            console.log('✅ Experience saved successfully');
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 4000);
        } catch (error) {
            console.error('❌ Error saving experience:', error);
            alert('Failed to save experience. Please try again.');
        }
    };

    // Timeline Handlers
    const handleTimelineChange = (index, field, value) => {
        if (index < 0 || index >= localTimeline.length) {
            console.error('❌ Invalid timeline index:', index);
            return;
        }

        const updated = [...localTimeline];
        updated[index] = {
            ...updated[index],
            [field]: value || ''
        };

        console.log(`✏️ Timeline item ${index + 1} updated:`, {
            field,
            oldValue: localTimeline[index][field],
            newValue: value,
            item: updated[index]
        });

        setLocalTimeline(updated);
    };

    const addTimelineItem = async () => {
        const newItem = {
            type: 'experience',
            period: "Jan 2025 - PRESENT",
            title: "New Position",
            company: "Company Name",
            description: "Description here..."
        };
        const updated = [newItem, ...localTimeline];
        setLocalTimeline(updated);
        console.log(`➕ Added new timeline item. New count: ${updated.length}`);

        // Auto-save after adding
        try {
            console.log('💾 Auto-saving timeline after add...');
            await updateTimeline(updated);
            console.log('✅ Timeline auto-saved successfully');
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error('❌ Error auto-saving timeline:', error);
            alert('Entry added but failed to save. Please click "Save Timeline" to persist changes.');
        }
    };

    const removeTimelineItem = (index) => {
        setDeleteTarget({ type: 'timeline', index });
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (deleteTarget && deleteTarget.type === 'timeline') {
            const itemToDelete = localTimeline[deleteTarget.index];
            console.log(`🗑️ Deleting timeline item:`, itemToDelete);

            const updated = localTimeline.filter((_, i) => i !== deleteTarget.index);
            console.log(`📊 Before delete: ${localTimeline.length} items → After delete: ${updated.length} items`);

            setLocalTimeline(updated);

            // Mark that we're about to save
            justSavedTimelineRef.current = true;

            // Auto-save after delete
            try {
                console.log('💾 Auto-saving timeline after delete...');
                console.log('📤 Sending to backend:', updated);
                await updateTimeline(updated);
                console.log('✅ Timeline auto-saved successfully to MongoDB');
                console.log('✅ Current local timeline count:', updated.length);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);

                // Keep the flag for 3 seconds to prevent immediate overwrite
                setTimeout(() => {
                    justSavedTimelineRef.current = false;
                    console.log('✅ Timeline delete save flag cleared');
                }, 3000);
            } catch (error) {
                console.error('❌ Error auto-saving timeline:', error);
                alert('Entry removed but failed to save. Please click "Save Timeline" to persist changes.');
                // Revert on error
                setLocalTimeline(localTimeline);
            }
        }
        setShowDeleteModal(false);
        setDeleteTarget(null);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDeleteTarget(null);
    };

    const saveTimeline = async () => {
        try {
            setIsSaving(true);
            setSaveError(null);

            console.log('💾 Saving timeline:', localTimeline.length, 'items');
            console.log('📋 Timeline data to save:', JSON.stringify(localTimeline, null, 2));

            // Validate timeline data
            if (!Array.isArray(localTimeline)) {
                throw new Error('Timeline must be an array');
            }

            // Mark that we're about to save
            justSavedTimelineRef.current = true;

            // Save to backend
            await updateTimeline(localTimeline);

            console.log('✅ Timeline saved successfully to MongoDB');
            console.log('✅ Local timeline state:', localTimeline.length, 'items');

            // Show success message
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 4000);

            // Keep the flag for 3 seconds to prevent immediate overwrite
            setTimeout(() => {
                justSavedTimelineRef.current = false;
                console.log('✅ Timeline save flag cleared - safe to sync from backend');
            }, 3000);
        } catch (error) {
            console.error('❌ Error saving timeline:', error);
            console.error('❌ Error details:', error.response?.data || error.message);
            setSaveError(error.message || 'Failed to save timeline. Please try again.');
            setTimeout(() => setSaveError(null), 5000);
        } finally {
            setIsSaving(false);
        }
    };

    const handleReorder = (newOrder) => {
        setLocalTimeline(newOrder);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-inter p-8">
            {/* Animated Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={cancelDelete}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        >
                            {/* Modal */}
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-red-500/30 shadow-2xl"
                            >
                                {/* Icon */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                                    className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center"
                                >
                                    <FaTrash className="w-8 h-8 text-red-500" />
                                </motion.div>

                                {/* Title */}
                                <motion.h3
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-2xl font-bold text-white text-center mb-2"
                                >
                                    Delete Entry?
                                </motion.h3>

                                {/* Message */}
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-gray-400 text-center mb-6"
                                >
                                    Are you sure you want to remove this entry? This action cannot be undone.
                                </motion.p>

                                {/* Buttons */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex gap-3"
                                >
                                    <button
                                        onClick={cancelDelete}
                                        className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                                    >
                                        <FaTrash className="w-4 h-4" />
                                        Delete
                                    </button>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Admin Panel
                    </h1>
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                            <FaArrowLeft /> Back to Home
                        </Link>
                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                            <FaSignOutAlt /> Logout
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-700 pb-1 overflow-x-auto">
                    {['profile', 'logo', 'resume', 'projects', 'services', 'experience', 'timeline'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 font-medium capitalize transition-colors whitespace-nowrap ${activeTab === tab
                                ? 'text-purple-400 border-b-2 border-purple-400'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="bg-slate-800/50 rounded-xl p-6 border border-gray-700">

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={localProfile.name}
                                        onChange={handleProfileChange}
                                        className="w-full bg-slate-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Role</label>
                                    <input
                                        type="text"
                                        name="role"
                                        value={localProfile.role}
                                        onChange={handleProfileChange}
                                        className="w-full bg-slate-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500"
                                    />
                                </div>

                                {/* Project Intro Toggle */}
                                <div className="md:col-span-2 flex items-center gap-3 p-4 bg-slate-900/50 rounded-lg border border-gray-700">
                                    <input
                                        type="checkbox"
                                        id="showProjectIntro"
                                        name="showProjectIntro"
                                        checked={localProfile.showProjectIntro}
                                        onChange={(e) => setLocalProfile(prev => ({ ...prev, showProjectIntro: e.target.checked }))}
                                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 bg-gray-700 border-gray-600"
                                    />
                                    <div>
                                        <label htmlFor="showProjectIntro" className="block text-sm font-medium text-white cursor-pointer">
                                            Enable Project Intro Animation
                                        </label>
                                        <p className="text-xs text-gray-400">
                                            Show the animated tech stack analysis when users first visit the site.
                                        </p>
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={localProfile.bio}
                                        onChange={handleProfileChange}
                                        rows="4"
                                        className="w-full bg-slate-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Profile Image</label>
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            name="image"
                                            value={localProfile.image}
                                            onChange={handleProfileChange}
                                            placeholder="Enter image URL or select file below"
                                            className="w-full bg-slate-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500"
                                        />
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="block w-full text-sm text-gray-400
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-full file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-purple-600 file:text-white
                                                    hover:file:bg-purple-700
                                                    cursor-pointer
                                                "
                                            />
                                            {localProfile.image && (
                                                <div className="shrink-0">
                                                    <img
                                                        src={localProfile.image}
                                                        alt="Preview"
                                                        className="w-12 h-12 rounded-full object-cover border-2 border-purple-500"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">LinkedIn URL</label>
                                    <input
                                        type="text"
                                        name="social.linkedin"
                                        value={localProfile.social.linkedin}
                                        onChange={handleProfileChange}
                                        className="w-full bg-slate-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">GitHub URL</label>
                                    <input
                                        type="text"
                                        name="social.github"
                                        value={localProfile.social.github}
                                        onChange={handleProfileChange}
                                        className="w-full bg-slate-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500"
                                    />
                                </div>

                                {/* About Me Section */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">About Me</label>
                                    <textarea
                                        name="aboutMe"
                                        value={localProfile.aboutMe || ''}
                                        onChange={handleProfileChange}
                                        rows={5}
                                        placeholder="Write about yourself, your skills, and your goals..."
                                        className="w-full bg-slate-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500 text-white resize-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">This will be displayed on your About page</p>
                                </div>

                                {/* About Home Section - 3 Paragraphs */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">About Home - Paragraph 1</label>
                                    <textarea
                                        name="aboutHome1"
                                        value={localProfile.aboutHome1 || ''}
                                        onChange={handleProfileChange}
                                        rows={2}
                                        placeholder="First paragraph - Brief introduction..."
                                        className="w-full bg-slate-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500 text-white resize-none"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">About Home - Paragraph 2</label>
                                    <textarea
                                        name="aboutHome2"
                                        value={localProfile.aboutHome2 || ''}
                                        onChange={handleProfileChange}
                                        rows={2}
                                        placeholder="Second paragraph - Your skills and technologies..."
                                        className="w-full bg-slate-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500 text-white resize-none"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">About Home - Paragraph 3</label>
                                    <textarea
                                        name="aboutHome3"
                                        value={localProfile.aboutHome3 || ''}
                                        onChange={handleProfileChange}
                                        rows={2}
                                        placeholder="Third paragraph - Your experience and passion..."
                                        className="w-full bg-slate-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500 text-white resize-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">These 3 paragraphs will be displayed on your Home page</p>
                                </div>

                                {/* Tech Stack Section */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Tech Stack <span className="text-purple-400">({Array.isArray(localProfile.techStack) ? localProfile.techStack.length : 0} technologies)</span>
                                    </label>
                                    <textarea
                                        name="techStack"
                                        value={techStackText}
                                        onChange={(e) => {
                                            // Allow typing freely with newlines
                                            const input = e.target.value;
                                            setTechStackText(input);

                                            // Parse in real-time for preview, but keep raw text
                                            const techs = input
                                                .split(/\n|,/)
                                                .map(t => t.trim())
                                                .filter(t => t && t.length > 0);

                                            // Update local profile for preview
                                            setLocalProfile(prev => ({
                                                ...prev,
                                                techStack: techs
                                            }));
                                        }}
                                        onBlur={() => {
                                            // Final parse when user leaves the field
                                            const techs = techStackText
                                                .split(/\n|,/)
                                                .map(t => t.trim())
                                                .filter(t => t && t.length > 0);

                                            setLocalProfile(prev => ({
                                                ...prev,
                                                techStack: techs
                                            }));

                                            console.log('💾 Tech Stack finalized:', techs.length, 'technologies');
                                        }}
                                        placeholder="Enter one technology per line (press Enter for new line):&#10;React&#10;Next.js&#10;TypeScript&#10;JavaScript&#10;Tailwind CSS&#10;Node.js&#10;Express&#10;MongoDB&#10;Socket.io&#10;JWT&#10;AWS&#10;Nginx&#10;Cloudflare"
                                        rows={10}
                                        className="w-full bg-slate-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500 text-white resize-y font-mono text-sm"
                                    />
                                    <div className="mt-2 space-y-2">
                                        <p className="text-xs text-gray-500">
                                            💡 Enter one technology per line, or separate by commas. Both methods work!
                                        </p>
                                        {Array.isArray(localProfile.techStack) && localProfile.techStack.length > 0 && (
                                            <div className="mt-2 p-3 bg-slate-800 rounded-lg border border-purple-900/30">
                                                <p className="text-xs font-semibold text-purple-400 mb-2">
                                                    📋 Preview ({localProfile.techStack.length} technologies):
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {localProfile.techStack.map((tech, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-2 py-1 bg-purple-900/30 text-purple-300 text-xs rounded border border-purple-700/50"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <p className="text-xs text-purple-400">
                                            ✅ Will save: {Array.isArray(localProfile.techStack) ? localProfile.techStack.length : 0} technologies
                                        </p>
                                    </div>
                                </div>

                                {/* Badges Section */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Badges / Tags <span className="text-purple-400">({Array.isArray(localProfile.badges) ? localProfile.badges.length : 0} badges)</span>
                                    </label>
                                    <textarea
                                        name="badges"
                                        value={badgesText}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            setBadgesText(input);
                                            const badges = input
                                                .split(/\n|,/)
                                                .map(b => b.trim())
                                                .filter(b => b && b.length > 0);
                                            setLocalProfile(prev => ({
                                                ...prev,
                                                badges: badges
                                            }));
                                        }}
                                        onBlur={() => {
                                            const badges = badgesText
                                                .split(/\n|,/)
                                                .map(b => b.trim())
                                                .filter(b => b && b.length > 0);
                                            setLocalProfile(prev => ({
                                                ...prev,
                                                badges: badges
                                            }));
                                        }}
                                        placeholder="Enter badges/tags (one per line or comma-separated):&#10;AI Enthusiast&#10;Tech Blogger"
                                        rows={4}
                                        className="w-full bg-slate-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500 text-white resize-y font-mono text-sm"
                                    />
                                    <div className="mt-2 space-y-2">
                                        <p className="text-xs text-gray-500">
                                            💡 These badges will appear next to your name on the Home page
                                        </p>
                                        {Array.isArray(localProfile.badges) && localProfile.badges.length > 0 && (
                                            <div className="mt-2 p-3 bg-slate-800 rounded-lg border border-purple-900/30">
                                                <p className="text-xs font-semibold text-purple-400 mb-2">
                                                    📋 Preview ({localProfile.badges.length} badges):
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {localProfile.badges.map((badge, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-2 py-1 bg-purple-900/30 text-purple-300 text-xs rounded border border-purple-700/50"
                                                        >
                                                            {badge}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                            {saveError && (
                                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 mb-4">
                                    <p className="text-sm text-red-400">❌ Error: {saveError}</p>
                                </div>
                            )}
                            <button
                                onClick={saveProfile}
                                disabled={isSaving}
                                className={`flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors ${isSaving ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                <FaSave /> {isSaving ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    )}

                    {/* Logo Tab */}
                    {activeTab === 'logo' && (
                        <div className="space-y-6">
                            <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-900/30">
                                <h3 className="text-xl font-bold text-purple-400 mb-6 flex items-center gap-2">
                                    🎨 Website Logo
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Current Logo</label>
                                        <div className="p-8 bg-slate-900 rounded-lg border border-gray-700 flex items-center justify-center min-h-[120px]">
                                            {localProfile.logo ? (
                                                <img src={localProfile.logo} alt="Current Logo" className="max-h-24 object-contain" />
                                            ) : (
                                                <span className="text-3xl font-bold text-gray-600">HV (Default)</span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Upload New Logo</label>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoUpload}
                                                className="block w-full text-sm text-gray-400
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-full file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-purple-600 file:text-white
                                                    hover:file:bg-purple-700
                                                    cursor-pointer
                                                "
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Recommended: PNG with transparent background.</p>
                                    </div>

                                    {saveError && (
                                        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                                            <p className="text-sm text-red-400">❌ Error: {saveError}</p>
                                        </div>
                                    )}

                                    {localProfile.logo && (
                                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                                            <p className="text-sm text-blue-400">
                                                ℹ️ Logo size: {(localProfile.logo.length / 1024).toFixed(2)} KB (base64)
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            onClick={saveProfile}
                                            disabled={isSaving || !localProfile.logo}
                                            className={`flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors ${isSaving || !localProfile.logo ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                        >
                                            <FaSave /> {isSaving ? 'Saving...' : 'Save Logo'}
                                        </button>
                                        {localProfile.logo && (
                                            <button
                                                onClick={() => {
                                                    setLocalProfile(prev => ({ ...prev, logo: null }));
                                                    setSaveError(null);
                                                }}
                                                disabled={isSaving}
                                                className={`flex items-center gap-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 px-6 py-3 rounded-lg font-medium transition-colors border border-red-600/30 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                            >
                                                <FaTrash /> Remove Logo
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Resume Tab */}
                    {activeTab === 'resume' && (
                        <div className="space-y-6">
                            <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-900/30">
                                <h3 className="text-xl font-bold text-purple-400 mb-6 flex items-center gap-2">
                                    📄 Resume Management
                                </h3>
                                <div className="space-y-6">
                                    {/* Current Resume Display */}
                                    {resume.fileName && (
                                        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                                            <h4 className="text-sm font-bold text-green-400 mb-2">✅ Current Resume:</h4>
                                            <p className="text-sm text-gray-300">{resume.fileName}</p>
                                            <button
                                                onClick={() => {
                                                    const link = document.createElement('a');
                                                    link.href = resume.fileData;
                                                    link.download = resume.fileName;
                                                    link.click();
                                                }}
                                                className="mt-3 text-xs text-purple-400 hover:text-purple-300 underline"
                                            >
                                                Download Current Resume
                                            </button>
                                        </div>
                                    )}

                                    {/* Upload Section */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Upload New Resume (PDF)</label>
                                        <div className="space-y-4">
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        console.log('Resume file selected:', file.name);
                                                        const reader = new FileReader();
                                                        reader.onloadend = async () => {
                                                            try {
                                                                await updateResume({
                                                                    fileName: file.name,
                                                                    fileData: reader.result
                                                                });
                                                                setShowSuccess(true);
                                                                setTimeout(() => setShowSuccess(false), 4000);
                                                            } catch (error) {
                                                                console.error('Error saving resume:', error);
                                                                alert('Failed to save resume. Please try again.');
                                                            }
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                                className="block w-full text-sm text-gray-400
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-full file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-purple-600 file:text-white
                                                    hover:file:bg-purple-700
                                                    cursor-pointer
                                                "
                                            />
                                            <p className="text-xs text-gray-500">
                                                Select any PDF file from your computer. It will be saved and available for download on your About page.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                                        <h4 className="text-sm font-bold text-blue-400 mb-2">📋 How it works:</h4>
                                        <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                                            <li>Click "Choose File" and select your resume PDF</li>
                                            <li>The file will be automatically saved to your browser's storage</li>
                                            <li>The download button on the About page will use your uploaded resume</li>
                                            <li>You can upload a new resume anytime to replace the current one</li>
                                        </ol>
                                    </div>

                                    {resume.fileName && (
                                        <button
                                            onClick={async () => {
                                                if (confirm('Are you sure you want to remove the current resume?')) {
                                                    try {
                                                        await updateResume({ fileName: null, fileData: null });
                                                        setShowSuccess(true);
                                                        setTimeout(() => setShowSuccess(false), 4000);
                                                    } catch (error) {
                                                        console.error('Error removing resume:', error);
                                                        alert('Failed to remove resume. Please try again.');
                                                    }
                                                }
                                            }}
                                            className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 px-6 py-3 rounded-lg font-medium transition-colors border border-red-600/30"
                                        >
                                            <FaTrash /> Remove Resume
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Projects Tab */}
                    {activeTab === 'projects' && (
                        <div className="space-y-6">
                            <div className="flex justify-end">
                                <button
                                    onClick={addProject}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    <FaPlus /> Add Project
                                </button>
                            </div>

                            <div className="grid gap-6">
                                {localProjects.map((project, index) => (
                                    <div key={index} className="bg-slate-900 p-6 rounded-xl border border-gray-700 relative group">
                                        <button
                                            onClick={() => removeProject(index)}
                                            className="absolute top-4 right-4 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <FaTrash />
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                                                <input
                                                    type="text"
                                                    value={project.title}
                                                    onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                                                    className="w-full bg-slate-800 border border-gray-700 rounded-lg p-2 focus:outline-none focus:border-purple-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Image</label>
                                                <div className="space-y-2">
                                                    <input
                                                        type="text"
                                                        value={project.image}
                                                        onChange={(e) => handleProjectChange(index, 'image', e.target.value)}
                                                        placeholder="Image URL or upload below"
                                                        className="w-full bg-slate-800 border border-gray-700 rounded-lg p-2 focus:outline-none focus:border-purple-500 text-xs text-gray-300"
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleProjectImageUpload(index, e)}
                                                            className="block w-full text-xs text-gray-400
                                                                file:mr-2 file:py-1 file:px-2
                                                                file:rounded-full file:border-0
                                                                file:text-xs file:font-semibold
                                                                file:bg-purple-600 file:text-white
                                                                hover:file:bg-purple-700
                                                                cursor-pointer
                                                            "
                                                        />
                                                    </div>
                                                    {project.image && (
                                                        <div className="mt-2 h-20 w-full bg-slate-800 rounded-lg overflow-hidden border border-gray-700">
                                                            <img
                                                                src={project.image}
                                                                alt="Preview"
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = 'https://via.placeholder.com/150?text=Invalid+Image';
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                                                <textarea
                                                    value={project.description}
                                                    onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                                                    rows="2"
                                                    className="w-full bg-slate-800 border border-gray-700 rounded-lg p-2 focus:outline-none focus:border-purple-500"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Demo Link</label>
                                                <input
                                                    type="text"
                                                    value={project.demoLink}
                                                    onChange={(e) => handleProjectChange(index, 'demoLink', e.target.value)}
                                                    className="w-full bg-slate-800 border border-gray-700 rounded-lg p-2 focus:outline-none focus:border-purple-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={saveProjects}
                                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    <FaSave /> Save Projects
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Services Tab */}
                    {activeTab === 'services' && (
                        <div className="space-y-6">
                            <div className="grid gap-6">
                                {localServices.map((service, index) => (
                                    <div key={index} className="bg-slate-900 p-6 rounded-xl border border-gray-700">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                                                <input
                                                    type="text"
                                                    value={service.title}
                                                    onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                                                    className="w-full bg-slate-800 border border-gray-700 rounded-lg p-2 focus:outline-none focus:border-purple-500"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                                                <textarea
                                                    value={service.description}
                                                    onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                                                    rows="2"
                                                    className="w-full bg-slate-800 border border-gray-700 rounded-lg p-2 focus:outline-none focus:border-purple-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={saveServices}
                                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                <FaSave /> Save Services
                            </button>
                        </div>
                    )}

                    {/* Experience & Contact Tab */}
                    {activeTab === 'experience' && (
                        <div className="space-y-8">
                            {/* Contact Information */}
                            <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-900/30">
                                <h3 className="text-xl font-bold text-purple-400 mb-6 flex items-center gap-2">
                                    📧 Contact Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-2">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={localContact?.email || ''}
                                            onChange={handleContactChange}
                                            placeholder="your@email.com"
                                            className="w-full bg-slate-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-2">Phone</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={localContact?.phone || ''}
                                            onChange={handleContactChange}
                                            placeholder="+91 1234567890"
                                            className="w-full bg-slate-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-2">Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={localContact?.location || ''}
                                            onChange={handleContactChange}
                                            placeholder="City, Country"
                                            className="w-full bg-slate-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500 text-white"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={saveContact}
                                    className="mt-6 flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:opacity-90 text-white px-6 py-3 rounded-lg font-medium transition-all"
                                >
                                    <FaSave /> Save Contact Info
                                </button>
                            </div>

                            {/* Experience Stats */}
                            <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-900/30">
                                <h3 className="text-xl font-bold text-purple-400 mb-6 flex items-center gap-2">
                                    🚀 Experience Stats
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-slate-900 p-6 rounded-lg border border-gray-700">
                                        <label className="block text-xs font-medium text-gray-400 mb-2">Projects Completed</label>
                                        <input
                                            type="text"
                                            name="projectsCompleted"
                                            value={localExperience?.projectsCompleted || ''}
                                            onChange={handleExperienceChange}
                                            placeholder="3+"
                                            className="w-full bg-slate-800 border border-gray-600 rounded-lg p-3 text-2xl font-bold focus:outline-none focus:border-purple-500 text-white text-center"
                                        />
                                        <p className="text-xs text-gray-500 text-center mt-2">e.g., 3+, 10+, 50+</p>
                                    </div>
                                    <div className="bg-slate-900 p-6 rounded-lg border border-gray-700">
                                        <label className="block text-xs font-medium text-gray-400 mb-2">Technologies</label>
                                        <input
                                            type="text"
                                            name="clientsSatisfied"
                                            value={localExperience?.clientsSatisfied || ''}
                                            onChange={handleExperienceChange}
                                            placeholder="30+"
                                            className="w-full bg-slate-800 border border-gray-600 rounded-lg p-3 text-2xl font-bold focus:outline-none focus:border-purple-500 text-white text-center"
                                        />
                                        <p className="text-xs text-gray-500 text-center mt-2">e.g., 10+, 20+</p>
                                    </div>
                                    <div className="bg-slate-900 p-6 rounded-lg border border-gray-700">
                                        <label className="block text-xs font-medium text-gray-400 mb-2">Years Experience</label>
                                        <input
                                            type="text"
                                            name="yearsExperience"
                                            value={localExperience?.yearsExperience || ''}
                                            onChange={handleExperienceChange}
                                            placeholder="2+"
                                            className="w-full bg-slate-800 border border-gray-600 rounded-lg p-3 text-2xl font-bold focus:outline-none focus:border-purple-500 text-white text-center"
                                        />
                                        <p className="text-xs text-gray-500 text-center mt-2">e.g., 1+, 2+, 5+</p>
                                    </div>
                                </div>
                                <button
                                    onClick={saveExperience}
                                    className="mt-6 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white px-6 py-3 rounded-lg font-medium transition-all"
                                >
                                    <FaSave /> Save Experience Stats
                                </button>
                            </div>

                            {/* Preview */}
                            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 p-6 rounded-xl border border-purple-700/30">
                                <h4 className="text-lg font-bold text-white mb-4">📊 Preview (Homepage)</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                                        <div className="text-3xl font-bold text-purple-400">{localExperience?.projectsCompleted || '0+'}</div>
                                        <div className="text-sm text-gray-400 mt-1">Projects Completed</div>
                                    </div>
                                    <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                                        <div className="text-3xl font-bold text-blue-400">{localExperience?.clientsSatisfied || '0+'}</div>
                                        <div className="text-sm text-gray-400 mt-1">Clients Satisfied</div>
                                    </div>
                                    <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                                        <div className="text-3xl font-bold text-pink-400">{localExperience?.yearsExperience || '0+'}</div>
                                        <div className="text-sm text-gray-400 mt-1">Years Experience</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Timeline Tab */}
                    {activeTab === 'timeline' && (
                        <div className="space-y-8">
                            {/* Profile Section (Added to Timeline Tab) */}
                            <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-900/30">
                                <h3 className="text-xl font-bold text-purple-400 mb-6 flex items-center gap-2">
                                    👤 Profile & Bio
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={localProfile.name}
                                            onChange={handleProfileChange}
                                            className="w-full bg-slate-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-2">Role / Title</label>
                                        <input
                                            type="text"
                                            name="role"
                                            value={localProfile.role}
                                            onChange={handleProfileChange}
                                            className="w-full bg-slate-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500 text-white"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-medium text-gray-400 mb-2">Bio / Description</label>
                                        <textarea
                                            name="bio"
                                            value={localProfile.bio}
                                            onChange={handleProfileChange}
                                            rows="4"
                                            className="w-full bg-slate-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500 text-white resize-none"
                                        />
                                    </div>

                                </div>
                                <button
                                    onClick={saveProfile}
                                    className="mt-6 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white px-6 py-3 rounded-lg font-medium transition-all"
                                >
                                    <FaSave /> Save Profile
                                </button>
                            </div>
                        </div>
                    )}
                    {/* Timeline Tab */}
                    {
                        activeTab === 'timeline' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-white">Timeline & Education</h2>
                                    <button
                                        onClick={addTimelineItem}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                                    >
                                        <FaPlus /> Add Entry
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <Reorder.Group axis="y" values={localTimeline} onReorder={handleReorder} className="space-y-4">
                                        {localTimeline.map((item, index) => (
                                            <Reorder.Item
                                                key={item.id || index}
                                                value={item}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-slate-900 border border-gray-700 rounded-xl p-6 relative group"
                                            >
                                                <div className="absolute top-4 left-4 p-2 text-gray-600 cursor-grab active:cursor-grabbing hover:text-gray-400 z-10">
                                                    <FaGripVertical />
                                                </div>
                                                <button
                                                    onClick={() => removeTimelineItem(index)}
                                                    className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                                    title="Delete Entry"
                                                >
                                                    <FaTrash />
                                                </button>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pl-8">
                                                    <div className="md:col-span-2">
                                                        <label className="block text-xs font-medium text-gray-400 mb-1">Type</label>
                                                        <select
                                                            value={item.type || 'experience'}
                                                            onChange={(e) => handleTimelineChange(index, 'type', e.target.value)}
                                                            className="w-full bg-slate-800 border border-gray-700 rounded-lg p-2 text-sm focus:outline-none focus:border-purple-500"
                                                        >
                                                            <option value="experience">Experience</option>
                                                            <option value="education">Education</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-400 mb-1">Period</label>
                                                        <input
                                                            type="text"
                                                            value={item.period}
                                                            onChange={(e) => handleTimelineChange(index, 'period', e.target.value)}
                                                            placeholder="e.g. Mar 2024 - PRESENT"
                                                            className="w-full bg-slate-800 border border-gray-700 rounded-lg p-2 text-sm focus:outline-none focus:border-purple-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-400 mb-1">Position / Degree</label>
                                                        <input
                                                            type="text"
                                                            value={item.title}
                                                            onChange={(e) => handleTimelineChange(index, 'title', e.target.value)}
                                                            placeholder="e.g. Senior Developer"
                                                            className="w-full bg-slate-800 border border-gray-700 rounded-lg p-2 text-sm focus:outline-none focus:border-purple-500"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-xs font-medium text-gray-400 mb-1">Company / Institution</label>
                                                        <input
                                                            type="text"
                                                            value={item.company}
                                                            onChange={(e) => handleTimelineChange(index, 'company', e.target.value)}
                                                            placeholder="e.g. Google"
                                                            className="w-full bg-slate-800 border border-gray-700 rounded-lg p-2 text-sm focus:outline-none focus:border-purple-500"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-xs font-medium text-gray-400 mb-1">Description</label>
                                                        <textarea
                                                            value={item.description}
                                                            onChange={(e) => handleTimelineChange(index, 'description', e.target.value)}
                                                            rows="3"
                                                            placeholder="Describe your role and achievements..."
                                                            className="w-full bg-slate-800 border border-gray-700 rounded-lg p-2 text-sm focus:outline-none focus:border-purple-500 resize-none"
                                                        />
                                                    </div>
                                                </div>
                                            </Reorder.Item>
                                        ))}
                                    </Reorder.Group>

                                    {localTimeline.length === 0 && (
                                        <div className="text-center py-12 text-gray-500 bg-slate-900/50 rounded-xl border border-dashed border-gray-700">
                                            No timeline entries found. Click "Add Entry" to start.
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end pt-4 border-t border-gray-700">
                                    <button
                                        onClick={saveTimeline}
                                        disabled={isSaving}
                                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <FaSave /> Save Timeline
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )
                    }


                    {/* Success Toast */}
                    <AnimatePresence>
                        {showSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 50 }}
                                className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 z-50"
                            >
                                <FaCheck className="text-xl" />
                                <span className="font-medium">Changes saved successfully!</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Error Toast */}
                    <AnimatePresence>
                        {saveError && (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 50 }}
                                className="fixed bottom-8 right-8 bg-red-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 z-50"
                            >
                                <span className="font-medium">{saveError}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {showSuccess && <Confetti numberOfPieces={200} recycle={false} />}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
