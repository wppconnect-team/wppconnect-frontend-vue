 <template>
    <div @keydown.esc="handleClose">
        <div open="open" aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description" class="modal">
            <div class="paper">
                <div class="imageModal">
                    <header class="top-buttons">
                        <div className="info-user">
                            <img :src="profilePic" />

                            <p>
                                {{nameContact}}
                            </p>
                        </div>

                        <div>
                            <a :href="image" download="image-random" target="_blank" rel="noreferrer">
                                <span class="material-icons">download</span>
                            </a>

                            <span class="material-icons" @click="handleClose">close</span>
                        </div>
                    </header>

                    <div class="image-component">
                        <img :src="image" :alt="message"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { config } from '../config';
import api, {socket} from '../services/api.js'
import {login} from '../services/auth'
import router from '../router/index'
import axios from 'axios'
import {useStore} from '../stores/dataStore'

//Assets

    export default {
        props: ['message', 'image','profilePic','nameContact'],
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
            handleClose(){
                this.$emit('handleClose')
            }

        },
        computed:{
        },
 
    }
</script>
<style scoped>
.imageModal{
    position:fixed;
    top: 50%;
    left: 50%;
    margin-top: -24%; /* Negative half of height. */
    margin-left: -40vh; /* Negative half of width. */
    align-items: center;
    z-index: 1;
    width: 130vh;
    height: 70%;
    background-color: rgb(202, 202, 202);
    border: rgb(100, 6, 61) 1px 2px 2px;
    border-radius:20px;
    box-shadow: black 2px 2px 2px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

header.top-buttons{
  border-bottom: 1px solid rgba(255, 255, 255, .5);
  background-color: rgb(51, 51, 51);
  border-radius: 15px 15px 0px 0px;
  padding: 2em;
  height: 68px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
header.top-buttons .material-icons{
    color: #999;
    margin-left:40px;
    cursor: pointer;
    transition-duration: 200ms;
}
header.top-buttons .material-icons:hover{
      color: #fff;
}
header.top-buttons .info-user{
    display: flex;
    align-items: center;
}
header.top-buttons .info-user p{
      color: #fff;
      font-size: 1.7rem;
      font-weight: 600;
      cursor: default;
}
header.top-buttons .info-user img{
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 15px;
}

.image-component{
    width: 80%;
    height: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
}
.image-component img{
    width: 100%;
    height: 100%;
    object-fit: contain;
}
</style>
      
      