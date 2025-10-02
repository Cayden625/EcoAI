// AI Service for image analysis and chatbot
import axios from 'axios'

const API_ENDPOINTS = {
  // Use HuggingFace for demo purposes
  huggingface: 'https://api-inference.huggingface.co/models/',
  // OpenAI endpoint (you'll need to replace with your API key)
  openai: 'https://api.openai.com/v1/',
}

// Mock AI responses for demo purposes
const mockPlantAnalysis = {
  healthy: {
    health: 'healthy',
    confidence: 0.95,
    issues: [],
    suggestions: [
      'Your plant looks healthy! Continue current care routine.',
      'Maintain consistent watering schedule.',
      'Ensure adequate sunlight exposure.',
      'Consider fertilizing monthly during growing season.'
    ]
  },
  diseased: {
    health: 'diseased',
    confidence: 0.87,
    issues: [
      'Yellowing leaves detected - possible nutrient deficiency',
      'Brown spots suggest fungal infection',
      'Wilting indicates possible overwatering'
    ],
    suggestions: [
      'Reduce watering frequency and ensure proper drainage',
      'Apply organic fungicide for brown spot treatment',
      'Add nitrogen-rich fertilizer for yellowing leaves',
      'Remove affected leaves to prevent spread',
      'Improve air circulation around the plant'
    ]
  }
}

const mockTrashAnalysis = {
  items: [
    {
      name: 'Plastic Water Bottle',
      category: 'recyclable',
      confidence: 0.94,
      tip: 'Remove cap and label before recycling. Rinse if needed.'
    },
    {
      name: 'Food Scraps',
      category: 'compostable',
      confidence: 0.89,
      tip: 'Perfect for composting! Avoid meat, dairy, and oily foods.'
    },
    {
      name: 'Aluminum Can',
      category: 'recyclable',
      confidence: 0.96,
      tip: 'Aluminum is infinitely recyclable! Clean before disposing.'
    }
  ],
  overallTip: 'Great job sorting! Remember to clean containers before recycling for better processing.'
}

// Simulated AI analysis function
export const analyzeImage = async (imageBase64, mode) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000))
    
    if (mode === 'plant') {
      // Random selection for demo
      const isHealthy = Math.random() > 0.4
      return isHealthy ? mockPlantAnalysis.healthy : mockPlantAnalysis.diseased
    } else if (mode === 'trash') {
      // Randomize some results for demo
      const items = [...mockTrashAnalysis.items]
      const numItems = Math.floor(Math.random() * 3) + 1
      const selectedItems = items.slice(0, numItems)
      
      return {
        ...mockTrashAnalysis,
        items: selectedItems
      }
    }
    
    throw new Error('Invalid analysis mode')
  } catch (error) {
    console.error('AI Analysis error:', error)
    throw new Error('AI analysis failed. Please try again.')
  }
}

// Mock chatbot responses
const mockChatResponses = {
  greetings: [
    "Hello! I'm your AI Environmental Assistant. How can I help you protect our planet today? 🌍",
    "Hi there, eco warrior! What environmental questions can I help you with? 🌱",
    "Welcome! I'm here to help with all your sustainability questions. What's on your mind? 🌿"
  ],
  plant_care: [
    "For healthy plants, ensure they get the right amount of water, light, and nutrients. What specific plant are you caring for?",
    "Plant health depends on several factors: proper watering, adequate sunlight, good soil drainage, and appropriate fertilization. Tell me more about your plant!",
    "Each plant has unique needs! Generally, check soil moisture, provide appropriate light, and watch for pests. What issues are you seeing?"
  ],
  recycling: [
    "Great question about recycling! Always check your local recycling guidelines, clean containers, and separate materials properly. What items are you looking to recycle?",
    "Recycling rules vary by location, but generally: clean containers, remove labels when possible, and separate by material type. What specific items do you need help with?",
    "The key to effective recycling is knowing your local guidelines! Plastic bottles, aluminum cans, and cardboard are commonly recyclable. What would you like to know more about?"
  ],
  sustainability: [
    "Sustainability is about meeting our current needs without compromising future generations. Small daily actions make a big difference! What area interests you most?",
    "Living sustainably involves reducing waste, conserving energy, and making eco-friendly choices. Every small action counts! What specific area would you like to improve?",
    "Sustainability encompasses environmental, social, and economic factors. Start with simple changes like reducing plastic use or conserving water. What's your main concern?"
  ],
  default: [
    "That's an interesting environmental question! While I'd love to help, I might need more specific information. Could you rephrase or provide more details?",
    "I'm focused on environmental and sustainability topics. Could you ask me something about plant care, recycling, or eco-friendly practices?",
    "I'm here to help with environmental questions! Try asking about plant health, waste management, or sustainability tips."
  ]
}

// Simple keyword-based chatbot
export const getChatbotResponse = async (message) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
    
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return getRandomResponse(mockChatResponses.greetings)
    } else if (lowerMessage.includes('plant') || lowerMessage.includes('flower') || lowerMessage.includes('tree') || lowerMessage.includes('leaf')) {
      return getRandomResponse(mockChatResponses.plant_care)
    } else if (lowerMessage.includes('recycle') || lowerMessage.includes('waste') || lowerMessage.includes('trash') || lowerMessage.includes('garbage')) {
      return getRandomResponse(mockChatResponses.recycling)
    } else if (lowerMessage.includes('sustain') || lowerMessage.includes('environment') || lowerMessage.includes('eco') || lowerMessage.includes('green')) {
      return getRandomResponse(mockChatResponses.sustainability)
    } else {
      return getRandomResponse(mockChatResponses.default)
    }
  } catch (error) {
    console.error('Chatbot error:', error)
    return "I'm having trouble processing your request right now. Please try again in a moment! 🤖"
  }
}

const getRandomResponse = (responses) => {
  return responses[Math.floor(Math.random() * responses.length)]
}

// Environmental data service
export const getEnvironmentalData = async (latitude = 40.7128, longitude = -74.0060) => {
  try {
    // Mock environmental data for demo
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      weather: {
        temperature: Math.round(15 + Math.random() * 20), // 15-35°C
        humidity: Math.round(40 + Math.random() * 40), // 40-80%
        description: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
        windSpeed: Math.round(Math.random() * 15) + 5 // 5-20 km/h
      },
      airQuality: {
        aqi: Math.round(50 + Math.random() * 100), // 50-150 AQI
        level: ['Good', 'Moderate', 'Unhealthy for Sensitive Groups'][Math.floor(Math.random() * 3)],
        pm25: Math.round(10 + Math.random() * 30), // PM2.5
        pm10: Math.round(20 + Math.random() * 50)   // PM10
      },
      uvIndex: {
        index: Math.round(Math.random() * 10) + 1, // 1-11 UV Index
        level: ['Low', 'Moderate', 'High', 'Very High', 'Extreme'][Math.floor(Math.random() * 5)]
      }
    }
  } catch (error) {
    console.error('Environmental data error:', error)
    throw new Error('Failed to fetch environmental data')
  }
}

export default {
  analyzeImage,
  getChatbotResponse,
  getEnvironmentalData
}