
<template>
    <Menubar>
        <template #start>
            <Button class="mr-3" icon="pi pi-bars" @click="visible = true"></Button>
            <span @click="VisibleFilterGeneral = true" class="mr-3" style="cursor: pointer;">Filtro general</span>
            <span @click="visibleCustomer = true" style="cursor: pointer;">Crear cliente</span>
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
    <Drawer v-model:visible="visible" header="Dr. Dentix">
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
                        <Avatar image="/src/assets/customers/dr_denix_logo.png" class="mr-2" shape="circle" />
                        <span class="inline-flex flex-col items-start">
                            <span class="font-bold">{{ Cookies.get('name') }}</span>
                        </span>
                    </button>
                </template>
            </Menu>
        </div>
    </Drawer>


    <Dialog v-model:visible="visibleCustomer" modal header="Crear Cliente" :style="{ width: '50%' }">
        <CustomerForm  @closedialog = "visibleCustomer = false" />
    </Dialog>


    <!-- Filtro General -->
    <Dialog v-model:visible="VisibleFilterGeneral" modal header="Filtro General" :style="{ width: '50%' }">
        <TicketFilter @closeFilter="VisibleFilterGeneral = false" />
    </Dialog>
    <!-- <TicketFilter :visibleDialog="true" /> -->
</template>

<script setup>
import { ref, onMounted } from "vue";
import Cookies from 'js-cookie';
import CustomerForm from '@views/customer/CustomerForm.vue';
import TicketFilter from '@views/ticket/TicketFilter.vue';
import { CustomerServices } from '@/services/customer.service'
import { TicketServices } from '@/services/ticket.service'


const dependencies = ref({
    sellers: [],
    customers: [],
    raffles: []
})

const visible = ref(false);
const visibleCustomer = ref(false);
const VisibleFilterGeneral = ref(false);
const customer = ref({})
const cities = ref([])
const items = ref([])

const filters = ref({
    number: "",
    raffle: "",
    customer: "",
    seller: "",
    init_date: "",
    final_date: ""
})


onMounted(async() => {
    drawMenu()
    cities.value = await CustomerServices.listCities()
    dependencies.value = await TicketServices.dependencies()
    chargeForm()
    
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
                { label: 'Boletas pendientes', link: '/tickets/Pendiente', icon: 'far fa-circle nav-icon' },
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
    
    // items.value.push({
    //         label: 'Filtro general',
    //         link: '/customers',
    //         icon: 'fas fa-user-tag'
    // })
}


// Cliente

const chargeForm = () => {
    customer.value = {
        first_name: "",
        last_name: "",
        document: "",
        phone: "",
        city: ""
    }
}

const listCustomers = async () => {
    customers.value = await CustomerServices.getByDocument(customer.value.document)
  .then(response => {
    if( response.length == 0){
        
 
        customer.value = {
         document: customer.value.document,
         name: "",
         phone: "",
         city: ""
      }
      isDisabled.value = false
        
    }else{
        customer.value = {
        name: response[0].name,
        document: response[0].document,
        phone: response[0].phone,
        city: response[0].city
       
     }
      isDisabled.value = true
    }
  })
  .catch(error => {
    // Manejar el error aquí
    console.error(error);
  });
   
    
   
}  


const saveEntity = async () => {
    customer.value.city = customer.value.city.id

    const customerData =  await CustomerServices.createCustomer(customer.value)
    emit('customerData', customerData)
 
    
    visible.value = false
    Swal.fire({
        title: '¡Éxito!',
        text: 'Datos guardados con Éxito.',
        icon: 'success',
        confirmButtonText: 'Continuar'
    })
   
}

</script>
