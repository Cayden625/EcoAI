import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Leaf, 
  Camera, 
  Map, 
  BarChart3, 
  Users, 
  Bot,
  Recycle,
  TreePine,
  Award
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Home = () => {
  const { user } = useAuth()

  const features = [
    {
      icon: Camera,
      title: 'AI Plant & Trash Analysis',
      description: 'Upload images to get instant AI-powered insights on plant health or waste sorting',
      color: 'from-green-400 to-green-600'
    },
    {
      icon: BarChart3,
      title: 'Environmental Dashboard',
      description: 'Real-time data on weather, air quality, and UV levels in your area',
      color: 'from-blue-400 to-blue-600'
    },
    {
      icon: Map,
      title: 'Eco Reporting Map',
      description: 'Report environmental issues and view crowdsourced data from your community',
      color: 'from-emerald-400 to-emerald-600'
    },
    {
      icon: Award,
      title: 'Gamification & Rewards',
      description: 'Earn points, unlock badges, and compete with other eco warriors',
      color: 'from-purple-400 to-purple-600'
    },
    {
      icon: Bot,
      title: 'AI Environmental Assistant',
      description: 'Chat with our AI to learn about sustainability and get eco-friendly tips',
      color: 'from-orange-400 to-orange-600'
    },
    {
      icon: Users,
      title: 'Community Leaderboard',
      description: 'Connect with like-minded people and track your environmental impact',
      color: 'from-pink-400 to-pink-600'
    }
  ]

  const floatingIcons = [
    { icon: Leaf, position: 'top-20 left-10', delay: 0 },
    { icon: Recycle, position: 'top-40 right-20', delay: 1 },
    { icon: TreePine, position: 'bottom-32 left-20', delay: 2 },
    { icon: Award, position: 'bottom-20 right-10', delay: 0.5 },
  ]

  return (
    <div className="relative overflow-hidden">
      {/* Floating Background Icons */}
      {floatingIcons.map((item, index) => {
        const Icon = item.icon
        return (
          <motion.div
            key={index}
            className={`absolute ${item.position} text-green-200/20 hidden lg:block`}
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 6,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Icon className="w-24 h-24" />
          </motion.div>
        )
      })}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-eco-500 rounded-full mb-6"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Leaf className="w-10 h-10 text-white" />
              </motion.div>
              
              <h1 className="text-6xl md:text-8xl font-bold mb-6">
                <span className="bg-gradient-to-r from-green-600 via-eco-500 to-blue-600 bg-clip-text text-transparent">
                  Protect the Planet
                </span>
                <br />
                <span className="text-gray-800">with AI</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Upload, track, and solve environmental problems with smart technology. 
                Join thousands of eco-warriors making a difference, one action at a time.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to={user ? "/dashboard" : "/register"}
                className="eco-button-primary flex items-center text-lg px-8 py-4"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              
              <Link
                to="/login"
                className="eco-button-secondary flex items-center text-lg px-8 py-4"
              >
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">10,000+</div>
                <div className="text-gray-600">Plants Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">5,000+</div>
                <div className="text-gray-600">Eco Reports</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">2,500+</div>
                <div className="text-gray-600">Eco Warriors</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              Powerful Features for
              <span className="block bg-gradient-to-r from-green-600 to-eco-600 bg-clip-text text-transparent">
                Environmental Protection
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Harness the power of AI and community collaboration to create positive environmental change
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  className="eco-card hover:transform hover:scale-105 transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-500 via-eco-500 to-blue-500">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join our community of environmental champions and start your journey towards a sustainable future today.
            </p>
            <Link
              to={user ? "/dashboard" : "/register"}
              className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-bold text-lg rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-xl"
            >
              Start Your Eco Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home