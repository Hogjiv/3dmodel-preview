<script>
export default {
  data() {
    return {
      showFaqContent: false,
    };
  },
  emits: ["btnClosed"],
  methods: {
    toggleFaqContent() {
      this.showFaqContent = !this.showFaqContent;
      this.$emit("btnClosed"); 
    },
    
  },
};
</script>

<template>
  <div v-if="!showFaqContent" class="d-flex flex-row">
      <div class="faqContent texts col-sm-12 col-md-4 col-lg-4">
        <div class="d-flex">

          <div class="btn  " @click="toggleFaqContent" > 
            <img
              src="/close-square.svg"
              width="30"
              height="30"
              style="fill: white"
              class="pic "
            />
          </div>

          <h3
            class="text-center justify-content-center align-items-center d-flex w-100"
          >
            How to use a script
          </h3>
        </div>

        <div>
          <p class="font-color-pink font-color-pink text-uppercase mb-3 m-3">
            Take a preview of any model and make your work simpler and faster!
          </p>
          <p>
            1. Choose the directory with your models. <br />
            2. Choose the directory to save previews. <br />
            3. For the first scan, select
            <b class="font-color-pink">HARD SCAN</b>. This option scans all
            files and saves data for offline access, even without Internet.
            <br />
            4. Use <b class="font-color-pink">SOFT SCAN</b> if you've scanned
            before or made changes (e.g., added or deleted files). It will
            update the data file for accurate previews. <br />
            5. After selecting Hard or Soft Scan, click the
            <b class="font-color-pink">Run Script</b> button. Check progress
            using "Show progress". <br />
            6. A table of scanned models will appear. Scanning may take time,
            and progress is shown in the progress bar above the table. <br />
            7. <b class="font-color-pink"> Do not delete the scan.JSON file in your folder.</b>
            <br />
            <p class="mt-3"> 
            * Supports both archived and unarchived files. <br />
            ** Sometimes scans take longer if the site doesn't respond well; you
            might need to reload and try again.
          </p>
          </p>
        </div>
      </div> 
  </div>
</template>

<style>
.pic {
  right: 10px !important;
  top: 10px !important;
  position: absolute;
  fill: white;
}
 
 
.pp {
  max-width: 450px;
  height: 100%;
}

.ii {
  background-color: aquamarine;
}
 
/* .screen-block
{
  background-color: rgba(0, 0, 0, 0.359);
  height: 100vh;
  width: 100vw;
}  */

/* .screen-block {
  right: 0px;
  max-width: 450px;
} */

.faqContent {
  position: absolute;
  right: 0px;
  height: 100vh;
  width: 450px;
  background-color: #303030;
  color: white;
  overflow-y: auto;
  animation: anim 1s ease-in-out;
}

@keyframes anim {
  from {
    transform: translateY(-100%);
    /* Сдвигаем блок за пределы экрана справа */
  }

  to {
    transform: translateY(0);
    /* Сдвигаем блок обратно, чтобы он оказался видимым */
  }
}

.texts {
  padding: 10px 30px 10px 30px;
  /* Добавьте отступы сюда в формате: верх право низ лево */
}
</style>
