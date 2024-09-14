 <script>
export default {
  name: "ScrollTop",
  data() {
    return {
      isVisible: false,
    };
  },
  methods: {
    handleScroll() {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
     // const scrollTop = window.scrollY || document.documentElement.scrollTop;

      // Показываем кнопку только если есть скролл и прокручено более 100px
    
      this.isVisible = (scrollHeight > clientHeight) && (scrollTop > 900);
    
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
    // Вызываем handleScroll сразу после монтирования, чтобы учесть начальное состояние
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
    v-show="isVisible"
    @click="scrollToTop"
    class="scroll-element mt-lg-6 mb-3 mx-4 d-flex justify-content-center align-items-center"
  >
    <img src="/arrow.svg" width="32" height="32" alt="Scroll to top">
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
 
