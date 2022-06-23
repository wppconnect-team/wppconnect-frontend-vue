<template>
    <div>
        <div class="layout">
            <Sidebar />
            <div class="container">
                <SidebarSettingsMenu />

                <div class="right-container">
                    <header>
                        <h2>
                            {{i18n.buttons}}
                        </h2>
                    </header>
                    <div class="content">
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#buttonsModal">
                            Novo botão
                        </button>
                        <table class="table" style="margin-top:30px;">
                            <thead class="thead-dark">
                                <tr>
                                <th scope="col">Nome</th>
                                <th scope="col">Título</th>
                                <th scope="col">Mensagem</th>
                                <th scope="col">Opções</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(btn, index) in buttons" v-bind:key="index">
                                    <th scope="row">{{btn.name}}</th>
                                    <td>{{btn.title}}</td>
                                    <td>{{btn.message}}</td>
                                    <td>
                                        <button type="button" style="pointer-events:none;opacity:0.5" class="btn btn-primary btn-sm"><span class="material-icons" style="font-size:10pt;">edit</span></button>
                                        <button type="button" @click="delButtons(btn)" class="btn btn-secondary btn-sm"><span class="material-icons"  style="font-size:10pt;">delete</span></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="buttonsModal" tabindex="-1" aria-labelledby="listsModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="listsModalLabel" v-if="!button.id">Nova Lista</h5>
                <h5 class="modal-title" id="listsModalLabel" v-if="button.id">Editar Lista</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                        <form>
                        <div class="form-group">
                            <label>Nome</label>
                            <input type="text" class="form-control" v-model="button.name">
                            <small class="form-text text-muted">Defina um nome para identificar a lista.</small>
                        </div>
                        <div class="form-group">
                            <label>Título</label>
                            <input type="text" class="form-control" v-model="button.title">
                            <small class="form-text text-muted">Coloque um título para a mensagem</small>
                        </div>
                        <div class="form-group">
                            <label>Rodapé</label>
                            <input type="text" class="form-control" v-model="button.footer">
                        </div>
                        <hr/>
                        <div class="form-row">
                            <div class="form-group col-md-12">
                                <label >Mensagem</label>
                                <textarea v-model="button.message" class="form-control" rows="3"></textarea>
                            </div>
                        </div>
                        <hr />
                        <button type="button" class="btn btn-primary" @click="addButton">Add Botão</button>
                        <div class="form-row" v-for="(btn,index) in button.buttons" v-bind:key="index">
                              <div class="col-md-4">
                                <label for="inputState" class="form-label">Tipo</label>
                                <select id="inputState" v-model="btn.type" class="form-select">
                                <option>Selecione</option>
                                <option value="text" selected>Texto</option>
                                <option value="url" selected>URL</option>
                                <option value="phoneNumber" selected>Telefone</option>
                                </select>
                            </div>
                            <div class="form-group col-md-12" >
                                <label >Texto do botão</label>
                                <input type="text" class="form-control" v-model="btn.text">
                            </div>
                            <div class="form-group col-md-12" v-if="btn.type == 'url'" >
                                <label >URL</label>
                                <input type="text" class="form-control" v-model="btn.url">
                            </div>
                            <div class="form-group col-md-12" v-if="btn.type == 'phoneNumber'" >
                                <label >Telefone</label>
                                <input type="text" class="form-control" v-model="btn.phoneNumber">
                            </div>
                            <button type="button" class="btn btn-danger" @click="delButton(btn)">Deletar botao</button>
                        </div>
                        </form>
            </div>
            <div class="modal-footer">
                <button type="button" @click="list = []" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" @click="addButtons" class="btn btn-primary">Salvar</button>
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
import {getButtons, setButtons} from '../services/settings_buttons'
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
                button: {},
                buttons: getButtons(),
                
            }
        },
        methods: {
            updateButtons(buttons){
                setButtons(buttons)
                this.$swal('Botões salvos com sucesso.')
                this.button = {}
                this.buttons = getButtons()
            },
            delButtons(lst){
                var buttons = getButtons()
                var newLista = [];
                buttons.map(list=>{
                    if(list.name != lst.name){
                        newLista.push(list)
                    }
                })
                this.updateButtons(newLista)
            },
            addButtons(){
                if(this.buttons.length > 0){
                    var newList = this.buttons
                    newList.push(this.button)
                    this.updateButtons(newList)
                }else{
                    this.updateButtons([this.button])
                }
                $('#buttonsModal').modal('hide')
            },

            addButton(){
                const newbtn = {
                    type: 'text',
                    text: '',
                }
                if(Array.isArray(this.button.buttons)){
                    if(this.button.buttons.length > 5) {return true;}
                    this.button.buttons.push(newbtn)
                }else{
                    this.button.buttons = [newbtn]
                }
            },
            delButton( button){
                this.button.buttons = this.button.buttons.filter(btn=> btn != button)
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