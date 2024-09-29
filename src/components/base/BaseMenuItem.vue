<!-- BaseMenuItem.vue -->
<template>
  <li :class="{'nav-item': true, 'has-treeview': hasSubmenu, 'menu-open': isOpen}">
    <a :href="link" class="nav-link" @click="toggleSubmenu">
      <i :class="icon"></i>
      <p>
        {{ name }}
        <i v-if="hasSubmenu" class="right fas fa-angle-left"></i>
      </p>
    </a>
    <ul v-if="hasSubmenu" class="nav nav-treeview">
      <li v-for="(subItem, index) in submenu" :key="index" class="nav-item">
        <a :href="subItem.link" class="nav-link">
          <i :class="subItem.icon"></i>
          <p>{{ subItem.name }}</p>
        </a>
      </li>
    </ul>
  </li>
</template>

<script setup lang="ts">
import { defineProps, ref, watch } from 'vue'

const props = defineProps({
  name: String,
  link: String,
  icon: String,
  submenu: {
    type: Array,
    default: () => []
  }
})

const isOpen = ref(false)

const hasSubmenu = props.submenu.length > 0

const toggleSubmenu = () => {
  if (hasSubmenu) {
    isOpen.value = !isOpen.value
  }
}

// Automatically open the submenu if there are filtered subitems
watch(() => props.submenu, (newSubmenu) => {
  if (newSubmenu.length > 0) {
    isOpen.value = true
  } else {
    isOpen.value = false
  }
})
</script>

<style scoped>
/* Puedes añadir estilos personalizados aquí si es necesario */
</style>