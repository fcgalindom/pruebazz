<template>
	<div class="base-select">
	  <label :for="id">
		{{ label }} <span v-if="required === '1'" class="text-danger">(*)</span>
	  </label>
	  <select
		:id="id"
		:value="modelValue"
		@change="updateValue($event.target.value)"
		@blur="clearError"
		:class="[error.length === 0 ? 'form-control' : 'form-control is-invalid']"
	  >
		<option v-for="option in options" :key="option.value" :value="option.value">
		  {{ option.label }}
		</option>
	  </select>
	  <template v-if="error.length">
		<Error class="d-block mt-1" v-for="(item, index) in error" :key="index">{{ item }}</Error>
	  </template>
	</div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  // Definimos las props
  const props = defineProps({
	modelValue: {
	  type: String,
	  default: ''
	},
	id: {
	  type: String,
	  default: ''
	},
	label: {
	  type: String,
	  default: ''
	},
	options: {
	  type: Array,
	  default: () => []
	},
	error: {
	  type: Array,
	  default: () => []
	},
	required: {
	  type: String,
	  default: '1'
	}
  })
  
  // Emitimos eventos
  const emit = defineEmits(['update:modelValue', 'blur'])
  
  // Actualizamos el valor del select
  const updateValue = (value) => {
	emit('update:modelValue', value)
  }
  
  // Limpiamos el error
  const clearError = () => {
	props.error.length = 0
  }
  </script>
  
  <style scoped>
  .base-select {
	margin-bottom: 1rem;
  
	.is-invalid {
	  border-color: red;
	}
  
	.error-message {
	  color: red;
	  font-size: 0.875rem;
	}
  }
  </style>