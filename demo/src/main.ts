import { createApp } from 'vue'
import App from './App.vue'

// Import CSS
import './assets/main.css'

// Import the CSS from the chatbot package
// Using style.css which is the standard import for CSS in npm packages
import '@aivue/chatbot/style.css'

// Create and mount the Vue application
createApp(App).mount('#app')
