import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Calendar, 
  Award, 
  TrendingUp, 
  Camera,
  MapPin,
  Leaf,
  Trash2,
  Zap,
  Target,
  Settings,
  Edit3,
  Save,
  X,
  Trophy,
  Star
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '../services/firebase'
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend)

const Profile = () => {
  const { user } = useAuth()
  const [userStats, setUserStats] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [achievements, setAchievements] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    displayName: user?.displayName || '',
    bio: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfileData()
  }, [user])

  const fetchProfileData = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      
      // Fetch user's analyses and reports
      const analysesQuery = query(
        collection(db, 'analyses'),
        where('userId', '==', user.uid)
      )
      const reportsQuery = query(
        collection(db, 'ecoReports'),
        where('userId', '==', user.uid)
      )
      
      const [analysesSnapshot, reportsSnapshot] = await Promise.all([
        getDocs(analysesQuery),
        getDocs(reportsQuery)
      ])
      
      const analyses = analysesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      const reports = reportsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      // Calculate stats with some mock data for demonstration
      const plantAnalyses = analyses.filter(a => a.mode === 'plant').length + Math.floor(Math.random() * 15)
      const wasteAnalyses = analyses.filter(a => a.mode === 'trash').length + Math.floor(Math.random() * 20)
      const totalReports = reports.length + Math.floor(Math.random() * 10)
      const totalPoints = (analyses.length * 5) + (reports.length * 10) + Math.floor(Math.random() * 200)
      
      setUserStats({
        totalAnalyses: plantAnalyses + wasteAnalyses,
        plantAnalyses,
        wasteAnalyses,
        totalReports,
        totalPoints,
        level: Math.floor(totalPoints / 200) + 1,
        streak: Math.floor(Math.random() * 15) + 1,
        joinDate: user.metadata?.creationTime ? new Date(user.metadata.creationTime) : new Date()
      })
      
      // Mock recent activity
      const mockActivity = [
        { type: 'analysis', mode: 'plant', description: 'Analyzed plant health', date: new Date(Date.now() - 86400000) },
        { type: 'report', description: 'Reported littering issue', date: new Date(Date.now() - 172800000) },
        { type: 'analysis', mode: 'trash', description: 'Sorted waste items', date: new Date(Date.now() - 259200000) },
        { type: 'achievement', description: 'Earned Plant Expert badge', date: new Date(Date.now() - 345600000) }
      ]
      
      setRecentActivity([...analyses.slice(0, 3), ...mockActivity].slice(0, 5))
      
      // Mock achievements
      const allAchievements = [
        { id: 'newcomer', name: 'Newcomer', description: 'Joined EcoAI Pro', icon: '⭐', unlocked: true, date: new Date(Date.now() - 604800000) },
        { id: 'eco-warrior', name: 'Eco Warrior', description: 'Complete first analysis', icon: '⚡', unlocked: analyses.length > 0, date: analyses.length > 0 ? new Date(Date.now() - 432000000) : null },
        { id: 'plant-expert', name: 'Plant Expert', description: 'Analyze 10 plants', icon: '🌱', unlocked: plantAnalyses >= 10, date: plantAnalyses >= 10 ? new Date(Date.now() - 259200000) : null },
        { id: 'waste-wizard', name: 'Waste Wizard', description: 'Sort 20 waste items', icon: '♻️', unlocked: wasteAnalyses >= 20, date: wasteAnalyses >= 20 ? new Date(Date.now() - 172800000) : null },
        { id: 'reporter', name: 'Community Reporter', description: 'Submit 5 map reports', icon: '🗺️', unlocked: totalReports >= 5, date: totalReports >= 5 ? new Date(Date.now() - 86400000) : null },
        { id: 'streak-keeper', name: 'Streak Keeper', description: 'Maintain 7-day streak', icon: '🔥', unlocked: userStats?.streak >= 7, date: null },
        { id: 'level-up', name: 'Level Up', description: 'Reach level 5', icon: '🏆', unlocked: false, date: null }
      ]
      
      setAchievements(allAchievements)
      
    } catch (error) {
      console.error('Error fetching profile data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditSubmit = async () => {
    try {
      // In a real app, you'd update the user profile in Firebase
      // For now, we'll just update the local state
      setIsEditing(false)
      console.log('Profile updated:', editForm)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const activityChartData = {
    labels: ['6 days ago', '5 days ago', '4 days ago', '3 days ago', '2 days ago', 'Yesterday', 'Today'],
    datasets: [
      {
        label: 'Daily Activity',
        data: [2, 4, 1, 6, 3, 5, 4],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-eco-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="eco-card mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-6 mb-6 md:mb-0">
            <div className="relative">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-eco-400 to-eco-600 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 bg-eco-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                {userStats?.level || 1}
              </div>
            </div>
            
            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editForm.displayName}
                    onChange={(e) => setEditForm(prev => ({...prev, displayName: e.target.value}))}
                    className="text-2xl font-bold bg-transparent border-b-2 border-eco-500 focus:outline-none"
                  />
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({...prev, bio: e.target.value}))}
                    placeholder="Tell us about yourself..."
                    className="w-full text-gray-600 bg-gray-50 rounded p-2 focus:outline-none focus:ring-2 focus:ring-eco-500"
                    rows={2}
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {user?.displayName || 'Eco Warrior'}
                  </h1>
                  <p className="text-gray-600 flex items-center mt-1">
                    <Mail className="w-4 h-4 mr-2" />
                    {user?.email}
                  </p>
                  <p className="text-gray-600 flex items-center mt-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    Joined {userStats?.joinDate?.toLocaleDateString() || 'Recently'}
                  </p>
                  {editForm.bio && (
                    <p className="text-gray-700 mt-2">{editForm.bio}</p>
                  )}
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleEditSubmit}
                  className="eco-button-primary flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="eco-button-secondary flex items-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="eco-button-secondary flex items-center"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div className="eco-card bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Points</p>
              <p className="text-3xl font-bold text-green-700">
                {userStats?.totalPoints?.toLocaleString() || 0}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="eco-card bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Analyses</p>
              <p className="text-3xl font-bold text-blue-700">
                {userStats?.totalAnalyses || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <Target className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="eco-card bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Current Streak</p>
              <p className="text-3xl font-bold text-purple-700">
                {userStats?.streak || 0} days
              </p>
            </div>
            <div className="p-3 bg-purple-500 rounded-full">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="eco-card bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Eco Level</p>
              <p className="text-3xl font-bold text-orange-700">
                {userStats?.level || 1}
              </p>
            </div>
            <div className="p-3 bg-orange-500 rounded-full">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="eco-card"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Activity Trend</h3>
          <Line data={activityChartData} options={activityChartOptions} />
        </motion.div>

        {/* Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="eco-card"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Activity Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <Leaf className="w-6 h-6 text-green-500 mr-3" />
                <span className="text-gray-700">Plant Analyses</span>
              </div>
              <span className="font-bold text-green-600">
                {userStats?.plantAnalyses || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Trash2 className="w-6 h-6 text-blue-500 mr-3" />
                <span className="text-gray-700">Waste Sorted</span>
              </div>
              <span className="font-bold text-blue-600">
                {userStats?.wasteAnalyses || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <MapPin className="w-6 h-6 text-purple-500 mr-3" />
                <span className="text-gray-700">Reports Submitted</span>
              </div>
              <span className="font-bold text-purple-600">
                {userStats?.totalReports || 0}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="eco-card mb-8"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                achievement.unlocked
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                  {achievement.icon}
                </div>
                <div>
                  <h4 className={`font-semibold ${
                    achievement.unlocked ? 'text-gray-800' : 'text-gray-500'
                  }`}>
                    {achievement.name}
                  </h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  {achievement.unlocked && achievement.date && (
                    <p className="text-xs text-gray-500 mt-1">
                      Earned {achievement.date.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="eco-card"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h3>
        {recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {activity.type === 'analysis' ? (
                    activity.mode === 'plant' ? (
                      <Leaf className="w-6 h-6 text-green-500" />
                    ) : (
                      <Trash2 className="w-6 h-6 text-blue-500" />
                    )
                  ) : activity.type === 'report' ? (
                    <MapPin className="w-6 h-6 text-purple-500" />
                  ) : (
                    <Star className="w-6 h-6 text-yellow-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">
                    {activity.description || 
                     (activity.mode === 'plant' ? 'Plant Health Analysis' : 'Waste Sorting Analysis')}
                  </p>
                  <p className="text-sm text-gray-600">
                    {activity.timestamp?.toDate ? 
                      activity.timestamp.toDate().toLocaleDateString() :
                      activity.date?.toLocaleDateString() || 'Recently'
                    }
                  </p>
                </div>
                <div className="text-sm text-green-600 font-medium">
                  +{activity.type === 'report' ? '10' : '5'} points
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No recent activity</p>
            <p className="text-sm text-gray-500">Start analyzing images or reporting issues to see your activity here!</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Profile