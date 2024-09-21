<script>
export default {
  name: "AlertComponent",
  props: {
    type: {
      type: String,
      default: "notification",
    },
    message: {
      type: String,
      default: "notification-error",
    },
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    getAlertClass() {
      let ret = [];
      if (this.type === "notification-success") {
        ret.push("notification-success");
      } else if (this.type === "notification-error") {
        ret.push("notification-error");
      }
      return ret.join(" ");
    },
    showSuccessIcon() {
      return this.type === "notification";
    }, 
  },
};
</script>

<template>
   
  <div v-if="isVisible" :class="['alert-container', getAlertClass]">
    <div class="alert-body d-flex flex-row">
      <slot name="alert-body"> 
        <p class="text-center text-white d-flex align-items-center">  {{ message }} </p>
         
      </slot>
    </div>
  </div>
</template>

<style scoped>
 
.alert-container {
  width: 100%;
  display: flex; 
  justify-content: center;  
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.5);
}

.notification {
  color: #724c2e;
  border: 1px solid #ee611b;
  border-radius: 5px;
}
.alert-body { 

  background-color: #7e7e7ec7;
  min-width: 300px;
  min-height: 25px;
  position: absolute;
  margin-top: 60px;
  border-radius: 10px;
  padding: 6px;
  animation-name: fadeOut;
  animation-duration: 5s;
  animation-fill-mode: forwards;
  z-index: 2; 
}
</style>
