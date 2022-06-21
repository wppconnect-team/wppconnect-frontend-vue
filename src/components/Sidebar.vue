<template>
    <div class="layout-sidebar">
            <div class="container-sidebar">
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
                        <router-link to="/reports" style="pointer-events:none;opacity:0.5;" >
                            <span class="material-icons">report</span>
                            <span>Reports</span>
                        </router-link>
                    </li>

                    <li>
                        <router-link to="/settings" style="pointer-events:none;opacity:0.5;" >
                            <span class="material-icons">settings</span>
                            <span>Settings</span>
                        </router-link>
                    </li>

                    <li>
                        <router-link to="/logout" @click="logoutSession">
                            <span class="material-icons">logout</span>
                            <span>Disconnect device</span>
                        </router-link>
                    </li>
                </section>

                <footer>
                    <div class="change-session">
                        <div>
                            <div className="online-circle"/>
                            <p>
                                Online
                            </p>
                        </div>

                        <div>
                            <a href="/change-session" @click="handleClickOpen">
                                Change
                            </a>
                        </div>
                    </div>

                    <div class="info-session">
                        <img src="https://ui-avatars.com/api/?name=${getSession()}?background=random"
                             :alt="selectedValue"/>
                        <div>
                            <p>
                                {{selectedValue}}
                            </p>
                            <small>
                                Active Session
                            </small>
                        </div>
                    </div>
                    
                    <span class="material-icons" @click="closeSession">logout</span> Logout
                </footer>
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

//Components



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
            async logoutSession(e) {
                e.preventDefault();

                await api.post(`${getSession()}/logout-session`, null, configHeader());
                window.location.href = "/login";
            },
            async closeSession() {
                await api.post(`${getSession()}/close-session`, null, configHeader());
                window.location.href = "/login";
            }
        },
        computed:{
        },
 
    }
</script>
<style scoped>

.layout-sidebar{
  height: 100vh;
  width: 250px;
  border-right: 1px solid rgba(0, 0, 0, .1);
}
.container-sidebar{

  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.footer{
  display: flex;
  flex-direction: column;
}

.menu-items{
  display: flex;
  flex-direction: column;
  padding: 1em;
  list-style-type: none;
}
.menu-items .selected{
    background: #f4f6fb;
    color: #47a7f6;
    font-weight: 600;
}
.menu-items li {
    display: flex;
    align-items: center;
    padding: 10px;
    margin-bottom: 1em;
    width: 100%;
    transition-duration: 200ms;
    border-radius: .4rem;
}
.menu-items li:hover{
      background: #f4f6fb;
}
.menu-items li:hover*{
        color: #47a7f6
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
.menu-items a{
    padding: 7px;
    display: flex;
    align-items: center;
    border-radius: .4rem;
    color: #6e6f73;
    font-size: 1rem;
    font-weight: 500;
    text-decoration: none;
    width: 100%;
}
.menu-items a .material-icons{
      margin-right: .5em;
}


.change-session{
  display: flex;
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
.info-session{
  display: flex;
  align-items: center;
  padding: 1em 10px;
  font-size: 1rem;
  cursor: default;
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
</style>