<template>
    <div>
        <div class="layout">
            <div class="container">

            <div class="content-container">
                    <ConversasComponent
                        :chats="data.chats"
                        :choosedContact="choosedContact"
                        @setChats="setChats"
                        @onClickContact="onClickContact"
                    />

                    <div class="chat-container" >
                        <header class="header-contact" v-if="(choosedContact.length != 0)">
                            <div class="container-info-ctt">
                                <img :src="getProfilePic(choosedContact)" :alt="getContactName(choosedContact)"/>
                                <h3 v-html="getContactName(choosedContact)"></h3>
                            </div>
                        </header>

                        <ul style="overflow-x: hidden">
                            <button class="load-more" @click="loadMore"  v-if="(messages.length > 0)">
                                Load more messages
                            </button>
                            <div class="waiting-container" v-if="(messages.length == 0)">
                                <img :src="ImageLoader" alt="Smartphone" />
                                <h2>Choose a contact to start a conversation</h2>
                            </div>
                            <div v-if="messages.length > 0">
                                <li v-bind:key="message.id" v-for="message in messages" :id="message.id">
                                    <ChatComponent
                                    :isMe="message.fromMe ? true : false"
                                    :isWarning="!message?.body && message.type !== 'chat' && !['ptt', 'audio'].includes(message.type)"
                                    
                                    :session="getSession"
                                    :token="getToken"
                                    :message="message"
                                    @selectMessageId="setSelectedMessage"
                                    />
                                </li>
                            </div>
                            <div id="messagesEnd" ref="messagesEnd" />
                        </ul>
                        <div class="reply-container" v-if="selectedMessage.length != 0">
                            <div class="content">
                                <ChatComponent
                                :isMe="selectedMessage.fromMe ? true : false"
                                :isWarning="!selectedMessage?.body && selectedMessage.type !== 'chat' && !['ptt', 'audio'].includes(selectedMessage.type)"
                                
                                :session="getSession"
                                :token="getToken"
                                :message="selectedMessage"
                                @selectMessageId="()=> {}"
                                />
                            </div>
                            <div>
                                <div class="my-tooltip" name="Cancelar" @click="selectedMessage = ''"><span class="material-icons">close</span></div>
                            </div>
                        </div>
                        <div class="bottom-container" v-if="(choosedContact.length != 0)">
                            <textarea placeholder="Digite uma mensagem..." @keydown.enter.prevent="sendMessage" v-model="data.message"/>

                            <div class="action-buttons">
                                <div>
                                    <button @click="emoji = false" v-if="emoji">
                                        <span class="material-icons">close</span>
                                    </button>
                                    <button @click="emoji = true" v-else>
                                        <span class="material-icons">add_reaction</span>
                                    </button>

                                    <label>
                                    <input type="file" @change="onChangeAnexo" />
                                    <div class="attach-info">
                                        <span class="material-icons">attach_file</span>
                                    </div>
                                    </label>
                                </div>
                                    <span class="material-icons" style="cursor:pointer;" @click="startRecording" v-if="!recordState">mic</span>
                                    <div class="contador" v-else>
                                        <div class="main-cont">
                                            <span class="material-icons" style="cursor:pointer;"  v-if="recordState" @click="cancelRecording">cancel</span>
                                        <div class="counter">
                                            <p v-html="getTimeRecording" v-if="recordState"></p>
                                        </div>
                                        <span class="material-icons" style="cursor:pointer;"  v-if="recordState" @click="finishRecording">stop</span>
                                        </div>
                                    </div>
                                    <span class="material-icons" style="cursor:pointer;"  @click="sendMessage">send</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { config } from '../config';
import configHeader from "../util/sessionHeader";
import api, {socket} from '../services/api.js'
import {login, getSession, getToken} from '../services/auth'
import router from '../router/index'
import axios from 'axios'
import {useStore} from '../stores/dataStore'

//Components
import ChatComponent from '../components/ChatComponent.vue'
import ConversasComponent from '../components/ConversasComponent.vue'

//Assets
import ImageLoader from '../assets/ic_loader_chat.svg'
const defaultImage = "https://i.pinimg.com/736x/51/24/9f/51249f0c2caed9e7c06e4a5453c57857.jpg";

    export default {        
        components: {
            ChatComponent,
            ConversasComponent,
        },
        async mounted(){
            const onLoad = async () => {
                await this.checkConnection();
            }
            onLoad()
        },
        setup(){
            const data = useStore()

            return { data }
        },
        data() {
            return {
                choosedContact: [],
                messages: [],
                selectedMessage: [],
                emoji: false,

                recordState: false,
                segundos: '',
                minutos: '',

                loadingMoreMessages: false,
                hasNoMore: false,

            }
        },
        methods: {
            async checkConnection() {
                try {
                    this.$swal({
                        title: 'Por favor, aguarde...',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        didOpen: () => {
                            this.$swal.showLoading()
                        }})
                    await api.get(`${getSession()}/check-connection-session`, configHeader());
                    await this.getAllContacts()
                    .then(async ()=>{
                        await this.getAllChats();
                    })
                    this.$swal().close()
                } catch (e) {
                    console.log(e)
                    this.$swal(e.response.data.message)
                    // history.push("/");
                }
            },
            async getAllContacts() {
                return new Promise(async (resolve, reject) => {
                    const {data} = await api.get(`${getSession()}/all-contacts`, configHeader());
                    const arr = [];

                    for (const contact of data.response) {
                        if (contact.isMyContact && contact.id.user !== undefined)
                            arr.push(contact);
                    }
                    this.data.contacts = arr;
                    resolve();
                });
            },
            async getAllChats() {
                try {
                    const {data: {response}} = await api.get(`${getSession()}/all-chats-with-messages`, configHeader());

                    const arr = [];
                    for (const elem of response) {
                        if (!elem.archive) {
                            var newarray = []
                            this.data.contacts.map((contact)=>{
                                if(contact.id._serialized == elem.id){
                                    newarray = contact;
                                    newarray.msgs = elem.msgs;
                                    arr.push(newarray);
                                }
                            })
                        }
                    }
                    this.data.chats = arr;
                    this.data.dados = arr;
                } catch (e) {
                    const {data: {response}} = await api.get(`${getSession()}/all-chats-with-messages`, configHeader());

                    const arr = [];
                    for (const elem of response) {
                        if (!elem.archive) {
                            var newarray = []
                            this.data.contacts.map((contact)=>{
                                if(contact.id._serialized == elem.id){
                                    newarray = contact;
                                    newarray.msgs = elem.msgs;
                                    arr.push(newarray);
                                }
                            })
                        }
                    }

                    this.data.chats = arr;
                    this.data.dados = arr;
                }
            },
            async setChats(chats){
                this.chats = chats;
            },
            async sendMessage(){
                if (!!this.data.message.trim() && !!this.getSession()) {
                    const by = "";
                    let endpoint = "send-message";

                    const body = {
                        phone: this.choosedContact.id.replace(/[@c.us,@g.us]/g, ""),
                        message: by + this.data.message,
                    };

                    if (this.choosedContact.id.includes("@g.us")) {
                        body.isGroup = true;
                    }

                    if (this.selectedMessage.length != 0) {
                        body.messageId = this.selectedMessage.id;
                        endpoint = "send-reply";
                    }

                    await api.post(`${this.getSession()}/${endpoint}`, body, configHeader());
                    this.scrollToBottom();
                    this.data.message = ''
                    this.selectedMessage = []
                } else {
                    this.$swal('Digite uma mensagem!')
                }
            },
            scrollToBottom() {
                setTimeout(() => {
                    if (this.$refs.messagesEnd !== null) {
                        this.$refs.messagesEnd.scrollIntoView({behavior: "smooth"});
                    }
                },300)
            },
            async onClickContact(contact){
                this.choosedContact = contact;
                this.$swal({
                    title: 'Please, wait...',
                    timerProgressBar: true,
                    showConfirmButton: false,
                })
                try {
                    if (contact.id._serialized.includes("@g.us")) {
                        const {data} = await api.get(`${getSession()}/chat-by-id/${contact.id._serialized.replace(/[@g.us,@g.us]/g, "")}?isGroup=true`, configHeader());
                        await api.post(`${getSession()}/send-seen`,{phone: contact.id._serialized.replace("@g.us", "")}, configHeader());
                        this.messages = data?.response || [];
                        this.$swal().close()
                        this.scrollToBottom()
                    } else {
                        const {data} = await api.get(`${getSession()}/chat-by-id/${contact.id._serialized.replace(/[@c.us,@c.us]/g, "")}?isGroup=false`, configHeader());
                        await api.post(`${getSession()}/send-seen`,{phone: contact.id._serialized.replace("@c.us", "")}, configHeader());
                        this.messages = data?.response || [];
                        this.$swal().close()
                        this.scrollToBottom()
                    }
                } catch (e) {
                    if(e){
                        console.log(e)
                        this.$swal(e)
                    }
                }
            },
            async loadMore() {
                this.loadingMoreMessages = true;
                try {
                    let id = this.messages[0].id
                    let param = "?isGroup=false";
                    if (this.choosedContact.id._serialized.includes("@g.us")) {
                        param = "?isGroup=true";
                    }
                    const { data } = await api.get(
                        `${getSession()}/load-earlier-messages/${this.choosedContact.id._serialized}/${id}/before/10${param}`,
                        configHeader());
                    if (data && data.response && Array.isArray(data.response)) {
                        this.messages = [...data.response, ...this.messages]
                    }
                    if (data && !data.response) {
                        this.hasNoMore = true;
                    }
                } catch (e) {
                    this.$swal(e.message)
                    console.log(e);
                } finally {
                    this.loadingMoreMessages = false;
                }
            },
            setSelectedMessage(message){
                this.selectedMessage = message;
            },

            getContactName(contact){
                if(!contact.name){
                    return contact?.id?.replace("@c.us", "").replace("@g.us", "")
                }else{
                    return contact.name
                }                
            },
            getProfilePic(contact){
                if(contact.profilePicThumbObj){
                    if(contact.profilePicThumbObj.eurl){
                        return contact.profilePicThumbObj.eurl
                    }else{
                        return defaultImage;
                    }
                }else{
                    return defaultImage;
                }
            },


            //Funções que serão chamadas apenas por retorno
            getSession(){
                return getSession()
            },
            getToken(){
                return getToken()
            },

        },
        computed:{
            getTimeRecording(){
                if(this.minutos === 0){
                    return `${this.segundos}s`
                }else{
                    return `${this.minutos}m ${this.segundos}s`
                }                       
            },
            //Funções que serão chamadas apenas por retorno
            ImageLoader(){
                return ImageLoader;
            },
        },
 
    }
</script>
<style scoped>
div .layout{
  height: 100vh;
  width: 100%;

  display: flex;
  overflow: hidden;

  justify-content: center;
  align-items: center;
}
div .container{
  height: 100vh;
  width: 100%;

  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;
}

div .content-container{
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;
    clear: both;
    max-height: 100vh;
}
div .content-container .emoji-mart.emoji-mart-light {
    position: absolute;
    width: 100% !important;
    left: 0;
    bottom: 120px;
}
div .content-container .emoji-mart {
position: absolute !important;
bottom: 60px;
width: 70vw !important;
height: 50vh;
background-color: #f0f0f0;
}

div .content-container .emoji-mart-bar {
border: 0;
}

div .content-container .emoji-mart-anchors {
padding: 0;
border: 0;
}

div .content-container .emoji-mart-anchor-icon {
color: #a3a3a3;
}

div .content-container .emoji-mart-anchor-selected {
color: red !important;
}

div .content-container .emoji-mart-anchor-bar {
background-color: #36aa9f !important;
}

div .content-container .emoji-mart-anchor-icon {
color: #8b8b8b !important;
}

div .content-container .emoji-mart-search {
margin: 5px 8px 15px 8px;
}

div .content-container .emoji-mart-search-icon {
display: none;
}

div .content-container .emoji-mart-search input {
font-size: 16px;
display: block;
width: 100%;
padding: 10px;
border-radius: 5px;
border: 0px solid #d9d9d9;
outline: 0;
background-color: #e6e6e6;
color: #4a4a4a;
}

div .content-container .emoji-mart-category-label span {
display: block;
width: 100%;
font-weight: 500;
padding: 5px 6px;
color: #b4b4b4;
background-color: #f0f0f0;
}

div .content-container .emoji-mart-scroll {
height: 200px;
}

div .content-container .emoji-mart-bar:last-child {
display: none;
}

div .content-container .emoji-mart {
position: absolute !important;
bottom: 60px;
width: 100vw !important;
height: 40vh;
}

div .content-container .emoji-mart-category-list {
display: flex;
flex-wrap: wrap;
}
div .top-container{  
    display: flex;
  align-items: center;

  justify-content: space-between;
  width: 100%;
}
div .top-container span {
display: flex;
align-items: center;
cursor: pointer;
transition-duration: 200ms;
}
div .top-container span p {
      border-bottom: 1px solid #000;
}

div .top-container span svg {
    margin-right: 10px;
}

div .top-container span svg:hover {
    transform: scale(1.1);
}
form .sessions-container{
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: 2em;

  height: 100%;
  width: 20%;
  min-width: 20%;
  position: relative;
  overflow: auto;
}
  form .sessions-container .plus-button {
    position: absolute;
    bottom: 30px;
    right: 30px;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px,
    rgba(0, 0, 0, 0.05) 0px 5px 10px;

    border-radius: 50%;
    background: #007af3;
    width: 50px;
    height: 50px;
    cursor: pointer;
    transition-duration: 200ms;

    display: flex;
    align-items: center;
    justify-content: center;
  }
form .sessions-container .plus-button svg {
      color: #fff;
      width: 30px;
      height: 30px;
    }
form .sessions-container .plus-button svg:hover {
      transform: scale(1.05);
      background: #1065ba;
    }
  form .sessions-container ul {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    list-style-type: none;
    }
form .sessions-container ul li {
    margin-top: 1em;
    width: 100%;
}
form .sessions-container ul li label .info-session {
    display: flex;
    flex-direction: column;
    cursor: pointer;

    padding: 20px 10px;
    border-radius: 7px;

    border: 1px solid #f4f6f9;
    transition-duration: 200ms;
}
form .sessions-container ul li label small {
color: #999;
}

form .sessions-container ul li label p {
font-weight: 600;
}
form .sessions-container ul li label input[type="radio"] {
          display: none;
        }
form .sessions-container ul li label input[type="radio"]:checked + .info-session {
    background: #f4f6f9;
}
form .sessions-container ul li label .info-session:hover {
transform: scale(1.03);
background: aliceblue;
}
.header-contact{
    display: flex;
  padding: 5px;
  border-bottom: 1px solid purple;
  background: rgb(66, 66, 66);
}
.header-contact .container-info-ctt {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 2em;
}
.header-contact .container-info-ctt img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 15px;
}

.header-contact .container-info-ctt h3 {
    font-weight: 500;
    color: rgb(255, 255, 255);
}
.chat-container{
    display: flex;
    flex-direction: column;
    background: rgba(255, 195, 255, 0.192);
    border-radius: 3px;
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
}
.chat-container h3 {
font-size: 1rem;
}
.chat-container .bottom-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 100%;
    padding: 15px;
    background: rgb(206, 206, 206);
}
.chat-container .bottom-container .action-buttons {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.chat-container .bottom-container .action-buttons button {
    background: transparent;
    border: 0;
    outline: 0;
}

.chat-container .bottom-container .action-buttons div {
display: flex;
}
.chat-container .bottom-container label {
    display: flex;
    align-items: center;
}
.chat-container .bottom-container label input[type="file"] {
    display: none;
}
.chat-container .bottom-container input {
    width: 100%;
    padding: 10px 15px;
    border-radius: 20px;
    border: 0;
    outline: 0;
}
.chat-container .bottom-container svg {
    margin-left: 20px;
    cursor: pointer;
    color: #666;
    transition-duration: 200ms;
}
.chat-container .bottom-container svg:nth-child(1) {
    margin-left: 10px;
    margin-right: 10px;
    }

    .chat-container .bottom-container svg:hover {
    color: #000;
    }
.chat-container ul {
height: 100%;
overflow: auto;
padding: 2em;
list-style-type: none;
}
.chat-container ul::-webkit-scrollbar {
    width: 7px;
    height: 7px;
}

.chat-container ul::-webkit-scrollbar-track {
background: #f1f1f1;
}

.chat-container ul::-webkit-scrollbar-thumb {
background: #9a9a9a;
transition-duration: 200ms;
border-radius: 10px;
}

.chat-container ul::-webkit-scrollbar-thumb:hover {
background: #a5a5a5;
}

.chat-container ul li {
display: flex;
margin-bottom: 10px;
}
.chat-container textarea {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    outline: none;
    height: 70px;
    font-size: 16px;
    background: rgb(228, 228, 228);
    color: rgb(36, 36, 36);
    border: 2px solid rgb(99, 8, 84);
    margin-bottom: 10px;
    transition-duration: 200ms;
}
.chat-container textarea :focus {
    border: 2px solid green;
}

.waiting-container{
    color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;

    height: 100%;
}
.waiting-container img {
    width: 100px;
    height: 100px;
    margin-bottom: 2em;
}

.waiting-container h2 {
    font-size: 1.3rem;
    color:purple;
}

.waiting-container p {
    margin-top: 0.5em;
    width: 350px;
    font-size: 1rem;
}

@keyframes pulsate-bck {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(0.9);
    }
    100% {
        transform: scale(1);
    }
}
.contador{
    display: block;
    width: 160px;
    min-width: 160px;
}

.contador .main-cont {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
.contador .main-cont svg {
    cursor: pointer;
    width: 26px;
    height: 26px;
}
.contador .main-cont svg:nth-child(1) {
    color: #c25252;
}

.contador .main-cont svg:nth-child(3) {
    color: #569241;
}
.contador .main-cont .counter p {
    font-size: 16px;
    text-align: center;
}
.load-more{
    color: #999;
    margin: 0 auto;
    border: 0;
    padding: 10px;
    background: rgba(94, 3, 89, 0.808);
    width: 100%;
    font-weight: 600;
    border-radius: 10px;
    cursor: pointer;
    margin-bottom: 2em;
}
.reply-container{
    padding: 10px;
    display: flex;
    flex-direction: row;
    background: #ccc;
    align-items:center;
    justify-content:center;
}
.reply-container .content{
    flex: 1;
    align-items:center;
    justify-content:center;
}
</style>