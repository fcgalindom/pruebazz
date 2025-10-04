<template>
  <div v-if="token">
    <Drawer />
    <!-- <adminlte /> -->
  </div>
  <div :class="token ? 'container-fluid' : ''">
    <router-view></router-view>
    <!-- Footer -->
    <footer v-if="token" class="app-footer">
      <div class="footer-content">
        <p class="footer-text">Copyright © 2025 casasorteos. Todos los derechos reservados</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import adminlte from './views/adminlte/adminlte.vue';
import Drawer from './Drawer.vue';
import Cookies from 'js-cookie';
const token = Cookies.get('token');

</script>

<style>
/* Footer */
.app-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #1e3a8a;
  /* Color azul similar al de la imagen */
  z-index: 1000;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.footer-content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 20px;
}

.footer-text {
  color: white;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  text-align: center;
}
</style>