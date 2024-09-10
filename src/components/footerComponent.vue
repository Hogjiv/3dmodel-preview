<script>
export default {
  name: "footerComponent",
  data() {
    return {
      currentYear: new Date().getFullYear(), // Инициализируем текущий год
    };
  },
};


 

</script>

<template>
  <div class="   font-color-gray   font-size-14 normal-text text-center ">
      Questions to
      <a href="mailto:hogjiv@gmail.com">
        hhyperplace@gmail.com </a> <br>
      donation to PayPal <u> hogjiv01@gmail.com </u> <br>
      Copyright Irina Avdeyeva    <p> {{ currentYear }} </p>

    </div> 
</template>


<style>


 
</style>
