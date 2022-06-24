import { defineStore } from "pinia";

export const useStore = defineStore("data", {
  state: () => ({
    readyConnection: true,
    darkMode: false,

    chats: [],
    contacts: [],
    config: [],

    message: "",
  }),

  actions: {
    async getAllContacts() {},
  },
  getters: {},
});
