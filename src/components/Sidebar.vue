<template>
    <div class="layout-sidebar">
            <div class="container-sidebar">

                <div class="logo-col">
                    <router-link to="/index"><img src="https://avatars.githubusercontent.com/u/77944999?s=200&v=4" alt="" width="50"></router-link>
                </div>
                <section class="menu-items">
                    <li>
                        <router-link to="/chat" >
                            <span class="material-icons">message</span>
                            <span>Chats</span>
                        </router-link>
                    </li>

                    <li>
                        <router-link to="/contacts">
                            <span class="material-icons">person</span>
                            <span>Contacts</span>
                        </router-link>
                    </li>

                    <li>
                        <router-link to="/groups">
                            <span class="material-icons">groups</span>
                            <span>Groups</span>
                        </router-link>
                    </li>

                    <li>
                        <router-link to="/settings" >
                            <span class="material-icons">settings</span>
                            <span>Settings</span>
                        </router-link>
                    </li>
                </section>

                <footer>
                    <div class="btn-group dropup">
                        <button class="btn btn-secondary dropdown-toggle btn-options" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                            <img type="button" :src="defaultImage" width="40"  />
                        </button>
                        <ul class="dropdown-menu">
                            <li><router-link to="/settings" ><button class="dropdown-item" type="button">Configurações</button></router-link></li>
                            <li><button class="dropdown-item" @click="logoutSession" type="button">Trocar sessão</button></li>
                            <li><button class="dropdown-item" @click="logoutDispositivo" type="button">Desconectar dispositivo</button></li>
                        </ul>
                    </div>
                </footer>
            </div>
    </div>
</template>
<script>
import { config } from '../config';
import configHeader from "../util/sessionHeader";
import api, {socket} from '../services/api.js'
import {getSession, logout} from '../services/auth'
import router from '../router/index'
import {useStore} from '../stores/dataStore'

//Components

const defaultImage = "https://i.pinimg.com/736x/51/24/9f/51249f0c2caed9e7c06e4a5453c57857.jpg";


//Assets

    export default {        
        components: {
        },
        async mounted(){

        },
        setup(){
            const data = useStore()

            return { data }
        },
        data() {
            return {

            }
        },
        methods: {
            logoutDispositivo() {
                api.post(`${getSession()}/logout-session`, null, configHeader());
                logout();
                router.push('/login')
            },
            tooggleDropdown(){
                $('#tooggleDropdown').trigger('click');
            },
            logoutSession(){
                logout();
                router.push('/login')
            },
        },
        computed:{
            defaultImage(){
                return defaultImage;
            }
            
        },
 
    }
</script>
<style scoped>
.sidebar-menu {
  position: fixed;
  left: 0;
  top: 0;
  width: 85px;
  background-color: #fff;
  box-shadow: 0px 4px 4px rgba(66, 11, 161, 0.2);
  z-index: 999;
  padding: 20px;
}


.layout-sidebar{
  display: flex;
  display: -webkit-flex;
  flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
  height: calc(100vh - 100px);
}

.container-sidebar{

  position: fixed;
  left: 0;
  top: 0;
  width: 85px;
  height: 100vh;
  background-color: #fff;
  box-shadow: 0px 4px 4px rgba(66, 11, 161, 0.2);
  z-index: 999;
  padding: 20px;
}
.layout-sidebar .container-sidebar .logo-col {
  text-align: center;
}
.footer{
  display: flex;
  flex-direction: column;
}

.menu-items{
  display: flex;
  flex-direction: column;
  list-style-type: none;
}
.menu-items .selected{
    background: #f4f6fb;
    color: #47a7f6;
    font-weight: 600;
}
.menu-items section{
  list-style: none;
  padding: 0;
  margin: 0;
}
.menu-items li {
    display: block;
    position: relative;
    align-items: center;
    padding: 10px;
    margin-bottom: 1em;
    width: 100%;
    transition-duration: 200ms;
    border-radius: .4rem;
}
.menu-items li.disabled{
      cursor: not-allowed;
      color: #999;
}
.menu-items li.disabled:hover{
        background: #fff;
}
.menu-items li.disabled:hover*{
          color: #999;
}
.menu-items li a{
    padding: 7px;
    display: flex;
    display: -webkit-flex;
    align-items: center;
    -webkit-align-items: center;
    justify-content: center;
    -webkit-justify-content: center;
    color: #6e6f73;
    font-size: 1rem;
    font-weight: 500;
    text-decoration: none;
    width: 52px;
    height: 46px;
}
.menu-items a .material-icons{
      margin-right: .5em;
      color: #50034c
}
.menu-items span:not(.material-icons){
    display: none;
}

footer{
    position: fixed;
    bottom: 15px;
    cursor: pointer;
}
.change-session{
  display: block;
  align-items: center;
  justify-content: space-between;
  padding: 10px 1em;
  border-top: 1px solid rgba(0, 0, 0, .1);
  border-bottom: 1px solid rgba(0, 0, 0, .1);
  font-size: 1rem;
}
.change-session .online-circle{
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: aquamarine;
    margin-right: .5em;
}
.change-session div{
    display: flex;
    align-items: center;
}
.change-session a{
    color: #47a7f6;
    text-decoration: none;
}
.btn-options{
    background-color: transparent;
    border: transparent;
    box-shadow: 0;
}
.btn-options:hover{
    background-color: transparent;
    border: transparent;
    box-shadow: 0;
}
.btn-options:focus{
    background-color: transparent;
    border: transparent;
    box-shadow: 0;
}
.btn-options::selection{
    background-color: transparent;
    border: transparent;
    box-shadow: 0;
}
.info-session{
  display: block;
  align-items: center;
  padding: 1em 10px;
  font-size: 1rem;
}

.info-session div{
    display: flex;
    flex-direction: column;
}
.info-session img{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  cursor: pointer;
}
.info-session a{
    font-size: 1rem;
    margin-top: 10px;
    color: #f64747;
}

.logout-button{
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  background: #f64747;
  text-align: center;
  padding: 10px;
  transition-duration: 200ms;
}
.logout-button:hover{
    background: red;
}
.dropdown-menu li a{
    
  text-decoration: none;
}
</style>