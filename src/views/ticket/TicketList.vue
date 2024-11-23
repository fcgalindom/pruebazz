<template>
    <div>
        <div class="container-fluid pt-3">
            <div class="my-3">
                <div class="d-flex justify-content-between">
                    <h3>{{ getTitle() }}</h3>
                    <div class="d-flex flex-column">
                        <Button class="btn-sm mb-3">{{ tickets.length }} Boletas</Button>
                        <Button class="btn-sm mb-3">Total: {{ Helper.formatNumber(full_value) }}</Button>
                    </div>
                </div>
                <hr>
                <div class="row mb-3">
                    <div class="col-md-3 mb-3">
                        <Label required="0">Número</Label>
                        <Input disabled required="0" v-model="filters.number" />
                    </div>
                    <div class="col-md-3 mb-3">
                        <Label required="0">Rifa</Label>
                        <Select v-model="filters.raffle" :options="dependencies.raffles" filter optionLabel="name" optionValue="id" class="w-100"></Select>
                    </div>
                    <div class="col-md-3 mb-3">
                        <Label required="0">Cliente</Label>
                        <Select v-model="filters.customer" :options="dependencies.customers" filter optionLabel="name" optionValue="id" class="w-100"></Select>
                    </div>
                    <div class="col-md-3 mb-3">
                        <Label required="0">Vendedor</Label>
                        <Select v-model="filters.seller" :options="dependencies.sellers" filter optionLabel="name" optionValue="id" class="w-100"></Select>
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
                <div class="d-flex justify-content-center">
                    <Button @click="datatable">Buscar</Button>
                </div>
                <div class="d-flex justify-content-end">
                    <Button @click="limpiarFormulario; visible = true">Registrar</Button>
                </div>
                <Dialog v-model:visible="visible" modal header="Gestionar Boleta" :style="{ width: '80rem' }">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <Label>Número</Label>
                            <Input v-model="ticket.number" type="number"></Input>
                        </div>
                        <div class="col-md-6 mb-3">
                            <Label>Vendedor</Label>
                            <Select v-model="ticket.seller" :options="dependencies.sellers" filter optionLabel="name" optionValue="id" class="w-100"></Select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <Label>Cliente (a quien se vende)</Label>
                            <Select v-model="ticket.customer" :options="dependencies.customers" filter optionLabel="name" optionValue="id" class="w-100"></Select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <Label>Rifa</Label>
                            <Select v-model="ticket.raffle" :options="dependencies.raffles" filter optionLabel="name" optionValue="id" class="w-100"></Select>
                        </div>
                        <!-- <div class="col-md-6 mb-3">
                                <Label>Estado de la boleta</Label>
                                <Select v-model="ticket.status" :options="payment_methods" filter class="w-100"></Select>
                            </div> -->
                    </div>
    
                    <hr>
    
                    <div>
                        <div class="d-flex justify-content-end">
                            <button class="btn btn-success" @click="add_payment()">+</button>
                        </div>
                        <div class="row" v-for="(i, index) in ticket.payments" :key="index">
                            <div class="col-4">
                                <Label>Método de pago</Label>
                                <Select v-model="i.payment_method" :options="payment_methods" filter class="w-100"></Select>
                            </div>
                            <div class="col-4">
                                <Label>Valor</Label>
                                <InputNumber mode="currency" currency="USD" locale="en-US" fluid v-model="i.amount" type="text"></InputNumber>
                            </div>
                            <div class="col-4">
                                <div class="row">
                                    <div class="col-10">
                                        <Label>Fecha de expiración</Label>
                                        <DatePicker v-model="i.expiration_date" showIcon fluid :showOnFocus="false" @date-select="i.expiration_date = Helper.formatDateForm($event)" />
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
                </Dialog>
            </div>
            <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Boleta</th>
                            <!-- <th>Rifa</th> -->
                            <th>Cliente</th>
                            <th>Documento</th>
                            <th>Teléfono</th>
                            <th>Ciudad</th>
                            <th>Fecha venta</th>
                            <th v-if="!sellerRouteId">Vendedor</th>
                            <th>Estado</th>
                            <th>Abonado</th>
                            <th>Saldo</th>
                            <th>Facturas</th>
                            <th>Acciones</th>
                            <th>Certif. Boleta</th>
                            <th>Whatsapp</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(i, index) in tickets" :key="index" v-bind:class="getLigthTracking(i.customer)">
                            <td>#{{i.number}}</td>
                            <!-- <td>{{i.raffle.name}}</td> -->
                            <td>{{ i.customer?.name ?? 'N/A' }}</td>
                            <td>{{ i.customer ? Helper.thousandSeparator(i.customer.document) : 'N/A' }}</td>
                            <td>{{ i.customer?.phone ?? 'N/A' }}</td>
                            <td>{{ i.customer?.city.name ?? 'N/A' }}</td>
                            <td>{{ i.created_at ?? 'N/A' }}</td>
                            <td v-if="!sellerRouteId">{{i.seller?.name ?? 'Cliente'}}</td>
                            <td>{{ i.status ?? 'No vendida' }}</td>
                            <td>{{ i.value ? Helper.formatNumber(i.value) : 'N/A' }}</td>
                            <td>{{ i.value_to_pay ? Helper.formatNumber(i.value_to_pay - i.value) : 'N/A' }}</td>
                            <td>
                                <div class="text-center">
                                    <button @click="paymentdata(i.payments)" class="btn"><i class="fas fa-file-invoice-dollar text-success fa-lg"></i></button>
                                </div>
                            </td>
                            <td class="text-center">
                                <div class="d-flex justify-content-between" v-if="i.customer">
                                    <button class="btn text-darkslategrey" @click="showData(i.id); visible = true"><i class="fas fa-edit"></i></button>
                                    <button class="btn btn-success btn-sm" style="border-radius: 50%;" @click="changeState(i.id, status)"><i class="fas fa-check"></i></button>
                                    <button class="btn btn-danger btn-sm" style="border-radius: 50%;" @click="changeState(i.id, 'Libre')"><i class="fas fa-times"></i></button>
                                </div>
                                <div v-else>
                                    <span>No vendida</span>
                                </div>
                            </td>
                            <td>
                                <div v-if="i.customer">
                                    <div class="row">
                                 
                                      <div v-if="ticketstatus == 'Reservado' || ticketstatus  == 'Pagado'" class="col-3">
                                       <button class="btn"  data-toggle="modal"  @click="showTicketAlert(i)"><i class="fas fa-download"></i></button>  
                                      </div>
                                      <div class="w-100 text-center" v-else>
                                        N/A
                                      </div>

                                    <!-- <div v-if="ticketstatus  == 'Pagado'" class="col-3">
                                       <button class="btn"  data-toggle="modal"  @click="showTicketAlertAll(i)"><i class="fas fa-download"></i></button>  
                                    </div> -->
                                    <!-- <div class="col-3">
                                       <button   @click="paymentdata(i.payments)"><i class="fas fa-ticket-alt"></i></button>
                                    </div> -->
                                   </div>
                                    <Modal :id="firstpaymentmodal" label="Descargar" title="Descarcar Boleta" size="xl">
                                        <TikectFirstPaid :ticketData="i" />
                                    </Modal>
        
                                    <Dialog v-model:visible="ticketsmodal" header="Descargar Boleta" :style="{width : '75rem'}">
                                        <table class="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Fecha</th>
                                                    <th>Número</th>
                                                    <th>abono</th>
                                                    <th>metodo de pago</th>
                                                    <th>Descarga</th>
        
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(f, index) in payments1" :key="index">
                                                    <td>{{ Helper.formatDateTime(f.created_at) }}</td>
                                                    <td>{{f.ticket}}</td>
                                                    <td>{{Helper.formatNumber(f.amount)}}</td>
                                                    <td>{{f.payment_method}}</td>
                                                    <td> <TicketPaid :ticketData="i" :paymentData="f" /> </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Dialog>
                                </div>
                                <div v-else>
                                    <span>No vendida</span>
                                </div>
                            </td>
                            <td>
                                <div class="text-center">
                                    <button class="btn" @click="notifyCustomer(i.customer?.phone)">
                                        <i class="text-success fab fa-whatsapp fa-lg"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, createApp } from "vue";
import { TicketServices } from '@/services/ticket.service'
import { useRoute } from 'vue-router';
import Swal from 'sweetalert2'
import TicketPaid from "./TicketPaid.vue";
import TikectFirstPaid from "./TikectFirstPaid.vue";
import TicketPaidAll from "./TicketPaidAll.vue";
// @ts-ignore
import Helper from '@/helpers/Helper';
import { SellerServices } from "@/services/seller.service";

const tickets = ref([])
const full_value = ref(0)
const ticket = ref({})
const ticketstatus = ref("")
const seller = ref({})
const payments1 = ref([])
const firstpaymentmodal = ref('firstpayment_modal')
const ticketsmodal = ref(false)
const position = ref('topcenter')
const payment_methods = ref(['Efectivo', 'Tarjeta de crédito', 'Tarjeta de débito', 'Transferencia', 'Consignación'])
const status_select = ref(['Free', 'Paid', 'Booked'])
const visible = ref(false)
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
    if(sellerRouteId.value) {
        seller.value = await SellerServices.show(sellerRouteId.value)
    }
    const ticketsee = JSON.parse(sessionStorage.getItem('tickets'));
    if(ticketsee) {
        tickets.value = ticketsee
        sessionStorage.removeItem('tickets');
        
    }else{
        await datatable()
    }
    getTitle()
    limpiarFormulario()
    dependencies.value = await TicketServices.dependencies()
})

const getTitle = () => {
    switch (status.value) {
        case 'Pendiente':
            ticketstatus.value = 'Pendiente'
            return 'Boletas Pendientes'
        case 'Reservado':
            ticketstatus.value = 'Reservado'
            return 'Boletas con Abono'
        case 'Pagado':
            ticketstatus.value = 'Pagado'
            return 'Boletas Pagadas'
        default:
            return 'Seguimiento al vendedor ' + seller.value.name
    }
}

const datatable = async () => {
    console.log('sellerRouteId.value ', sellerRouteId.value);
    
    filters.value.status = status.value
    if(sellerRouteId.value) {
        filters.value.seller = sellerRouteId.value
        tickets.value = await SellerServices.tracking(sellerRouteId.value, filters.value)
    }else {
        tickets.value = await TicketServices.list(filters.value)
    }
    full_value.value = 0
    tickets.value.forEach(element => {
        if(element.value) {
            full_value.value += parseInt(element.value)
        }
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
    if (!value) value = 0

    ticket.value.value = value
    if (ticket.value.id) {
        await TicketServices.updateCustomer(ticket.value, ticket.value.id)
    } else {
        await TicketServices.createCustomer(ticket.value)
    }
    visible.value = false
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
    if (!ticket.value.payments) {
        ticket.value.payments = [{
            payment_method: "",
            amount: "",
            expiration_date: ""
        }]
    }
}
const paymentdata = async (payments) => {
    payments1.value = payments
    ticketsmodal.value = true
}


const changeState = async (id, status) => {
    let message = ""
    let newStatus = ""
    switch (status) {
        case 'Pendiente':
            message = "¿Desea marcar esta boleta como Boleta con abono?"
            newStatus = "Reservado"
            break;

        case 'Reservado':
            message = "¿Desea marcar esta boleta como totalmente pagada?"
            newStatus = "Pagado"
            break;

        default:
            message = "¿Desea declinar esta boleta?"
            break;
    }

    Swal.fire({
        title: message,
        showDenyButton: true,
        confirmButtonText: "Aceptar",
        denyButtonText: `Cancelar`,
    }).then(async (result) => {
        if (result.isConfirmed) {
            await TicketServices.changeState(id, newStatus)
            Swal.fire("¡Guardado!", "", "success");
            await datatable()
        }
    });
}

const getLigthTracking = (customer) => {
    if(!sellerRouteId.value) {
        return ''
    }
    if (customer) {
        return 'ligth-tracking-sold'
    } else {
        return 'ligth-tracking-not-sold'
    }
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
    // Create a container in the DOM where we will render the component
    const wrapper = document.createElement('div');

    // Create a Vue instance with our component
    const app = createApp(TikectFirstPaid, { ticketData });

    // Mount the instance in the created container
    app.mount(wrapper);

    // Show the SweetAlert with the component mounted in `html`
    Swal.fire({
        title: 'Descargar Boleta',
        html: wrapper,
        focusConfirm: false,
        showCloseButton: true, // Show the "X" to close
        showConfirmButton: false, // Hide the confirm button
        width: '400px', // Adjust the size if necessary
        didDestroy: () => {
            // Unmount the component when the SweetAlert is closed
            app.unmount();
        },
    });
}

const notifyCustomer = (phone) => {
    window.open(`https://wa.me/57${phone}`, '_blank');
}

function showTicketAlertAll(ticketData) {
  // Creamos un contenedor en el DOM donde renderizaremos el componente
  const wrapper = document.createElement('div');

  // Creamos una instancia de Vue con nuestro componente
  const app = createApp(TicketPaidAll, { ticketData });

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
const sellerRouteId = computed(() => {
  return router.params.id; // Asumiendo que el parámetro de la ruta se llama 'id'
});

</script>
  
