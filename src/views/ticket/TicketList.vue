<template>
    <div>
        <div class="container-fluid pt-3">
            <div class="my-3">
    
                <div class="row mb-3">
                    <div class="col-md-3">
                        <Input v-model="filters.number" label="Número" />
                    </div>
                    <div class="col-md-3">
                        <Label>Rifa</Label>
                        <Select2 ref="multiselect" v-model="filters.raffle" :options="dependencies.raffles" :multiple="false" :clear-on-select="true" :preserve-search="true" placeholder="Selecciona" label="name" track-by="id" />
                    </div>
                    <div class="col-md-3">
                        <Label>Cliente</Label>
                        <Select2 ref="multiselect" v-model="filters.customer" :options="dependencies.customers" :multiple="false" :clear-on-select="true" :preserve-search="true" placeholder="Selecciona" label="name" track-by="id" />
                    </div>
                    <div class="col-md-3">
                        <Label>Vendedor</Label>
                        <Select2 ref="multiselect" v-model="filters.seller" :options="dependencies.sellers" :multiple="false" :clear-on-select="true" :preserve-search="true" placeholder="Selecciona" label="name" track-by="id" />
                    </div>
                </div>
                <div class="d-flex justify-content-center">
                    <Button @click="datatable">Buscar</Button>
                </div>
                <div class="d-flex justify-content-end">
                    <Button :id="`${modal}_button`" data-toggle="modal" :data-target="`#${modal}`" @click="limpiarFormulario">Registrar</Button>
                </div>
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
                            <button class="btn btn-success" @click="add_award()">+</button>
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
                                        <button class="btn btn-danger mt-4 ml-3" @click="remove_award(index)">X</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    <div class="d-flex justify-content-center my-3">
                        <Button @click="saveEntity">Guardar</Button>
                    </div>
                </Modal>
            </div>
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Número</th>
                            <th>Rifa</th>
                            <th>Vendedor</th>
                            <th>Cliente</th>
                            <th>Valor pagado</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(i, index) in tickets" :key="index">
                            <td>#{{i.number}}</td>
                            <td>{{i.raffle.name}}</td>
                            <td>{{i.seller?.name}}</td>
                            <td>{{i.customer.name}}</td>
                            <td>{{i.value}}</td>
                            <td>{{i.status}}</td>
                            <td class="text-center">
                                <div class="d-flex justify-content-between">
                                    <button class="btn text-danger" data-toggle="modal" :data-target="`#${modal}`" @click="showData(i.id)"><i class="fas fa-edit"></i></button>
                                    <button class="btn btn-success btn-sm" style="border-radius: 50%;" @click="changeState(i.id, 'Pagado')"><i class="fas fa-check"></i></button>
                                    <button class="btn btn-danger btn-sm" style="border-radius: 50%;" @click="changeState(i.id, 'Libre')"><i class="fas fa-times"></i></button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { TicketServices } from '@/services/ticket.service'
import { useRoute } from 'vue-router';
import Swal from 'sweetalert2'

const tickets = ref([])
const ticket = ref({})
const modal = ref('ticket_modal')
const payment_methods = ref(['Efectivo', 'Tarjeta de crédito', 'Tarjeta de débito', 'Transferencia', 'Consignación'])
const status_select = ref(['Free', 'Paid', 'Booked'])
const dependencies = ref({
    sellers: [],
    customers: [],
    raffles: []
})

const filters = ref({
    number: "",
    raffle: "",
    customer: "",
    seller: "",
})
const router = useRoute()

const status = computed(() => {
    const path = router.path
    return path.split('/').pop()
})

onMounted(async () => {
    datatable()
    limpiarFormulario()
    dependencies.value = await TicketServices.dependencies()
})

const datatable = async () => {
    const filtersForm = {
        number: filters.value.number,
        raffle: filters.value.raffle?.id,
        customer: filters.value.customer?.id,
        seller: filters.value.seller?.id,
        status: status.value
    }

    tickets.value = await TicketServices.list(filtersForm)
}

watch(() => router.path, async () => {
    await datatable()
})


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

const add_award = () => {
    ticket.value.payments.push({ award: "", date: "", type_award: "" })
}

const remove_award = (index) => {
    ticket.value.payments.splice(index, 1);
}

const showData = async (id) => {
    ticket.value = await TicketServices.show(id)
}

const changeState = (id, status) => {
    console.log('status', status);
    const message = status == 'Libre' ? '¿Desea declinar esta boleta?' : '¿Desea marcar esta boleta como totalmente pagada?'
    Swal.fire({
        title: message,
        showDenyButton: true,
        confirmButtonText: "Aceptar",
        denyButtonText: `Cancelar`,
    }).then(async(result) => {
        if (result.isConfirmed) {
            await TicketServices.changeState(id, status)
            Swal.fire("¡Guardado!", "", "success");
        }
    });
    datatable()
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
  
<style src="vue-multiselect/dist/vue-multiselect.css"></style>