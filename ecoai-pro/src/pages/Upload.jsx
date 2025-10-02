import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload as UploadIcon, 
  Camera, 
  Leaf, 
  Trash2, 
  Loader2, 
  CheckCircle,
  AlertTriangle,
  Info,
  Lightbulb,
  Recycle
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { analyzeImage } from '../services/aiService'
import { doc, addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../services/firebase'
import toast from 'react-hot-toast'

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [analysisMode, setAnalysisMode] = useState('plant') // 'plant' or 'trash'
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const fileInputRef = useRef(null)
  const { user, updateUserPoints } = useAuth()

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setResult(null)
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setResult(null)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const analyzeFile = async () => {
    if (!selectedFile) return

    setLoading(true)
    try {
      // Convert file to base64 for API
      const reader = new FileReader()
      reader.onloadend = async () => {
        try {
          const base64Image = reader.result
          const analysis = await analyzeImage(base64Image, analysisMode)
          
          setResult(analysis)
          
          // Save to Firebase
          await addDoc(collection(db, 'analyses'), {
            userId: user.uid,
            mode: analysisMode,
            result: analysis,
            timestamp: serverTimestamp(),
            imageUrl: base64Image // In production, save to Firebase Storage instead
          })
          
          // Award points
          await updateUserPoints(5)
          
          toast.success('Analysis completed! 🌱')
        } catch (error) {
          console.error('Analysis error:', error)
          toast.error('Analysis failed. Please try again.')
        } finally {
          setLoading(false)
        }
      }
      reader.readAsDataURL(selectedFile)
    } catch (error) {
      console.error('File reading error:', error)
      toast.error('Failed to read file')
      setLoading(false)
    }
  }

  const resetUpload = () => {
    setSelectedFile(null)
    setPreviewUrl('')
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const renderResult = () => {
    if (!result) return null

    if (analysisMode === 'plant') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="eco-card mt-6"
        >
          <div className="flex items-center mb-4">
            <div className={`p-2 rounded-full mr-3 ${
              result.health === 'healthy' ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              {result.health === 'healthy' ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Plant Analysis Result
              </h3>
              <p className="text-gray-600">
                Status: <span className={`font-semibold ${
                  result.health === 'healthy' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {result.health === 'healthy' ? 'Healthy' : 'Needs Attention'}
                </span>
              </p>
            </div>
          </div>

          {result.issues && result.issues.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <Info className="w-4 h-4 mr-2" />
                Detected Issues:
              </h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {result.issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {result.suggestions && result.suggestions.length > 0 && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                <Lightbulb className="w-4 h-4 mr-2" />
                Recommendations:
              </h4>
              <ul className="list-disc list-inside text-green-700 space-y-1">
                {result.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )
    } else {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="eco-card mt-6"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-full mr-3 bg-blue-100">
              <Recycle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Waste Sorting Result
              </h3>
            </div>
          </div>

          {result.items && result.items.length > 0 && (
            <div className="space-y-3">
              {result.items.map((item, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-800">{item.name}</h4>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.category === 'recyclable' ? 'bg-green-100 text-green-800' :
                      item.category === 'compostable' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.category === 'recyclable' ? 'Recyclable' :
                       item.category === 'compostable' ? 'Compostable' :
                       'General Waste'}
                    </span>
                    <span className="text-sm text-gray-600">
                      Confidence: {Math.round(item.confidence * 100)}%
                    </span>
                  </div>
                  {item.tip && (
                    <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-2 rounded">
                      💡 {item.tip}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {result.overallTip && (
            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                <Lightbulb className="w-4 h-4 mr-2" />
                Pro Tip:
              </h4>
              <p className="text-blue-700">{result.overallTip}</p>
            </div>
          )}
        </motion.div>
      )
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-green-400 to-eco-500 rounded-full">
              <Camera className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            AI Image Analyzer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload an image to get instant AI-powered insights on plant health or waste sorting
          </p>
        </div>

        {/* Mode Selection */}
        <div className="eco-card mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Analysis Mode</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setAnalysisMode('plant')}
              className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                analysisMode === 'plant'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="flex items-center justify-center mb-4">
                <div className={`p-3 rounded-full ${
                  analysisMode === 'plant' ? 'bg-green-500' : 'bg-gray-400'
                }`}>
                  <Leaf className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Plant Health</h3>
              <p className="text-gray-600 text-center">
                Analyze plant conditions and get health recommendations
              </p>
            </button>

            <button
              onClick={() => setAnalysisMode('trash')}
              className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                analysisMode === 'trash'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-center mb-4">
                <div className={`p-3 rounded-full ${
                  analysisMode === 'trash' ? 'bg-blue-500' : 'bg-gray-400'
                }`}>
                  <Trash2 className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Waste Sorter</h3>
              <p className="text-gray-600 text-center">
                Identify recyclable, compostable, and general waste items
              </p>
            </button>
          </div>
        </div>

        {/* Upload Area */}
        <div className="eco-card">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 hover:border-eco-400 transition-colors duration-200 rounded-xl p-8 text-center bg-gray-50/50"
          >
            {previewUrl ? (
              <div className="space-y-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
                />
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={analyzeFile}
                    disabled={loading}
                    className="eco-button-primary flex items-center"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <UploadIcon className="w-5 h-5 mr-2" />
                    )}
                    {loading ? 'Analyzing...' : 'Analyze Image'}
                  </button>
                  <button
                    onClick={resetUpload}
                    className="eco-button-secondary"
                  >
                    Choose Different Image
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-eco-100 rounded-full">
                    <UploadIcon className="w-12 h-12 text-eco-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Drop your image here
                </h3>
                <p className="text-gray-600 mb-6">
                  or click to select a file
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="eco-button-primary"
                >
                  Select Image
                </button>
                <p className="text-sm text-gray-500 mt-4">
                  Supports: JPG, PNG, GIF up to 10MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {renderResult()}

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="eco-card mt-8 bg-gradient-to-r from-green-50 to-blue-50"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            💡 Pro Tips for Better Results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                <Leaf className="w-4 h-4 mr-2" />
                Plant Health Analysis
              </h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Use clear, well-lit photos</li>
                <li>• Include leaves, stems, and any affected areas</li>
                <li>• Take photos during daylight</li>
                <li>• Focus on specific problem areas</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                <Trash2 className="w-4 h-4 mr-2" />
                Waste Sorting
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Ensure objects are clearly visible</li>
                <li>• Use good lighting and contrast</li>
                <li>• Include packaging labels when possible</li>
                <li>• Separate items for better detection</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Upload