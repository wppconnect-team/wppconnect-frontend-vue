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
                            Profile
                        </h2>
                    </header>
                    <div class="content">
                        <form>
                        <div class="form-group">
                            <label>Nome </label>
                            <input type="text" class="form-control" v-model="name">
                            <small class="form-text text-muted">Insira aqui o nome padrão para ser alterado no WhatsApp.</small>
                        </div>
                        <button @click="updateName" class="btn btn-primary">Trocar nome</button>
                        <hr/>
                        <div class="form-group">
                            <label>Status </label>
                            <input type="text" class="form-control" v-model="status">
                            <small class="form-text text-muted">Insira sua nova frase de status para colocar no WhatsApp.</small>
                        </div>
                        <button @click="updateStatus" class="btn btn-primary">Trocar status</button>
                        <hr/>
                        <div class="form-group">
                            <label>Foto de perfil </label>
                            <input type="file" ref="profilePicPath" class="form-control" id="profilePic">
                            <small class="form-text text-muted">Selecione aqui sua nova foto de perfil </small>
                        </div>
                        <button @click="updateProfilePic" class="btn btn-primary">Atualizar foto</button>
                        <hr/>
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
                name: '',
                status: '',
            }
        },
        methods: {
            updateName(e){
                e.preventDefault();
                if(!this.name) return true;
                api.post(`${getSession()}/change-username`, {name: this.name}, configHeader())
                .then(()=>{
                    this.$swal('Nome alterado com sucesso')
                })
                .catch(e=>{
                    this.$swal(e)
                })
            },
            updateStatus(e){
                e.preventDefault();
                if(!this.status) return true;
                api.post(`${getSession()}/profile-status`, {name: this.status}, configHeader())
                .then(()=>{
                    this.$swal('Status alterado com sucesso')
                })
                .catch(e=>{
                    this.$swal(e)
                })
            },
            updateProfilePic(e){
                e.preventDefault();
                if(!this.$refs.profilePicPath.value) return true;
                const upload = this.$refs.profilePicPath;
                const file = upload.files[0]
                var formData = new FormData();
                formData.append('file', file)

                api.post(`${getSession()}/set-profile-pic`, formData, configHeader())
                .then(()=>{
                    this.$swal('Foto de perfil alterada com sucesso')
                })
                .catch(e=>{
                    console.log(e)
                    this.$swal(e.message)
                })
            },
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