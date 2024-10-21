<template>
    <div>
    
        <Modal :id="modal" label="Registrar" title="Crear Boleta" size="xl">
            <div class="row">
                <div class="col-md-6 mb-3">
                    <Input v-model="ticket.number" type="text" label="Número"></Input>
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
                <button :class="{ active: isActive(button) }" :disabled="!filters.raffle" v-for="(button, index) in buttons" :key="index" class="grid-button" @click="buyTicket(button, button)">
                <!-- <button :disabled="!filters.raffle" v-for="(button, index) in buttons" :key="index" class="grid-button" data-toggle="modal" :data-target="`#${modal}`" @click="buyTicket(button)"> -->
                  {{ button }}
                </button>
            </div>
            <div>
                <Input disabled v-model="ticket.number" class="mb-3" label="Números seleccionados"></Input>
                <Button class="mt-3" data-toggle="modal" :data-target="`#${modal}`">Comprar</Button>
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
const ticketNumbers = ref("")
const activeButtons = ref(new Set());
const dependencies = ref({
    sellers: [],
    customers: [],
    raffles: []
})

onMounted(async () => {
    limpiarFormulario()
    dependencies.value = await TicketServices.dependencies()
})

const isActive = (button) => {
  return activeButtons.value.has(button);
}

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

const saveEntity = async () => {

    let value = 0
    ticket.value.payments.forEach(element => {
        value += parseInt(element.amount)
    });

    const form = {
        id: ticket.value.id,
        number: ticket.value.number,
        value: value,
        seller_id: ticket.value.seller?.id,
        customer_id: ticket.value.customer?.id,
        raffle_id: ticket.value.raffle?.id,
        status: ticket.value.status,
        payments: ticket.value.payments
    }
    if (ticket.value.id) {
        await TicketServices.updateCustomer(form, ticket.value.id)
    } else {
        await TicketServices.createCustomer(form)
    }
    document.getElementById('closeModal').click()
    await datatable()
    Swal.fire({
        title: '¡Éxito!',
        text: 'Datos guardados con Éxito.',
        icon: 'success',
        confirmButtonText: 'Continuar'
    })
}

const buyTicket = (index, button) => {
    if (activeButtons.value.has(button)) {
    ticket.value.number = ticket.value.number.filter(num => num !== index)
    activeButtons.value.delete(button);
  } else {
    ticket.value.number.push(index)
    activeButtons.value.add(button);
  }
    ticket.value.raffle = filters.value.raffle
}

// watch(ticket, (newTicket) => {
//   ticketNumbers.value = newTicket.number.join(", ");
// }, { deep: true });

const limpiarFormulario = () => {
    ticket.value = {
        number: [],
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

<style scoped>
/* Estilos específicos para este componente */
/* button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
} */

button.active {
  background-color: #28a745;
}

button:hover {
  background-color: #0056b3;
}
</style>