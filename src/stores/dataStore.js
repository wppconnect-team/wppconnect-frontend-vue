import { defineStore } from 'pinia'
import {api} from '../services/api'
import {socket} from '../services/api'


export const useStore = defineStore('data', {
    state: () => ({
      readyConnection: true,
      darkMode: false,

      chats: [],
      contacts: [],
      config: [],
      
      message: '',
    }),
    
    actions: {
        async getAllContacts(){
        },
        
    },
    getters: {
    }
  })
