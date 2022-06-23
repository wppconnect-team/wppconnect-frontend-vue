import { createApp } from 'vue'
import {createPinia} from 'pinia'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


require('./assets/css/app.css');

const app = createApp(App)

// Components

const pinia = createPinia()
app.use(pinia)
app.use(VueSweetalert2);

app.use(router)
.mount('#app');
