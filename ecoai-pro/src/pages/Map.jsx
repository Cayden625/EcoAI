import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { 
  MapPin, 
  Plus, 
  X, 
  Camera, 
  Trash2, 
  TreePine, 
  Waves, 
  AlertTriangle,
  Filter,
  Upload,
  Loader2,
  CheckCircle
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore'
import { db } from '../services/firebase'
import toast from 'react-hot-toast'

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom marker icons
const createCustomIcon = (color) => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    className: 'custom-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })
}

const categoryIcons = {
  trash: { icon: Trash2, color: '#ef4444', label: 'Trash/Litter' },
  pollution: { icon: AlertTriangle, color: '#f59e0b', label: 'Pollution' },
  deforestation: { icon: TreePine, color: '#8b5cf6', label: 'Deforestation' },
  flood: { icon: Waves, color: '#3b82f6', label: 'Flood Risk' }
}

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng)
    },
  })
  return null
}

const Map = () => {
  const { user, updateUserPoints } = useAuth()
  const [reports, setReports] = useState([])
  const [showReportModal, setShowReportModal] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('trash')
  const [reportDescription, setReportDescription] = useState('')
  const [reportImage, setReportImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [filterCategory, setFilterCategory] = useState('all')
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const reportsQuery = query(
        collection(db, 'ecoReports'),
        orderBy('timestamp', 'desc')
      )
      const reportsSnapshot = await getDocs(reportsQuery)
      const reportsData = reportsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      // Add some mock data for demonstration
      const mockReports = [
        {
          id: 'mock1',
          lat: 40.7580,
          lng: -73.9855,
          category: 'trash',
          description: 'Large pile of plastic waste near the park entrance',
          userName: 'EcoWarrior123',
          timestamp: { toDate: () => new Date(Date.now() - 86400000) }
        },
        {
          id: 'mock2',
          lat: 40.7614,
          lng: -73.9776,
          category: 'pollution',
          description: 'Air quality seems poor due to construction activities',
          userName: 'GreenGuardian',
          timestamp: { toDate: () => new Date(Date.now() - 172800000) }
        },
        {
          id: 'mock3',
          lat: 40.7505,
          lng: -73.9934,
          category: 'deforestation',
          description: 'Several trees were recently cut down for development',
          userName: 'TreeProtector',
          timestamp: { toDate: () => new Date(Date.now() - 259200000) }
        }
      ]
      
      setReports([...reportsData, ...mockReports])
    } catch (error) {
      console.error('Error fetching reports:', error)
    }
  }

  const handleMapClick = (latlng) => {
    setSelectedPosition(latlng)
    setShowReportModal(true)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setReportImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const submitReport = async () => {
    if (!selectedPosition || !reportDescription.trim()) {
      toast.error('Please provide location and description')
      return
    }

    setLoading(true)
    try {
      const reportData = {
        lat: selectedPosition.lat,
        lng: selectedPosition.lng,
        category: selectedCategory,
        description: reportDescription.trim(),
        userName: user.displayName || 'Anonymous',
        userId: user.uid,
        timestamp: serverTimestamp(),
        // In production, upload image to Firebase Storage
        hasImage: !!reportImage
      }

      await addDoc(collection(db, 'ecoReports'), reportData)
      
      // Award points for reporting
      await updateUserPoints(10)
      
      toast.success('Report submitted successfully! +10 eco points earned 🌍')
      
      // Reset form
      setShowReportModal(false)
      setSelectedPosition(null)
      setReportDescription('')
      setReportImage(null)
      setImagePreview('')
      setSelectedCategory('trash')
      
      // Refresh reports
      fetchReports()
      
    } catch (error) {
      console.error('Error submitting report:', error)
      toast.error('Failed to submit report')
    } finally {
      setLoading(false)
    }
  }

  const filteredReports = filterCategory === 'all' 
    ? reports 
    : reports.filter(report => report.category === filterCategory)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Eco Reporting Map 🗺️
        </h1>
        <p className="text-xl text-gray-600">
          Report environmental issues and view community contributions
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="eco-card mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-eco-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {Object.entries(categoryIcons).map(([key, category]) => (
                <option key={key} value={key}>{category.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>Click anywhere on the map to report an issue</span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Legend:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(categoryIcons).map(([key, category]) => {
              const IconComponent = category.icon
              return (
                <div key={key} className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <IconComponent className="w-4 h-4" style={{ color: category.color }} />
                  <span className="text-sm text-gray-600">{category.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="eco-card p-0 overflow-hidden"
      >
        <div className="h-96 md:h-[500px]">
          <MapContainer
            center={[40.7580, -73.9855]} // New York City
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            className="rounded-lg"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapClickHandler onMapClick={handleMapClick} />
            
            {filteredReports.map((report) => (
              <Marker
                key={report.id}
                position={[report.lat, report.lng]}
                icon={createCustomIcon(categoryIcons[report.category]?.color || '#6b7280')}
              >
                <Popup>
                  <div className="p-2">
                    <div className="flex items-center mb-2">
                      {React.createElement(categoryIcons[report.category]?.icon || MapPin, {
                        className: "w-5 h-5 mr-2",
                        style: { color: categoryIcons[report.category]?.color || '#6b7280' }
                      })}
                      <strong className="text-gray-800">
                        {categoryIcons[report.category]?.label || 'Report'}
                      </strong>
                    </div>
                    <p className="text-gray-700 mb-2">{report.description}</p>
                    <div className="text-xs text-gray-500">
                      <p>Reported by: {report.userName}</p>
                      <p>
                        {report.timestamp?.toDate ? 
                          report.timestamp.toDate().toLocaleDateString() : 
                          'Recently'
                        }
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </motion.div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Report Environmental Issue
                </h3>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Category Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Issue Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(categoryIcons).map(([key, category]) => {
                    const IconComponent = category.icon
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedCategory(key)}
                        className={`p-3 rounded-lg border-2 flex flex-col items-center space-y-2 transition-all ${
                          selectedCategory === key
                            ? 'border-eco-500 bg-eco-50'
                            : 'border-gray-200 hover:border-eco-300'
                        }`}
                      >
                        <IconComponent 
                          className="w-6 h-6" 
                          style={{ color: category.color }}
                        />
                        <span className="text-xs text-gray-700">
                          {category.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Describe the environmental issue you're reporting..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo (Optional)
                </label>
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Report preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setReportImage(null)
                        setImagePreview('')
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-eco-400 transition-colors"
                  >
                    <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Click to add photo</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {/* Location Info */}
              {selectedPosition && (
                <div className="mb-6 bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center mb-1">
                    <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Location</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Lat: {selectedPosition.lat.toFixed(6)}, 
                    Lng: {selectedPosition.lng.toFixed(6)}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 eco-button-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReport}
                  disabled={loading || !reportDescription.trim()}
                  className="flex-1 eco-button-primary flex items-center justify-center"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Submit Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Map