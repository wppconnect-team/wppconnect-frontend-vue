<template>
    <div>
        <div class="layout">
            <Sidebar />
        </div>
    </div>
</template>
<script>
import { config } from '../config';
import configHeader from "../util/sessionHeader";
import api, {socket} from '../services/api.js'
import {getSession, getToken} from '../services/auth'
import router from '../router/index'
import {useStore} from '../stores/dataStore'
import {language} from '../services/language'

//Components
import Sidebar from '../components/Sidebar.vue'




//Assets
import ImageLoader from '../assets/ic_loader_chat.svg'
const defaultImage = "https://i.pinimg.com/736x/51/24/9f/51249f0c2caed9e7c06e4a5453c57857.jpg";

    export default {        
        components: {
            Sidebar,
        },
        async mounted(){
        },
        setup(){
            const data = useStore()

            return { data }
        },
        data() {
            return {
                i18n: language(),
            }
        },
        methods: {
        },
        computed:{
        },
 
    }
</script>
<style scoped>

</style>