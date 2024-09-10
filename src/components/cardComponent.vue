<script>
export default {
  name: "cardComponent",
};
</script>

<template>
  <div class="container w-100">
    <div class="row justify-content-center align-items-center">
      <div
        class="kartochka col-12 m-3 align-items-center col-sm-6 col-md-4 col-lg-3"
        v-for="model in $store.state.modelsList"
        :key="model.name"
      >
        <img class="model-image my-3" v-if="model.image" :src="model.image" />
        <p class="font-size-14 font-color-dark medium-text text-center">
          {{ model.name }}
        </p>
        <p class="font-size-14 font-color-pink text-center medium-text">
          {{ model.title }}
        </p>
      </div>
    </div>
  </div>
</template>

<style>
containter {
  padding: 0px 0px 0px 0px;
}
 

.kartochka {
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 350px;
  height: 380px;
  min-width: 350px;
  min-height: 390px;
  max-width: 350px;
  max-height: 380px;
  background-color:#dfdfdf;
  border-radius: 15px;
}
.model-image {
  width: 300px;
  height: 300px;
  object-fit: cover;
}
</style>
