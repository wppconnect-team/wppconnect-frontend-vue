 <template>
        <div class="audio">
            <div class="audio-player" :data-url="url" ref="audioPlayer" v-bind:class="{ 'isMe': isMe== true}" :isMe="isMe">
                <div class="player">
                    <button type="button" class="btn-play play-button" @click="checkIsDownloaded">
                        <span class="material-icons icon-play">play_arrow</span>
                        <span class="material-icons icon-pause">pause</span>
                        <span class="material-icons icon-loop">loop</span>
                    </button>

                    <div class="timeline">
                        <div class="line">
                            <input dir="ltr" type="range" min="0" max="100" value="0" ref="sliderRef"
                                   @input="handleSlider"/>
                        </div>
                        <div class="data">
                            <div class="current-time"/>
                            <div class="time">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="user" v-bind:class="{ 'isMe': isMe== true}">
                    <img :src="profileImage" alt="ProfileImg"/>
                    <span class="material-icons">mic</span>
                </div>
            </div>
        </div>
</template>
<script>
import { config } from '../config';
import api, {socket} from '../services/api.js'
import {getSession, getToken} from '../services/auth'
import configHeader from '../util/sessionHeader';
import {login} from '../services/auth'
import router from '../router/index'
import axios from 'axios'
import {useStore} from '../stores/dataStore'

//Assets

    export default {
        props: ['url', 'isMe','profileImage','contact','message'],
        async mounted(){
            const onLoad = () => {
                this.setAudio();
            }
            onLoad();
        },
        setup(){
            const data = useStore()

            return { data }
        },
        data() {
            return {
                audio: null,
            }
        },
        methods: {
            setAudio(){
                this.audio = new Audio('');
            },
            async checkIsDownloaded() {
                if (this.audio.src.includes('/chat')) {
                    await api.get(`${getSession()}/get-media-by-message/${this.message.id}`,configHeader())
                    .then((result)=>{
                        this.audio = new Audio('data:audio/ogg;base64,'+result.data.base64);
                        setTimeout(()=> {
                            this.start()
                        },200)
                    })
                } else {
                    this.start();
                }
            },
            start() {
                this.onClickPlay();
                this.audio.onloadstart = () => {
                    this.$refs.audioPlayer.classList.add("loading");
                    this.setMessageDate();
                };

                this.audio.onplay = () => this.$refs.audioPlayer.classList.add("playing");
                this.audio.onpause = () => this.$refs.audioPlayer.classList.remove("playing");
                this.audio.onloadeddata = () => this.$refs.audioPlayer.classList.remove("loading");
                this.audio.ondurationchange = this.showTimeDuration();
                this.audio.onended = () => (this.audio.currentTime = 0);
                this.audio.ontimeupdate = () => {
                    const {currentTime} = this.audio;
                    const currentTimeDisplay = this.formatTimeToDisplay(currentTime);
                    this.updateCurrentTimeDisplay(currentTimeDisplay);
                    this.updateCurrentPercent();
                    if (currentTime === 0) {
                       this.showTimeDuration();
                    }
                };
            },
            onClickPlay() {
                this.audio.paused ? this.audio.play() : this.audio.pause();
            },
            formatTimeToDisplay(seconds) {
                var milliseconds = seconds * 1000;
                return new Date(milliseconds).toISOString().substr(14, 5);
            },

            setMessageDate() {
                let currentDateTime = new Date().toISOString().substr(11, 5);
                this.$refs.audioPlayer.style.setProperty(
                    "--player-current-date-time",
                    `'${currentDateTime}'`
                );
            },
            handleSlider(e) {
                const {duration} = this.audio;
                const percent = e.target.value;
                const currentTimeInSeconds = ((percent * duration) / 100).toFixed(2);
                this.audio.currentTime = currentTimeInSeconds;
            },

            showTimeDuration() {
                const {duration = 0} = this.audio;
                const durationDisplay = this.formatTimeToDisplay(duration);
                this.updateCurrentTimeDisplay(durationDisplay);
            },

            updateCurrentTimeDisplay(time) {
                this.$refs.audioPlayer.style.setProperty("--player-current-time", `'${time}'`);
            },

            updateCurrentPercent() {
                const {currentTime, duration} = this.audio;
                const percentPlayed = (currentTime * 100) / duration;
                this.$refs.sliderRef.value = percentPlayed;
                this.$refs.audioPlayer.style.setProperty(
                    "--player-percent-played",
                    `${percentPlayed}%`
                );
            }
        },
        computed:{
        },
 
    }
</script>
<style scoped>
:root{
    --bg-color: #1b1b22;
    --green: #00e5c0;
    --body-font-family: "Jost", sans-serif;
    --player-color-featured: #00e5c0;
    --player-color-background: #262d31;
    --player-color-text: #c5c6c8;
    --player-percent-played: 0;
    --player-current-time: "00:00";
    --player-current-date-time: "00:00";
}
@keyframes load {
    to {
        transform: rotate(360deg);
    }
}
.audio{
  width: 100%;
}
.audio .audio-player .player .btn-play span:not(.icon-play),
.audio .audio-player.playing .player .btn-play span:not(.icon-pause),
.audio .audio-player.loading .player .btn-play span:not(.icon-loop) {
    display: none;
}
.audio .audio-player.playing .player .btn-play .icon-pause {
    display: inline-block;
}

.audio-player{
  background: var(--player-color-background);
  display: inline-flex;
  flex-direction: row-reverse;
  min-width: 240px;
  width: 336px;
  max-width: 100%;
  border-radius: 0.4rem;
  padding: 0.4rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  user-select: none;
 margin-top: 1rem;
}
.isMe{
    flex-direction: row;
}
.audio-player .loading{

}
.audio-player .loading .player{

}
.audio-player .loading .player .btn-play {
    pointer-events: none;
}
.audio-player .loading .player .btn-play span {
    animation: load 1s linear infinite;
}
.audio-player .loading .player .btn-play span:not(.icon-loop) {
    display: none;
}
.audio-player .loading .player .btn-play .icon-loop {
    display: inline-block;
}
.audio-player {
    --player-color-background: #dddddd;
}
.audio-player .user{
      margin-left: 0;
}
.audio-player .user span{
    right: 0;
    left: auto;
    transform: translateX(50%);
}
.user.isMe img{
    display:none;
}
.audio-player .player{
      margin-right: 0.8rem;
}
.audio-player .player .btn-play{
        padding: 0 0.8rem;
}
.player{
  flex: 1;
  display: flex;
}

.btn-play{
  outline: none;
  appearance: none;
  cursor: pointer;
  background: none;
  border: 0;
  padding: 0 0.8rem 0 0.4rem;
}
.btn-play:disabled{
    cursor: default;
}
.btn-play span{
    color: var(--player-color-text);
    font-size: 38px;
    opacity: 0.8;
}
.btn-play span:not(.icon-play){
      display: none;
}
.timeline{

  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  padding-bottom: 0.2rem;
}
.timeline .line{
    --line-height: 0.24rem;
    flex: 1;
    display: flex;
    align-items: center;
    position: relative;
}
.timeline .line:before{
      content: "";
      width: var(--player-percent-played);
      position: absolute;
      background: var(--player-color-featured);
      height: var(--line-height);
      border-radius: calc(var(--line-height) / 2);
}
.timeline .line input[type="range"]{
      flex: 1;
      all: unset;
      appearance: none;
      background: rgba(0, 0, 0, .3);
      border: none;
      outline: none;
      width: 100%;
      position: relative;
}
.timeline .line input[type="range"]::-webkit-slider-thumb{
        appearance: none;
        background: #999;
        width: 0.9rem;
        height: 0.9rem;
        border-radius: 50%;
        margin-top: calc(var(--line-height) * -1.4);
}
.timeline .line input[type="range"]::-moz-range-thumb{
        unset: all;
        appearance: none;
        border: 0;
        background: #286cc1;
        width: 0.9rem;
        height: 0.9rem;
        border-radius: 50%;
        margin-top: calc(var(--line-height) * -1.4);
}
.timeline .line input[type="range"]::-ms-thumb{
        appearance: none;
        background: var(--player-color-featured);
        width: 0.9rem;
        height: 0.9rem;
        border-radius: 50%;
        margin-top: calc(var(--line-height) * -1.4);
}
.timeline .line input[type="range"]::-webkit-slider-runnable-track{
        background: rgba(255, 255, 255, 0.2);
        height: var(--line-height);
        border-radius: calc(var(--line-height) / 2);
}
.timeline .line input[type="range"]::-moz-range-track{
        background: rgb(182, 205, 179);
        height: var(--line-height);
        border-radius: calc(var(--line-height) / 2);
}
.timeline .line input[type="range"]::-ms-track{
        background: rgba(255, 255, 255, 0.2);
        height: var(--line-height);
        border-radius: calc(var(--line-height) / 2);
}
.timeline .data{
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.68rem;
    color: var(--player-color-text);
    position: absolute;
    width: 100%;
    bottom: 0;
}
.timeline .data .current-time{
      font-size: 1rem;
}
.timeline .data .current-time::before{
        content: var(--player-current-time);
}
.timeline .data .time{
      display: flex;
      align-items: center;
}
.timeline .data .time::before{
        content: var(--player-current-date-time);
}
.timeline .data .time span{
        font-size: 1rem;
        margin-left: 0.4rem;
        color: var(--player-color-featured);
}

.user{
  position: relative;
  width: 55px;
  height: 55px;
  margin-left: 10px;
}
.user .isMe{
    margin-left:1.4rem;;
}
.user img{
    width: 55px;
    height: 55px;
    border-radius: 50%;
    object-fit: cover;
    background: rgba(255, 255, 255, 0.01);
}
.user span{
    position: absolute;
    left: 10px;
    bottom: 0;
    color: var(--player-color-featured);
    transform: translateX(-50%);
    font-size: 2.5rem;
    text-shadow: -1px -1px 0 var(--player-color-background), 1px -1px 0 var(--player-color-background), -1px 1px 0 var(--player-color-background), 1px 1px 0 var(--player-color-background);
}
</style>
      
      