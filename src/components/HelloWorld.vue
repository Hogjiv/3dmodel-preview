<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const count = computed(() => store.state.count);
const dataFromBackground = computed(() => store.state.dataFromBackground);

const incrementCount = () => {
  store.dispatch("incrementCount");
};

const fetchData = () => {
  store.dispatch("fetchDataFromBackground");
};

const systemInfo = ref<{
  platform?: string;
  release?: string;
  cpu?: string;
} | null>(null);

const getSystemInfo = () => {
  if (window.ipcRenderer) {
    window.ipcRenderer
      .invoke("getSystemInfo")
      .then((info: { platform: string; release: string; cpu: string }) => {
        systemInfo.value = info;
      })
      .catch(console.error);
  }
};

const userData = ref<{ id: number; name: string; email: string } | null>(null);
const loading = ref(false);

const fetchUserData = async () => {
  loading.value = true;
  try {
    userData.value = await window.ipcRenderer.invoke("getUserData");
  } catch (error) {
    console.error("Error fetching user data:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUserData();
});
</script>

<template>
  <div>
    <button type="button" @click="getSystemInfo">Get System Info</button>
    <p>{{ systemInfo }}</p>

    <div>
      <p>Count: {{ count }}</p>
      <button @click="incrementCount">Increment</button>
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
