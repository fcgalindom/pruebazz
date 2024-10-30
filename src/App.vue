<template > 
  <div v-if="token">
    <adminlte />
  </div>
  <div v-else>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Cookies from 'js-cookie';
import adminlte from './views/adminlte/adminlte.vue';
const token = Cookies.get('token');

</script>