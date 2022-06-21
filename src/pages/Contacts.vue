<template>
    <div>
        <div class="layout">
            <Sidebar />
            <div class="content">
            <header>
                <h2>
                    {{i18n.contacts}}
                </h2>

                <div>
                    <input id="search-contacts" :placeholder="i18n.searchContacts" />
                </div>
            </header>

                <table>
                    <thead>
                    <tr>
                        <th>
                            #
                        </th>
                        <th>
                            {{i18n.name}}
                        </th>
                        <th>
                            {{i18n.phone}}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(contact, index) in data.contacts" v-bind:key="index">
                            <td>
                            # {{index}}
                            </td>
                            <td>
                            {{contact.name}}
                            </td>
                            <td>
                            {{maskPhone(contact.id.user)}}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
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
            $("#search-contacts").on("keyup", function() {
                var value = $(this).val().toLowerCase();
                $("table tbody tr").filter(function() {
                    $(this).toggle($(this).text().toLowerCase().replace('-','').indexOf(value) > -1)
                });
            });
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
            maskPhone( value ) {
            return value
                .replace(/\D/g, "")
                .replace(/(\d{2})(\d)/, "($1) $2")
                .replace(/(\d{5})(\d{4})(\d)/, "$1-$2");
            },
        },
        computed:{
        },
 
    }
</script>
<style scoped>
.layout{
  width: 100%;
  height: 100vh;
  padding-left: 85px;
}
.container{
  width: 100%;
  height: 100%;
}

header{
    position: fixed;
    top:0;
  width: 100%;
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
header button{
    background-color: #44ce4b;
    padding: 10px 1.5em;
    border: 0;
    margin-left: 1em;
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
    outline: 0;
}

table {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position:absolute;
  top:70px;
  left: 100px;
      font-size: 13pt;
}
table thead tr{
    width: 70%;
  display: flex;
  align-content: center;
  justify-content: space-between;
  background-color:rgb(202, 202, 202);
}
table thead tr th{
    width: 30%;
}
table tbody tr{
    width: 70%;
  display: flex;
  justify-content: space-between;
  border: 0.5px solid black;
}
table tbody tr td{
    width: 30%;
}
</style>