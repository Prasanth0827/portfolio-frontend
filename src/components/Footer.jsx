import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { FaGithub, FaLinkedin, FaHeart } from 'react-icons/fa';

const Footer = () => {
    const { profile } = usePortfolio();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative z-50 bg-slate-900 border-t border-gray-800 py-4 mt-auto">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                    {/* Copyright */}
                    <div className="text-gray-400 text-sm text-center md:text-left">
                        <p>&copy; {currentYear} {profile.name || 'Portfolio'}. All rights reserved.</p>
                        <p className="flex items-center gap-1 justify-center md:justify-start mt-1 text-xs text-gray-500">
                            Built with <FaHeart className="text-red-500 w-3 h-3" /> and React
                        </p>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        {profile.social.github && (
                            <a
                                href={profile.social.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors transform hover:scale-110"
                                title="GitHub"
                            >
                                <FaGithub className="w-5 h-5" />
                            </a>
                        )}
                        {profile.social.linkedin && (
                            <a
                                href={profile.social.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-blue-400 transition-colors transform hover:scale-110"
                                title="LinkedIn"
                            >
                                <FaLinkedin className="w-5 h-5" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
