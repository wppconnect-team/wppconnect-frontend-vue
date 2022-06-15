 <template>
    <div class="chat-layout" v-bind:class="{ 'left': isMe== true}" >
      <ImageModal v-if="message.type == 'image' && showModalImage == true" 
        @handleClose="showModalImage = false"
        :message="message"
        :image="getImageSrc"
        :profilePic="profilePic"
        :nameContact="nameContact"
      />

      <div class="message-container" v-bind:class="{ 'left': isMe== true, 'warning': isWarning==true}" >
        <div style="position: absolute, right: -5, top: -5, z-index: 10">
            <span class="material-icons">keyboard_arrow_down</span>
            <!-- aqui entra o menu de responder e apagar -->
        </div>

          <span class="msg-title-top" v-if="!message.fromMe">
            <small> {{message.sender?.name || message.sender?.id?.user}}</small> <small class="pushname">~ {{message?.sender?.pushname}}</small>
          </span>
        <div class="message-content" v-bind:class="{ 'left': isMe== true, 'warning': isWarning==true}">
            <div class="image-container" v-if="message.type === 'video'">
                <video ref="imageRef" :src="getImageSrc" :poster="getImageSrc" controls />
                <div class="download" ref="downloadRef" v-bind:style="{display: display}" @click="onClickDownload('video')" />
            </div>
            <div class="image-container" v-if="message.mimetype === 'image/jpeg'">
                <img ref="imageRef" :src="getImageSrc" @click="showModalImage = true" :alt="message.caption" />
                <div class="download" ref="downloadRef" v-bind:style="{display: display}" @click="onClickDownload('image')"></div>
            </div>
            <div class="document-component" v-if="message.type === 'document'" v-bind:class="{ 'left': isMe== true, 'warning': isWarning==true}" @click="onClickDownload('document', {mimetype: message.mimetype, filename: message.filename, mediadata: message.mediadata,})">
              <p>{{message.filename}}</p>
              <span class="material-icons">download</span>
            </div>
            <AudioComponent v-if="message.type === 'ptt'"
              :url="audioUrl"
              :isMe="message.fromMe"
              :profileImage="profilePic"
              :message="message"
              @onClickDownload="onClickDownload"
            />
            <img v-if="message.type === 'sticker'" :src="message.body" />

            <div class="message-content-text" v-bind:class="{ 'left': isMe== true,'warning': isWarning==true}" >
              <QuotedMessage :message="message" v-if="message.quotedMsg" />
              <div>{{getBodyMessage}}</div>
            </div>
        </div>
        <span class="caption" v-if="message.caption">{{message.caption}}</span>
        <div v-html="getMessageTime(message)" />
      </div>
    </div>
</template>
<script>
import { config } from '../config';
import api, {socket} from '../services/api.js'
import {getSession, getToken} from '../services/auth'
import router from '../router/index'
import axios from 'axios'
import {useStore} from '../stores/dataStore'
import configHeader from '../util/sessionHeader';
import ImageModal from './ImageModal.vue'
import AudioComponent from './AudioComponent.vue'


//Assets
import Loading from '../assets/loading.gif'

    export default {
        components:{
            ImageModal,
            AudioComponent,
        },
        props: ['isMe', 'isWarning', 'session', 'token','message','profilePic','nameContact'],
        async mounted(){
        },
        setup(){
            const data = useStore()

            return { data }
        },
        data() {
            return {
                showModalImage: false,
                display: 'block',
                audioUrl: null,
            }
        },
        methods: {
            async onClickDownload (type, option) {
                if(type != 'document' && type != 'audio') this.$refs.downloadRef.style.backgroundImage = `url('${Loading}')`
                const response = await api.get(`${getSession()}/get-media-by-message/${this.message.id}`,configHeader());

                if (type === "image") {
                    this.$refs.imageRef.src = `data:${response.data.mimetype};base64, ${response.data.base64}`;
                    this.message.body = response.data.base64;
                    this.message.mimetype = response.data.mimetype;
                    this.display = 'none';
                } else if (type === "video") {
                    this.$refs.imageRef.src = `data:video/webm;base64, ${response.data.base64}`;
                    this.display = 'none';
                } else if (type === "audio") {
                    console.log(response.data)
                    this.audioUrl = `data:audio/ogg;base64, ${response.data.base64}`;
                } else if (type === "document") {
                    const a = document.createElement("a");
                    a.href = `data:${option.mimetype};base64, ${response.data.base64}`;
                    a.download = `${option.filename}`;
                    a.click();
                }
            },
            getSender(m) {
                let sender = m?.sender?.id?.user;
                if (m.sender) {
                const key = [
                    "name",
                    "shortName",
                    "pushname",
                    "verifiedName",
                    "formattedName",
                ].find((n) => {
                    if (n in m.sender && !!String(m.sender[n]).trim()) {
                    return m.sender[n];
                    }
                });
                sender = m.sender[key];
                }
                return sender;
            },
            getReason(m) {
                try {
                const sender = this.getSender(m);
                if (m.type === "revoked") return `${sender} has deleted message`;
                if (m.type === "gp2") {
                    let users = [];
                    if (m.recipients && Array.isArray(m.recipients)) {
                    users = m.recipients.reduce(
                        (c, acc, i) => c + (i > 0 ? ", " : "") + acc.user,
                        ""
                    );
                    }
                    if (m.subtype === "leave") return `${m?.recipients[0]?.user} leave`;
                    if (m.subtype === "remove") return `${sender} removed \n${users}`;
                    if (m.subtype === "add") return `${sender} added \n${users}`;
                }
                } catch (error) {
                return "";
                }
            },
            getMessageTime(m){
                   const date = new Date(m.timestamp * 1000);
                    const lang = navigator.language || navigator.languages[0];
                    const date_locale = date.toLocaleDateString(lang, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    });
                    const time_locale = date.toLocaleTimeString(lang);
                    const formatted = `${date_locale} ${time_locale}`;
                    return `
                    <div style="margin-top: 5">
                        <small>
                        <strong>${formatted}</strong>
                        </small>
                    </div>`;
            },
        },
        computed:{
            getBodyMessage(){
                if (!!this.message?.body && this.message.type === "chat") return this.message.body;
                    if (!!this.message?.body && this.message.type === "gp2" && this.message.subtype === "picture") {
                        const sender = this.getSender(this.message);
                        return `${sender} Alterou a imagem do grupo`;
                    }
                    if (!this.message?.body) return this.getReason(this.message);
            },
            getImageSrc(){
                if(this.message.type == 'video'){
                    return `data:image/jpeg;base64,${this.message.body}`
                }else{
                    return `data:${this.message.mimetype};base64,${this.message.body}`
                }
                
            }

            
        },
 
    }
</script>
<style scoped>
.chat-layout{
    width: 100%;
}
.chat-layout.left{
    display: flex;
    flex-direction: row-reverse;
}

.message-container .msg-title-top {
    margin-bottom: 10px;
    padding-right: 20px;
    width: fit-content;
    color: #f0f0f0;
    font-weight: bold;
}
.msg-title-top .pushname{
    color: #f0f0f07e;
}
.message-container{
  width: fit-content;
  font-size: 14px;
  height: auto;
  position: relative;
  display: flex;
  padding: 5px 10px;
  flex-direction: column;
  flex-wrap: wrap;
  color: #fff;
  border-radius: 5px;
  background-color:rgb(92, 7, 104);
}
.message-container.left{
    background: #cecece;
    color:#333;
}
.message-container.warning{
    background: #6A30FF;
    width: 100%;
    color: purple;
    text-align: center;
}
.message-container.warning .msg-title-top,
.message-container.warning span {
    width: 100%;
    text-align: center;
}
  .message-container.left .warning{
      background: #F3F3F5;
  }

  .message-container .caption {
    bottom: 0;
    padding: 10px;
  }


  /* Message Content */
.message-container .message-content{
    display: flex;
    margin: 3px 0;
    position: relative;
    max-width: 300px;
}

.message-container .message-content.warning{
    max-width: 100%;
    text-align: center;
}
.message-container .message-content span {
    display: block;
    width: 100%;
}

.message-container .message-content .download {
    position: absolute;
    background-image: url("../assets/ic_download_chat.svg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    padding: 2em;
    margin: auto;
    z-index: 1;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
}
/*image container */
.message-content .image-container{
    min-width: 300px;
    max-height: 300px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    position: relative;
}

.message-content .image-container img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    cursor: pointer;
}

.message-content .image-container video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
}

/*document component */
.message-content .document-component{
      width: 100%;
  background: #f0f0f0;
  color: #333;
  padding: 1em 10px;
  min-width: 250px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.message-content .document-component .warning{
    max-width: 500px;
}

.message-content .document-component .material-icons {
    color: #2b2b2b;
    border-radius: 50%;
    padding: 5px;
    width: 30px;
    height: 30px;
}

img .sticker{
  width: 125px;
  height: 125px;
  object-fit: contain;
}
.message-content .message-content-text{
 width: 100%;
  margin: 3px 0;
  position: relative;
  overflow-wrap: break-word;
  white-space: pre-wrap;
    color: rgb(226, 226, 226);
}
.message-content .message-content-text.left{
    color: rgb(77, 77, 77);
}
.message-content-text a {
    color: rgb(0, 0, 0);
}
.message-content-text.left a{
    color: #333;
}
</style>
      
      