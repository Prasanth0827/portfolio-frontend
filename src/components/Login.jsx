import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaUser, FaLock, FaExclamationCircle } from 'react-icons/fa'
import background from '../assets/background.png'
import { portfolioAPI } from '../services/api'

function Login() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            // Call backend API to login
            // Try with username first, if fails, try with @portfolio.com
            let loginEmail = formData.username
            if (!loginEmail.includes('@')) {
                loginEmail = formData.username + '@portfolio.com'
            }
            
            const response = await portfolioAPI.auth.login({
                email: loginEmail, // Backend expects 'email' field
                password: formData.password
            })

            // Extract token from response
            const token = response.data.data.token || response.data.token

            if (token) {
                // Store auth token and status
                localStorage.setItem('auth_token', token)
                localStorage.setItem('isAuthenticated', 'true')

                console.log('✅ Login successful!')

                setTimeout(() => {
                    setLoading(false)
                    navigate('/admin')
                }, 500)
            } else {
                throw new Error('No token received from server')
            }
        } catch (err) {
            console.error('❌ Login error:', err)
            setLoading(false)
            
            // Handle different error types
            if (err.response) {
                // Server responded with error
                setError(err.response.data?.error || err.response.data?.message || 'Invalid credentials')
            } else if (err.request) {
                // Request made but no response
                setError('Cannot connect to server. Please ensure backend is running.')
            } else {
                // Other errors
                setError(err.message || 'Login failed. Please try again.')
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative font-inter">
            {/* Background */}
            <div
                className="fixed inset-0 z-0"
                style={{
                    backgroundImage: `url(${background})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-slate-950/90"></div>
            </div>

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md px-4"
            >
                <div className="bg-slate-900/70 backdrop-blur-xl border border-purple-900/30 rounded-2xl p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center"
                        >
                            <FaLock className="w-10 h-10 text-white" />
                        </motion.div>
                        <h1 className="text-3xl font-space font-bold text-white mb-2">
                            Admin <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Login</span>
                        </h1>
                        <p className="text-gray-400 text-sm">Enter your credentials to continue</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400"
                        >
                            <FaExclamationCircle className="flex-shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </motion.div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Username</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <FaUser />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Enter username"
                                    required
                                    autoComplete="username"
                                    className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Password</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <FaLock />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                    required
                                    autoComplete="current-password"
                                    className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 hover:shadow-lg hover:scale-[1.02]'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Logging in...
                                </>
                            ) : (
                                'Login to Admin Panel'
                            )}
                        </button>
                    </form>

                    {/* Demo Credentials */}
                    {/* <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                        <p className="text-xs text-gray-400 text-center mb-2">Demo Credentials:</p>
                        <div className="text-center space-y-1">
                            <p className="text-sm text-gray-300">Username: <span className="font-mono text-purple-400">spidy</span></p>
                            <p className="text-sm text-gray-300">Password: <span className="font-mono text-purple-400">spidy</span></p>
                        </div>
                    </div> */}

                    {/* Back to Home */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="text-sm text-gray-400 hover:text-purple-400 transition-colors"
                        >
                            ← Back to Portfolio
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default Login
