import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import emailjs from '@emailjs/browser'
import {
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaPaperPlane,
    FaCheckCircle,
    FaExclamationCircle
} from 'react-icons/fa'
import { usePortfolio } from '../context/PortfolioContext'
import background from '../assets/background.png'

function Contact() {
    const { profile, contact, darkMode } = usePortfolio()
    const formRef = useRef()

    const [status, setStatus] = useState('')

    // EmailJS Configuration
    const SERVICE_ID = 'service_qg84f5i'
    const TEMPLATE_ID = 'template_jorrvgd'
    const PUBLIC_KEY = 'gw7_vx3W8mlqGu9ia'

    const handleSubmit = (e) => {
        e.preventDefault()

        setStatus('sending')
        console.log('� Sending email via EmailJS...')
        console.log('Service ID:', SERVICE_ID)
        console.log('Template ID:', TEMPLATE_ID)
        console.log('Public Key:', PUBLIC_KEY)

        emailjs.sendForm(
            SERVICE_ID,
            TEMPLATE_ID,
            formRef.current,
            PUBLIC_KEY
        )
            .then((result) => {
                console.log('✅ SUCCESS!', result.text)
                console.log('Full result:', result)
                setStatus('success')
                formRef.current.reset()

                // Clear success message after 5 seconds
                setTimeout(() => setStatus(''), 5000)
            })
            .catch((error) => {
                console.error('❌ FAILED!', error.text)
                console.error('Full error:', error)
                setStatus('error')

                // Clear error message after 5 seconds
                setTimeout(() => setStatus(''), 5000)
            })
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

            {/* Notification Toast */}
            {status === 'success' && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full px-4"
                >
                    <div className="p-4 rounded-xl shadow-2xl flex items-center gap-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white backdrop-blur-sm">
                        <FaCheckCircle className="w-6 h-6 flex-shrink-0" />
                        <p className="font-medium text-sm">✉️ Message sent successfully! I'll get back to you soon.</p>
                    </div>
                </motion.div>
            )}

            {status === 'error' && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full px-4"
                >
                    <div className="p-4 rounded-xl shadow-2xl flex items-center gap-3 bg-red-500 text-white backdrop-blur-sm">
                        <FaExclamationCircle className="w-6 h-6 flex-shrink-0" />
                        <p className="font-medium text-sm">❌ Failed to send. Check console or email me directly at hemaprasanth08@gmail.com</p>
                    </div>
                </motion.div>
            )}

            <div className="relative z-10 pt-20">
                <section id="contact" className="py-20">
                    <div className="w-full px-4 sm:px-6 lg:px-8 w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-space font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Get In <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Touch</span>
                            </h2>
                            <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Have a project in mind or want to collaborate? I'd love to hear from you.
                                <br />Send me a message and I'll respond as soon as possible.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Contact Info */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className={`p-8 rounded-2xl ${darkMode ? 'bg-slate-900/50 border border-purple-900/30' : 'bg-white border border-gray-200'} h-full`}
                            >
                                <h3 className={`text-2xl font-space font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Contact <span className="text-purple-400">Information</span>
                                </h3>

                                <div className="space-y-8">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                                            <FaEnvelope className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</h4>
                                            <a href="mailto:hemaprasanth08@gmail.com" className={`text-base font-medium ${darkMode ? 'text-white hover:text-purple-400' : 'text-gray-900 hover:text-purple-600'} transition-colors`}>
                                                hemaprasanth08@gmail.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-slate-800 text-green-400' : 'bg-green-50 text-green-600'}`}>
                                            <FaPhone className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Phone</h4>
                                            <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className={`text-base font-medium ${darkMode ? 'text-white hover:text-purple-400' : 'text-gray-900 hover:text-purple-600'} transition-colors`}>
                                                {contact.phone}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-slate-800 text-red-400' : 'bg-red-50 text-red-600'}`}>
                                            <FaMapMarkerAlt className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Location</h4>
                                            <p className={`text-base font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{contact.location}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12">
                                    <h4 className={`text-sm font-medium mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Follow me on</h4>
                                    <div className="flex gap-4">
                                        <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className={`p-3 rounded-lg transition-colors ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'}`}>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                        </a>
                                        <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className={`p-3 rounded-lg transition-colors ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'}`}>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                                        </a>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Contact Form */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className={`lg:col-span-2 p-8 rounded-2xl ${darkMode ? 'bg-slate-900/50 border border-purple-900/30' : 'bg-white border border-gray-200'}`}
                            >
                                <h3 className={`text-2xl font-space font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Send me a <span className="text-purple-400">message</span>
                                </h3>

                                {/* EmailJS Contact Form */}
                                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your Name *</label>
                                            <input
                                                type="text"
                                                name="user_name"
                                                placeholder="John Doe"
                                                required
                                                className={`w-full px-4 py-3 rounded-xl outline-none transition-all ${darkMode ? 'bg-slate-800 text-white border-slate-700 focus:border-purple-500' : 'bg-gray-50 text-gray-900 border-gray-200 focus:border-purple-500 border'}`}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email Address *</label>
                                            <input
                                                type="email"
                                                name="user_email"
                                                placeholder="john@example.com"
                                                required
                                                className={`w-full px-4 py-3 rounded-xl outline-none transition-all ${darkMode ? 'bg-slate-800 text-white border-slate-700 focus:border-purple-500' : 'bg-gray-50 text-gray-900 border-gray-200 focus:border-purple-500 border'}`}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Message *</label>
                                        <textarea
                                            rows="8"
                                            name="message"
                                            placeholder="Tell me about your project or just say hello..."
                                            required
                                            className={`w-full px-4 py-3 rounded-xl outline-none transition-all resize-none ${darkMode ? 'bg-slate-800 text-white border-slate-700 focus:border-purple-500' : 'bg-gray-50 text-gray-900 border-gray-200 focus:border-purple-500 border'}`}
                                        ></textarea>
                                    </div>

                                    {/* Status Message */}
                                    {status && (
                                        <div className={`text-center text-sm font-medium ${status === 'sending' ? 'text-blue-500' : status === 'success' ? 'text-cyan-500' : 'text-red-500'}`}>
                                            {status === 'sending' && '⏳ Sending...'}
                                            {status === 'success' && '✅ Message sent successfully!'}
                                            {status === 'error' && '❌ Failed to send. Please try again.'}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={status === 'sending'}
                                        className={`w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg transition-all flex items-center justify-center gap-2 ${status === 'sending' ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 hover:shadow-lg hover:scale-[1.02]'}`}
                                    >
                                        {status === 'sending' ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <FaPaperPlane className="w-5 h-5" />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Contact
