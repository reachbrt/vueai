import { createApp } from 'vue'
import App from './App.vue'

// Import CSS
import './assets/aivue.css'
import './assets/demo.css'
import './assets/hero.css'

// Import the CSS from the chatbot package
// Using style.css which is a copy of chatbot.css
import '@aivue/chatbot/style.css'

// Create and mount the Vue application
createApp(App).mount('#app')
