<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      isVisible: true,
    };
  },
  computed: {
    ...mapState(["modelsList"]),
    totalReadyModels() {
      const totalModels = this.modelsList.length;
      const readyModels = this.modelsList.reduce((total, model) => {
        return total + (model.ready ? 1 : 0);
      }, 0);

      const notReadyModels = totalModels - readyModels;

      return {
        totalModels,
        readyModels,
        notReadyModels,
      };
    },
    progressBarPersentage() {
      const { totalModels, readyModels } = this.totalReadyModels;
      if (totalModels === 0) return 0; // Предотвращаем деление на ноль
      return (readyModels / totalModels) * 100;
    },
    textToShow() {
      console.log("Progress bar...");
      return this.totalReadyModels.notReadyModels === 0;
    },
  },
};
</script>

<template>
  <div v-if="isVisible">
    <div class="d-flex flex-column justify-content-center align-items-center">
      <p class="bold-text font-size-24 font-color-pink text-uppercase">
        {{ totalReadyModels.notReadyModels }} models from
        {{ totalReadyModels.totalModels }} are not ready
      </p>
      <div class="scale col-md-6 col-lg-6 col-sm-10">
        <div
          class="progress"
          :style="{ width: progressBarPersentage + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>
<style>
.scale {
  background-color: rgb(207, 207, 207);
  border-radius: 18px;
  border: #898989 1px solid;
  height: 17px;
  min-width: 300px;
}
.progress {
 background-color:   #C97191 !important;
  transition: width 0.5s ease-in-out;  
  height: 100% !important;
  border-radius: 18px !important; 
}
</style>
