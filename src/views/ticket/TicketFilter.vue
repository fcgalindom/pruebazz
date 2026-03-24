<template #container="{ closeCallback }">
    <form @submit.prevent="datatable">
        <div class="row">
    
            <div class="col-12 mb-3">
                <Label required="0">Cliente</Label>
                <Select optionLabel="documentname" optionValue="id" filter v-model="filters.customer"
                    :options="dependencies.customers" fluid>
                </Select>
            </div>
    
    
            <div class="col-12 mb-3">
                <Label required="0">Número de Boleta</Label>
                <BaseInput required="0" v-model="filters.number" />
            </div>
    
        </div>
        <div class="d-flex justify-content-center my-3">
            <Button type="submit">Buscar</Button>
        </div>
    </form>

</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, defineProps, defineEmits, toRefs } from "vue";
import { CustomerServices } from '@/services/customer.service'
import { useFilterStore, useFilterTicket, useFilterCustomer } from '@/stores/filterStore';
import Swal from 'sweetalert2'
import { TicketServices } from "@/services/ticket.service";
import { inject } from "vue";
import { Button } from 'primevue';
import { get } from 'jquery';
import BaseInput from '@/components/base/BaseInput.vue'
const dialogRef = inject('dialogRef');
const closeDialog = () => {
    dialogRef.value.close();
}

const router = useRouter();
const customer = ref({})
const cities = ref([])
const customers = ref([])
const isDisabled = ref(false)
const emit = defineEmits(['customEvent', 'closeFilter']);
const tickets = ref([])
const full_value = ref(0)






onMounted(async () => {
    cities.value = await CustomerServices.listCities()
    chargeForm()
})
const dependencies = ref({
    sellers: [],
    customers: [],
    raffles: []
})
onMounted(async () => {
    dependencies.value = await TicketServices.dependencies()
    dependencies.value.customers = dependencies.value.customers.map((customer) => ({
        ...customer,
        documentname: `${customer.name} - ${customer.document}`,
    }));
})
const filtroStore = useFilterStore();
const fitroticket = useFilterTicket();
const filtrocustomer = useFilterCustomer();






const chargeForm = () => {
    customer.value = {
        first_name: "",
        last_name: "",
        document: "",
        phone: "",
        city: ""
    }
}


const filters = ref({
    number: "",
    raffle: "",
    customer: "",
    seller: "",
    init_date: "",
    final_date: ""
})
const filtersticket = ref({})
const getvalidate = ref({
    exists: false,
    seller: 0
})

const datatable = async () => {

    const currentPath = window.location.pathname
    filtersticket.value = { number: filters.value.number, raffle: 1 }
    getvalidate.value = await TicketServices.getticketbyraffle(filtersticket.value)
    full_value.value = 0
    tickets.value.forEach(element => {
        full_value.value += parseInt(element.value)
    });

    if (getvalidate.value.exists) {
        fitroticket.setFilter(filters.value.number);
        router.push({ name: 'SellerTracking', params: { id: getvalidate.value.seller } })
    }
    else if (filters.value.customer) {
        filtroStore.setFilter(filters.value.customer);

        router.push({ name: 'PendingTickets' })
    }
    else {
        // console.log('getvalidate.value.seller ==> ', );
        
        if(getvalidate.value?.seller_range?.seller) {
            fitroticket.setFilter(filters.value.number);
            router.push({ name: 'SellerTracking', params: { id: getvalidate.value.seller_range.seller } })
        }else {
            sessionStorage.setItem('ticket', filters.value.number);
            if (currentPath == '/tickets/Libre') {
                window.location.reload();
            }
            router.push({ name: 'TicketFree' })
        }

    }
    emit('closeFilter', false)
    /*router.push({ name: 'BookedTickets' });
   const currentPath =  window.location.pathname
   if(currentPath == '/tickets/Reservado'){
       window.location.reload();
   } */
}



const saveEntity = async () => {
    datatable()
    router.push({ name: 'BookedTickets', query: tickets.value });
    const currentPath = window.location.pathname; // Ruta después del dominio
    if (currentPath == '/tickets/Reservado') {
        window.location.reload();
    }



}
</script>