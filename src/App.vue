<template > 
  <div v-if="token">
    <adminlte />
  </div>
  <div v-else>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Cookies from 'js-cookie';
import adminlte from './views/adminlte/adminlte.vue';
// import another from './another.vue';
const token = Cookies.get('token');

const items = ref([])


if (Cookies.get('type_user') == 'true') {
    items.value.push({
        label: 'Clientes',
        link: '/customers',
        icon: 'fas fa-user-tag'
    })
    items.value.push({
        label: 'Rifas',
        link: '/raffles',
        icon: 'fas fa-table'
    })
    items.value.push({
        label: 'Boletas',
        link: '#',
        icon: 'fas fa-cogs',
        submenu: [
            { label: 'Boletas disponibles', link: '/tickets/Libre', icon: 'far fa-circle nav-icon' },
            // { label: 'Boletas con abono', link: '/tickets/', icon: 'far fa-circle nav-icon' },
            { label: 'Boletas con abono', link: '/tickets/Reservado', icon: 'far fa-circle nav-icon' },
            { label: 'Boletas pagadas', link: '/tickets/Pagado', icon: 'far fa-circle nav-icon' }
        ]
    })
    items.value.push({
        label: 'Vendedores',
        link: '/sellers',
        icon: 'fas fa-user'
    })
    items.value.push({
        label: 'Promociones',
        link: '/promotions',
        icon: 'fas fa-tags'
    })
    items.value.push({
        label: 'Reportes',
        link: '#',
        icon: 'fas fa-chart-bar',
        submenu: [
            { label: 'Reporte de ventas', link: '/reports/sales', icon: 'far fa-circle nav-icon' },
            { label: 'Reporte de boletas', link: '/reports/tickets', icon: 'far fa-circle nav-icon' },
            { label: 'Reporte de vendedores', link: '/reports/sellers', icon: 'far fa-circle nav-icon' }
        ]
    })

} else {
    items.value.push({
        name: 'Clientes',
        link: '/customers',
        icon: 'fas fa-user-tag'
    })
    items.value.push({
        name: 'Boletas',
        link: '#',
        icon: 'fas fa-cogs',
        submenu: [
            { name: 'Boletas disponibles', link: '/tickets/Libre', icon: 'far fa-circle nav-icon' },
            // { name: 'Boletas con abono', link: '/tickets/', icon: 'far fa-circle nav-icon' },
            { name: 'Boletas con abono', link: '/tickets/Reservado', icon: 'far fa-circle nav-icon' },
            { name: 'Boletas pagadas', link: '/tickets/Pagado', icon: 'far fa-circle nav-icon' }
        ]
    })
}

</script>