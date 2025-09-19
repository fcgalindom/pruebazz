<template>
    <div>
        <div style="display: none;">
            {{ whereAmI }}
        </div>
        <!-- <Dialog v-model:visible="visiblefindcustomer" modal header="Buscar Cliente" :style="{ width: '80rem' }">
                            
                            <CustomerFInd @customerData="getcutomerevent" />
                        </Dialog> -->
        <!-- <Dialog v-model:visible="visible" modal header="Crear Boleta" :style="{ width: '80rem' }"> -->
        <Dialog v-model:visible="visiblefindcustomer" modal :style="{ width: '50rem' }"
            style="background-color: #1f4aa2; border-color: #1f4aa2;" id="modalfinalpay">
            <!-- <div class="modal-header"> -->
                <button class="btn btn-close" @click="visiblefindcustomer = false">X</button>
            <!-- </div> -->
            <form
                class="modal-body"
                @submit.prevent="typeScreen == 'client' ? getPromotionsByRaffle() : saveEntity()"
                style="padding-top: 0; background-color: white; border-radius: 12px; padding-bottom: 3px; z-index: 1;">
                <h1 class="mb-4 pt-4 text-center" style="font-weight: bold; font-size: 2em;">DATOS DE COMPRA</h1>
                <div class="row">
                    <div class="col-12 mb-3">
                        <Label :bold="true">Documento</Label>
                        <Input class="form-control" v-model="customer.document" type="number"
                            @blur="listCustomers"></Input>
                    </div>
                    <div class="col-12 mb-3">
                        <Label :bold="true">Nombres y apellidos</Label>
                        <Input v-model="customer.name" :disabled="isDisabled" label="Nombre"></Input>
                    </div>
                    <div class="col-12 mb-3">
                        <Label :bold="true">Teléfono</Label>
                        <div class="row" style="padding: 0 15px;">
                            <Select v-model="customer.country_code" optionLabel="name" :options="countries"
                                class="col-4 col-md-3">
                                <template #value="slotProps">
                                    <div v-if="slotProps.value"
                                        class="d-flex align-items-center justify-content-center">
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
                            <Input class="col-8 col-md-9" v-model="customer.phone" :disabled="isDisabled"
                                label="Teléfono"></Input>
                        </div>
                    </div>
                    <div class="col-12 mb-3">
                        <Label :bold="true">Ciudad</Label>
                        <Select filter optionValue="id" fluid optionLabel="name" ref="multiselect"
                            v-model="customer.city" :disabled="isDisabled" :options="cities" :multiple="false"
                            :clear-on-select="true" :customer-search="true" placeholder="Selecciona" label="name"
                            track-by="id" @select="myChangeEvent"></Select>
                    </div>
                </div>
                <!-- <CustomerForm @customerData="handleUpdateData" :datadocument="documentcustomer"
                @closedialog="visibleCustomer = false" /> -->
                <hr>
                <div class="row">
                    <div class="col-md-12 mb-3">
                        <Label :bold="true">Boleta(s) a comprar</Label>
                        <MultiSelect v-model="ticket.number" display="chip" :options="ticket.number" filter fluid
                            disabled :maxSelectedLabels="15" class="w-full md:w-80" />
                        <!-- <Input disabled v-model="ticket.number" type="text"></Input> -->
                    </div>
                    <div class="col-md-12 mb-3" v-if="typeScreen == 'admin'">
                        <Label :bold="true">Vendedor</Label>
                        <Select v-model="ticket.seller" :options="dependencies.sellers" filter optionLabel="name"
                            optionValue="id" class="w-100"></Select>
                    </div>
                    <div class="col-12" v-if="typeScreen == 'client'">
                        <div class="d-flex justify-content-center">
                            <Checkbox v-model="ticket.agree" class="mr-2 mt-1" inputId="ingredient1" :value="true" />
                            <label class="poppins-medium" for="ingredient1"> He leído y estoy informado sobre la ley
                                1581 de 2012 - ley
                                de protección de datos personales </label>
                        </div>
                    </div>
                </div>

                <hr>

                <div v-if="typeScreen == 'admin'">
                    <div class="d-flex justify-content-end">
                        <button type="button" class="btn btn-primary" @click="add_payment()">+</button>
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
                    </div>
                </div>
                <div v-if="typeScreen == 'client'">
                    <div class="d-flex justify-content-center my-3">
                        <button type="submit" class="btn darkblue poppins-semibold" data-toggle="modal" @click="modalfinalpay = true;"
                            :disabled="validateForm" style="padding: .35em 1em .35em 1em; font-size: 2em;">
                            COMPRAR</button>
                    </div>

                </div>
                <div v-if="typeScreen == 'admin'">
                    <div class="d-flex justify-content-center my-3">
                        <Button type="submit" :disabled="validateForm">Guardar</Button>
                    </div>

                </div>

            </form>
        </Dialog>
        <Dialog v-model:visible="modalfinalpay" modal :style="{ width: '32rem' }"
            style="background-color: #1f4aa2; border-color: #1f4aa2;" id="modalfinalpay">
            <div class="modal-body text-center"
                style="padding-top: 0; background-color: white; border-radius: 12px; padding-bottom: 3px;">
                <h2 class="mb-4 pt-4 darkbluetext" style="font-weight: bold; font-size: 1.75em;">FINALIZAR PAGO</h2>

                <!-- Botón Wompi -->
                <button @click="saveEntity()"
                    class="btn darkblue btn-lg w-100 mb-5 d-flex align-items-center justify-content-center gap-2"
                    style="font-size: 1.75em; font-weight: bold;">
                    PAGO EN LINEA


                    <!-- Generator: Adobe Illustrator 19.2.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
                    <svg width="30" height="30" viewBox="0 0 188.25 187.833" xmlns="http://www.w3.org/2000/svg"
                        style="margin-left: 1rem;">

                        <radialGradient id="Circle_2_" cx="96.0109" cy="357.5831" r="93.1552" fx="45.8266" fy="353.8991"
                            gradientTransform="matrix(1 0 0 1 0 -264)" gradientUnits="userSpaceOnUse">
                            <stop offset="0.3155" style="stop-color:#2D5CA8" />
                            <stop offset="0.5312" style="stop-color:#285496" />
                            <stop offset="0.7289" style="stop-color:#1f4aa2" />
                            <stop offset="1" style="stop-color:#0D2D4D" />
                        </radialGradient>
                        <ellipse id="Circle_1_" class="st0" cx="94.345" cy="93.917" rx="93.157" ry="93.153" />
                        <g id="PSE_1_">
                            <path class="st1" d="M119.47,71H97.417c-0.099,0-0.198-0.014-0.295,0.006C93.613,71.767,87,75.354,87.034,83.188
		C86.852,86.202,88.172,91,94.475,93c0.019,0,15.72,0,15.72,0c0.696,0,4.989,0.982,4.704,8.47c-0.288,7.549-6.724,8.53-7.65,9.53
		H82.891c-0.768,0-1.391,0.732-1.391,1.5s0.623,1.5,1.391,1.5h24.492c0.079,0,0.157-0.366,0.235-0.38
		c3.344-0.572,9.749-4.002,10.062-12.207c0.404-10.611-7.273-11.281-7.351-11.286c0.011-0.003-15.516-0.045-15.516-0.045
		c-5.301-0.97-5.015-6.598-4.999-6.843c0.002-0.034,0.003,0.054,0.003,0.02C89.76,76.152,96.514,74,97.581,74h21.89
		c0.768,0,1.391-0.732,1.391-1.5C120.861,71.732,120.238,71,119.47,71z" />
                            <path class="st1" d="M153.047,70.843C152.92,70.807,152.788,71,152.656,71h-16.478c-7.459,0-10.828,8.637-10.967,9.014
		c-0.023,0.061-0.04,0.016-0.055,0.08c-0.171,0.773-4.187,18.937-4.052,24.934c0.129,5.642,5.875,7.693,8.895,8.016
		c0.05,0.006,0.1-0.043,0.151-0.043h22.908c0.778,0,1.41-0.722,1.41-1.5s-0.631-1.5-1.41-1.5h-22.822
		c-0.717,0-6.212-0.838-6.311-5.205c-0.053-2.344,0.614-6.83,1.418-11.362l31.881-0.238c0.68-0.005,1.26-0.482,1.377-1.153
		c0.062-0.35,1.494-8.503,1.494-13.392C160.094,72.834,153.335,70.927,153.047,70.843z M156.014,90.414l-30.154,0.252
		c0.926-4.913,1.868-8.94,2.027-9.663c0.322-0.805,3.088-7.004,8.291-7.004h16.255c0.88,0,4.842,1.556,4.842,4.853
		C157.275,82.457,156.409,87.958,156.014,90.414z" />
                            <path class="st1" d="M82.84,79.444C83.667,73.817,76.56,71,75.23,71c-0.002,0-0.004,0-0.004,0c-5.739,0-14.433,0.197-15.34,0.166
		c-0.121-0.013-0.246,0.067-0.372,0.086c-3.554,0.566-8.38,5.143-9.93,9.377l0.024,0.029c-0.155,0.472-0.291,1.2-0.498,2.294
		c-0.251,1.323-0.602,3.218-1.021,5.485c-0.836,4.53-1.939,10.573-3.039,16.613c-2.2,12.079-4.384,24.158-4.384,24.158
		c-0.135,0.745,0.36,1.459,1.105,1.594c0.082,0.015,0.164,0.023,0.245,0.023c0.65,0,1.228-0.464,1.347-1.128
		c0.924-5.106,2.439-13.468,3.957-21.805c3.579,4.515,8.031,4.989,8.254,5.01c0.055,0.006,0.11,0.01,0.167,0.005l14.091-0.403
		c0.121-0.003,0.239-0.022,0.354-0.057c6.685-2.005,8.695-8.903,8.778-9.196c0.013-0.049,0.025-0.099,0.033-0.15l3.825-23.429
		C82.832,79.622,82.833,79.494,82.84,79.444z M80.104,79.391l-3.797,23.176c-0.198,0.621-1.944,5.659-6.739,7.201l-13.8,0.394
		c-0.636-0.089-4.942-0.881-7.732-6.195c2.032-11.153,3.898-21.318,4.139-22.397c1.279-3.436,5.416-7.128,7.737-7.525
		c0.526,0.032,1.245,0.033,2.24,0.035c1.453,0.002,3.394,0.001,5.333-0.003c3.213-0.005,6.424-0.016,7.429-0.02
		C76.542,74.045,80.5,76.808,80.104,79.391z" />
                        </g>
                        <g id="Figures">
                            <ellipse class="st2" cx="19.366" cy="66.019" rx="3.923" ry="4.185" />
                            <path class="st2" d="M15.405,52.808c0-1.839-1.119-3.384-2.665-3.945c-1.306,2.363-2.513,4.789-3.614,7.272
		c0.658,0.531,1.468,0.858,2.356,0.858C13.649,56.993,15.405,55.119,15.405,52.808z" />
                            <path class="st2" d="M7.484,66.019c0-1.135-0.427-2.162-1.115-2.916c-0.806,2.304-1.525,4.648-2.151,7.03
		C6.07,69.798,7.484,68.09,7.484,66.019z" />
                            <ellipse class="st2" cx="19.913" cy="117.005" rx="3.923" ry="4.185" />
                            <path class="st2" d="M6.055,117.005c0-1.745-1.215-3.174-2.79-3.412c0.446,2.067,0.957,4.11,1.538,6.124
		C5.56,119.083,6.055,118.11,6.055,117.005z" />
                            <path class="st2"
                                d="M15.387,130.652c0-2.311-1.756-4.185-3.923-4.185c-1.547,0-2.871,0.963-3.51,2.35
		c0.812,2.004,1.69,3.974,2.635,5.906c0.282,0.069,0.573,0.113,0.875,0.113C13.63,134.837,15.387,132.963,15.387,130.652z" />
                            <path class="st2" d="M22.046,104h-7.867c-0.51-1-1.971-2.721-3.715-2.721c-2.167,0-3.923,1.964-3.923,4.275
		c0,2.311,1.756,4.266,3.923,4.266c1.744,0,3.205-0.821,3.715-2.821h6.44h2.217h0.188l8.251-15H44v-2H23.14l-8.575-15h-0.598H11.76
		H3.076c-0.204,0.994-0.388,1.995-0.561,3h10.803l7.018,12H1.25c-0.027,0.665-0.049,1.331-0.062,2H28.87L22.046,104z" />
                        </g>
                        <g id="ach_1_">
                            <path class="st3" d="M54.233,58.499h4.206c0,0,1.233,0.363,1.015,1.813l-0.798,5.584h-4.424c0,0-1.958-0.725-0.943-2.828
		c0,0,0.925-1.124,1.741-1.124l4.052,0.136" />
                            <path class="st3"
                                d="M66.997,58.499H62.79c0,0-1.45,0.725-1.813,2.611c0,0-0.979,2.756,0.181,4.786l0.49,0.109H65.6" />
                            <polyline class="st3" points="69.426,55.108 68.815,58.499 67.45,66.077 	" />
                            <path class="st3" d="M68.561,59.91c0,0,0.503-0.995,1.373-1.412c0,0,3.173-0.308,3.735,0.49c0,0,0.635,0.308,0.598,1.215
		l-0.979,5.693" />
                        </g>
                    </svg>
                </button>

                <!-- Botón WhatsApp -->
                <button @click="mesnajewa()"
                    class="btn darkblue btn-lg  w-100 d-flex align-items-center justify-content-center gap-2"
                    style="margin-bottom: 4em; font-size: 1.75em; font-weight: bold">
                    PAGO VÍA WHATSAPP
                    <i class="fab fa-whatsapp whatsapp"></i>
                </button>

                <!-- Información y contacto -->
                <div class="darkblue text-white p-3 rounded" style="border-radius: 12px !important;">
                    <p class="mb-2" style="font-size: .9em;">Términos y condiciones políticas de privacidad</p>
                    <p style="font-size: .9em;">Información de contacto</p>
                    <p class="mb-1 d-flex justify-content-center" style="font-size: .9em;">
                        <i class="fab fa-whatsapp whatsapp mr-1"></i> (+57) 315 253 2377
                    </p>
                    <p class="mb-0" style="font-size: .9em;">
                        <i class="fas fa-envelope"></i>
                        <i class="bi bi-envelope"></i> Rifasysorteos4@gmail.com
                    </p>
                </div>

            </div>

        </Dialog>

        <Modal :id="modalwompi" label="Pagos" title="Paga Con Wompi" size="xl">
            <form ref="wompiForm"></form>
        </Modal>



        <div v-if="typeScreen == 'client'">
            <div class="d-flex justify-content-center w-100 mb-3">
                <div class="w-70 text-center">
                    <label class="poppins-semibold fs-random-number" for="">NÚMEROS AL AZAR</label>
                    <input v-model="filters.number_random" type="text" class="input-customer poppins-medium"
                        placeholder="Cantidad de Números" aria-label="Cantidad de Números"
                        aria-describedby="basic-addon2">
                    <button class="blinking-button-2 mt-3" @click="generateRandomNumbers">Generar</button>
                </div>
            </div>
            <!-- <div class="d-flex justify-content-center w-100 mt-3">
                <div class="w-70 text-center">
                    <label class="poppins-semibold fs-random-number" for="">BUSQUE SU NÚMERO</label>
                    <div class="input-group mb-3">
                        <input v-model="filters.number" type="text" class="input-customer poppins-medium"
                            placeholder="Ingrese el número a buscar" aria-label="Ingrese el número a buscar"
                            aria-describedby="basic-addon2">
                    </div>
                </div>
            </div> -->
            <div class="d-flex justify-content-center w-100">
                <div class="w-70 text-center">
                    <label class="poppins-semibold fs-random-number" for="">&nbsp;</label>
                    <MultiSelect v-model="ticket.number" display="chip" :options="ticket.number" filter fluid
                        placeholder="Números seleccionados" :maxSelectedLabels="15" class="w-full md:w-80"
                        @change="deleteTicket" />
                </div>
            </div>
        </div>
        <div v-if="typeScreen == 'admin'" class="my-3">
            <h3 v-if="isLoadingTickets == false">Boletas Disponibles</h3>
            <h3 v-else>Cargue de Boletas</h3>
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
            <div class="d-flex flex-column align-items-center w-100"
                :class="typeScreen == 'client' ? 'border-client' : ''" v-else>
                <div class="mb-2">
                    <span class="poppins-semibold " style="font-size: 1.45em;">NÚMEROS DISPONIBLES</span>
                </div>
                <div id="board-buy" class="button-grid w-80 grid-buttons-tickets scroll-container">
                    <button :class="{ active: isActive(button) }" v-for="(button, index) in filteredButtons"
                        :key="index" class="grid-button" @click="buyTicket(button, button)">
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

<style type="text/css">
.st0 {
    fill: url(#Circle_2_);
}

.st1 {
    fill: #FFFFFF;
}

.st2 {
    fill: #FDB718;
}

.st3 {
    fill: none;
    stroke: #FFFFFF;
    stroke-miterlimit: 10;
}
</style>

<script setup>
import { ref, onMounted, computed, defineProps, toRaw, watch } from 'vue';
import { TicketServices } from '@/services/ticket.service'
import { PromotionServices } from '@/services/promotion.service'
import { RaffleServices } from '@/services/raffle.service'
import { SellerTicketsServices } from "@/services/seller_tickets.service";
import { CustomerServices } from '@/services/customer.service'
import Swal from 'sweetalert2'
import CustomerForm from '@views/customer/CustomerForm.vue';
import CustomerFInd from '../customer/CustomerFInd.vue';
import Helper from '@/helpers/Helper';
import { SellerServices } from '@/services/seller.service';
import Cookies from 'js-cookie';
import { type } from 'jquery';
import { useRoute } from 'vue-router';
import { elements } from 'chart.js';



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
const router = useRoute()

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
const modalfinalpay = ref(false)
const type_user = ref("")

const referencia = ref("");
const monto = ref("0");
const moneda = "COP";
const secretoIntegridad = "prod_integrity_3FCZzpavOOU1wtUttCkAZLxLYthemogy";
const isDisabled = ref(true)
const ticketsBooked = ref([])
const isLoadingTickets = ref(false)
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

watch(() => router.path, async () => {

    if (router.path == '/tickets/Libre') {
        setTimeout(async () => {
            await search()
        }, 500);
    } else {
        setTimeout(async () => {
            await search()
        }, 1000);
    }

})

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

    if (props.typeScreen == 'client') {
        ticket.value.seller = 3
    }

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

    // ticket.value.seller = selleridofice[0].id

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
    buttons.value = [];

    if (isLoadingTickets.value != true && props.typeScreen == 'admin') { // Solo muestra boletas disponibles, que no están asignadas
        buttons.value = [];
        var response = await SellerTicketsServices.getTiketsFreeForSeller(1, 99999)
        raffle.value = response.raffle
        ticketsBooked.value = response

        let counter = 0
        activeButtons.value = new Set();
        // for (let index = response.raffle.start_number; index <= response.raffle.final_number; index++) {
        for (let index = response.raffle.start_number; index <= response.raffle.final_number && counter < 100; index++) {
            let formattedNumber = index.toString().padStart(4, '0');
            if (!response.tickets_excluded.some(ticket => ticket.toString().padStart(4, '0') === formattedNumber)) {
                buttons.value.push(formattedNumber);
            }
            response.seller_range.forEach(range => {
                range.numbers.forEach(number => {
                    let formattedNumber = number.toString().padStart(4, '0');

                    if (formattedIndex == formattedNumber) {
                        buttons.value.push(formattedNumber);
                    }
                });
            });
            counter++
        }
        return
    }

    let filterJson = {}

    if (props.typeScreen == 'client') {
        filterJson = {
            raffle: props.raffle?.id
        }
    }
    // filters.value.raffle = 1
    filterJson.raffle = 1
    type_user.value = Cookies.get('type_user')
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
        // if(Cookies.get('seller_id')){
        //     getRangeForClients()
        // }else {
        // }
        if (type_user.value == 'false') {
            if (response.tickets.some(ticket => ticket.number == filters.value.number)) {
                buttons.value = [filters.value.number]
            }
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

const mountedBuyTicket = async () => {
    visiblefindcustomer.value = true;
    getPromotionsByRaffle()

    if (ticket.value.payments.length == 0) {

    }
    ticket.value.payments[0].ticket = ticket.value.number[0] || "";
    ticket.value.seller = await SellerTicketsServices.findByidbyTicket(ticket.value.payments[0].ticket)
}

const saveEntity = async (is_whatsapp = false) => {

    let value = 0
    let total = 0

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
                amount: 0,
                expiration_date: "2024-12-31",
                reference: referencia.value
            })
            total += parseInt(element.value)
            value = 0
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
    let isWompiPay = false
    if (ticket.value.id) {
        await TicketServices.updateCustomer(ticket.value, ticket.value.id)
        message = 'Datos guardados con Éxito.'
    } else {
        let response = "";
        ticket.value.raffle = await RaffleServices.listlast();
        ticket.value.raffle = ticket.value.raffle?.id
        if (props.typeScreen == 'admin') {
            response = await TicketServices.createticket(ticket.value, ticket.value.raffle)
        } else {
            // if (is_whatsapp == false) ticket.value.value = ticket.value.value_to_pay * ticket.value.number.length
            if (is_whatsapp == false) ticket.value.value = 0
            else {
                ticket.value.value = 0
                ticket.value.payments = []
            }
            response = await TicketServices.createticketClient(ticket.value)
        }
        if (props.typeScreen == 'client') {
            message = `Boletas reservadas con éxito. A continuación por favor realizar el pago.`
            isWompiPay = true
        }else {
            if (response.duplicated.length > 0)
                message = `Tickets creados con éxito. ${response.success} y estas boletas ya estaban creadas con anterioridad ${response.duplicated} y no se realizaron cambios ni en creación ni agregando pagos`
            else
                message = `Tickets creados con éxito. ${response.success}`
        }
    }
    visible.value = false
    visibleCustomer.value = false
    Swal.fire({
        title: '¡Éxito!',
        text: message,
        icon: 'success',
        confirmButtonText: 'Continuar'
    }).then((result) => {
        if (result.isConfirmed && isWompiPay) {
            generateWompiPay(total.toString() + "00")
        }
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
    console.log('filters.value.number ==> ', filters.value.number);

    filters.value.number = ""
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
    } else {
        ticket.value.raffle = raffle.value.id
    }



    // promotion.value = await PromotionServices.promotionsByRaffle(ticket.value.raffle)
    promotion.value = await PromotionServices.promotionsByRaffle(1) // Debe quedar como la línea anterior


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

            const raffle = await RaffleServices.listlast()

            ticket.value.value_to_pay = raffle.value_ticket
            ticket.value.promotion_id = null
        }
    }
    monto.value = ticket.value.value_to_pay
    // 85.000
    monto.value = ticket.value.value_to_pay * ticket.value.number.length
    monto.value += "00"
    // if(props.typeScreen == 'client'){
    //     saveEntity()
    // }

}
const telefono = "573154862281"; // Número en formato internacional (sin "+")


const generateWompiPay = async (monto_ = "0") => {
    const mensajedado = `${referencia.value}${monto.value}${moneda}${secretoIntegridad}`;
    await hashSHA256(mensajedado).then(hash => cifrar.value = hash);

    if (props.typeScreen == 'client') {
        saveEntity()
    }

    setTimeout(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.wompi.co/widget.js';
        script.setAttribute('data-render', 'button');
        script.setAttribute('data-public-key', 'pub_prod_KI6rFlfUF70XgHhKL1UcE4l5umZaE68v');
        script.setAttribute('data-currency', moneda);
        script.setAttribute('data-amount-in-cents', monto.value);
        script.setAttribute('data-reference', referencia.value);
        script.setAttribute('data-reference', referencia.value);
        //script.setAttribute('data-reference', "c8d3fa5b7e99a21k");// de pruebas
        script.setAttribute(
            'data-signature:integrity',
            cifrar.value
        );
        wompiForm.value.appendChild(script);
        const waitForButton = setInterval(() => {
            const wompiButton = wompiForm.value.querySelector('button');
            if (wompiButton) {
                clearInterval(waitForButton);
                wompiButton.click();

                // Restaurar scroll
                setTimeout(() => {
                    document.body.style.overflow = 'auto';
                    document.body.style.position = 'static';
                }, 2000);
            }
        }, 200);
    }, 200); // <-- Puedes aumentar este valor si sigue fallando (ej: 1500ms)

    visible.value = false
    // document.body.style.overflow = 'auto';
    // document.body.style.overflow = 'hidden';
    // document.body.style.position = 'fixed';
    // document.body.style.width = '100%';
    // window.scrollTo(0, 0); // Asegura que el scroll esté arriba
    // document.activeElement.blur(); // Evita interferencia del teclado
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

                

                //window.open( `https://wa.me/${telefono}?text=${mensajewa}`,"_blank");
            } else if (data.event === 'unprocessabletransaction') {
                alert('Transacción no procesable')
            } else if (data.event === 'transaction_error') {
                alert('Error en el pago')
            }
        }
        // setTimeout(() => {
        //     document.body.style.overflow = 'hidden';
        //     document.body.style.position = 'fixed';
        //     document.body.style.width = '100%';
        // }, 2000);
    });
    const headerElement = document.getElementById('header-raffle');

    // if (headerElement) {
    //     headerElement.scrollIntoView({ behavior: 'smooth' });
    // }
}

const mesnajewa = () => {

    saveEntity(true)
    let boletasTexto = "N°";
    ticket.value.number.forEach((boleta) => {
        boletasTexto += ` ${boleta}`;
    });



    const mensajef = `
Hola, he separado boleta con la siguiente información:

Boleta: ${boletasTexto} 
Nombre:  ${customer.value.name}
Documento: ${customer.value.document}
Ciudad: ${customer.value.cityname}
Valor a cancelar:$${Helper.thousandSeparator(monto.value / 100 )}
——————————————

MEDIOS DE PAGO

NEQUI: 3156549290
DAVIPLATA: 3156549290
TRANSFIYA: 3156549290
BANCOLOMBIA (AHORROS): 91267627121  
TITULAR: UBER MAYORGA

DATÁFONO VIRTUAL:
https://checkout.wompi.co/l/VPOS_KZxD3H

* Nota: la boleta permanecerá separada solo por 24 horas, 
Si en este lapso de tiempo no realizas el pago o un abono mínimo de $35.000 pesos la boleta quedará automáticamente nuevamente disponible al público

POR FAVOR REALIZA EL PAGO Y ME ENVÍAS EL COMPROBANTE
`;

    // Codificamos para usarlo en un enlace de WhatsApp
    const mensajewa = encodeURIComponent(mensajef);


    window.open(`https://wa.me/${telefono}?text=${mensajewa}`, "_blank");
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
        city: "",
        cityname: ""
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
                    country_code: countries.value[3],
                    name: "",
                    phone: "",
                    city: "",
                }
                isDisabled.value = false
            } else {
                customer.value = {
                    name: response[0].name,
                    document: response[0].document,
                    country_code: countries.value[3],
                    phone: response[0].phone,
                    city: response[0].city.id,
                    cityname: response[0].city.name
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
    if (filters.value.number) {

        if (isLoadingTickets.value != true && props.typeScreen == 'admin') { // Solo muestra boletas disponibles, que no están asignadas
            let counter = 0
            buttons.value = [];

            if (ticketsBooked.value.raffle) {
                for (let index = ticketsBooked.value.raffle.start_number; index < ticketsBooked.value.raffle.final_number && counter < 100; index++) {
                    let formattedNumber = index.toString().padStart(4, '0');
                    if (filters.value.number && formattedNumber.includes(filters.value.number)) {
                        if (!ticketsBooked.value.tickets_excluded.some(ticket => ticket.toString().padStart(4, '0') === formattedNumber)) {
                            buttons.value.push(formattedNumber);
                            counter++
                        }
                    }
                }
            }
        }
        else if (isLoadingTickets.value == true && props.typeScreen == 'client') {
            buttons.value = []
            ticketsBooked.value.filter(element => !element.created_at)
            ticketsBooked.value.forEach(element => {
                let formattedNumber = element.number.toString().padStart(4, '0');
                if (formattedNumber.includes(filters.value.number)) {
                    buttons.value.push(element.number.toString().padStart(4, '0'));
                }
            });
        }
        else {
            let counter = 0
            buttons.value = []
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
    }

    if (!filters.value.number) {
        let counter = 0;
        if (isLoadingTickets.value != true && props.typeScreen == 'admin') { // Solo muestra boletas disponibles, que no están asignadas
            buttons.value = [];
            if (ticketsBooked.value.raffle) {
                for (let index = ticketsBooked.value.raffle.start_number; index <= ticketsBooked.value.raffle.final_number && counter < 100; index++) {
                    let formattedNumber = index.toString().padStart(4, '0');
                    if (!ticketsBooked.value.tickets_excluded.some(ticket => ticket.toString().padStart(4, '0') === formattedNumber)) {
                        buttons.value.push(formattedNumber);
                    }
                    ticketsBooked.value.seller_range.forEach(range => {
                        range.numbers.forEach(number => {
                            counter++

                            let formattedIndex = index.toString().padStart(4, '0');
                            let formattedNumber = number.toString().padStart(4, '0');

                            if (formattedIndex == formattedNumber) {
                                buttons.value.push(formattedNumber);
                            }
                        });
                    });
                }
            }
        }

        else if (isLoadingTickets.value == true && props.typeScreen == 'client') {
            buttons.value = []
            ticketsBooked.value = ticketsBooked.value.filter(element => !element.created_at)

            ticketsBooked.value.forEach(element => {
                buttons.value.push(element.number.toString().padStart(4, '0'));
            });
        }

        else {
            let counter = 0
            buttons.value = []
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
    }
    return buttons.value;
});

const whereAmI = computed(() => {
    const route = useRoute()
    const path = route.path

    if (path == '/tickets/LoadingTickets') {
        isLoadingTickets.value = true
        return 'loading'
    } else if (path == '/tickets/Libre') {
        isLoadingTickets.value = false
        return 'free'
    } else if (path == '/') {
        isLoadingTickets.value = true
        return 'home'

    }
});

const validateForm = computed(() => {
    let agree = ticket.value.agree ? ticket.value.agree[0] || false : false;
    if (props.typeScreen == 'admin') {
        agree = true; // En la pantalla de administración, se asume que el acuerdo ya está aceptado
    }

    if (!ticket.value.number.length > 0 || !ticket.value.seller || !customer.value.document || !customer.value.name || !customer.value.phone || !customer.value.city || !agree) {
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