<template>
    <div>
        <div class="layout">
            <Sidebar />
            <div class="container">
                <SidebarSettingsMenu />

                <div class="right-container">
                    <header>
                        <h2>
                            {{i18n.list}}
                        </h2>
                    </header>
                    <div class="content">
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#listsModal">
                            Nova lista
                        </button>
                        <table class="table" style="margin-top:30px;">
                            <thead class="thead-dark">
                                <tr>
                                <th scope="col">Nome</th>
                                <th scope="col">Descrição</th>
                                <th scope="col">Texto do botão</th>
                                <th scope="col">Opções</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(lst, index) in lists" v-bind:key="index">
                                    <th scope="row">{{lst.name}}</th>
                                    <td>{{lst.description}}</td>
                                    <td>{{lst.buttonText}}</td>
                                    <td>
                                        <button type="button" @click="list = lst" class="btn btn-primary btn-sm"><span class="material-icons" style="font-size:10pt;">edit</span></button>
                                        <button type="button" @click="delList(lst)" class="btn btn-secondary btn-sm"><span class="material-icons"  style="font-size:10pt;">delete</span></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modal -->
        <div class="modal fade" id="listsModal" tabindex="-1" aria-labelledby="listsModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="listsModalLabel" v-if="!list.id">Nova Lista</h5>
                <h5 class="modal-title" id="listsModalLabel" v-if="list.id">Editar Lista</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                        <form>
                        <div class="form-group">
                            <label>Nome</label>
                            <input type="text" class="form-control" v-model="list.name">
                            <small class="form-text text-muted">Defina um nome para identificar a lista.</small>
                        </div>
                        <div class="form-group">
                            <label>Nome para o botão</label>
                            <input type="text" class="form-control" v-model="list.buttonText">
                            <small class="form-text text-muted">Coloque o nome para o botão de clique</small>
                        </div>
                        <hr/>
                        <div class="form-row">
                            <div class="form-group col-md-12">
                                <label >Descrição</label>
                                <textarea v-model="list.description" class="form-control" rows="3"></textarea>
                                <small>Insira uma descrição / texto para enviar para o contato</small>
                            </div>
                        </div>
                        <hr />
                        <button type="button" class="btn btn-primary" @click="addSection">Add Seção</button>
                        <div class="form-row" v-for="(section,indexSection) in list.sections" v-bind:key="indexSection">
                            <div class="form-group col-md-12" >
                                <label >Título da Seção</label>
                                <input type="text" class="form-control" v-model="section.title">
                            </div>
                            <button type="button" class="btn btn-primary" @click="addRow(indexSection)">Add Botões</button>
                            <button type="button" class="btn btn-danger" @click="delSection(section)">Deletar seção</button>
                            <div class="row g-3" v-for="(row,index) in section.rows" v-bind:key="index">
                                <div class="col-md-5">
                                    <label >Nome</label>
                                    <input type="text" class="form-control" v-model="row.title">
                                </div>
                                <div class="col-md-5">
                                    <label >Descrição</label>
                                    <input type="text" class="form-control" v-model="row.description">
                                </div>
                                <div class="col-md-2">
                                    <label >Opt</label><br/>
                                    <button type="button" class="btn btn-danger" @click="delRow(indexSection, row)">Del</button>
                                </div>
                            </div>
                        </div>
                        </form>
            </div>
            <div class="modal-footer">
                <button type="button" @click="list = []" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" @click="addList" class="btn btn-primary">Salvar</button>
            </div>
            </div>
        </div>
        </div>

    </div>
</template>
<script>
import {getLists, setLists} from '../services/settings_lists'
import {useStore} from '../stores/dataStore'
import {language} from '../services/language'

//Components
import Sidebar from '../components/Sidebar.vue'
import SidebarSettingsMenu from '../components/SidebarSettingsMenu.vue'


//Assets

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
                list: {},
                lists: getLists(),
                
            }
        },
        methods: {
            updateLists(lists){
                setLists(lists)
                this.$swal('Lista salva com sucesso.')
                this.list = {}
                this.lists = getLists()
            },
            delList(lst){
                var lists = getLists()
                var newLista = [];
                lists.map(list=>{
                    if(list.name != lst.name){
                        newLista.push(list)
                    }
                })
                this.updateLists(newLista)
            },
            addList(){
                if(this.lists.length > 0){
                    var newList = this.lists
                    newList.push(this.list)
                    this.updateLists(newList)
                }else{
                    this.updateLists([this.list])
                }
                $('#buttonsModal').modal('hide')
            },

            addSection(){
                const newsection = {
                    title: '',
                    rows: []
                }
                if(Array.isArray(this.list.sections)){
                    if(this.list.sections.length > 5) {return true;}
                    this.list.sections.push(newsection)
                }else{
                    this.list.sections = [newsection]
                }
            },
            delSection( section){
                this.list.sections = this.list.sections.filter(sct=> sct != section)
            },
            addRow(index){
                if(this.list.sections[index].rows.length > 5) {return true;}
                const newrow = {
                    title: '',
                    description: '',
                }
                this.list.sections[index].rows.push(newrow)
            },
            delRow(indexSection, rowDel){
                this.list.sections[indexSection].rows = this.list.sections[indexSection].rows.filter(row => row != rowDel)
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