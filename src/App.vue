<template > 
  <div v-if="token">
    <Drawer />
    <!-- <adminlte /> -->
  </div>
<div class="container-fluid">
  <router-view></router-view>
</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import adminlte from './views/adminlte/adminlte.vue';
import Drawer from './Drawer.vue';
import Cookies from 'js-cookie';
const token = Cookies.get('token');

</script>