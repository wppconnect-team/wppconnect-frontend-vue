<template>
    <div>
        <div class="layout">
            <Sidebar />
            <ModalCreateGroup @handleClose="handleCloseCreate" @open="openModalCreate"/>
            <div class="container">
                <SidebarGroupsMenu />
                <div class="right-container">
                    <header>
                        <h2>
                            {{i18n.groups}}
                        </h2>

                        <div>
                            <input id="search-groups" :placeholder="i18n.searchGroup"/>
                        </div>
                    </header>
                    <table class="table">
                        <thead>
                            <tr>
                            <th scope="col">#</th>
                            <th scope="col">{{i18n.name}}</th>
                            <th scope="col">ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(group, index) in groups" v-bind:key="index">
                            <th scope="row">{{index}}</th>
                            <td>{{group.name}}</td>
                            <td>{{group.id}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import configHeader from "../util/sessionHeader";
import api, {socket} from '../services/api.js'
import {getSession, getToken} from '../services/auth'
import router from '../router/index'
import {useStore} from '../stores/dataStore'
import {language} from '../services/language'

//Components
import Sidebar from '../components/Sidebar.vue'
import SidebarGroupsMenu from '../components/SidebarGroupsMenu.vue'


//Assets
import ImageLoader from '../assets/ic_loader_chat.svg'
const defaultImage = "https://i.pinimg.com/736x/51/24/9f/51249f0c2caed9e7c06e4a5453c57857.jpg";

    export default {        
        components: {
            Sidebar,
            SidebarGroupsMenu,
        },
        async mounted(){
            $("#search-groups").on("keyup", function() {
                var value = $(this).val().toLowerCase();
                $("table tbody tr").filter(function() {
                    $(this).toggle($(this).text().toLowerCase().replace('-','').indexOf(value) > -1)
                });
            });

            const getAllGroups = async () => {
                await this.getAllGroups();
            }
            getAllGroups();
        },
        setup(){
            const data = useStore()

            return { data }
        },
        data() {
            return {
                i18n: language(),
                groups: [],
            }
        },
        methods: {
            async getAllGroups() {
                /* 

                //Esse é o formato padrão para buscar grupos, mas como a LIB está com erro
                //irei utilizar um formato alternativo

                this.$swal({
                    title: this.i18n.pleaseWait,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    didOpen: () => {
                        this.$swal.showLoading()
                    }
                })
                const {data: allGroups} = await api.get(`${getSession()}/all-groups`, configHeader());
                this.groups = allGroups.response;
                this.$swal.close();
                */
               var groups = []
               this.data.chats.map((chat) =>{
                   let idContact = chat.id._serialized ? chat.id._serialized : chat.id;
                   if(idContact.includes('@g.us')){
                       groups.push(chat)
                   }
               })
               this.groups = groups
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