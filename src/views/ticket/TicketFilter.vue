<template #container="{ closeCallback }">
    <div class="row">
        
        <div class="col-md-6 mb-3">
            <Label required="0">Cliente</Label>
            <Select optionLabel="name" optionValue="id" filter v-model="filters.customer" :options="dependencies.customers" fluid ></Select>
        </div>
   
       
        <div class="col-md-6 mb-3">
            <Label required="0">Número de Boleta</Label>
            <Input required="0" v-model="filters.number" />
        </div>
       
    </div>
    <div class="d-flex justify-content-center my-3">
        <Button @click="datatable" >Buscar</Button>
    </div>

</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, defineProps, defineEmits  , toRefs} from "vue";
import { CustomerServices } from '@/services/customer.service'
import Swal from 'sweetalert2'
import { TicketServices } from "@/services/ticket.service";
import { inject } from "vue";
import { Button } from 'primevue';
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
})


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
const getvalidate = ref(false)

const datatable = async () => {
    tickets.value = await TicketServices.list(filters.value)
    filtersticket.value = {number: filters.value.number , raffle : 1}
    console.log('filtersticket', filtersticket.value)
    
    getvalidate.value = await TicketServices.getticketbyraffle(filtersticket.value)

    console.log('getvalidate', filters.value.number)

    full_value.value = 0
    tickets.value.forEach(element => {
        full_value.value += parseInt(element.value)
    });
    
    emit('closeFilter', false)
    if(getvalidate.value.exists){
        router.push({ name: 'BookedTickets' });

    }else{
        sessionStorage.setItem('ticket',filters.value.number);

        const currentPath =  window.location.pathname
        if(currentPath == '/tickets/Libre'){
           window.location.reload();
        } 
        router.push({ name: 'TicketFree' });
        
        
    }
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
if(currentPath == '/tickets/Reservado'){
    window.location.reload();
}   



}
</script>