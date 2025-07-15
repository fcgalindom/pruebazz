<template>
    <label class="form-label" :class="bold === true ? 'text-bold' : ''" >
        <slot>
        </slot>
        <span v-if="required==true" class="text-danger"> (*)</span>
    </label>
</template>

<script lang="ts" setup>
  import { defineProps } from 'vue'

  const props = withDefaults(defineProps<{
    required?: boolean
    bold?: boolean
  }>(), {
    required: true,
    bold: false
  })
</script>

<style>
  .text-bold {
    font-weight: bold;
  }
</style>