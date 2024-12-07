<template>
    <div>
    
        <Dialog v-model:visible="visible" modal header="Crear Boleta" :style="{ width: '80rem' }">
            <div class="row">
                <div class="col-md-6 mb-3">
                    <Label>Número</Label>
                    <Input disabled v-model="ticket.number" type="text"></Input>
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
            </div>
    
            <hr>
    
            <div>
                <div class="d-flex justify-content-end">
                    <button class="btn btn-success" @click="add_payment()">+</button>
                </div>
                <div class="row" v-for="(i, index) in ticket.payments" :key="index">
                    <div class="col-3">
                        <Label>Boleta</Label>
                        <Select v-model="i.ticket" :options="ticket.number" filter class="w-100"></Select>
                    </div>
                    <div class="col-3">
                        <Label>Método de pago</Label>
                        <Select v-model="i.payment_method" :options="payment_methods" filter class="w-100"></Select>
                    </div>
                    <div class="col-3">
                        <Label>Valor</Label>
                        <InputNumber fluid v-model="i.amount" />
                    </div>
                    <div class="col-3">
                        <div class="row">
                            <div class="col-10">
                                <Label>Fecha de expiración</Label>
                                <DatePicker v-model="i.expiration_date" showIcon fluid  dateFormat="yy-mm-dd" :manualInput="false" @date-select="i.expiration_date = Helper.formatDateForm($event)" />
                            </div>
                            <div class="col-2">
                                <button class="btn btn-danger mt-4" @click="remove_payment(index)">X</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="typeScreen == 'client'">
                <div class="d-flex justify-content-center my-3">
                      <Button data-toggle="modal"  :data-target="`#${modalwompi}`" > Guardar</Button>
                </div>

            </div>
            <div v-if="typeScreen == 'admin'">
                <div class="d-flex justify-content-center my-3">
                      <Button @click="saveEntity">Guardar</Button>
                </div>

            </div>
    
            
        </Dialog>

        <Modal  :id="modalwompi" label="Pagos" title="Paga Con Wompi" size="xl">
            <form ref="wompiForm"></form>
        </Modal>

    

        <div v-if="typeScreen == 'client'">
            <div class="d-flex justify-content-center w-100 mb-3">
                <div class="w-70 text-center">
                    <label class="poppins-bold fs-random-number" for="">NÚMEROS AL AZAR</label>
                    <div class="input-group mb-3 input-customer">
                        <input v-model="filters.number_random" type="text" class="form-control poppins-medium" placeholder="Cantidad de Números" aria-label="Cantidad de Números" aria-describedby="basic-addon2">
                        <div class="input-group-append" @click="generateRandomNumbers" style="cursor: pointer;">
                            <span class="input-group-text" id="basic-addon2"><i class="fas fa-search fa-lg"></i></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-center w-100 mt-5">
                <div class="w-70 text-center">
                    <label class="poppins-bold fs-random-number" for="">BUSQUE SU NÚMERO</label>
                    <div class="input-group mb-3 input-customer">
                        <input v-model="filters.number" type="number" class="form-control poppins-medium" placeholder="Ingrese el número a buscar" aria-label="Ingrese el número a buscar" aria-describedby="basic-addon2">
                        <div class="input-group-append">
                            <span class="input-group-text" id="basic-addon2"><i class="fas fa-search fa-lg"></i></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-center w-100 mt-5">
                <div class="w-70 text-center">
                    <label class="poppins-bold fs-random-number" for="">&nbsp;</label>
                    <div class="input-group mb-3 input-customer">
                        <input v-model="ticket.number" type="text" class="form-control poppins-medium text-center" placeholder="Números seleccionados" readonly
                        aria-label="Números seleccionados" aria-describedby="basic-addon2" style="border-top-right-radius: 12px; border-bottom-right-radius: 12px;">
                    </div>
                </div>
            </div>
        </div>
        <div v-if="typeScreen == 'admin'" class="my-3">
            <h3>Boletas Disponibles</h3>
        </div>
        <hr>
        <div class="row" v-if="typeScreen == 'admin'">
            <!-- <div class="col-md-4">
                <Label>Rifa</Label>
                <Select v-model="filters.raffle" :options="dependencies.raffles" @change="search" filter optionLabel="name" optionValue="id" fluid></Select>
            </div> -->
            <div class="col-md-4">
                <Label required="0">Filtrar Número</Label>
                <Input v-model="filters.number" required="0"></Input>
            </div>
            <div class="col-md-8">
                <div v-if="typeScreen == 'admin'">
                <Label>Número seleccionados</Label>
                <MultiSelect v-model="ticket.number" display="chip" :options="ticket.number" filter fluid
                :maxSelectedLabels="15" class="w-full md:w-80"  @change="deleteTicket" />
                <!-- <Input disabled v-model="ticket.number" class="mb-3" label="Números seleccionados"></Input> -->
            </div>
            </div>
            <div class="col-12">
                <div class="w-100 d-flex justify-content-center">
                    <Button class="mt-3" @click="visiblefindcustomer = true;"  >Comprar</Button>
                </div>
            </div>
        </div>
        <!-- <div class="mt-3 d-flex justify-content-center" v-if="typeScreen == 'admin'">
            <Button :disabled="!filters.raffle" @click="search">Buscar</Button>
        </div> -->

        <div class="w-100 d-flex justify-content-center" v-if="typeScreen == 'client' && ticket.number">
           <Button class="mt-3" @click="visibleCustomer = true;">Comprar</Button> 

           <button id="modalTicket"  data-toggle="modal"  :data-target="`#${modal}`" style="display: none;"> prueba2</button>
           <!-- <a  class="mt-3 btn-dark"  data-widget="navbar-search" href="#" role="button" data-toggle="modal" data-target="#customer-form">
                  Crear cliente
           </a> -->
        </div>
        
        <div class="container-fluid d-flex flex-column-reverse flex-md-row mt-3 pb-5" :class="typeScreen == 'admin' ? 'justify-content-between' : 'justify-content-center'">
            <div class="button-grid w-80 grid-buttons-tickets scroll-container">
                <button :class="{ active: isActive(button) }" :disabled="!filters.raffle && typeScreen == 'admin'" v-for="(button, index) in filteredButtons" :key="index" class="grid-button" @click="buyTicket(button, button)">
                    <!-- <button :disabled="!filters.raffle" v-for="(button, index) in buttons" :key="index" class="grid-button" data-toggle="modal" :data-target="`#${modal}`" @click="buyTicket(button)"> -->
                      {{ button }}
                </button>
            </div>
        </div>
        <Dialog v-model:visible="visibleCustomer" modal header="Crear Cliente" :style="{ width: '50%' }">
          <CustomerForm   @customerData = "handleUpdateData"     @closedialog = "visibleCustomer = false" />
       </Dialog>
       <Dialog v-model:visible="visiblefindcustomer" modal header="Buscar Cliente" :style="{ width: '50%' }">
           <CustomerFInd @customerData = "getcutomerevent" />
       </Dialog>
    
    </div>
</template>

<script setup>
import { ref, onMounted, computed, defineProps } from 'vue';
import { TicketServices } from '@/services/ticket.service'
import { PromotionServices } from '@/services/promotion.service'
import { RaffleServices } from '@/services/raffle.service'
import Swal from 'sweetalert2'
import CustomerForm from '@views/customer/CustomerForm.vue';
import CustomerFInd from '../customer/CustomerFInd.vue';
import Helper from '@/helpers/Helper';
import { SellerServices } from '@/services/seller.service';


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

const modal = ref('ticket_modal')
const modalwompi = ref('wompi-modal')
const raffle = ref({})

const buttons = ref(Array.from({ length: 10 }, (_, i) => `${i + 1}`));
const visible = ref(false);

const payment_methods = ref(['EFECTIVO', 'TRANSFERENCIA', 'CONSIGNACIÓN', 'NEQUI', 'DAVIPLATA', 'BANCOLOMBIA', 'AHORRO A LA MANO', 'WOMPI'])
const ticket = ref({})
const filters = ref({
    number: "",
    raffle: ""
})
const activeButtons = ref(new Set());
const promotion = ref({})
const dependencies = ref({
    sellers: [],
    customers: [],
    raffles: []
})
const wompiForm = ref(null);
const visibleCustomer = ref(false);
const cifrar = ref("")
const costumerdata = ref("")
const visiblefindcustomer = ref(false)

const referencia = ref("");
const monto = "200000";
const moneda = "COP";
const secretoIntegridad = "prod_integrity_3FCZzpavOOU1wtUttCkAZLxLYthemogy";

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


function generarYValidarCodigo(longitud = 16 ) {
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
            return   codigoAleatorio;
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

const mensaje = `${referencia.value}${monto}${moneda}${secretoIntegridad}`;

hashSHA256(mensaje).then(hash => console.log("Hash SHA-256:", hash));

const  getcutomerevent = (data) => {
   console.log("numbre", ticket.value.number)
   if(data){
    ticket.value.customer = data.id
    visiblefindcustomer.value = false
    getPromotionsByRaffle()
   }else{
    visiblefindcustomer.value = false
    visibleCustomer.value = true
   }
}
onMounted(async () => {

    limpiarFormulario()
    search()
    dependencies.value = await TicketServices.dependencies()
    const selleridofice =  await SellerServices.getsellerofice()

    ticket.value.seller = selleridofice[0].id

    const ticketsee = sessionStorage.getItem('ticket');
    console.log("ticketsee", ticketsee)
    if(ticketsee) {
        ticket.value.number.push(ticketsee)
        sessionStorage.removeItem('ticket');
        
    }
    
    
    //referencia.value = await TicketServices.getTiketsRefferece()
      
    const script = document.createElement('script');
     script.src = 'https://checkout.wompi.co/widget.js';
     script.setAttribute('data-render', 'button');
     script.setAttribute('data-public-key', 'pub_prod_KI6rFlfUF70XgHhKL1UcE4l5umZaE68v');
     script.setAttribute('data-currency', moneda);
     script.setAttribute('data-amount-in-cents', monto);
     script.setAttribute('data-reference',  referencia.value);
     //script.setAttribute('data-reference', "c8d3fa5b7e99a21k");// de pruebas
     script.setAttribute(
       'data-signature:integrity',
       cifrar.value
     );

  // Insertar el script en el formulario
  wompiForm.value.appendChild(script);

  window.addEventListener('message', function(event) {
  if (event.origin === 'https://checkout.wompi.co') {
    const data = event.data;

    if (data.event === 'transaction_approved') {
      // Pago aprobado
    } else if (data.event === 'unprocessabletransaction') {
    
      saveEntity()

    } else if (data.event === 'transaction_error') {
      // Error en el pago
    }
  }
});
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
    
    if(props.typeScreen == 'client') {
        filterJson = {
            raffle: props.raffle?.id
        }
    }else {
        // if(!filters.value.raffle) {
        //     return
        // }
        // filterJson = {
        //     raffle: filters.value.raffle
        // }
    }
    filters.value.raffle = 1
    filterJson.raffle = 1
    const response = await TicketServices.getTiketsByRaffle(filterJson.raffle)
    raffle.value = response.raffle


    if (filters.value.number) {
       
        if (response.tickets.some(ticket => ticket.number == filters.value.number)) {
            buttons.value = [filters.value.number]
        } else {
            buttons.value = [];
        }
    } else {
        buttons.value = [];
        for (let index = response.raffle.start_number; index <= response.raffle.final_number; index++) {
            if (!response.tickets.some(ticket => ticket.number == index)) {
                let formattedNumber = index.toString().padStart(4, '0');
                buttons.value.push(formattedNumber);
            }
        }
    }
}

const saveEntity = async () => {
    
    let value = 0
    ticket.value.payments.forEach(element => {
        value += parseInt(element.amount)
    });
    if(!value) {
        value = 0
    }
    ticket.value.value = value
    let message = ''
    if (ticket.value.id) {
        await TicketServices.updateCustomer(ticket.value, ticket.value.id)
        message = 'Datos guardados con Éxito.'
    } else {
        const response = await TicketServices.createCustomer(ticket.value)
        if(response.duplicated.length > 0)
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
        payment_method: "",
        amount: "",
        expiration_date: ""
    })
}

const getPromotionsByRaffle = async() => {
   
   
    if(props.typeScreen == 'client') {
        ticket.value.raffle = props.raffle
    }
    else {
        ticket.value.raffle = raffle.value.id
    }
    
    promotion.value =  await PromotionServices.promotionsByRaffle(ticket.value.raffle)
   
    
    
    if(promotion.value[0]?.number_of_tickets <= ticket.value.number.length){
        console.log("filipe")
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
        console.log(ticket.value)
        if(props.typeScreen == 'client') {
            ticket.value.value_to_pay = props.raffle.value_ticket
        } else {
            
            // const raffle = await RaffleServices.show(filters.value.raffle)
            
            ticket.value.value_to_pay = raffle.value.value_ticket
            ticket.value.promotion_id = null
        }
    }
   
}

const generateRandomNumbers = () => {
    if(filters.value.number_random > 10) {
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
        promotion_id: null,
        value_to_pay: "",
        status: "",
        payments: [{
            payment_method: "",
            amount: "",
            expiration_date: ""
        }]
    }
}

const deleteTicket = (ticketEvent) => {
    console.log('ticket', ticketEvent);
    activeButtons.value = new Set()
    
    ticket.value.number.forEach(element => {
        activeButtons.value.add(element);
    });
}

const filteredButtons = computed(() => {
  if (filters.value.number) {
    return buttons.value.filter(button => button.toString().includes(filters.value.number));
  }
  return buttons.value;
});

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