<script>
export default {
  props: {
    modelValue: String, // Это свойство для связи с v-model
    name: String, // Добавляем prop для имени группы радиокнопок
    value: String // Добавляем prop для значения этой кнопки
  },
  emits: ['update:modelValue'], // Это событие для обновления значения
  computed: {
    isChecked() {
      return this.modelValue === this.value;
    }
  },
  methods: {
    onClick() {
      this.$emit('update:modelValue', this.value); // Отправляем значение этой кнопки
    }
  }
};
</script>

<template>
  <div class="d-flex flex-row">
    <div
      class="checkbox d-flex" 
      @click="onClick"
      :style="{ backgroundColor: isChecked ? '#C97191' : '#F0EEF0' }"
    >
      <!-- Текстовый элемент убран -->
    </div>
  </div>
</template>

<style>
.checkbox { 
  width: 28px;
  height: 28px;
  border-radius: 5px;
  background-color: #F0EEF0;
  box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.25);
  cursor: pointer; 
}
</style>