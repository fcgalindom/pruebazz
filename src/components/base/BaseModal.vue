<template>
  <div
    class="modal fade"
    :id="id"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div :class="'modal-dialog modal-' + size">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">{{ title }}</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
            <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";

// Definir props con valores predeterminados
const props = defineProps({
  id: {
    type: String,
    default: ""
  },
  label: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    default: ""
  },
  size: {
    type: String,
    default: ""
  },
  error: {
    type: Array,
    default: () => []
  }
});

// Definir emit para emitir eventos
const emit = defineEmits(["update:modelValue"]);

// Crear una referencia al elemento de entrada HTML
const input = ref(null);

// Función para actualizar el valor
const updateValue = (event) => {
  const target = event.target;
  emit("update:modelValue", target.value);
};

// Función para limpiar el error (asumiendo que props.error es un array)
const clearError = () => {
  if (Array.isArray(props.error)) {
    props.error.length = 0;
  }
};

// Función para enfocar el input
const focus = () => {
  input.value?.focus();
};
</script>
