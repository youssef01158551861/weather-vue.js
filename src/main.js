import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { auth } from './firebase/config'
import App from './App.vue'
import router from './router'
import { onAuthStateChanged } from 'firebase/auth'

let app

onAuthStateChanged(auth, (user) => {
    if (!app) {
        app = createApp(App)
        app.use(createPinia())
        app.use(router)
        app.mount('#app')
    }
})
