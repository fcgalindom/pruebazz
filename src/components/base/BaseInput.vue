<template>
  <label :for="id"> {{ label }} <span v-if="required == '1'" class="text-danger">(*)</span> </label>
  <input 
    :disabled="disabled" 
    :type="type" 
    :id="id" 
    maxlength="255" 
    v-on:keyup="clearError" 
    autocomplete="on"
    v-bind="required == '1' ? { required: true } : {}"
    class="form-control ileven-input font-light" 
    :class="[error.length === 0 ? ' ileven-input ' : ' ileven-input-error ']"
    :value="modelValue" 
    :placeholder="placeholder" 
    @input="updateValue" 
    @blur="$emit('blur')" 
    ref="input" 
    v-on="$attrs" />
  <template v-if="error.length">
    <Error class="d-block mt-1" v-for="(item, index) in error" :key="index">{{ item }}</Error>
  </template>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  error?: string[]
  type?: string
  disabled?: boolean
  placeholder?: string
  id?: string
  label?: string
  required?: string
}>(), {
  modelValue: '',
  // @ts-ignore
  error: [],
  type: 'text',
  disabled: false,
  placeholder: '',
  id: '',
  label: '',
  required: '1',
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'blur'): void
}>()

const input = ref<HTMLInputElement | null>(null)

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const clearError = () => {
  props.error.length = 0
}

const focus = () => {
  input.value?.focus()
}


</script>
