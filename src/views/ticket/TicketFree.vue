<template>
    <div>
    
        <Modal :id="modal" label="Registrar" title="Crear Boleta" size="xl">
            <div class="row">
                <div class="col-md-6 mb-3">
                    <Input v-model="ticket.number" type="number" label="Número"></Input>
                </div>
                <div class="col-md-6 mb-3">
                    <Label>Vendedor</Label>
                    <Select2 ref="multiselect" v-model="ticket.seller" :options="dependencies.sellers" :multiple="false" :clear-on-select="true" :preserve-search="true" placeholder="Selecciona" label="name" track-by="id" />
                </div>
                <div class="col-md-6 mb-3">
                    <Label>Cliente (a quien se vende)</Label>
                    <Select2 ref="multiselect" v-model="ticket.customer" :options="dependencies.customers" :multiple="false" :clear-on-select="true" :preserve-search="true" placeholder="Selecciona" label="name" track-by="id" />
                </div>
                <div class="col-md-6 mb-3">
                    <Label>Rifa</Label>
                    <Select2 ref="multiselect" v-model="ticket.raffle" :options="dependencies.raffles" :multiple="false" :clear-on-select="true" :preserve-search="true" placeholder="Selecciona" label="name" track-by="id" />
                </div>
                <div class="col-md-6 mb-3">
                    <Label>Estado de la boleta</Label>
                    <Select2 ref="multiselect" v-model="ticket.status" :options="payment_methods" :multiple="false" :clear-on-select="true" :preserve-search="true" placeholder="Selecciona" track-by="id" />
                </div>
            </div>
    
            <hr>
    
            <div>
                <div class="d-flex justify-content-end">
                    <button class="btn btn-success" @click="add_payment()">+</button>
                </div>
                <div class="row" v-for="(i, index) in ticket.payments" :key="index">
                    <div class="col-4">
                        <Label>Método de pago</Label>
                        <Select2 ref="multiselect" v-model="i.payment_method" :options="payment_methods" :multiple="false" :clear-on-select="true" :preserve-search="true" placeholder="Selecciona" track-by="id" />
                    </div>
                    <div class="col-4">
                        <Input v-model="i.amount" type="text" label="Valor"></Input>
                    </div>
                    <div class="col-4">
                        <div class="row">
                            <div class="col-10">
                                <Input v-model="i.expiration_date" type="date" label="Fecha de expiración"></Input>
                            </div>
                            <div class="col-2">
                                <button class="btn btn-danger mt-4 ml-3" @click="remove_payment(index)">X</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            <div class="d-flex justify-content-center my-3">
                <Button @click="saveEntity">Guardar</Button>
            </div>
        </Modal>
    
        <div class="row">
            <div class="col-md-4">
                <Label>Rifa</Label>
                <Select2 ref="multiselect" v-model="filters.raffle" :options="dependencies.raffles" :multiple="false" :clear-on-select="true" :preserve-search="true" label="name" placeholder="Selecciona" track-by="id" />
            </div>
            <div class="col-md-4">
                <Input required="0" label="Número"></Input>
            </div>
        </div>
        <div class="mt-3 d-flex justify-content-center">
            <Button :disabled="!filters.raffle" @click="search">Buscar</Button>
        </div>
        <div class="container-fluid d-flex justify-content-between mt-3 pb-5">
            <div class="button-grid w-80 grid-buttons-tickets scroll-container" style="grid-template-columns: repeat(10, 1fr);">
                <button :disabled="!filters.raffle" v-for="(button, index) in buttons" :key="index" class="grid-button" data-toggle="modal" :data-target="`#${modal}`" @click="buyTicket(button)">
                  {{ button }}
                </button>
            </div>
            <div>
                <Input class="mb-3" label="Números seleccionados"></Input>
                <Button class="mt-3">Comprar</Button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { TicketServices } from '@/services/ticket.service'

const modal = ref('ticket_modal')

const buttons = ref(Array.from({ length: 999 }, (_, i) => `${i + 1}`));

const payment_methods = ref(['Efectivo', 'Tarjeta de crédito', 'Tarjeta de débito', 'Transferencia', 'Consignación'])
const ticket = ref({})
const filters = ref({
    number: "",
    raffle: ""
})

const dependencies = ref({
    sellers: [],
    customers: [],
    raffles: []
})

onMounted(async () => {
    limpiarFormulario()
    dependencies.value = await TicketServices.dependencies()
})

const search = async () => {
    const filterJson = {
        raffle: filters.value.raffle?.id
    }
    const response = await TicketServices.getTiketsByRaffle(filterJson.raffle)

    if(filters.value.number){
        console.log('response.tickets ==> ', response.tickets);
        
        if(response.tickets.some(ticket => ticket.number == filters.value.number)) {
            buttons.value = [filters.value.number]
        }else {
            buttons.value = [];
        }
    }else {
        buttons.value = [];
        for (let index = response.raffle.start_number; index <= response.raffle.final_number; index++) {
            if (!response.tickets.some(ticket => ticket.number == index)) {
                buttons.value.push(index);
            }
        }
    }
}

const buyTicket = (index) => {
    ticket.value.number = index
    ticket.value.raffle = filters.value.raffle
}

const limpiarFormulario = () => {
    ticket.value = {
        number: "",
        value: "",
        seller: "",
        customer: "",
        raffle: "",
        status: "",
        payments: [{
            payment_method: "",
            amount: "",
            expiration_date: ""
        }]
    }
}
</script>