<script>
export default {
  name: "cardComponent",
};
</script>

<template>
  <div class="container w-100">
    <div class="row justify-content-center align-items-center">
      <div
        class="kartochka col-12 m-2  d-flex flex-column align-items-center justify-content-between col-sm-6 col-md-4 col-lg-3"
        v-for="model in $store.state.modelsList"
        :key="model.name"
      > 
        <img class="model-image my-2" v-if="model.image" :src="model.image" />
         
        <p class="font-size-14 font-color-dark medium-text text-center text-wrap">
          {{ model.model }} {{ model.name }}
        </p>
 
        <p class="font-size-14   font-color-pink text-center bold-text text-wrap">
          {{ model.title }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 0;
}
 

.kartochka {
  display: flex;
  flex-direction: column;
  justify-content: center;  
  align-items: center;  
  width: 350px;
  height: 380px;
  min-width: 370px;
  min-height: 370px;
  max-width: 420px;
  max-height: 420px;
  background-color:#dfdfdf;
  border-radius: 15px;
  padding: 10px;
  box-sizing: border-box;
}

.model-image {
  width: 280px;
  height: 280px;
  object-fit: contain; /* Чтобы картинка всегда сохраняла пропорции */
}

p {
  margin: 0;
 
  max-width: 100%; /* Ограничение ширины */
  word-wrap: break-word; /* Перенос длинных слов */
}

.font-size-14 {
  font-size: 14px;
}

.text-wrap {
  white-space: normal;
  word-wrap: break-word;
}
</style>
