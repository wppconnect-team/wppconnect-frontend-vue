import { createApp } from 'vue'
import {createPinia} from 'pinia'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


import ConversasComponent from './components/ConversasComponent'
import ChatComponent from './components/ChatComponent'

require('./assets/css/app.css');

const app = createApp(App)

// Components
app.component('ConversasComponent', {
    props: ['chats', 'choosedContact'],
    template: ConversasComponent
  });
app.component('ChatComponent', {
    props: ['isMe', 'isWarning', 'session', 'token','message' ],
    template: ConversasComponent
});

const pinia = createPinia()
app.use(pinia)
app.use(VueSweetalert2);

app.use(router)
.mount('#app');
