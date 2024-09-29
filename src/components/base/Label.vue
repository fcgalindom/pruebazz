<template>
    <label class="form-label">
        <slot>
        </slot>
        <span v-if="required==true" class="text-danger"> (*)</span>
    </label>
</template>

<script lang="ts" setup>
  import { defineProps } from 'vue'

  const props = withDefaults(defineProps<{
    required?: boolean
  }>(), {
    required: true
  })
</script>
