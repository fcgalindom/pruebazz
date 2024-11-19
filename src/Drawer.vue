
<template>
    <Menubar :model="items">
        <template #submenulabel="{ item }">
                <span class="text-primary font-bold">{{ item.label }}</span>
            </template>
            <template #item="{ item, props }">
                <router-link v-if="item.link" :to="item.link">
                    <a v-ripple class="flex items-center" v-bind="props.action">
                        <span :class="item.icon" />
                        <span>{{ item.label }}</span>
                        <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
                        <span v-if="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>
                        <i v-if="item.items" :class="['pi pi-angle-down ml-auto', { 'pi-angle-down': root, 'pi-angle-right': !root }]"></i>
                    </a>
                </router-link>
            </template>
            <template #end>
                <button v-ripple class="relative overflow-hidden w-full border-0 bg-transparent flex items-start p-2 pl-4 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-none cursor-pointer transition-colors duration-200">
                    <Avatar image="/src/assets/customers/dr_denix_logo.png" class="mr-2" shape="circle" />
                    <span class="inline-flex flex-col items-start">
                        <span class="font-bold">{{ Cookies.get('name') }}</span>
                    </span>
                </button>
            </template>
    </Menubar>
    <!-- <Drawer v-model:visible="visible" header="Dr. Dentix">
    <div class="d-flex justify-content-center">
        <Menu :model="items" class="w-100 md:w-60">
            <template #submenulabel="{ item }">
                <span class="text-primary font-bold">{{ item.label }}</span>
            </template>
            <template #item="{ item, props }">
                <router-link v-if="item.link" :to="item.link">
                    <a v-ripple class="flex items-center" v-bind="props.action">
                        <span :class="item.icon" />
                        <span>{{ item.label }}</span>
                        <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
                        <span v-if="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>
                    </a>
                </router-link>
            </template>
            <template #end>
                <button v-ripple class="relative overflow-hidden w-full border-0 bg-transparent flex items-start p-2 pl-4 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-none cursor-pointer transition-colors duration-200">
                    <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" class="mr-2" shape="circle" />
                    <span class="inline-flex flex-col items-start">
                        <span class="font-bold">Amy Elsner</span>
                        <span class="text-sm">Admin</span>
                    </span>
                </button>
            </template>
        </Menu>
    </div>
</Drawer>
<Button icon="pi pi-bars" @click="visible = true" ></Button> -->
</template>

<script setup>
import { ref, onMounted } from "vue";
import Cookies from 'js-cookie';
const visible = ref(false);

const items = ref([])

onMounted(() => {
    drawMenu()
    console.log(Cookies.get('name'));
    
})

const getNameLogged = () => {
    return Cookies.get('name')
}

const drawMenu = () => {
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
            items: [
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
            items: [
                { label: 'Reporte de ventas', link: '/reports/sales', icon: 'far fa-circle nav-icon' },
                { label: 'Reporte de boletas', link: '/reports/tickets', icon: 'far fa-circle nav-icon' },
                { label: 'Reporte de vendedores', link: '/reports/sellers', icon: 'far fa-circle nav-icon' }
            ]
        })
    
    } else {
        items.value.push({
            label: 'Clientes',
            link: '/customers',
            icon: 'fas fa-user-tag'
        })
        items.value.push({
            label: 'Boletas',
            link: '#',
            icon: 'fas fa-cogs',
            items: [
                { label: 'Boletas disponibles', link: '/tickets/Libre', icon: 'far fa-circle nav-icon' },
                // { label: 'Boletas con abono', link: '/tickets/', icon: 'far fa-circle nav-icon' },
                { label: 'Boletas con abono', link: '/tickets/Reservado', icon: 'far fa-circle nav-icon' },
                { label: 'Boletas pagadas', link: '/tickets/Pagado', icon: 'far fa-circle nav-icon' }
            ]
        })
    }
    
    items.value.push({
            label: 'Filtro general',
            link: '/customers',
            icon: 'fas fa-user-tag'
    })
}

</script>
