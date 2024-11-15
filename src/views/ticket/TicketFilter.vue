<template>
    <Modal id="ticket-form" label="Registrar" title="Crear Cliente" size="lg">
        <div class="row">
            <div class="col-md-6 mb-3">
                            <Label>Cliente (a quien se vende)</Label>
                            <Select2 ref="multiselect" v-model="filters.customer" :options="dependencies.customers" :multiple="false" :clear-on-select="true" :preserve-search="true" placeholder="Selecciona" label="document" track-by="id" />
            </div>
            <div class="col-md-6 mb-3">
                <Input v-model="customer.name" :disabled="isDisabled" label="Nombre"></Input>
            </div>
            <div class="col-md-6 mb-3">
                <Input v-model="customer.phone" :disabled="isDisabled" label="Teléfono"></Input>
            </div>
            <div class="col-md-6 mb-3">
                <Input v-model="customer.document" type="number"  label="Numero de Boleta"></Input>
            </div>
        </div>
        <div class="d-flex justify-content-center my-3">
            <Button @click="datatable" >Guardarf</Button>
        </div>
    </Modal>
    
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from "vue";
import { CustomerServices } from '@/services/customer.service'
import Swal from 'sweetalert2'
import { defineEmits } from 'vue'
import { TicketServices } from "@/services/ticket.service";
const router = useRouter();
const customer = ref({})
const cities = ref([])
const customers = ref([])
const isDisabled = ref(false)
const emit = defineEmits(['customEvent'])
const ticket = ref({})
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
    console.log('dependencies ==> ', dependencies.value)    
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
    console.log('filters ==> ', filters.value)
    const filtersForm = {
        number: filters.value.number,
        raffle: filters.value.raffle?.id,
        customer: filters.value.customer?.id,
        seller: filters.value.seller?.id,
        init_date: filters.value.init_date,
        final_date: filters.value.final_date,
        status: status.value
    }

    tickets.value = await TicketServices.list(filtersForm)
    full_value.value = 0
    tickets.value.forEach(element => {
        full_value.value += parseInt(element.value)
    });
    console.log('ticket ==> ', tickets.value)
    router.push({ name: 'BookedTickets', query: tickets.value });
    const currentPath = window.location.pathname; // Ruta después del dominio
    console.log("Path:", currentPath);
    if(currentPath == '/tickets/Reservado'){
        window.location.reload();
    }   
    
}


const saveEntity = async () => {
    datatable()
    console.log('ticket ==> ', tickets.value)
    router.push({ name: 'BookedTickets', query: tickets.value });
    const currentPath = window.location.pathname; // Ruta después del dominio
    console.log("Path:", currentPath);
    if(currentPath == '/tickets/Reservado'){
        window.location.reload();
    }   
    
    
   
}
</script>