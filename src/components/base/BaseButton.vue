<template>
  <button type="button" @click="handleClick" class="btn stf-btn d-flex justify-content-center align-items-center font-bold" variant="outlined">
    <slot></slot>
</button>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  (event: 'click'): void
}>()

const handleClick = (event: MouseEvent) => {
  // @ts-ignore
  emit('click', event)
}
</script>

<style>
.stf-btn {
  border-radius: 18px !important;
  min-width: 13.5em !important;
  background-color: #343a40 !important;
  /* background-color: #007E76 !important; */
  color: white !important;
  padding-top: 2px !important;
  padding-bottom: 2px !important;
}
</style>