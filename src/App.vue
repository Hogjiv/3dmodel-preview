<script lang="ts">
import { defineComponent } from 'vue';
import NotificationManager from './components/NotificationManager.vue';
import ScriptUi from './views/scriptUi.vue';

export default defineComponent({
  components: {
    NotificationManager,
    ScriptUi
  }
});
</script>
<template>
  <NotificationManager />
  <ScriptUi />
</template>
<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;900&display=swap");
</style>
