import { createApp } from 'vue'
import App from './App.vue'

// Import the packages with named imports
import { initializeAI } from '@aivue/core'
import '@aivue/chatbot'
import '@aivue/autosuggest'
import '@aivue/smartform'

// Import CSS
import './assets/aivue.css'

// Initialize AI functionality
initializeAI({
  debug: true
})

// Create and mount the Vue application
createApp(App).mount('#app')
