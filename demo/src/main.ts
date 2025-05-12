import { createApp } from 'vue'
import App from './App.vue'

// Import CSS
import './assets/aivue.css'
import './assets/demo.css'
import './assets/hero.css'

// Import the CSS from the chatbot package
// Using chatbot.css directly
import '@aivue/chatbot/chatbot.css'

// Create and mount the Vue application
createApp(App).mount('#app')
