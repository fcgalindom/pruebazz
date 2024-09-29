<template>
    <span class="text-danger">
      <b>*
        <slot></slot>
      </b>
    </span>
  </template>
  
  <script lang="ts" setup>
  import { defineProps } from 'vue'
  
  // Define props if needed in the future
  const props = defineProps({})
  </script>