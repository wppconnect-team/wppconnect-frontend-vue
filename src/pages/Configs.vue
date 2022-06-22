<template>
    <div>
        <div class="layout">
            <Sidebar />
            <ModalCreateGroup @handleClose="handleCloseCreate" @open="openModalCreate"/>
            <div class="container">
                <div class="left-container">
                    <ul>
                        <li >
                            <div class="wrapper-li">
                                <div class="wrapper-ic">
                                    <span class="material-icons">done</span>
                                </div>
                                <div class="wrapper-text">
                                    <h2>
                                        {{i18n.general}}
                                    </h2>
                                    <p>
                                        {{i18n.generalText}}
                                    </p>
                                </div>
                            </div>
                        </li>

                        <li style="pointer-events:none; opacity:0.5;">
                            <div className="wrapper-li">
                                <div className="wrapper-ic">
                                    <span class="material-icons">radio_button_checked</span>
                                </div>
                                <div class="wrapper-text">
                                    <h2>
                                        {{i18n.buttons}}
                                    </h2>
                                    <p>
                                        {{i18n.buttonsText}}
                                    </p>
                                </div>
                            </div>
                        </li>

                        <li style="pointer-events:none; opacity:0.5;">
                            <div class="wrapper-li">
                                <div class="wrapper-ic">
                                    <span class="material-icons">list</span>
                                </div>
                                <div class="wrapper-text">
                                    <h2>
                                        {{i18n.list}}
                                    </h2>
                                    <p>
                                        {{i18n.listText}}
                                    </p>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>

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
.left-container{
    position:fixed;
  width: 20%;
  display: flex;
  background: #fff;
  height: 100%;
  min-width: 300px;
  border-right: 1px solid #E8E8EF;
}
.left-container ul{
    list-style-type: none;
    width: 100%;
}
.left-container ul li {
      display: flex;
      flex-direction: column;
}
.left-container ul li .wrapper-li {
        display: flex;
        width: 100%;
        padding: 1.5em;
        cursor: pointer;
        transition-duration: 200ms;
}
.left-container ul li .wrapper-li:hover {
          box-shadow: 0px 4px 30px rgb(22 33 74 / 8%);
          border-radius: 5px;
          background-color: #FFF;
}
.left-container ul li .wrapper-li .wrapper-ic{
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background-color: #F1F4FC;
          border-radius: 5px;
          text-align: center;
          white-space: nowrap;
}
.left-container ul li .wrapper-li .wrapper-ic .material-icons{
    color: #808292;
    height: 22px;
    width: 22px;
}
.left-container ul li .wrapper-li .wrapper-text{
          display: inline-block;
          width: 220px;
          vertical-align: top;
          margin-left: 12px;
          pointer-events: none;
}
.left-container ul li .wrapper-li .wrapper-text h2{
            margin: 0px !important;
            padding: 0px !important;
            font-weight: 600;
            font-size: 16px;
            color: #393C44;
}
.left-container ul li .wrapper-li .wrapper-text p{
    color: #808292;
    font-size: 1rem;
    line-height: 21px;
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