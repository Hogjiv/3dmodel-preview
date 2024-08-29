<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      systemInfo: null,
      userData: null,
      loading: false,
    };
  },
  computed: {
    ...mapState({
      count: (state) => state.count,
      dataFromBackground: (state) => state.dataFromBackground,
      number: (state) => state.number,
    }),
  },
  methods: {
    async fetchAndSetNumber() {
      try {
        const number = await window.ipcRenderer.invoke("setNumberStore");
        this.$store.commit("updateNumber", number);
      } catch (error) {
        console.error("Error fetching number:", error);
      }
    },
    incrementCount() {
      this.$store.dispatch("incrementCount");
    },

    fetchData() {
      this.$store.dispatch("fetchDataFromBackground");
    },
    getSystemInfo() {
      if (window.ipcRenderer) {
        window.ipcRenderer
          .invoke("getSystemInfo")
          .then((info) => {
            this.systemInfo = info;
          })
          .catch(console.error);
      }
    },
    async fetchUserData() {
      this.loading = true;
      try {
        this.userData = await window.ipcRenderer.invoke("getUserData");
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.fetchUserData();
  },
};
</script>
<template>
  <div>
    <div>
      <button @click="fetchAndSetNumber">Set Number222</button>
      <p>Current Number: {{ number }}</p>
    </div>

    <div>
      <p>Count: {{ count }}</p>
      <button @click="incrementCount">Increment</button>
    </div>
    <div>
      <button type="button" @click="getSystemInfo">Get System Info</button>
      <p>{{ systemInfo }}</p>
    </div>
    <div>
      <button @click="fetchData">Fetch Background Data</button>
      <p>Data from Background: {{ dataFromBackground }}</p>
    </div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
