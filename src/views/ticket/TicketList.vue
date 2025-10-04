<template>
    <div>
        <div class="container-fluid pt-3">
            <form @submit.prevent="datatable()" class="my-3">
                <div class="d-flex flex-column flex-sm-row justify-content-between">
                    <!-- <h3 v-if="!status">{{ seller }}</h3> -->
                    <h3>{{ getTitle() }}</h3>
                    <div class="d-flex" v-if="type_user != 'false'">
                        <!-- <Button class="btn-sm mb-3">{{ tickets.count }} Boletas</Button> -->
                        <Button v-if="is_admin == 'true' && cant_tickets" class="btn-sm mb-3 mr-3">Cant: {{ cant_tickets
                            }}</Button>
                        <Button v-if="is_admin == 'true'" class="btn-sm mb-3">Total: {{
                            Helper.formatNumber(full_value?.total) }}</Button>
                    </div>
                </div>
                <hr>
                <div class="row mb-3">
                    <div class="col-md-3 mb-3">
                        <Label required="0">Número</Label>
                        <BaseInput required="0" v-model="filters.number" />
                    </div>
                    <div class="col-md-3 mb-3">
                        <Label required="0">Rifa</Label>
                        <Select v-model="filters.raffle" :options="dependencies.raffles" filter optionLabel="name"
                            optionValue="id" class="w-100"></Select>
                    </div>
                    <div class="col-md-3 mb-3">
                        <Label required="0">Cliente</Label>
                        <Select v-model="filters.customer" :options="dependencies.customers" filter optionLabel="name"
                            optionValue="id" class="w-100"></Select>
                    </div>
                    <div class="col-md-3 mb-3">
                        <Label required="0">Vendedor</Label>
                        <Select v-model="filters.seller" :options="dependencies.sellers" filter optionLabel="name"
                            optionValue="id" class="w-100"></Select>
                    </div>
                    <div class="col-md-3 mb-3">
                        <Label required="0">Fecha inicial</Label>
                        <DatePicker v-model="filters.init_date" showIcon fluid dateFormat="yy-mm-dd"
                            :manualInput="false" @date-select="filters.init_date = Helper.formatDateForm($event)" />
                    </div>
                    <div class="col-md-3 mb-3">
                        <Label required="0">Fecha final</Label>
                        <DatePicker v-model="filters.final_date" showIcon fluid dateFormat="yy-mm-dd"
                            :manualInput="false" @date-select="filters.final_date = Helper.formatDateForm($event)" />
                    </div>
                    <div class="col-md-3 mb-3">
                        <Label required="0">Mínimo Abonado</Label>
                        <InputGroup>
                            <InputGroupAddon>$</InputGroupAddon>
                            <InputNumber required="0" v-model="filters.min_amount" fluid />
                        </InputGroup>
                    </div>
                    <div class="col-md-3 mb-3">
                        <Label required="0">Máximo Abonado</Label>
                        <InputGroup>
                            <InputGroupAddon>$</InputGroupAddon>
                            <InputNumber required="0" v-model="filters.max_amount" fluid />
                        </InputGroup>
                    </div>
                </div>
                <div class="d-flex justify-content-center mb-3">
                    <Button type="submit">Buscar</Button>
                </div>
                <div class="d-flex justify-content-end">
                    <Button class="mr-3" @click="syncWompiPayments" :disabled="loading">
                        <i v-if="!loading" class="fas fa-sync"></i>
                        <div v-if="loading" class="spinner-border spinner-border-sm" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                        {{ loading ? 'Sincronizando...' : '' }}
                    </Button>
                    <Button class="mr-3" @click="goPayToSeller">Pagar</Button>
                    <Button class="mr-3" @click="generatePDF"><i class="far fa-file-pdf fa-lg"></i></Button>
                    <Button class="mr-3" @click="downloadExcel"><i class="far fa-file-excel fa-lg"></i></Button>
                    <Button v-if="!sellerRouteId" @click="limpiarFormulario; visible = true">Registrar</Button>
                </div>
                <Dialog v-model:visible="visible" modal header="DATOS DE COMPRA" :style="{ width: '80rem' }">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <Label>Número</Label>
                            <Input v-model="ticket.number" type="number"></Input>
                        </div>
                        <div class="col-md-6 mb-3">
                            <Label>Vendedor</Label>
                            <Select v-model="ticket.seller" :options="dependencies.sellers" filter optionLabel="name"
                                optionValue="id" class="w-100"></Select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <Label>Cliente (a quien se vende)</Label>
                            <Select v-model="ticket.customer" :options="dependencies.customers" filter
                                optionLabel="name" optionValue="id" class="w-100"></Select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <Label>Rifa</Label>
                            <Select v-model="ticket.raffle" :options="dependencies.raffles" filter optionLabel="name"
                                optionValue="id" class="w-100"></Select>
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
                        <div class="row pb-3 mb-3" v-for="(i, index) in ticket.payments" :key="index"
                            style="border-bottom: 1px solid rgba(0, 0, 0, 0.19);">
                            <div class="col-md-6">
                                <Label>Método de pago</Label>
                                <Select v-model="i.payment_method" :options="payment_methods" filter
                                    class="w-100"></Select>
                            </div>
                            <div class="col-md-6" v-if="i.payment_method !== '' && i.payment_method !== 'EFECTIVO'">
                                <label>Referencia de pagos</label>
                                <input type="text" v-model="i.reference" class="form-control"
                                    placeholder="Ingrese la referencia" />
                            </div>
                            <div class="col-md-6">
                                <Label>Valor</Label>
                                <InputGroup>
                                    <InputGroupAddon>$</InputGroupAddon>
                                    <InputNumber fluid v-model="i.amount" type="text"></InputNumber>
                                </InputGroup>
                            </div>
                            <hr>
                        </div>
                    </div>

                    <div class="d-flex justify-content-center my-3">
                        <Button @click="saveEntity">Guardar</Button>
                    </div>
                </Dialog>
            </form>
            <div id="toPDF" ref="toPDF" style="position: relative;">
                <!-- Loading Overlay -->
                <div v-if="loading" class="d-flex justify-content-center align-items-center"
                    style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(255, 255, 255, 0.8); z-index: 1000; min-height: 200px;">
                    <div class="text-center">
                        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                            <span class="sr-only">Loading...</span>
                        </div>
                        <div class="mt-2">
                            <strong>Sincronizando pagos de Wompi...</strong>
                        </div>
                    </div>
                </div>

                <Accordion value="0" v-if="pay.percentage > 0">
                    <AccordionPanel value="0">
                        <AccordionHeader>Desplegar tabla pagar a Vendedor</AccordionHeader>
                        <AccordionContent>
                            <div class="table-responsive">
                                <table class="table table-bordered">
                                    <thead>
                                        <tr colspan="12">
                                            <th colspan="6">TOTAL DINERO RECAUDADO</th>
                                            <th colspan="6">{{ Helper.formatNumber(full_value?.total) }}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td colspan="6">ENTREGA A LA OFICINA</td>
                                            <td colspan="6">{{ Helper.formatNumber(full_value?.total - pay.totalToPay)
                                            }} </td>
                                        </tr>
                                        <tr>
                                            <td colspan="3">PAGADO AL VENDEDOR</td>
                                            <td colspan="3">{{ pay.percentage }} %</td>
                                            <td colspan="6">{{ Helper.formatNumber(pay.totalToPay) }} </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </AccordionContent>
                    </AccordionPanel>
                </Accordion>

                <div class="table-responsive mt-3">
                    <table ref="table" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Boleta</th>
                                <th>Cliente</th>
                                <th>Documento</th>
                                <th>Teléfono</th>
                                <th>Ciudad</th>
                                <th>Fecha venta</th>
                                <th v-show="!sellerRouteId">Vendedor</th>
                                <th v-show="!printting">Estado</th>
                                <th>Abonado</th>
                                <th>Saldo</th>
                                <th v-show="!printting">Facturas</th>
                                <th v-show="!printting">Acciones</th>
                                <th v-show="!printting">Certif. Boleta</th>
                                <th v-show="!printting">Whatsapp</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(i, index) in tickets.results" :key="index"
                                v-bind:class="getLigthTracking(i.customer)">
                                <td>#{{ i.number }}</td>
                                <td>{{ i.customer?.name ?? '' }}</td>
                                <td>{{ i.customer ? Helper.thousandSeparator(i.customer.document) : '' }}</td>
                                <td>{{ i.customer?.phone ?? '' }}</td>
                                <td>{{ i.customer?.city.name ?? '' }}</td>
                                <td>{{ Helper.formatDate(i.created_at) ?? '' }}</td>
                                <td v-show="!sellerRouteId">{{ i.seller?.name ?? 'Cliente' }}</td>
                                <td v-show="!printting">{{ i.status ?? 'No vendida' }}</td>
                                <td>{{ calculatePaid(i, true) }}</td>
                                <td>{{ i.value_to_pay ? Helper.formatNumber(i.value_to_pay - i.value) : '' }}</td>
                                <td v-show="!printting">
                                    <div class="text-center">
                                        <button @click="paymentdata(i)" class="btn"><i
                                                class="fas fa-file-invoice-dollar text-success fa-lg"></i></button>
                                    </div>
                                </td>
                                <td v-show="!printting" class="text-center">
                                    <div class="d-flex justify-content-between" v-if="i.customer">
                                        <button class="btn text-darkslategrey"
                                            @click="showData(i.id); visible = true"><i class="fas fa-edit"></i></button>
                                        <div class="d-flex"
                                            v-if="(i.status != 'Pagado' || Cookies.get('type_user') == 'true')">
                                            <button class="btn btn-success btn-sm" style="border-radius: 50%;"
                                                v-if="i.status != 'Pendiente' && i.status != 'Reservado' && (i.status != 'Pagado' || i.origin == 'web')"
                                                @click="changeState(i.id, i.status)"><i
                                                    class="fas fa-check"></i></button>
                                            <button class="btn btn-danger btn-sm" style="border-radius: 50%;"
                                                @click="changeState(i.id, 'Libre')"><i
                                                    class="fas fa-times"></i></button>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <span>No vendida</span>
                                    </div>
                                </td>
                                <td v-show="!printting">
                                    <div v-if="i.customer">
                                        <div class="row">
                                            <div v-if="ticketstatus == 'Reservado' || ticketstatus == 'Pendiente'"
                                                class="col-3">
                                                <button class="btn" data-toggle="modal" @click="showTicketAlert(i)"><i
                                                        class="fas fa-download"></i></button>
                                            </div>
                                            <div v-if="ticketstatus == 'Pagado'" class="col-3">
                                                <button class="btn" data-toggle="modal"
                                                    @click="showTicketAlertAll(i)"><i
                                                        class="fas fa-download"></i></button>
                                            </div>
                                            <div class="w-100 text-center" v-else>
                                                N/A
                                            </div>
                                        </div>
                                        <Modal :id="firstpaymentmodal" label="Descargar" title="Descarcar Boleta"
                                            size="xl">
                                            <TikectFirstPaid :ticketData="i" />
                                        </Modal>


                                    </div>
                                    <div v-else>
                                        <span>No vendida</span>
                                    </div>
                                </td>
                                <td v-show="!printting">
                                    <div class="text-center">
                                        <button class="btn" @click="notifyCustomer(i.customer)">
                                            <i class="text-success fab fa-whatsapp fa-lg"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- Paginador -->
            <Paginator v-if="!sellerRouteId" :first="pagination.page * pagination.rows" :rows="pagination.rows"
                :total-records="pagination.totalRecords" @page="onPageChange" :rows-per-page-options="[10, 20, 50]" />

            <Dialog class="table-responsive" v-model:visible="ticketsmodal" header="Descargar Boleta"
                :style="{ width: '75rem' }">
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
                        <tr v-for="(f, index) in ticket_certif.payments" :key="index">
                            <td>{{ Helper.formatDateTime(f.created_at) }}</td>
                            <td># {{ ticket_certif.number }}</td>
                            <td>{{ Helper.formatNumber(f.amount) }}</td>
                            <td>{{ f.payment_method }}</td>
                            <td>
                                <TicketPaid :ticketData="ticket_certif" :paymentData="ticket_certif.payments"
                                    :index="index" />
                            </td>
                        </tr>
                    </tbody>
                </table>

            </Dialog>

            <Dialog v-model:visible="visiblePayCustomer" modal header="Pagar a Vendedor" :style="{ width: '30rem' }">
                <PayToSeller :totalProp="full_value" @pay="handlePay" />
            </Dialog>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, createApp, reactive, nextTick } from "vue";
import autoTable from 'jspdf-autotable'
import { RaffleServices } from "@/services/raffle.service";
import { TicketServices } from '@/services/ticket.service'
import { useRoute } from 'vue-router';
import Swal from 'sweetalert2'
import TicketPaid from "./TicketPaid.vue";
import TikectFirstPaid from "./TikectFirstPaid.vue";
import TicketPaidAll from "./TicketPaidAll.vue";
import PayToSeller from "./PayToSeller.vue";
import Cookies from 'js-cookie';
import BaseInput from '@/components/base/BaseInput.vue'
// @ts-ignore
import Helper from '@/helpers/Helper';
import { SellerServices } from "@/services/seller.service";
import { useFilterStore, useModalStore, useFilterTicket } from '@/stores/filterStore';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { red } from "@cloudinary/url-gen/actions/adjust";
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import logoImg from '@/assets/customers/logo_casa_sorteos.png'

const tickets = ref([])
const ticket_certif = ref({})
const full_value = ref(0)
const cant_tickets = ref(0)
const ticket = ref({})
const ticketstatus = ref("")
const seller = ref({})
const firstpaymentmodal = ref('firstpayment_modal')
const ticketsmodal = ref(false)
const payment_methods = ref(['EFECTIVO', 'TRANSFERENCIA', 'CONSIGNACIÓN', 'NEQUI', 'DAVIPLATA', 'BANCOLOMBIA', 'AHORRO A LA MANO', 'WOMPI'])
const visible = ref(false)
const type_user = ref('')
const is_admin = ref(false)
const perrmisionadmin = ref(false);
const visiblePayCustomer = ref(false)
const printting = ref(false)
const paginatedTickets = ref([])
const pay = ref({
    percentage: 0,
    totalToPay: 0
})
const dependencies = ref({
    sellers: [],
    customers: [],
    raffles: []
})
const reciboCanvas = ref(null);
const filtroStore = useFilterStore();
const fitroticket = useFilterTicket();
const loading = ref(false)

const toPDF = ref(null)

const filters = ref({
    number: "",
    raffle: "",
    customer: "",
    seller: "",
    init_date: "",
    final_date: "",
    min_amount: "0",
    max_amount: "",
    origin: "",
    page: 1
})

const router = useRoute()

const status = computed(() => {
    const path = router.path
    return path.split('/').pop()
})
const customerf = ref(null)
const customerf2 = ref(null)
const numberf = ref(null)


const pagination = reactive({
    page: 0, // Página actual (empieza desde 0)
    rows: 10, // Cantidad de registros por página
    totalRecords: 200, // Total de registros
});


onMounted(async () => {

    customerf.value = filtroStore.filter;
    numberf.value = fitroticket.filter;
    type_user.value = Cookies.get('type_user')
    is_admin.value = Cookies.get('is_admin')
    console.log('is_admin.value ==> ', is_admin.value);
    if (Cookies.get('name') == "drdentix1") {
        perrmisionadmin.value = true
    } else {
        perrmisionadmin.value = false
    }


    await datatable()
    getTitle()
    limpiarFormulario()
    dependencies.value = await TicketServices.dependencies()
    console.log('seller ==> ', seller.value);

})

const handlePay = (payload) => {
    pay.value = payload
    visiblePayCustomer.value = false
}

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
        case 'Enlinea':
            ticketstatus.value = 'Pagado'
            return 'Boletas en linea'
        default:
            return 'Seguimiento al vendedor ' + seller.value.name
    }
}

const datatable = async () => {
    filters.value.status = status.value
    filters.value.origin = "admin"
    if (status.value == "Enlinea") {
        console.log('status.value', status.value);
        filters.value.origin = "web"
    }

    filters.value.customer = ""


    if (customerf.value) {
        filters.value.customer = customerf.value
        filters.value.status = ""
        customerf.value = ""
        filtroStore.clearFilter()

    }

    // console.log('sellerRouteId.value', sellerRouteId.value);

    if (sellerRouteId.value) {
        if (numberf.value) {
            filters.value.number = numberf.value
            filters.value.status = ""
            numberf.value = ""
            fitroticket.clearFilter()
        }
        filters.value.seller = sellerRouteId.value
        seller.value = await SellerServices.show(sellerRouteId.value)
        filters.value.status = ""
        tickets.value.results = await SellerServices.tracking(sellerRouteId.value, filters.value)
        paginatedTickets.value = tickets.value.results
        cant_tickets.value = tickets.value.results.length

    } else {
        if (filters.value.number || filters.value.raffle || filters.value.customer || filters.value.seller || filters.value.init_date || filters.value.final_date) {
            filters.value.page = 1
        }
        const response = await TicketServices.list(filters.value)
        tickets.value = response
        pagination.totalRecords = response.count;
    }
    full_value.value = await TicketServices.totalValue({ seller: filters.value.seller, status: filters.value.status, init_date: filters.value.init_date, final_date: filters.value.final_date })
    if (pay.value.percentage > 0) {
        pay.value.totalToPay = full_value.value.total * (pay.value.percentage / 100)
    }
    filtroStore.clearFilter()
    fitroticket.clearFilter()
}

const onPageChange = (event) => {
    pagination.page = event.page;
    pagination.rows = event.rows;
    filters.value.page = pagination.page + 1;
    // filters.value.page_size = event.rows;
    datatable();
};

watch(() => router.path, async () => {
    await datatable()

})
watch(
    () => filtroStore.filter,
    (newValue) => {
        if (newValue) {
            customerf.value = filtroStore.filter;
            datatable()
        } else {
        }
    }
);
watch(
    () => fitroticket.filter,
    (newValue) => {
        if (newValue) {
            numberf.value = fitroticket.filter;
            datatable()


        } else {


        }
    }
);



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

const syncWompiPayments = async () => {
    loading.value = true
    try {
        await TicketServices.syncWompiPayments()
        Swal.fire({
            title: '¡Éxito!',
            text: 'Pagos de Wompi sincronizados correctamente',
            icon: 'success',
            confirmButtonText: 'Continuar'
        })
        await datatable()
    } catch (error) {
        console.error('Error sincronizando pagos de Wompi:', error)
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al sincronizar los pagos de Wompi',
            icon: 'error',
            confirmButtonText: 'Continuar'
        })
    } finally {
        loading.value = false
    }
}

const generatePDF = async () => {
    const doc = new jsPDF()
    const logo = new Image()
    logo.src = logoImg

    logo.onload = async () => {
        // Imagen logo
        const imageX = 10
        const imageY = 10
        const imageW = 39.7
        const imageH = 38.6

        doc.addImage(logo, 'PNG', imageX, imageY, imageW, imageH)

        // Texto cabecera: después de la imagen
        let y = imageY + imageH + 10 // margen de 10mm debajo de la imagen
        doc.setFontSize(10)
        doc.text(`VENDEDOR: ${seller.value?.name ?? ''}`, 10, y)
        y += 5
        doc.text(`DOCUMENTO: ${seller.value?.document_number ?? ''}`, 10, y)
        y += 5
        doc.text(`TELÉFONO: (${seller.value?.country_code ? seller.value.country_code : ''}) ${seller.value?.phone ? seller.value.phone : ''}`, 10, y)
        y += 5
        doc.text(`FECHA INICIAL: ${Helper.formatDate(filters.value?.init_date)}`, 10, y)
        y += 5
        doc.text(`FECHA FINAL: ${Helper.formatDate(filters.value?.final_date)}`, 10, y)
        y += 5
        doc.text(`TOTAL BOLETAS REPORTADAS: ${cant_tickets.value}`, 10, y)
        y += 5
        doc.text(`USUARIO: ${(Cookies.get('name') ?? '').toUpperCase()}`, 10, y)

        // Tabla de tickets
        const ticketData = tickets.value?.results || []
        const tableBody = ticketData.map(i => ([
            `#${i.number}`,
            i.customer?.name ?? '',
            i.customer ? Helper.thousandSeparator(i.customer.document) : '',
            i.customer?.phone ?? '',
            calculatePaid(i),
            i.value_to_pay ? Helper.formatNumber(i.value_to_pay - i.value) : ''
        ]))

        // Cambia el tamaño de fuente solo para los datos de tableBody
        const tableBodyFontSize = 12;
        const formattedTableBody = tableBody.map(row =>
            row.map(cell => ({ content: cell, styles: { fontSize: tableBodyFontSize } }))
        );

        autoTable(doc, {
            startY: y + 10,
            head: [[
                { content: 'TOTAL DINERO RECAUDADO', colSpan: 6, styles: { halign: 'center', fontSize: 10, lineWidth: 0.2, lineColor: [180, 180, 180] } },
                { content: Helper.formatNumber(full_value.value?.total), colSpan: 6, styles: { halign: 'center' } }
            ]],
            body: [
                [
                    { content: 'ENTREGA A LA OFICINA', colSpan: 6 },
                    { content: Helper.formatNumber(full_value.value?.total - pay.value.totalToPay), colSpan: 6 }
                ],
                [
                    { content: 'PAGADO AL VENDEDOR', colSpan: 4 },
                    { content: `${pay.value.percentage} %`, colSpan: 2 },
                    { content: Helper.formatNumber(pay.value.totalToPay), colSpan: 6 }
                ]
            ],
            theme: 'grid',
            styles: { fontSize: 10, lineWidth: 0.2, lineColor: [180, 180, 180] }, styles: { fontSize: 10 },
            tableLineWidth: 0.2,
            tableLineColor: [180, 180, 180],
            headStyles: { fillColor: [41, 76, 150] },
            didDrawPage: (data) => {
                y = data.cursor.y + 10 // actualizar el valor de Y después de la tabla
            }
        })


        autoTable(doc, {
            head: [[
                'Boleta', 'Cliente', 'Documento', 'Teléfono', 'Abonado', 'Saldo'
            ]],
            body: formattedTableBody,
            startY: y + 5,
            styles: { fontSize: 10, lineWidth: 0.2, lineColor: [180, 180, 180] },
            tableLineWidth: 0.2,
            tableLineColor: [180, 180, 180],
            headStyles: { fillColor: [41, 76, 150] }
        })

        // Pie de página
        let finalY = doc.lastAutoTable.finalY + 10
        doc.text('FIRMA VENDEDOR: ___________________________', 120, finalY)
        doc.text(`GENERACIÓN DEL REPORTE: ${currentDate()}`, 120, finalY + 7)
        doc.text(`HORA: ${currentTime()}`, 160, finalY + 14)

        // Guardar PDF
        const name_file = `BOLETAS_${seller.value?.name}_${new Date().toLocaleDateString('es-ES', {
            day: '2-digit', month: 'long', year: 'numeric'
        }).replace(/ /g, '_').toUpperCase()}`
        doc.save(`${name_file}.pdf`)
    }
}

const add_payment = () => {
    ticket.value.payments.push({ payment_method: "EFECTIVO", amount: "", expiration_date: "2024-12-31", reference: "" })
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
            expiration_date: "2024-12-31"
        }]
    }
}
const paymentdata = async (ticket) => {
    ticket_certif.value = ticket
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
            newStatus = "Libre"
            break;
    }

    if (status == "Pagado" || status == "Reservado") {
        message = "¿Desea pasar esta boleta a boletas pagadas?"
        newStatus = "Pagado"
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
    if (printting.value) {
        return ''
    }

    if (!sellerRouteId.value) {
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
            expiration_date: "2024-12-31"
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

const calculatePaid = (i, showNa = false) => {
    // if(!i.value && showNa){
    //     return 'N/A'
    // }
    if (!i.value && i.value === "0") {
        return ''
    }

    let total = 0
    i.payments?.forEach(element => {
        total += parseInt(element.amount)
    });
    return Helper.formatNumber(total)
}

const notifyCustomer = (customer) => {
    window.open(`https://wa.me/${customer.country_code}${customer.phone}`, '_blank');
}


const table = ref(null);
const downloadExcel = () => {
    // Mapea y filtra solo las columnas que quieres exportar
    const filteredData = tickets.value.results.map(i => ({
        BOLETA: i.number,
        CLIENTE: i.customer?.name || "",
        DOCUMENTO: i.customer ? Helper.thousandSeparator(i.customer.document) : "",
        TELÉFONO: i.customer?.phone ? `${i.customer.country_code ? '+' + i.customer.country_code + ' ' : ''}${i.customer.phone}` : "",
        ABONO: i.value ? Helper.formatNumber(i.value) : "",
        SALDO: i.value_to_pay ? Helper.formatNumber(i.value_to_pay - i.value) : "",
    }));

    // Remueve columnas undefined si sellerRouteId es true
    const cleanedData = filteredData.map(row => {
        const cleanedRow = { ...row };
        if (sellerRouteId) delete cleanedRow.Vendedor;
        return cleanedRow;
    });

    // Convierte el JSON a una hoja de Excel
    const worksheet = XLSX.utils.json_to_sheet(cleanedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Facturas");

    // Convierte y descarga el archivo
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    const name = `BOLETAS_${seller.value.name}_${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }).replace(/ /g, '_').toUpperCase()}.xlsx`;
    saveAs(data, name);
};

const downloadPdf = () => {
    console.log('downloadPdf ==> ', tickets.value.results);

}

const goPayToSeller = () => {
    visiblePayCustomer.value = true
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

const currentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // Formato DD/MM/YYYY
};

const currentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Formato HH:MM
};

</script>
