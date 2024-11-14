<template>
    <div>
        <div class="container-fluid pt-3">
            <div class="my-3">
                <div class="d-flex justify-content-between">
                    <h3>Boletas Reservadas</h3>
                    <div class="d-flex flex-column">
                        <Button class="btn-sm mb-3">{{ tickets.length }} Boletas</Button>
                        <Button class="btn-sm mb-3">Total: {{ Helper.formatNumber(full_value) }}</Button>
                    </div>
                </div>
                <hr>
                <div class="row mb-3">
                    <div class="col-md-3 mb-3">
                        <Input required="0" v-model="filters.number" label="Número" />
                    </div>
                    <div class="col-md-3 mb-3">
                        <Label required="0">Rifa</Label>
                        <Select2 ref="multiselect" v-model="filters.raffle" :options="dependencies.raffles" :multiple="false" :clear-on-select="true" :preserve-search="true" placeholder="Selecciona" label="name" track-by="id" />
                    </div>
                    <div class="col-md-3 mb-3">
                        <Label required="0">Cliente</Label>
                        <Select2 ref="multiselect" v-model="filters.customer" :options="dependencies.customers" :multiple="false" :clear-on-select="true" :preserve-search="true" placeholder="Selecciona" label="name" track-by="id" />
                    </div>
                    <div class="col-md-3 mb-3">
                        <Label required="0">Vendedor</Label>
                        <Select2 ref="multiselect" v-model="filters.seller" :options="dependencies.sellers" :multiple="false" :clear-on-select="true" :preserve-search="true" placeholder="Selecciona" label="name" track-by="id" />
                    </div>
                    <div class="col-3">
                        <Input required="0" v-model="filters.init_date" type="date" label="Fecha inicial"/>
                    </div>
                    <div class="col-3">
                        <Input required="0" v-model="filters.final_date" type="date" label="Fecha final"/>
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
            </div>
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Número</th>
                            <th>Rifa</th>
                            <th>Cliente</th>
                            <th>Documento</th>
                            <th>Teléfono</th>
                            <th>Ciudad</th>
                            <th>Vendedor</th>
                            <th>Abonado</th>
                            <th>Saldo</th>
                            <th>Acciones</th>
                            <th>Cerficado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(i, index) in tickets" :key="index">
                            <td>#{{i.number}}</td>
                            <td>{{i.raffle.name}}</td>
                            <td>{{i.customer.name}}</td>
                            <td>{{ Helper.thousandSeparator(i.customer.document) }}</td>
                            <td>{{ i.customer.phone }}</td>
                            <td>{{ i.customer.city.name }}</td>
                            <td>{{i.seller?.name}}</td>
                            <td>{{ Helper.formatNumber(i.value) }}</td>
                            <td>{{ Helper.formatNumber(i.value_to_pay) }}</td>
                            <td class="text-center">
                                <div class="d-flex justify-content-between">
                                    <button class="btn text-darkslategrey" data-toggle="modal" :data-target="`#${modal}`" @click="showData(i.id)"><i class="fas fa-edit"></i></button>
                                    <button class="btn btn-success btn-sm" style="border-radius: 50%;" @click="changeState(i.id, 'Pagado')"><i class="fas fa-check"></i></button>
                                    <button class="btn btn-danger btn-sm" style="border-radius: 50%;" @click="changeState(i.id, 'Libre')"><i class="fas fa-times"></i></button>
                                </div>
                            </td>
                            <td>  
                                <div class="row">
                                     <div class="col-3">
                                        <button class="btn  text-danger"  data-toggle="modal"  @click="showTicketAlert(i)"><i class="fas fa-download"></i></button>  
                                     </div>
                                     <div class="col-3">
                                        <button  data-toggle="modal" :data-target="`#${ticketsmodal}`" @click="paymentdata(i.payments)"><i class="fas fa-ticket-alt"></i></button>
                                     </div>
                                </div>


                               
                      
                        
                                <Modal :id="firstpaymentmodal" label="Descargar" title="Descarcar Boleta" size="xl">
                                    <TikectFirstPaid :ticketData="i" />
                                </Modal>
    
                                <Modal :id="ticketsmodal" label="Descargar" title="Descarcar Boleta" size="xl">
                                    <table class="table table-bordered">
                                     <thead>
                                       <tr>
                                        <th>Número</th>
                                        <th>abono</th>
                                        <th>metodo de pago</th>
                                        <th>Descarga</th>

                                       </tr>
                                      </thead>
                                    <tbody>

                                       <tr v-for="(f, index) in payments1" :key="index">

                                         <td>{{f.ticket}}</td>
                                         <td>{{f.amount}}</td>
                                         <td>{{f.payment_method}}</td>
                                         <td><TicketPaid :ticketData="i"  :paymentData="f"/> </td>
                                      
                                        </tr>

                                    </tbody>

                                   </table>
                               
                                    
                                </Modal>
                               
                               
                                
                                
                            </td>
                            
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  
</template>

<script setup>
import { ref, onMounted, computed, watch  , createApp } from "vue";
import { TicketServices } from '@/services/ticket.service'
import { useRoute } from 'vue-router';
import Swal from 'sweetalert2'
import TicketPaid from "./TicketPaid.vue";
import TikectFirstPaid from "./TikectFirstPaid.vue";
// @ts-ignore
import Helper from '@/helpers/Helper';

const tickets = ref([])
const full_value = ref(0)
const ticket = ref({})
const payments1 = ref([])
const modal = ref('ticket_modal')
const firstpaymentmodal = ref('firstpayment_modal')
const ticketsmodal = ref('tickets_modal')
const payment_methods = ref(['Efectivo', 'Tarjeta de crédito', 'Tarjeta de débito', 'Transferencia', 'Consignación'])
const status_select = ref(['Free', 'Paid', 'Booked'])
const dependencies = ref({
    sellers: [],
    customers: [],
    raffles: []
})
const reciboCanvas = ref(null);


const filters = ref({
    number: "",
    raffle: "",
    customer: "",
    seller: "",
    init_date: "",
    final_date: ""
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
        init_date: filters.value.init_date,
        final_date: filters.value.final_date,
        status: status.value
    }

    tickets.value = await TicketServices.list(filtersForm)
    full_value.value = 0
    tickets.value.forEach(element => {
        full_value.value += parseInt(element.value)
    });
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

const add_payment = () => {
    ticket.value.payments.push({ award: "", date: "", type_award: "" })
}

const remove_payment = (index) => {
    ticket.value.payments.splice(index, 1);
}

const showData = async (id) => {
    ticket.value = await TicketServices.show(id)
}
const paymentdata = async (payments) => {
    payments1.value = payments
}


const changeState = async(id, status) => {
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
            await datatable()
        }
    });
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
function showTicketAlert(ticketData) {
  // Creamos un contenedor en el DOM donde renderizaremos el componente
  const wrapper = document.createElement('div');

  // Creamos una instancia de Vue con nuestro componente
  const app = createApp(TikectFirstPaid, { ticketData });

  // Montamos la instancia en el contenedor creado
  app.mount(wrapper);

  // Mostramos el SweetAlert con el componente montado en `html`
  Swal.fire({
  title: 'Descargar Boleta',
  html: wrapper,
  focusConfirm: false,
  showCloseButton: true, // Muestra la "X" para cerrar
  showConfirmButton: false, // Oculta el botón de confirmación
  width: '400px', // Ajusta el tamaño si es necesario
  didDestroy: () => {
    // Desmonta el componente cuando se cierre el SweetAlert
    app.unmount();
  },
});
}
</script>
  
<style src="vue-multiselect/dist/vue-multiselect.css"></style>