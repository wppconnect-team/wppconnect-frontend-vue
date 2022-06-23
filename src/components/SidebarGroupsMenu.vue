<template>
    <div>
        <div class="left-container">
            <ul>
                <li >
                    <div class="wrapper-li">
                        <div class="wrapper-ic">
                            <span class="material-icons">person</span>
                        </div>
                        <div class="wrapper-text">
                            <h2>
                                {{i18n.allGroups}}
                            </h2>
                            <p>
                                {{i18n.allGroupsText}}
                            </p>
                        </div>
                    </div>
                </li>

                <li style="pointer-events:none; opacity:0.5;">
                    <div className="wrapper-li">
                        <div className="wrapper-ic">
                            <span class="material-icons">group_add</span>
                        </div>
                        <div class="wrapper-text">
                            <h2>
                                {{i18n.createGroup}}
                            </h2>
                            <p>
                                {{i18n.createGroupText}}
                            </p>
                        </div>
                    </div>
                </li>

                <li style="pointer-events:none; opacity:0.5;">
                    <div class="wrapper-li">
                        <div class="wrapper-ic">
                            <span class="material-icons">add</span>
                        </div>
                        <div class="wrapper-text">
                            <h2>
                                {{i18n.inviteParticipants}}
                            </h2>
                            <p>
                                {{i18n.inviteParticipantsText}}
                            </p>
                        </div>
                    </div>
                </li>
            </ul>
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
import {language} from '../services/language'

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
</style>