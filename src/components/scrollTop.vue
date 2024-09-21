 <script>
export default {
  name: "ScrollTop",
  data() {
    return {
      scrollVisible: false,
    };
  },
  props: {
    showProgress: {
      type: Boolean,
      required: true,
    },
  }, 
  methods: {
  handleScroll() {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
 
    //console.log('scrollHeight:', scrollHeight, 'clientHeight:', clientHeight, 'scrollTop:', scrollTop, 'showProgress:', this.showProgress);
 
    if (clientHeight < 0) {
      this.scrollVisible = (scrollHeight > clientHeight) && (scrollTop > 0) && !this.showProgress;
    } else {
      this.scrollVisible = false;  
    }
 
    if (scrollTop === 0 && this.showProgress) {
      this.scrollVisible = false;  
    }
 
    //console.log('scrollVisible:', this.scrollVisible);
  },
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  },


  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
},


  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    window.addEventListener("resize", this.handleScroll); 
    this.$nextTick(this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleScroll);
  }
};
</script>

<template>
  <div
    v-show="scrollVisible"
    @click="scrollToTop"
    class="scroll-element mt-lg-6 mb-3 mx-4 d-flex justify-content-center align-self-center align-items-center"
  >
    <img src="/arrow.svg" class="mb-2" width="32" height="32" alt="Scroll to top">
  </div>
</template>

<style scoped>
.scroll-element {
  z-index: 100;
  cursor: pointer !important;
  background-color: rgba(255, 255, 255, 0.459);
  border: #888888 2px solid;
  border-radius: 8px;
  width: 45px;
  height: 45px;
  right: 20px;
  bottom: 20px;
  position: fixed;
}

.scroll-element:hover {
  opacity: 0.8;
}
</style>
 
