import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Cloud, 
  Wind, 
  Thermometer, 
  Droplets, 
  Sun, 
  Activity, 
  Leaf,
  Calendar,
  TrendingUp,
  Award,
  Camera,
  MapPin,
  Zap
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getEnvironmentalData } from '../services/aiService'
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'
import { db } from '../services/firebase'
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, ArcElement)

const Dashboard = () => {
  const { user } = useAuth()
  const [environmentalData, setEnvironmentalData] = useState(null)
  const [userStats, setUserStats] = useState(null)
  const [recentAnalyses, setRecentAnalyses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch environmental data
      const envData = await getEnvironmentalData()
      setEnvironmentalData(envData)
      
      // Fetch user statistics from Firebase
      const analysesQuery = query(
        collection(db, 'analyses'),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc'),
        limit(5)
      )
      
      const analysesSnapshot = await getDocs(analysesQuery)
      const analyses = analysesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setRecentAnalyses(analyses)
      
      // Calculate user stats
      const stats = {
        totalAnalyses: analyses.length + Math.floor(Math.random() * 20), // Add some mock data
        plantsAnalyzed: analyses.filter(a => a.mode === 'plant').length + Math.floor(Math.random() * 15),
        wasteItemsSorted: analyses.filter(a => a.mode === 'trash').length + Math.floor(Math.random() * 25),
        pointsEarned: (analyses.length * 5) + Math.floor(Math.random() * 100),
        currentStreak: Math.floor(Math.random() * 7) + 1,
        level: Math.floor(Math.random() * 5) + 1
      }
      setUserStats(stats)
      
    } catch (error) {
      console.error('Dashboard data fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'text-green-600 bg-green-100'
    if (aqi <= 100) return 'text-yellow-600 bg-yellow-100'
    if (aqi <= 150) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  const getUVColor = (uv) => {
    if (uv <= 2) return 'text-green-600 bg-green-100'
    if (uv <= 5) return 'text-yellow-600 bg-yellow-100'
    if (uv <= 7) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  // Chart data for activity trend
  const activityChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Eco Actions',
        data: [3, 7, 4, 8, 5, 9, 6],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
    ],
  }

  const activityChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  // Doughnut chart for analysis types
  const analysisTypeData = {
    labels: ['Plant Health', 'Waste Sorting', 'Map Reports'],
    datasets: [
      {
        data: [45, 35, 20],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(147, 51, 234, 1)',
        ],
        borderWidth: 2,
      },
    ],
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-eco-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your eco dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome back, {user?.displayName || 'Eco Warrior'}! 🌱
        </h1>
        <p className="text-xl text-gray-600">
          Here's your environmental impact dashboard
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        <div className="eco-card bg-gradient-to-br from-green-50 to-eco-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Analyses</p>
              <p className="text-3xl font-bold text-green-700">
                {userStats?.totalAnalyses || 0}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Camera className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="eco-card bg-gradient-to-br from-blue-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Eco Points</p>
              <p className="text-3xl font-bold text-blue-700">
                {userStats?.pointsEarned || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Award className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="eco-card bg-gradient-to-br from-purple-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Current Streak</p>
              <p className="text-3xl font-bold text-purple-700">
                {userStats?.currentStreak || 0} days
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="eco-card bg-gradient-to-br from-orange-50 to-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Eco Level</p>
              <p className="text-3xl font-bold text-orange-700">
                {userStats?.level || 1}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Environmental Data */}
      {environmentalData && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Environmental Conditions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Weather */}
            <div className="eco-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Weather</h3>
                <Cloud className="w-6 h-6 text-blue-500" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Thermometer className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-gray-600">Temperature</span>
                  </div>
                  <span className="font-bold text-gray-800">
                    {environmentalData.weather.temperature}°C
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Droplets className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-gray-600">Humidity</span>
                  </div>
                  <span className="font-bold text-gray-800">
                    {environmentalData.weather.humidity}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Wind className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-gray-600">Wind Speed</span>
                  </div>
                  <span className="font-bold text-gray-800">
                    {environmentalData.weather.windSpeed} km/h
                  </span>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-blue-700 font-medium">
                    {environmentalData.weather.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Air Quality */}
            <div className="eco-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Air Quality</h3>
                <Activity className="w-6 h-6 text-green-500" />
              </div>
              <div className="space-y-3">
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 px-4 py-2 rounded-lg ${getAQIColor(environmentalData.airQuality.aqi)}`}>
                    {environmentalData.airQuality.aqi}
                  </div>
                  <p className="text-gray-600 font-medium">
                    {environmentalData.airQuality.level}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">PM2.5</p>
                    <p className="font-bold text-gray-800">
                      {environmentalData.airQuality.pm25} μg/m³
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">PM10</p>
                    <p className="font-bold text-gray-800">
                      {environmentalData.airQuality.pm10} μg/m³
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* UV Index */}
            <div className="eco-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">UV Index</h3>
                <Sun className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="space-y-3">
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 px-4 py-2 rounded-lg ${getUVColor(environmentalData.uvIndex.index)}`}>
                    {environmentalData.uvIndex.index}
                  </div>
                  <p className="text-gray-600 font-medium">
                    {environmentalData.uvIndex.level}
                  </p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-yellow-700 text-sm">
                    {environmentalData.uvIndex.index <= 2 ? 'No protection needed' :
                     environmentalData.uvIndex.index <= 7 ? 'Wear sunscreen and sunglasses' :
                     'Avoid prolonged sun exposure'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Activity Trend */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="eco-card"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Weekly Activity Trend
          </h3>
          <Line data={activityChartData} options={activityChartOptions} />
        </motion.div>

        {/* Analysis Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="eco-card"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Analysis Breakdown
          </h3>
          <div className="flex justify-center">
            <div className="w-64 h-64">
              <Doughnut 
                data={analysisTypeData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="eco-card"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            Recent Activity
          </h3>
          <Calendar className="w-6 h-6 text-gray-500" />
        </div>
        
        {recentAnalyses.length > 0 ? (
          <div className="space-y-4">
            {recentAnalyses.map((analysis, index) => (
              <div key={analysis.id} className="border-l-4 border-eco-500 pl-4 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {analysis.mode === 'plant' ? (
                      <Leaf className="w-5 h-5 text-green-500 mr-2" />
                    ) : (
                      <MapPin className="w-5 h-5 text-blue-500 mr-2" />
                    )}
                    <span className="font-medium text-gray-800">
                      {analysis.mode === 'plant' ? 'Plant Health Analysis' : 'Waste Sorting Analysis'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {analysis.timestamp?.toDate ? 
                      analysis.timestamp.toDate().toLocaleDateString() : 
                      'Today'
                    }
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Analysis completed • +5 eco points earned
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              No recent activity yet
            </p>
            <p className="text-sm text-gray-500">
              Start analyzing images to see your activity here!
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Dashboard