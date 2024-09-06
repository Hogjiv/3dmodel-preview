<script>
import { mapState } from "vuex";
import AlertComponent from "./AlertComponent.vue";

export default {
  components: {
    AlertComponent,
  },
  
  computed: {
    ...mapState("notifications", ["notifications"]),
  },
};
</script>

<template> 
    <AlertComponent
      v-for="notification in notifications"
      :key="notification.id"
      :message="notification.message"
      :isVisible="notification.isVisible"
      :type="notification.type"
    />
 
</template>
<style>
.notifications-container { 
  margin-top: 30px; 
  align-items: center;
  z-index: 10;
  width: 300px;
 
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
    
 20% {
    opacity: 0.2;
  }
 80% {
    opacity: 0;
  } 
  100% {
    opacity: 0;
  }
}


</style>