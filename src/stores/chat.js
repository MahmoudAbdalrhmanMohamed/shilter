// src/stores/chat.js
import { defineStore } from "pinia";
// import pusher from "@/pusher"; // Import the Pusher instance



export const useChatStore = defineStore({
  id: "chat",
  state: () => ({
    messages: [],
  }),
  actions: {
    addMessage(message) {
      this.messages.push(message);
    },
    triggerPusherEvent(eventName, data) {
      const channel = pusher.subscribe(
        `scraping.progress.admin.${localStorage.getItem("id")}`,
      );
      channel.trigger(eventName, data); // Trigger the Pusher event
    },
  },
  created() {
    const channel = pusher.subscribe(
      `scraping.progress.admin.${localStorage.getItem("id")}`,
    );
    channel.bind("progress.one", (data) => {
      this.addMessage(data.message);
    });
  },
});
