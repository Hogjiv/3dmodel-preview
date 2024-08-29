<script>
export default {
  data() {
    return {
      showFaqContent: false,
    };
  },
  emits: ['btnClosed'],
  methods: {
    toggleFaqContent() {
      this.showFaqContent = !this.showFaqContent;
      this.$emit('btnClosed')
      console.log('clicked!!!!')
    },
  },
};
</script>

<template>
  <div v-if="!showFaqContent" class="d-flex flex-row">
    <div class="screen-block">
      <div class="faqContent texts">
        <div class="d-flex flex-row justify-content-between align-items-center mb-3">
          <h3 class="ss ">How to use a script</h3>
          <div class="btn btn-exit align-items-center justify-content-center" @click="toggleFaqContent">
            <img src="../../public/exit.svg"  width="20" height="20" style="fill: white; margin-left: -2px;" />
          </div>
        </div>




        <div class=" ">
          <p class="font-color-pink font-color-pink align-items-center text-center text-uppercase mb-3">
            Take a preview of any model and make your work simpler and faster!
          </p>
          <p>
            1. Choose a directory where you models are <br />
            2. Choose a directory where you want to put previews <br />
            3. If you trying to make preview for first time it's highly
              recommended to check up  <b class="font-color-pink">HARD SCAN  </b> function. It will scan all files in
            choosen directory and save special data for take it again in any
            moment. For example, you will have acsess to preview even when you
            Internet connection doesn't work *
            <br />
            4. Choose  <b class="font-color-pink">SOFT SCAN  </b>if you alredy scaned files before. Choose this
            option,  <b class="font-color-pink"> if you added new models to folder or did some other changes </b>
            (deleted files, added new). This option will rewrite you special file
            and you will have acsess to your refreshed previews <br />
            5. After Soft Scan or Hard scan hase been choosed, push <b class="font-color-pink">  Run Script  button!  </b>
           Try to push "Show progress" now <br />
            6. Now you can see a table with all models, wich was scanned. It
            can take a few time to scan your files and find in on website  **. You can see
            progress in progress bar, located upper of the table <br />
            7. <b class="font-color-pink"> Do not delete scan.JSON file </b> <br />
            * It's not important if you have zip/rar or unarchived files. My
            script will do everything with any state of you files. <br />
            ** Sometimes it can take a lot of time to scan files and find all
            previews on website. Sometimes 3dd doesn't respond correctly and you
            need to reload page and start again, unfortunately.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.ss {

  margin-left: 80px;
}

.pp {
  max-width: 450px;
  height: 100%;
}

.ii {
  background-color: aquamarine;
}

.btn-exit {
  width: 40px;
  height: 40px;
  background-color: #474747;
}

.btn-exit:hover {
  background-color: white;
}

.btn-exit:active {
  background-color: pink !important;
}

.screen-block {
  right: 0px;
  max-width: 450px;
}

.faqContent {

  right: 0px;
  height: 100vh;
  background-color: #474747;
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
