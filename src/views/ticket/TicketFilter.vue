<template #container="{ closeCallback }">
    <div class="row">
        <div class="col-md-6 mb-3">
            <Label required="0">Cliente</Label>
            <Select optionLabel="document" optionValue="id" filter v-model="filters.customer" :options="dependencies.customers" fluid ></Select>
        </div>
        <div class="col-md-6 mb-3">
            <Label>Vendedor</Label>
            <Select v-model="filters.seller" :options="dependencies.sellers" filter optionLabel="name" optionValue="id" class="w-100"></Select>
        </div>
        <div class="col-md-3 mb-3">
             <Label required="0">Rifa</Label>
             <Select v-model="filters.raffle" :options="dependencies.raffles" filter optionLabel="name" optionValue="id" class="w-100"></Select>
        </div>
        <div class="col-md-3 mb-3">
            <Label required="0">Número</Label>
            <Input required="0" v-model="filters.number" />
        </div>
        <div class="col-3">
            <Label required="0">Fecha inicial</Label>
            <DatePicker v-model="filters.init_date" showIcon fluid dateFormat="yy-mm-dd" :manualInput="false" @date-select="filters.init_date = Helper.formatDateForm($event)" />
         </div>
        <div class="col-3">
            <Label required="0">Fecha final</Label>
             <DatePicker v-model="filters.final_date" showIcon fluid dateFormat="yy-mm-dd" :manualInput="false" @date-select="filters.final_date = Helper.formatDateForm($event)" />
        </div>
    </div>
    <div class="d-flex justify-content-center my-3">
        <Button @click="datatable" >Guardar</Button>
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
const emit = defineEmits(['customEvent'])
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


const datatable = async () => {


tickets.value = await TicketServices.list(filters.value)
full_value.value = 0
tickets.value.forEach(element => {
    full_value.value += parseInt(element.value)
});
sessionStorage.setItem('tickets', JSON.stringify(tickets.value));
router.push({ name: 'BookedTickets' });
const currentPath =  window.location.pathname
if(currentPath == '/tickets/Reservado'){
    window.location.reload();
} 


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