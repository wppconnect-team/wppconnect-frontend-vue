<template>
    <div>
        <div class="layout">
            <Sidebar />
            <ModalCreateGroup @handleClose="handleCloseCreate" @open="openModalCreate"/>
            <div class="container">
                <SidebarSettingsMenu />

                <div class="right-container">
                    <header>
                        <h2>
                            {{i18n.settings}}
                        </h2>
                    </header>
                    <div class="content">
                        <form>
                        <div class="form-group">
                            <label>Nome do atendente</label>
                            <input type="text" class="form-control" v-model="settings.attendantName">
                            <small class="form-text text-muted">Coloque aqui um nome para o atendente que será enviado junto com a mensagem.</small>
                        </div>
                        <div class="form-row">
                            <div class="form-group col-md-12">
                                <div class="form-check">
                                <input v-model="settings.sendSeen" class="form-check-input" type="checkbox" >
                                <label class="form-check-label" >
                                    Enviar tick de mensagem lida
                                </label>
                                </div>
                            </div>
                        </div>
                        <hr/>
                        <div class="form-row">
                            <div class="form-group col-md-12">
                                <div class="form-check">
                                <input v-model="settings.notifySound" class="form-check-input" type="checkbox" >
                                <label class="form-check-label" >
                                    Tocar som ao receber nova mensagem
                                </label>
                                </div>
                            </div>
                        </div>
                        <hr/>
                        <div class="form-row">
                            <div class="form-group col-md-12">
                                <div class="form-check">
                                <input v-model="settings.rejectCall" class="form-check-input" type="checkbox" >
                                <label class="form-check-label">
                                    Rejeitar ligações
                                </label>
                                </div>
                            </div>
                            <div class="form-group col-md-12">
                                <label >Mensagem ao rejeitar ligação</label>
                                <textarea v-model="settings.msgRejectCall" class="form-control" rows="3"></textarea>
                                <small>Essa função só funciona se o frontend estiver aberto</small>
                            </div>
                        </div>
                        <hr/>
                        <button @click="updateSettings" class="btn btn-primary">Atualizar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import configHeader from "../util/sessionHeader";
import api, {socket} from '../services/api.js'
import {getSession, getToken} from '../services/auth'
import {getConfigs, setConfigs} from '../services/settings'
import router from '../router/index'
import {useStore} from '../stores/dataStore'
import {language} from '../services/language'

//Components
import Sidebar from '../components/Sidebar.vue'
import SidebarSettingsMenu from '../components/SidebarSettingsMenu.vue'


//Assets
import ImageLoader from '../assets/ic_loader_chat.svg'
const defaultImage = "https://i.pinimg.com/736x/51/24/9f/51249f0c2caed9e7c06e4a5453c57857.jpg";

    export default {        
        components: {
            Sidebar,
            SidebarSettingsMenu,
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
                groups: [],
                settings: getConfigs(),
                
            }
        },
        methods: {
            updateSettings(e){
                e.preventDefault();
                setConfigs(this.settings)
                this.$swal('Configurações salvas com sucesso.')
            }
        },
        computed:{
        },
 
    }
</script>
<style scoped>
.layout{
  width: 80%;
  height: 100vh;
}
.container{
    position: absolute;
    top:0;
    left:90px;
  width: 100%;
  height: 100%;
  display: flex;
}
.right-container{
  width: 80%;
  margin-top:80px;
  margin-left:330px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

header{
    position: fixed;
    top:0;
  width: 70%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2em;
  height: 7%;
  border-bottom: 1px solid rgba(0, 0, 0, .1);
  z-index: 10;
  background-color:white;
}
header h2{
    font-size: 1.5rem;
    font-weight: 500;
}
header input{
    width: 300px;
    border: 1px solid #e2e6e8;
    padding: 10px 1em;
    border-radius: 5px;
    outline: 0;
}

</style>