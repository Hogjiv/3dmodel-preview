<script>
import progressBar from "../components/progressBar.vue";
import checkBox from "../components/checkBox.vue";
import faqPage from "../components/faqPage.vue";
import footerComponent from "../components/footerComponent.vue";
import cardComponent from "../components/cardComponent.vue";
import scrollTop from "../components/scrollTop.vue";

export default {
  data() {
    return {
      showProgress: false,
      modelPath: "",
      imagePath: "",
      preview: true,
      showMore: false,
      state2: true,
      softScan: false,
      hardScan: true,
      faqOpen: false,
      showMessage: false,
      disabled: false,
      btnActive: false,
      btnDisabled: false,
      scrollTop: false,
    };
  },

  created() {
    this.$store.dispatch("electronConnect");
  },
  computed: {
    selectedScan: {
      get() {
        return this.softScan ? "soft" : "hard";
      },
      set(value) {
        this.softScan = value === "soft";
        this.hardScan = value === "hard";
      },
    },
    pageLength() {},
  },

  components: {
    footerComponent,
    cardComponent,
    faqPage,
    progressBar,
    checkBox,
    scrollTop,
  },
  watch: {
    "$store.state.scriptRunning"(newVal) {
      if (newVal === false) {
        console.log("UI::watcher active. Waching the state of scriptRunning");
        this.showMessage = true;
      }
    },
  },
  methods: {
    btnClosed() {
      console.log("BTNCLOSED from other comp");
      this.faqOpen = false;
    },

    btnClicked() {
      this.btnActive = true;
      this.btnDisabled = false;

      // checking if fields are correct
      // if (!this.isButtonDisabled()) {
      //   console.log("fields are correct");
      //   this.btnActive = true;
      //   this.btnDisabled = false;
      // } else {

      //   setTimeout(() => {

      //     console.log("!!!ask new notification!!!!");
      //     const payload = {
      //       message: `Copy path from PC which looks like 'D/: ....'`,
      //       type: "notification",
      //     };

      //     this.$store.dispatch("notificationVisible", payload);

      //     this.btnDisabled = true;
      //     this.btnActive = false;
      //   }, 3);
      //   console.log("ERROR");
      // }
      // this.$store.dispatch("notificationVisible", {
      //   message: " Copy path from PC which looks like 'D/: ....",
      //   type: "notification",
      // });

      // check if showProgress is active
      if (this.btnActive === true) {
        this.makePreview();
        console.log("btnActive = true");
        this.showProgress = !this.showProgress;
      } else {
        console.log("ELSE");
      }
    },
    isButtonDisabled() {
      // UNCOMMMENT for Windows!
      // const modelPathValid =
      //   this.modelPath.trim() && /^[A-Z]\W+.*$/gm.test(this.modelPath);
      // const imagePathValid =
      //   this.imagePath.trim() && /^[A-Z]\W+.*$/gm.test(this.imagePath);
      // return !modelPathValid || !imagePathValid;
    },

    makePreview() {
      console.log("UI:: dispatch makePreview"),
        this.$store.dispatch("makePreview", {
          modelPath: this.modelPath,
          imagePath: this.imagePath,
          softScan: this.softScan,
          hardScan: this.hardScan,
        });
      console.log(
        "UI::modelpath = ",
        this.modelPath,
        "UI::imgPath = ",
        this.imagePath,
        "UI::softscan = ",
        this.softScan,
        "UI::hardscan = ",
        this.hardScan
      );
    },
  },
};
</script>

<template>
  <div class="header d-flex justify-content-center align-items-center">
    <h2 class="bold-text text-uppercase">Preview maker2</h2>
  </div> 

  <scrollTop
    v-if="!showProgress && btnActive"
    :showProgress="showProgress"
  ></scrollTop>

  <div v-if="faqOpen">
    <div
      class="modal d-flex"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <faqPage @btnClosed="btnClosed"> </faqPage>
    </div>
  </div>

  <div class="d-flex flex-column">
    <div class="fluid-container d-flex flex-row">
      <div
        class="container-lg d-flex flex-column justify-content-center align-items-center"
      >
        <div
          class="container-lg d-flex flex-row justify-content-center align-items-center menu"
        >
          <div class="row col-12 d-flex justify-content-center">
            <!-- buttons Hard and Soft -->
            <div
              class="d-flex flex-column col-lg-2 col-md-12 col-sm-12 col-12 justify-content-center align-items-center mt-3 mb-3 order-lg-1 order-sm-2 order-2 mt-4 mt-md-4 mt-lg-0"
            >
              <div class="d-flex mb-3 mb-md-3 mb-lg-3">
                <checkBox v-model="selectedScan" name="scanType" value="soft" />
                <p class="font-size-16 mx-2">Soft scan</p>
              </div>
              <div class="d-flex">
                <checkBox v-model="selectedScan" name="scanType" value="hard" />
                <p class="font-size-16 mx-1">Hard scan</p>
              </div>
            </div>

            <!-- buttons for insert path -->
            <div
              class="d-flex cc flex-column justify-content-center align-items-center col-lg-8 col-md-12 col-sm-12 col-12 order-lg-2 order-sm-1 order-1"
            >
              <input
                type="text"
                v-model="modelPath"
                class="input-form"
                @input="saveDataModel"
                placeholder="Path for load models"
              />
              <input
                type="text"
                v-model="imagePath"
                class="input-form mt-3"
                @input="saveDataImage"
                placeholder="Path for save image"
              />
            </div>

            <!-- FAQ block -->

            <div
              class="d-flex flex-column col-md col-lg-2 col-sm-6 align-items-center align-self-center justify-content-center order-lg-3 order-sm-3 order-3 mt-4 mt-md-4 mt-lg-0"
            >
              <div>
                <p
                  class="bold-text font-size-32 faq-btn align-items-center justify-content-center d-flex"
                  @click="faqOpen = !faqOpen"
                >
                  FAQ
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- main container -->
        <div class="d-flex flex-column w-100">
        
          <!-- Big Btn block -->
          <div class="d-flex justify-content-center align-items-center">
            <button
              class="big-btn mt-3 col-12 align-items-center"
              :class="{
                btnActive: btnActive && $store.state.scriptRunning,
                btnDisabled: !$store.state.scriptRunning,
              }"
              @click="btnClicked"
            >
              <p
                class="bold-text font-size-22 text-white text-center btnDisables"
              >
                {{
                  btnActive && $store.state.scriptRunning
                    ? "Running!"
                    : "Make previews!"
                }}
              </p>
            </button>
          </div>

          <div v-if="btnActive" class="yy container w-100">
            <!-- Show progress => show less BTN -->
            <div
              class="d-flex col-12 justify-content-center align-items-center"
            >
              <button
                class="big-btn mt-3"
                @click="showProgress = !showProgress"
              >
                <p class="bold-text font-size-22 font-color-dark text-center">
                  <span v-if="showProgress" class="text-white">
                    Show Progress
                  </span>
                  <span v-else class="text-white"> Show less </span>
                </p>
              </button>
            </div>

            <div v-if="!showProgress" class="preview-window p-3">
              <!-- show progress status -->
              <div v-if="$store.state.scriptRunning">
                <progressBar> </progressBar>
              </div>
              <h2
                v-if="!$store.state.scriptRunning"
                class="justify-content-center align-items-center text-center my-4 bold-text font-size-24 font-color-pink text-uppercase"
              >
                Finish!
              </h2>
              <cardComponent> </cardComponent>
              　
            </div>
          </div>
        </div>
      </div>
    </div>
    　 <footerComponent class="footer"> </footerComponent>　
  </div>
</template>

<style>
.faq-btn {
  cursor: pointer;
  border: #888888 2px solid;
  border-radius: 8px;
  width: 100px;
  height: 100px;
}
.faq-btn:hover {
  background-color: #9a9a9a;
}

.footer {
  position: relative;
  bottom: 0px;
}

.modal {
  background-color: rgba(0, 0, 0, 0.359);
}

@keyframes slideIn {
  from {
    transform: translateX(-20%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.btn-faq {
  width: 80px;
  height: 80px;
  background-color: white;
}

.btn-faq:hover,
btn-faq:active {
  background-color: #c97191;
}

.preview-window {
  background-color: #f1f1f1;
  min-width: 350px;
  margin-top: 10px;
  padding-top: 10px;
  margin-bottom: 40px;
  padding-bottom: 60px;
  border-radius: 20px;
  box-shadow: 0px 2px 5px 0px rgba(3, 2, 2, 0.25);
}

containter {
  padding: 0px 0px 0px 0px;
}

p {
  margin: 0px !important;
  margin-bottom: 0px !important;
}

.header {
  background-color: #f1f1f1;
  height: 70px;
  border-bottom: #b3b3b3 2px solid;
  border-top: #b3b3b3 2px solid;
  box-shadow: 0px 4px 7px 0px rgba(145, 145, 145, 0.25);
}

.menu {
  padding: 30px 0px 30px 0px;
}

.btn:disabled {
  background-color: #ffffffda;
  border: 1mm solid #484848;
}

.input-form {
  width: 430px;
  height: 50px;
  background-color: #f0eef0;
  border-radius: 20px;
  border-style: none;
  outline: none;
}

input {
  text-align: center;
}

.btn:hover p {
  color: #ffffff;
}

.big-btn {
  outline: none;
  border: none;
  width: 210px !important;
  height: 75px !important;
  border-radius: 20px;
  background-color: #bcbcbc;
}

.btnActive {
  background-color: #c97191;
  background-size: 200% 100%;
  background-image: linear-gradient(
    to right,
    #de93af 0%,
    #a97ec2 25%,
    #de93af 50%,
    #a97ec2 75%,
    #de93af 100%
  );
  transition: background-position 1s linear;
  animation: gradientAnimation 6s linear infinite;
}

.btnDisabled {
  background-color: #ffffffda;
  color: #484848 !important;
  background-color: #c8c8c8 !important;
  position: relative;
  transition: all 0.02s ease;
}

.btnDisabled:hover {
  background-color: #ffffffda;
  color: #1c1c1c !important;
  background-color: #c97191 !important;
}

.btnDisabled:active {
  background-color: #a0a0a0 !important;
  animation: error-blink 0.24s linear;
}

@keyframes gradientAnimation {
  0% {
    background-position: 100% 0%;
  }

  100% {
    background-position: -100% 0%;
  }
}

@keyframes error-blink {
  0%,
  20%,
  40%,
  60%,
  80% {
    transform: translateX(-5px);
  }

  0%,
  10%,
  30%,
  50%,
  70% {
    transform: translateX(5px);
  }

  100% {
    transform: translateX(0);
  }
}

@keyframes btnDisabled1 {
  0% {
    left: 0;
  }

  50% {
    left: 194px;
  }

  100% {
    left: 0;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    display: none;
  }
}
</style>
