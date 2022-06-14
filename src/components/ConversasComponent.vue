 <template>
 <aside>
        <div class="search-component" style="margin-bottom: 0">
            <input placeholder="Search chats" id="search-chats" @change="onSearch" />
            <span class="material-icons">search</span>
        </div>
        <ul id="all-contacts" >
            <!-- Search component in this location -->
            <li v-for="(contact, index) in data.chats" v-bind:key="index" class="contact-li" @click="onClickContact(contact)">
                <div class="contact-info">
                    <input type="radio" name="contact"/>

                    <div class="user-data">
                        <img :src="getProfilePic(contact)" :alt="contact.id" />
                        <div class="principal-info">
                            <p class="contact-name" v-html="getContactName(contact)" />
                            <div class="contact-message">
                                {{getMessagesCtt(contact.msgs)}}
                                <div class="unread-message" v-if="contact.unreadCount !== 0"/>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
 </aside>
</template>
<script>
import { config } from '../config';
import api, {socket} from '../services/api.js'
import {login} from '../services/auth'
import router from '../router/index'
import axios from 'axios'

const defaultImage = "https://i.pinimg.com/736x/51/24/9f/51249f0c2caed9e7c06e4a5453c57857.jpg";

//Assets
import {useStore} from '../stores/dataStore'

    export default {
        props: ['chats', 'choosedContact'],
        async mounted(){
            $("#search-chats").on("keyup", function() {
                var value = $(this).val().toLowerCase();
                $("aside ul li").filter(function() {
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

            }
        },
        methods: {
            onClickContact(contact){
                this.$emit('onClickContact', contact)
            },
            getMessagesCtt(msgs){
                if(!msgs){
                    return "Não foi possível carregar as mensagens anteriores..."
                }else if(msgs.length > 0){
                    if(msgs[msgs.length - 1].type === "image" || msgs[msgs.length - 1].type === "video" || 
                    msgs[msgs.length - 1].type === "file" || msgs[msgs.length - 1].type === "ptt" || msgs[msgs.length - 1].type === "sticker"){
                        return 'Media message'
                    }
                    else if(msgs[msgs.length - 1].type === "vcard"){
                        return 'Contact'
                    }
                    else if(msgs[msgs.length - 1].type === 'document'){
                        return 'Document'
                    }
                    else if(msgs[msgs.length - 1].type === "revoked"){
                        return 'Revoked message'
                    }
                    else if(msgs[msgs.length - 1].type==="gp2"){
                        return 'No messages'
                    }
                    else if(msgs[msgs.length - 1].type === "notification_template"){
                        return 'No messages'
                    }
                    else{
                        return msgs[msgs.length - 1].body
                    }
                }else{
                    return 'Não foi possível carregar as mensagens anteriores...'
                }
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
            }
        },
        computed:{
        },
 
    }
</script>
<style scoped>
aside {
  display: flex;
  flex-direction: column;
  background: #ebebeb;

  height: 100%;
  width: 35rem;
  min-width: 20%;
  overflow: hidden auto;

  position: relative;
  transition-duration: 200ms;
}
aside::-webkit-scrollbar {
width: 2px;
height: 7px;
}
aside::-webkit-scrollbar-track {
background: purple;
}
aside::-webkit-scrollbar-thumb {
background: #929090;
transition-duration: 200ms;
border-radius: 10px;
}
aside::-webkit-scrollbar-thumb:hover {
background: #6b0b5b38;
}
aside h2 {
font-size: 1.5rem;
font-weight: 400;
margin-left: 1em;
}
aside ul {
width: 100%;
display: flex;
flex-direction: column;
list-style-type: none;
padding: .5em;
}
aside ul li {
    transition-duration: 200ms;
    border-radius: 8px;


}
    aside ul li:hover {
    background: #6b0b5b38;
    }
aside ul .active {
    background: blue;
}

.search-component{
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-bottom: 2em;
  transition-duration: 200ms;
  position: sticky;
  top: 0;
  padding: 1em 2em;
  background: #2a2f32;
  border-bottom: 1px solid rgb(216, 199, 216);
  z-index: 1;
  height: 52px;
}
.search-component .material-icons {
    color:white
}
.search-component .material-icons:nth-child(2) {
    margin-left: 10px;
}

.search-component input {
border: 0;
width: 100%;
margin-left: .5em;
outline: 0;
background: rgb(212, 212, 212);
padding: 10px;
border-radius: 5px;
}

.contact-info input[type=radio] {
display: none;
}

.contact-info input[type=radio]:checked + .contact-info {
background: #F4F6F9;
}


div .user-data{
  display: flex;
  cursor: pointer;
  padding: 20px 10px;
  transition-duration: 200ms;
}
.user-data img {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 50%;
    margin-right: 10px;
  }
.user-data .principal-info {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
.user-data .principal-info .contact-name {
    font-weight: 500;
    font-size: 1rem;
    color: purple;
  }
.user-data .principal-info .contact-message {
    display: flex;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 280px;
    color: black;
    font-weight: 400;
  }
.user-data .principal-info  .contact-message .left {
    font-size: 1rem;
    position: relative;
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 240px;
}
.user-data .contact-message .unread-message {
    position: absolute;
    right: 0px;
    margin-left: 10px;
    width: 15px;
    height: 15px;
    background: #61045c;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
}
.user-data .contact-message .unread-message p {
    font-weight: 600;
}
</style>
      
      