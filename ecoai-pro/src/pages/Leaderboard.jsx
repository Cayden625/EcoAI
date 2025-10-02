import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  TrendingUp,
  Award,
  Target,
  Zap,
  Leaf,
  Users,
  Calendar,
  Filter
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore'
import { db } from '../services/firebase'

const Leaderboard = () => {
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState([])
  const [userRank, setUserRank] = useState(null)
  const [timeFilter, setTimeFilter] = useState('all') // all, week, month
  const [categoryFilter, setCategoryFilter] = useState('points') // points, analyses, reports
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboardData()
  }, [timeFilter, categoryFilter])

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true)
      
      // In a real app, you'd fetch actual user data from Firebase
      // For now, we'll use mock data with some real user data
      
      const mockLeaderboard = [
        {
          id: '1',
          displayName: 'EcoChampion2024',
          photoURL: null,
          points: 2850,
          analyses: 95,
          reports: 42,
          level: 8,
          badges: ['eco-warrior', 'plant-expert', 'waste-wizard', 'community-hero'],
          streak: 15
        },
        {
          id: '2',
          displayName: 'GreenGuardian',
          photoURL: null,
          points: 2650,
          analyses: 88,
          reports: 38,
          level: 7,
          badges: ['eco-warrior', 'plant-expert', 'map-explorer'],
          streak: 12
        },
        {
          id: '3',
          displayName: 'SustainabilityPro',
          photoURL: null,
          points: 2340,
          analyses: 76,
          reports: 35,
          level: 7,
          badges: ['eco-warrior', 'waste-wizard', 'streak-master'],
          streak: 22
        },
        {
          id: '4',
          displayName: 'PlantWhisperer',
          photoURL: null,
          points: 2120,
          analyses: 82,
          reports: 28,
          level: 6,
          badges: ['eco-warrior', 'plant-expert'],
          streak: 8
        },
        {
          id: '5',
          displayName: 'RecycleHero',
          photoURL: null,
          points: 1980,
          analyses: 65,
          reports: 45,
          level: 6,
          badges: ['eco-warrior', 'waste-wizard', 'community-hero'],
          streak: 5
        },
        {
          id: '6',
          displayName: user?.displayName || 'You',
          photoURL: user?.photoURL || null,
          points: 1750,
          analyses: 58,
          reports: 22,
          level: 5,
          badges: ['eco-warrior', 'newcomer'],
          streak: 3
        },
        {
          id: '7',
          displayName: 'EcoNinja',
          photoURL: null,
          points: 1620,
          analyses: 52,
          reports: 31,
          level: 5,
          badges: ['eco-warrior', 'map-explorer'],
          streak: 7
        },
        {
          id: '8',
          displayName: 'TreeLover99',
          photoURL: null,
          points: 1450,
          analyses: 48,
          reports: 19,
          level: 4,
          badges: ['eco-warrior'],
          streak: 4
        },
        {
          id: '9',
          displayName: 'WasteWarrior',
          photoURL: null,
          points: 1320,
          analyses: 42,
          reports: 26,
          level: 4,
          badges: ['eco-warrior', 'waste-wizard'],
          streak: 1
        },
        {
          id: '10',
          displayName: 'GreenThumb',
          photoURL: null,
          points: 1180,
          analyses: 38,
          reports: 15,
          level: 3,
          badges: ['newcomer'],
          streak: 6
        }
      ]

      // Sort based on category filter
      const sortedLeaderboard = [...mockLeaderboard].sort((a, b) => {
        if (categoryFilter === 'points') return b.points - a.points
        if (categoryFilter === 'analyses') return b.analyses - a.analyses
        if (categoryFilter === 'reports') return b.reports - a.reports
        return 0
      })

      setLeaderboard(sortedLeaderboard)
      
      // Find user's rank
      const userIndex = sortedLeaderboard.findIndex(u => u.displayName === (user?.displayName || 'You'))
      setUserRank(userIndex >= 0 ? userIndex + 1 : null)

    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />
    return <span className="text-lg font-bold text-gray-600">{rank}</span>
  }

  const getBadgeInfo = (badgeKey) => {
    const badges = {
      'eco-warrior': { name: 'Eco Warrior', icon: '⚡', color: 'bg-green-100 text-green-800' },
      'plant-expert': { name: 'Plant Expert', icon: '🌱', color: 'bg-emerald-100 text-emerald-800' },
      'waste-wizard': { name: 'Waste Wizard', icon: '♻️', color: 'bg-blue-100 text-blue-800' },
      'community-hero': { name: 'Community Hero', icon: '🏆', color: 'bg-purple-100 text-purple-800' },
      'map-explorer': { name: 'Map Explorer', icon: '🗺️', color: 'bg-orange-100 text-orange-800' },
      'streak-master': { name: 'Streak Master', icon: '🔥', color: 'bg-red-100 text-red-800' },
      'newcomer': { name: 'Newcomer', icon: '⭐', color: 'bg-gray-100 text-gray-800' }
    }
    return badges[badgeKey] || { name: badgeKey, icon: '🏅', color: 'bg-gray-100 text-gray-800' }
  }

  const getCurrentValue = (user) => {
    if (categoryFilter === 'points') return user.points.toLocaleString()
    if (categoryFilter === 'analyses') return user.analyses
    if (categoryFilter === 'reports') return user.reports
    return user.points.toLocaleString()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-eco-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full">
            <Trophy className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Eco Warriors Leaderboard 🏆
        </h1>
        <p className="text-xl text-gray-600">
          Compete with eco-champions around the world
        </p>
      </motion.div>

      {/* User's Current Position */}
      {userRank && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="eco-card bg-gradient-to-r from-eco-50 to-green-50 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-eco-500 rounded-full">
                <span className="text-white font-bold">#{userRank}</span>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-800">Your Current Position</p>
                <p className="text-green-700">
                  {getCurrentValue(leaderboard[userRank - 1])} {categoryFilter}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Level {leaderboard[userRank - 1]?.level}</p>
              <p className="text-sm text-gray-600">🔥 {leaderboard[userRank - 1]?.streak} day streak</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="eco-card mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <div className="flex space-x-2">
              {[
                { key: 'points', label: 'Points', icon: Zap },
                { key: 'analyses', label: 'Analyses', icon: Target },
                { key: 'reports', label: 'Reports', icon: Users }
              ].map((category) => {
                const Icon = category.icon
                return (
                  <button
                    key={category.key}
                    onClick={() => setCategoryFilter(category.key)}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      categoryFilter === category.key
                        ? 'bg-eco-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-eco-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="week">This Week</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Top 3 Podium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
      >
        {/* 2nd Place */}
        {leaderboard[1] && (
          <div className="eco-card bg-gradient-to-br from-gray-100 to-gray-200 order-2 md:order-1">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  {leaderboard[1].photoURL ? (
                    <img
                      src={leaderboard[1].photoURL}
                      alt={leaderboard[1].displayName}
                      className="w-16 h-16 rounded-full"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <div className="absolute -top-2 -right-2">
                    <Medal className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{leaderboard[1].displayName}</h3>
              <p className="text-2xl font-bold text-gray-600 mb-2">
                {getCurrentValue(leaderboard[1])}
              </p>
              <p className="text-sm text-gray-600">Level {leaderboard[1].level}</p>
            </div>
          </div>
        )}

        {/* 1st Place */}
        {leaderboard[0] && (
          <div className="eco-card bg-gradient-to-br from-yellow-100 to-yellow-200 order-1 md:order-2 transform md:scale-105">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  {leaderboard[0].photoURL ? (
                    <img
                      src={leaderboard[0].photoURL}
                      alt={leaderboard[0].displayName}
                      className="w-20 h-20 rounded-full"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                  )}
                  <div className="absolute -top-2 -right-2">
                    <Crown className="w-10 h-10 text-yellow-500" />
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-gray-800 mb-1 text-lg">{leaderboard[0].displayName}</h3>
              <p className="text-3xl font-bold text-yellow-700 mb-2">
                {getCurrentValue(leaderboard[0])}
              </p>
              <p className="text-sm text-gray-600">Level {leaderboard[0].level}</p>
              <div className="flex justify-center mt-3">
                <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                  👑 Champion
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {leaderboard[2] && (
          <div className="eco-card bg-gradient-to-br from-amber-100 to-amber-200 order-3">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  {leaderboard[2].photoURL ? (
                    <img
                      src={leaderboard[2].photoURL}
                      alt={leaderboard[2].displayName}
                      className="w-16 h-16 rounded-full"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <div className="absolute -top-2 -right-2">
                    <Award className="w-8 h-8 text-amber-600" />
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{leaderboard[2].displayName}</h3>
              <p className="text-2xl font-bold text-amber-700 mb-2">
                {getCurrentValue(leaderboard[2])}
              </p>
              <p className="text-sm text-gray-600">Level {leaderboard[2].level}</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Full Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="eco-card"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Complete Rankings
        </h2>
        <div className="space-y-3">
          {leaderboard.map((user, index) => (
            <div
              key={user.id}
              className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                user.displayName === (user?.displayName || 'You')
                  ? 'border-eco-500 bg-eco-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-8 h-8">
                  {getRankIcon(index + 1)}
                </div>
                
                <div className="flex items-center space-x-3">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-eco-500 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                  )}
                  
                  <div>
                    <p className="font-medium text-gray-800">{user.displayName}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Level {user.level}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-sm text-gray-600">🔥 {user.streak}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Badges */}
                <div className="hidden md:flex space-x-1">
                  {user.badges.slice(0, 3).map((badge) => {
                    const badgeInfo = getBadgeInfo(badge)
                    return (
                      <span
                        key={badge}
                        className={`text-xs px-2 py-1 rounded-full ${badgeInfo.color}`}
                        title={badgeInfo.name}
                      >
                        {badgeInfo.icon}
                      </span>
                    )
                  })}
                  {user.badges.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{user.badges.length - 3}
                    </span>
                  )}
                </div>

                {/* Score */}
                <div className="text-right">
                  <p className="font-bold text-gray-800 text-lg">
                    {getCurrentValue(user)}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {categoryFilter}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Achievement Badges Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="eco-card mt-8 bg-gradient-to-r from-blue-50 to-purple-50"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          🏅 Achievement Badges
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries({
            'eco-warrior': 'Complete your first analysis',
            'plant-expert': 'Analyze 50+ plants',
            'waste-wizard': 'Sort 100+ waste items',
            'community-hero': 'Submit 25+ map reports',
            'map-explorer': 'Explore different map areas',
            'streak-master': 'Maintain 20+ day streak'
          }).map(([key, description]) => {
            const badgeInfo = getBadgeInfo(key)
            return (
              <div key={key} className="text-center">
                <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${badgeInfo.color} mb-2`}>
                  <span className="mr-1">{badgeInfo.icon}</span>
                  {badgeInfo.name}
                </div>
                <p className="text-xs text-gray-600">{description}</p>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

export default Leaderboard