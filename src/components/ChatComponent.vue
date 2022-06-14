 <template>
    <div class="chat-layout" v-bind:class="{ 'left': isMe== true}" >
      <ImageModal
        open={openModalImage}
        handleClose={handleCloseModalImage}
        message={message}
        image={clickedUrl}
      />

      <div class="message-container" v-bind:class="{ 'left': isMe== true, 'warning': isWarning==true}" >
        <div style="position: absolute, right: -5, top: -5, z-index: 10">
            <span class="material-icons">keyboard_arrow_down</span>
            <!-- aqui entra o menu de responder e apagar -->
        </div>

          <span class="msg-title-top" v-if="!message.fromMe">
            <small>
              {{message.sender?.name || message.sender?.id?.user}}}
              {{message?.sender?.pushname}}
            </small>
          </span>
        <div class="message-content" v-bind:class="{ 'left': isMe== true, 'warning': isWarning==true}">
            <div class="image-container" v-if="message.type === 'video'">
                <video :src="'data:image/png;base64'+ message.body" controls />
                <div class="download" style="display: display" @click="onClickDownload('video')" />
            </div>
            <div class="image-container" v-if="message.mimetype === 'image/jpeg'">
                <img :src="getImageSrc" :alt="message.caption" @click="handleOpenModalImage" />
                <div class="download" style="display: display" @click="onClickDownload('image')"/>
            </div>
            <div class="document-component" v-if="message.type === 'document'" v-bind:class="{ 'left': isMe== true, 'warning': isWarning==true}" @click="onClickDownload('document', {mimetype: message.mimetype, filename: message.filename, mediadata: message.mediadata,})">
              <p>{{message.filename}}</p>
            </div>
            <AudioComponent v-if="message.type === 'ptt'"
              :url="audioUrl"
              :isMe="message.fromMe"
              :profileImage="!message?.sender?.profilePicThumbObj?.eurl
                  ? defaultImage
                  : message?.sender?.profilePicThumbObj?.eurl"
              @downloadAudio="onClickDownload"
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
import {login} from '../services/auth'
import router from '../router/index'
import axios from 'axios'


//Assets
import {useStore} from '../stores/dataStore'

    export default {
        props: ['isMe', 'isWarning', 'session', 'token','message'],
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
                if (m.type === "revoked") return `${sender} apagou mensagem`;
                if (m.type === "gp2") {
                    let users = [];
                    if (m.recipients && Array.isArray(m.recipients)) {
                    users = m.recipients.reduce(
                        (c, acc, i) => c + (i > 0 ? ", " : "") + acc.user,
                        ""
                    );
                    }
                    if (m.subtype === "leave") return `${m?.recipients[0]?.user} saiu`;
                    if (m.subtype === "remove") return `${sender} removeu \n${users}`;
                    if (m.subtype === "add") return `${sender} adicionou \n${users}`;
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
                return `data:${this.message.mimetype};base64,${this.message.body}`
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
    background-image: url("");
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
    width: 80px;
    height: 80px;
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

.message-content .document-component svg {
    color: #909090;
    border-radius: 50%;
    border: 1px solid black;
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
      
      