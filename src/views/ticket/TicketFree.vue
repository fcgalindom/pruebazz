<template>
    <div>

        <!-- <Dialog v-model:visible="visiblefindcustomer" modal header="Buscar Cliente" :style="{ width: '80rem' }">
            
            <CustomerFInd @customerData="getcutomerevent" />
        </Dialog> -->
        <!-- <Dialog v-model:visible="visible" modal header="Crear Boleta" :style="{ width: '80rem' }"> -->
        <Dialog v-model:visible="visiblefindcustomer" modal header="Crear Boleta" :style="{ width: '50rem' }">
            <div class="row">
                <div class="col-12 mb-3">
                    <Label>Documento</Label>
                    <Input class="form-control" v-model="customer.document" type="number" @blur="listCustomers"></Input>
                </div>
                <div class="col-12 mb-3">
                    <Label>Nombre</Label>
                    <Input v-model="customer.name" :disabled="isDisabled" label="Nombre"></Input>
                </div>
                <div class="col-12 mb-3">
                    <Label>Teléfono</Label>
                    <div class="row">
                        <Select v-model="customer.country_code" optionLabel="name" :options="countries"
                            class="col-6 col-md-3 mb-3 mb-md-0">
                            <template #value="slotProps">
                                <div v-if="slotProps.value" class="d-flex align-items-center justify-content-center">
                                    <img :src="slotProps.value.flag" style="width: 20px" />
                                </div>
                            </template>
                            <template #option="slotProps">
                                <div class="d-flex align-items-center">
                                    <img :src="slotProps.option.flag" class="mr-2" style="width: 20px" />
                                    <div>{{ slotProps.option.name }}</div>
                                </div>
                            </template>
                        </Select>
                        <Input class="col-md-9" v-model="customer.phone" :disabled="isDisabled"
                            label="Teléfono"></Input>
                    </div>
                </div>
                <div class="col-12 mb-3">
                    <Label>Ciudad</Label>
                    <Select filter optionValue="id" fluid optionLabel="name" ref="multiselect" v-model="customer.city"
                        :disabled="isDisabled" :options="cities" :multiple="false" :clear-on-select="true"
                        :customer-search="true" placeholder="Selecciona" label="name" track-by="id"
                        @select="myChangeEvent"></Select>
                </div>
            </div>
            <!-- <CustomerForm @customerData="handleUpdateData" :datadocument="documentcustomer"
                @closedialog="visibleCustomer = false" /> -->
            <hr>
            <div class="row">
                <div class="col-md-12 mb-3">
                    <Label>Número</Label>
                    <Input disabled v-model="ticket.number" type="text"></Input>
                </div>
                <div class="col-md-12 mb-3">
                    <Label>Vendedor</Label>
                    <Select v-model="ticket.seller" :options="dependencies.sellers" filter optionLabel="name"
                        optionValue="id" class="w-100"></Select>
                </div>
                <!-- <div class="col-md-12 mb-3">
                    <Label>Cliente (a quien se vende)</Label>
                    <Select v-model="ticket.customer" :options="dependencies.customers" filter optionLabel="name"
                        optionValue="id" disabled class="w-100"></Select>
                </div> -->
                <!-- <div class="col-md-6 mb-3">
                    <Label>Rifa</Label>
                    <Select v-model="ticket.raffle" :options="dependencies.raffles" filter optionLabel="name"
                        optionValue="id" class="w-100"></Select>
                </div> -->
            </div>

            <hr>

            <div v-if="typeScreen == 'admin'">
                <div class="d-flex justify-content-end">
                    <button class="btn btn-success" @click="add_payment()">+</button>
                </div>
                <div class="row border p-2 my-3" v-for="(i, index) in ticket.payments" :key="index">
                    <div class="col-md-4">
                        <Label>Boleta</Label>
                        <Select v-model="i.ticket" :options="ticket.number" filter class="w-100"></Select>
                    </div>
                    <div class="col-md-4">
                        <Label>Método de pago</Label>
                        <Select v-model="i.payment_method" :options="payment_methods" filter class="w-100"></Select>
                    </div>
                    <div class="col-md-4" v-if="i.payment_method !== '' && i.payment_method !== 'EFECTIVO'">
                        <label>Referencia de pagos</label>
                        <input type="text" v-model="i.reference" class="form-control"
                            placeholder="Ingrese la referencia" />
                    </div>
                    <div class="col-md-4">
                        <Label>Valor</Label>
                        <InputGroup>
                            <InputGroupAddon>$</InputGroupAddon>
                            <InputNumber fluid v-model="i.amount" />
                        </InputGroup>
                    </div>
                    <!-- <div class="col-md-3">
                        <div class="row">
                            <div class="col-10">
                                <Label>Fecha de expiración</Label>
                                <DatePicker v-model="i.expiration_date" showIcon fluid dateFormat="yy-mm-dd"
                                    :manualInput="false"
                                    @date-select="i.expiration_date = Helper.formatDateForm($event)" />
                            </div>
                            <div class="col-2">
                                <button class="btn btn-danger mt-4" @click="remove_payment(index)">X</button>
                            </div>
                        </div>
                    </div> -->
                    <hr class="my-3">
                </div>
            </div>
            <div v-if="typeScreen == 'client'">
                <div class="d-flex justify-content-center my-3">
                    <Button data-toggle="modal" @click="generateWompiPay(monto)" :disabled="validateForm">
                        Guardar</Button>
                </div>

            </div>
            <div v-if="typeScreen == 'admin'">
                <div class="d-flex justify-content-center my-3">
                    <Button @click="saveEntity">Guardar</Button>
                </div>

            </div>


        </Dialog>

        <Modal :id="modalwompi" label="Pagos" title="Paga Con Wompi" size="xl">
            <form ref="wompiForm"></form>
        </Modal>



        <div v-if="typeScreen == 'client'">
            <div class="d-flex justify-content-center w-100 mb-3">
                <div class="w-70 text-center">
                    <label class="poppins-bold fs-random-number" for="">NÚMEROS AL AZAR</label>
                    <input v-model="filters.number_random" type="text" class="input-customer poppins-medium"
                        placeholder="Cantidad de Números" aria-label="Cantidad de Números"
                        aria-describedby="basic-addon2">
                    <button class="blinking-button-2 mt-3" @click="generateRandomNumbers">Generar</button>
                    <!-- <div class="input-group mb-3 input-customer">
                        <div class="input-group-append" @click="generateRandomNumbers" style="cursor: pointer;">
                            <span class="input-group-text" id="basic-addon2"><i class="fas fa-search fa-lg"></i></span>
                        </div>
                    </div> -->
                </div>
            </div>
            <div class="d-flex justify-content-center w-100 mt-5">
                <div class="w-70 text-center">
                    <label class="poppins-bold fs-random-number" for="">BUSQUE SU NÚMERO</label>
                    <div class="input-group mb-3">
                        <input v-model="filters.number" type="text" class="input-customer poppins-medium"
                            placeholder="Ingrese el número a buscar" aria-label="Ingrese el número a buscar"
                            aria-describedby="basic-addon2">
                        <!-- <div class="input-group-append">
                            <span class="input-group-text" id="basic-addon2"><i class="fas fa-search fa-lg"></i></span>
                        </div> -->
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-center w-100 mt-5">
                <div class="w-70 text-center">
                    <label class="poppins-bold fs-random-number" for="">&nbsp;</label>
                    <!-- <div class="input-group mb-3 input-customer"> -->
                    <MultiSelect v-model="ticket.number" display="chip" :options="ticket.number" filter fluid
                        placeholder="Números seleccionados" :maxSelectedLabels="15" class="w-full md:w-80"
                        @change="deleteTicket" />
                    <!-- <input v-model="ticket.number" type="text" class="poppins-medium text-center"
                            placeholder="Números seleccionados" readonly aria-label="Números seleccionados"
                            aria-describedby="basic-addon2"
                            style="border-top-right-radius: 12px; border-bottom-right-radius: 12px;"> -->
                    <!-- </div> -->
                </div>
            </div>
        </div>
        <div v-if="typeScreen == 'admin'" class="my-3">
            <h3>Boletas Disponibles</h3>
        </div>
        <hr>
        <div class="row" v-if="typeScreen == 'admin'">
            <div class="col-md-2">
                <Label required="0">Filtrar Números</Label>
                <Input v-model="filters.number"></Input>
            </div>
            <div class="col-md-10">
                <div v-if="typeScreen == 'admin'">
                    <Label>Números seleccionados</Label>
                    <MultiSelect v-model="ticket.number" display="chip" :options="ticket.number" filter fluid
                        :maxSelectedLabels="15" class="w-full md:w-80" @change="deleteTicket" />
                </div>
            </div>
            <div class="col-12">
                <div class="w-100 d-flex justify-content-center">
                    <Button class="mt-3" :disabled="ticket.number.length == 0"
                        @click="mountedBuyTicket()">Comprar</Button>
                </div>
            </div>
        </div>
        <div class="w-100 d-flex justify-content-center" v-if="typeScreen == 'client' && ticket.number">
            <button v-if="ticket.number.length > 0" class="blinking-button-2 poppins-semibold mt-3"
                @click="visiblefindcustomer = true; getPromotionsByRaffle()">Comprar</button>

            <button id="modalTicket" data-toggle="modal" :data-target="`#${modal}`" style="display: none;">
                prueba2</button>
        </div>

        <div class="container-fluid d-flex flex-column-reverse flex-md-row mt-3 pb-5"
            :class="typeScreen == 'admin' ? 'justify-content-between' : 'justify-content-center'">
            <div class="w-100 p-5" v-if="filteredButtons.length === 0" style="background-color: lightgray;">
                <h3 class="text-center">No hay números disponibles</h3>
            </div>
            <div class="d-flex flex-column align-items-center w-100" v-else>
                <div class="mb-2">
                    <span class="poppins-bold" style="font-size: 2em;">NÚMEROS DISPONIBLES</span>
                </div>
                <div id="board-buy" class="button-grid w-80 grid-buttons-tickets scroll-container">
                    <button :class="{ active: isActive(button) }" :disabled="!filters.raffle && typeScreen == 'admin'"
                        v-for="(button, index) in filteredButtons" :key="index" class="grid-button"
                        @click="buyTicket(button, button)">
                        {{ button }}
                    </button>
                </div>
            </div>
        </div>
        <!-- <div>
        </div>
        <Dialog v-model:visible="visibleCustomer" modal header="Crear Cliente" :style="{ width: '80rem' }">
        </Dialog> -->

    </div>
</template>

<script setup>
import { ref, onMounted, computed, defineProps, toRaw } from 'vue';
import { TicketServices } from '@/services/ticket.service'
import { PromotionServices } from '@/services/promotion.service'
// import { RaffleServices } from '@/services/raffle.service'
import { SellerTicketsServices } from "@/services/seller_tickets.service";
import { CustomerServices } from '@/services/customer.service'
import Swal from 'sweetalert2'
import CustomerForm from '@views/customer/CustomerForm.vue';
import CustomerFInd from '../customer/CustomerFInd.vue';
import Helper from '@/helpers/Helper';
import { SellerServices } from '@/services/seller.service';
import Cookies from 'js-cookie';
import { type } from 'jquery';



const props = defineProps({
    typeScreen: {
        type: String,
        default: "admin"
    },
    raffle: {
        type: Object,
        default: {}
    }
})
// const emits = defineEmits(['update:modelValue', 'update:error', 'update:type', 'update:disabled', 'update:placeholder', 'update:id', 'update:label', 'update:required']);
const documentcustomer = ref("")
const modal = ref('ticket_modal')
const modalwompi = ref('wompi-modal')
const raffle = ref({})
const range_tickets = ref([])
const customer = ref({})

const buttons = ref(Array.from({ length: 10 }, (_, i) => `${i + 1}`));
const visible = ref(false);

const payment_methods = ref(['EFECTIVO', 'TRANSFERENCIA', 'CONSIGNACIÓN', 'NEQUI', 'DAVIPLATA', 'BANCOLOMBIA', 'AHORRO A LA MANO', 'WOMPI'])
const ticket = ref({ number: [] })
const filters = ref({
    number: "",
    raffle: ""
})
const activeButtons = ref(new Set());
const promotion = ref({})
const cities = ref([])
const dependencies = ref({
    sellers: [],
    customers: [],
    raffles: []
})
let wompiForm = ref(null);
let visibleCustomer = ref(false);
let cifrar = ref("")
const costumerdata = ref("")
const visiblefindcustomer = ref(false)
const type_user = ref("")

const referencia = ref("");
const monto = ref("0");
const moneda = "COP";
const secretoIntegridad = "prod_integrity_3FCZzpavOOU1wtUttCkAZLxLYthemogy";
const isDisabled = ref(false)
const ticketsBooked = ref([])
const countries = ref([{
    name: "Mexico",
    dialCode: "52",
    flag: "https://flagcdn.com/mx.svg"
},
{
    name: "Chile",
    dialCode: "56",
    flag: "https://flagcdn.com/cl.svg"
},
{
    name: "España",
    dialCode: "34",
    flag: "https://flagcdn.com/es.svg"
},
{
    name: "Colombia",
    dialCode: "57",
    flag: "https://flagcdn.com/co.svg"
},
{
    name: "Argentina",
    dialCode: "54",
    flag: "https://flagcdn.com/ar.svg"
},
{
    name: "Bolivia",
    dialCode: "591",
    flag: "https://flagcdn.com/bo.svg"
},
{
    name: "Brazil",
    dialCode: "55",
    flag: "https://flagcdn.com/br.svg"
},
{
    name: "Ecuador",
    dialCode: "593",
    flag: "https://flagcdn.com/ec.svg"
},
{
    name: "Paraguay",
    dialCode: "595",
    flag: "https://flagcdn.com/py.svg"
},
{
    name: "Peru",
    dialCode: "51",
    flag: "https://flagcdn.com/pe.svg"
},
{
    name: "Uruguay",
    dialCode: "598",
    flag: "https://flagcdn.com/uy.svg"
},
{
    name: "Venezuela",
    dialCode: "58",
    flag: "https://flagcdn.com/ve.svg"
}
]);

async function hashSHA256(message) {
    // Convertir la cadena a un array de bytes
    const encoder = new TextEncoder();
    const data = encoder.encode(message);

    // Calcular el hash SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convertir el hash a un string hexadecimal
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    cifrar.value = hashHex

    return hashHex;
}

const chargeForm = () => {
    customer.value = {
        name: "",
        document: "",
        country_code: countries.value[3],
        phone: "",
        city: ""
    }

    customer.value.document = props.datadocument
}


function generarYValidarCodigo(longitud = 16) {
    // Definir el conjunto de caracteres que se utilizarán
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'; // Letras, dígitos, guiones y guiones bajos
    const patron = /^[a-zA-Z0-9_-]{1,16}$/; // Expresión regular para validar el formato del código

    while (true) {
        // Generar un código aleatorio
        let codigoAleatorio = '';
        for (let i = 0; i < longitud; i++) {
            codigoAleatorio += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }

        // Validar el código
        if (patron.test(codigoAleatorio)) {
            referencia.value = codigoAleatorio;
            return codigoAleatorio;
        }
    }
}
const handleUpdateData = async (data) => {
    dependencies.value = await TicketServices.dependencies()
    ticket.value.customer = data.customer.id
    visibleCustomer.value = false
    getPromotionsByRaffle()


}
generarYValidarCodigo(16);



const getcutomerevent = (data) => {
    console.log('get');
    
    if (props.typeScreen == 'client') {
        ticket.value.seller = 3
    }
    console.log('ticket.value', ticket.value);
    
    if (data.validate) {

        ticket.value.customer = data.customer.id
        visiblefindcustomer.value = false
        // visibleCustomer.value = true
        getPromotionsByRaffle()
    } else {
        visiblefindcustomer.value = false
        visibleCustomer.value = true
        documentcustomer.value = data.customer.document
        // getPromotionsByRaffle()
    }
}
onMounted(async () => {

    limpiarFormulario()
    search()
    cities.value = await CustomerServices.listCities()
    dependencies.value = await TicketServices.dependencies()
    const selleridofice = await SellerServices.getsellerofice()

    ticket.value.seller = selleridofice[0].id

    const ticketsee = sessionStorage.getItem('ticket');
    if (ticketsee) {
        ticket.value.number.push(ticketsee)
        sessionStorage.removeItem('ticket');

    }


    //referencia.value = await TicketServices.getTiketsRefferece()

    // const script = document.createElement('script');
    // script.src = 'https://checkout.wompi.co/widget.js';
    // script.setAttribute('data-render', 'button');
    // script.setAttribute('data-public-key', 'pub_prod_KI6rFlfUF70XgHhKL1UcE4l5umZaE68v');
    // script.setAttribute('data-currency', moneda);
    // script.setAttribute('data-amount-in-cents', monto);
    // script.setAttribute('data-reference', referencia.value);
    // //script.setAttribute('data-reference', "c8d3fa5b7e99a21k");// de pruebas
    // script.setAttribute(
    //     'data-signature:integrity',
    //     cifrar.value
    // );

    // Insertar el script en el formulario
    // wompiForm.value.appendChild(script);

    // window.addEventListener('message', function (event) {
    //     if (event.origin === 'https://checkout.wompi.co') {
    //         const data = event.data;

    //         if (data.event === 'transaction_approved') {
    //             // Pago aprobado
    //         } else if (data.event === 'unprocessabletransaction') {

    //             saveEntity()

    //         } else if (data.event === 'transaction_error') {
    //             // Error en el pago
    //         }
    //     }
    // });
})

const isActive = (button) => {
    return activeButtons.value.has(button);
}

const customerEmit = async (customerData) => {
    dependencies.value = await TicketServices.dependencies()
    ticket.value.customer = customerData.customer
    visible.value = false
    document.getElementById('modalTicket').click()
}

const search = async () => {

    let filterJson = {}

    if (props.typeScreen == 'client') {
        filterJson = {
            raffle: props.raffle?.id
        }
    } else {
        // if(!filters.value.raffle) {
        //     return
        // }
        // filterJson = {
        //     raffle: filters.value.raffle
        // }
    }
    filters.value.raffle = 1
    filterJson.raffle = 1
    type_user.value = Cookies.get('type_user')
    let response = ""
    if (type_user.value == 'false') {
        const seller = Cookies.get('seller_id')
        response = await SellerServices.tracking(seller, { seller: seller, raffle: filterJson.raffle, free: true })
    } else {
        response = await TicketServices.getTiketsByRaffle(filterJson.raffle)
    }

    raffle.value = response.raffle
    ticketsBooked.value = response.tickets

    if (filters.value.number) {

        if (response.tickets.some(ticket => ticket.number == filters.value.number)) {
            buttons.value = [filters.value.number]
        } else {
            buttons.value = [];
        }
    } else {
        buttons.value = [];

        // if(Cookies.get('seller_id')){
        //     getRangeForClients()
        // }else {
        // }
        if (type_user.value == 'false') {
            // if (response.some(ticket => ticket.number == filters.value.number)) {
            //     buttons.value = [filters.value.number]
            // }
        } else {
            let counter = 0;
            for (let index = response.raffle.start_number; index <= response.raffle.final_number && counter < 100; index++) {
                if (!response.tickets.some(ticket => ticket.number == index)) {
                    let formattedNumber = index.toString().padStart(4, '0');
                    buttons.value.push(formattedNumber);
                    counter++;
                }
            }
        }
    }
}

const getRangeForClients = async () => {
    range_tickets.value = await SellerTicketsServices.show(Cookies.get('seller_id'), false);
    range_tickets.value[0].numbers.forEach((index) => {
        let formattedNumber = index.toString().padStart(4, '0');
        buttons.value.push(formattedNumber);
    });
};

const mountedBuyTicket = () => {
    visiblefindcustomer.value = true;
    getPromotionsByRaffle()
    
    if (ticket.value.payments.length == 0) {

    }
    ticket.value.payments[0].ticket = ticket.value.number[0] || "";
}

const saveEntity = async () => {

    let value = 0

    customer.value.country_code = customer.value.country_code.dialCode
    const customerData = await CustomerServices.createCustomer(customer.value)
    ticket.value.customer = customerData.customer.id

    if (props.typeScreen == 'client') {
        ticket.value.payments = []
        ticket.value.origin = 'web'
        ticket.value.number.forEach(element => {

            ticket.value.payments.push({
                ticket: element,
                payment_method: "TRANSFERENCIA",
                amount: ticket.value.value_to_pay,
                expiration_date: "2024-12-31"
            })
            value += parseInt(element.value)
        });
    } else {
        ticket.value.payments.forEach(element => {
            value += parseInt(element.amount)
        });
    }
    if (!value) {
        value = 0
    }
    ticket.value.value = value
    let message = ''
    if (ticket.value.id) {
        await TicketServices.updateCustomer(ticket.value, ticket.value.id)
        message = 'Datos guardados con Éxito.'
    } else {

        const response = await TicketServices.createticket(ticket.value)
        if (response.duplicated.length > 0)
            message = `Tickets creados con éxito. ${response.success} y estas boletas ya estaban creadas con anterioridad ${response.duplicated} y no se realizaron cambios ni en creación ni agregando pagos`
        else
            message = `Tickets creados con éxito. ${response.success}`
    }
    visible.value = false
    visibleCustomer.value = false
    Swal.fire({
        title: '¡Éxito!',
        text: message,
        icon: 'success',
        confirmButtonText: 'Continuar'
    })
    visiblefindcustomer.value = false
    chargeForm()
    await search()
    limpiarFormulario()
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

const add_payment = () => {
    ticket.value.payments.push({
        ticket: "",
        payment_method: "EFECTIVO",
        amount: "",
        expiration_date: "2024-12-31"
    })
}

const getPromotionsByRaffle = async () => {
    if (props.typeScreen == 'client') {
        ticket.value.raffle = props.raffle.id
        ticket.value.seller = 3 // Seleccionar el vendedor por defecto para clientes (Compra en Línea)
    }
    else {
        ticket.value.raffle = raffle.value.id
    }



    promotion.value = await PromotionServices.promotionsByRaffle(ticket.value.raffle)


    let montoWompi = 0
    if (promotion.value[0]?.number_of_tickets <= ticket.value.number.length) {
        Swal.fire({
            title: '¡Felicitaciones!',
            text: `Genial se te aplicará la promoción ${promotion.value[0].name} con un valor de ${promotion.value[0].new_value} por boleta`,
            icon: 'info',
            confirmButtonText: 'Continuar'
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                visible.value = true
            }
        });
        ticket.value.promotion_id = promotion.value[0].id
        ticket.value.value_to_pay = promotion.value[0].new_value
    } else {
        visible.value = true

        if (props.typeScreen == 'client') {
            ticket.value.value_to_pay = props.raffle.value_ticket
        } else {

            // const raffle = await RaffleServices.show(filters.value.raffle)

            ticket.value.value_to_pay = raffle.value.value_ticket
            ticket.value.promotion_id = null
        }
    }
    //  monto.value = ticket.value.value_to_pay
    monto.value = ticket.value.value_to_pay * ticket.value.number.length
    monto.value += "00"

  
}
const telefono = "573156113402"; // Número en formato internacional (sin "+")
 

const generateWompiPay = async (monto_ = "0") => {

    const mensajedado = `${referencia.value}${monto.value}${moneda}${secretoIntegridad}`;
    await hashSHA256(mensajedado).then(hash => cifrar.value = hash);
         
    const script = document.createElement('script');
    script.src = 'https://checkout.wompi.co/widget.js';
    script.setAttribute('data-render', 'button');
    script.setAttribute('data-public-key', 'pub_prod_KI6rFlfUF70XgHhKL1UcE4l5umZaE68v');
    script.setAttribute('data-currency', moneda);
    script.setAttribute('data-amount-in-cents', monto.value);
    script.setAttribute('data-reference', referencia.value);
    //script.setAttribute('data-reference', "c8d3fa5b7e99a21k");// de pruebas
    script.setAttribute(
        'data-signature:integrity',
         cifrar.value
    );
    wompiForm.value.appendChild(script);
    setTimeout(() => {
        const wompiButton = wompiForm.value.querySelector('button');
        if (wompiButton) wompiButton.click();
    }, 500);
    visible.value = false
    window.addEventListener('message', function (event) {
        let boletasTexto = "*Números de Boleta:*\n";
        ticket.value.number.forEach((boleta) => {
            boletasTexto += `- ${boleta}\n`;
        });

        if (event.origin === 'https://checkout.wompi.co') {
            window.addEventListener('beforeunload', function (e) {
                const mensaje = 'Estás a punto de salir de la página. Si estás en proceso de pago, podrías perder la transacción.';

                e.preventDefault();
                e.returnValue = mensaje;
                return mensaje;
            });
            const data = event.data;
            if (data.data?.transaction?.status == 'transaction_created' || data.data?.transaction?.status == 'PENDING') {
                // alert('Transacción creada')

            }
            if (data.data?.transaction?.status === 'transaction_approved' || data.data?.transaction?.status == 'APPROVED') {
                let boletasTexto = "*Números de Boleta:*\n";
                ticket.value.number.forEach((boleta) => {
                    boletasTexto += `- ${boleta}\n`;
                });

                const transactionId = data.data.transaction.id;
                const mensajef = `Hola, he realizado la compra en línea con los siguientes datos:\n\n` +
                    boletasTexto + `\n` +
                    `*Nombre y Apellidos:\n` +
                    `*Uber Mayorga\n` +
                    `*Documento:* 1.118.257.604\n` +
                    `*Teléfono:* +57 315 611 3402\n` +
                    `*Transacción #:* ${transactionId}\n` +
                    `——————————————-\n` +
                    `Quedo atento(a) al envío de la boleta en formato digital.`;
                const mensajewa = encodeURIComponent(mensajef);
                window.open(`https://wa.me/${telefono}?text=${mensajewa}`, "_blank");

                saveEntity()

                //window.open( `https://wa.me/${telefono}?text=${mensajewa}`,"_blank");
            } else if (data.event === 'unprocessabletransaction') {
                alert('Transacción no procesable')
            } else if (data.event === 'transaction_error') {
                alert('Error en el pago')
            }
        }
    });
}

const generateRandomNumbers = () => {
    if (filters.value.number_random > 10) {
        Swal.fire({
            title: '¡Error!',
            text: 'No puedes seleccionar más de 10 números',
            icon: 'error',
            confirmButtonText: 'Continuar'
        })
        return
    }
    const activeButtonsArray = buttons.value;
    const randomNumbers = [];
    const count = Math.min(filters.value.number_random, activeButtonsArray.length);
    const element = document.getElementById('buyNumbers');
    element.scrollIntoView({ behavior: 'smooth' });
    while (randomNumbers.length < count) {
        const randomIndex = Math.floor(Math.random() * activeButtonsArray.length);
        const randomNumber = activeButtonsArray[randomIndex];
        if (!randomNumbers.includes(randomNumber)) {
            buyTicket(randomNumber, randomNumber)
            randomNumbers.push(randomNumber);
        }
    }

    ticket.value.number = randomNumbers;
};

const limpiarFormulario = () => {
    ticket.value = {
        number: [],
        value: "",
        seller: "",
        customer: "",
        raffle: "",
        promotion_id: null,
        value_to_pay: "",
        status: "",
        payments: [{
            payment_method: "EFECTIVO",
            amount: "",
            expiration_date: '2024-12-31',
            reference: "",
        }]
    }
    customer.value = {
        name: "",
        document: "",
        country_code: countries.value[3],
        phone: "",
        city: ""
    }
}

const deleteTicket = (ticketEvent) => {
    activeButtons.value = new Set()

    ticket.value.number.forEach(element => {
        activeButtons.value.add(element);
    });
}

const remove_payment = (index) => {
    ticket.value.payments.splice(index, 1);
}

const listCustomers = async () => {
    await CustomerServices.getByDocument(customer.value.document)
        .then(response => {

            if (response.length == 0) {
                customer.value = {
                    document: customer.value.document,
                    name: "",
                    phone: "",
                    city: ""
                }
                isDisabled.value = false
            } else {
                customer.value = {
                    name: response[0].name,
                    document: response[0].document,
                    country_code: response[0].country_code,
                    phone: response[0].phone,
                    city: response[0].city.id

                }
                isDisabled.value = true
            }
        })
        .catch(error => {
            // Manejar el error aquí
            console.error(error);
        });



}

const filteredButtons = computed(() => {

    // if (filters.value.number) {
    buttons.value = []
    let counter = 0;
    if (type_user.value == 'false') {

        ticketsBooked.value.forEach(element => {
            if (filters.value.number) {

            }
            if (!element.status) {
                buttons.value.push(element.number)
            }
        });
    } else {
        for (let index = raffle.value.start_number; index <= raffle.value.final_number && counter < 100; index++) {
            let formattedNumber = index.toString().padStart(4, '0');

            if (filters.value.number && formattedNumber.includes(filters.value.number)) {
                if (!ticketsBooked.value.some(ticket => ticket.number == index)) {
                    buttons.value.push(formattedNumber);
                    counter++;
                }
            }
            if (!filters.value.number) {
                if (!ticketsBooked.value.some(ticket => ticket.number == index)) {
                    buttons.value.push(formattedNumber);
                    counter++;
                }
            }
        }
    }

    return buttons.value;
});

const validateForm = computed(() => {
    if (!ticket.value.number.length > 0 || !ticket.value.seller || !customer.value.document || !customer.value.name || !customer.value.phone || !customer.value.city) {
        return true
    } else {
        return false
    }
});

</script>

<style scoped>
/* Estilos específicos para este componente */

button.active {
    background-color: #28a745;
}

button:hover {
    background-color: #0056b3;
}
</style>