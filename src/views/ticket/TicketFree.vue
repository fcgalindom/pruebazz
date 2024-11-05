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
            </div>
    
            <hr>
    
            <div>
                <div class="d-flex justify-content-end">
                    <button class="btn btn-success" @click="add_payment()">+</button>
                </div>
                <div class="row" v-for="(i, index) in ticket.payments" :key="index">
                    <div class="col-3">
                        <Label>Boleta</Label>
                        <Select2 ref="multiselect" v-model="i.ticket" :options="ticket.number" :multiple="false" :clear-on-select="true" :preserve-search="true" placeholder="Selecciona" track-by="id" />
                    </div>
                    <div class="col-3">
                        <Label>Método de pago</Label>
                        <Select2 ref="multiselect" v-model="i.payment_method" :options="payment_methods" :multiple="false" :clear-on-select="true" :preserve-search="true" placeholder="Selecciona" track-by="id" />
                    </div>
                    <div class="col-3">
                        <Input v-model="i.amount" type="text" label="Valor"></Input>
                    </div>
                    <div class="col-3">
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
            <div v-if="typeScreen == 'client'">
                <div class="d-flex justify-content-center my-3">
                      <Button   data-toggle="modal"  :data-target="`#${modalwompi}`" > Guardar</Button>
                </div>

            </div>
            <div v-if="typeScreen == 'admin'">
                <div class="d-flex justify-content-center my-3">
                      <Button @click="saveEntity">Guardar</Button>
                </div>

            </div>
    
            
        </Modal>

        <Modal  :id="modalwompi" label="Pagos" title="Paga Con Wompi" size="xl">
            <form ref="wompiForm"></form>
        </Modal>

    

        <div v-if="typeScreen == 'client'">
            <div class="d-flex justify-content-center w-100 mb-3">
                <div class="w-70 text-center">
                    <label class="poppins-bold fs-random-number" for="">NÚMEROS AL AZAR</label>
                    <div class="input-group mb-3 input-customer">
                        <input type="text" class="form-control poppins-medium" placeholder="Cantidad de Números" aria-label="Cantidad de Números" aria-describedby="basic-addon2">
                        <div class="input-group-append">
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
        <div class="row" v-if="typeScreen == 'admin'">
            <div class="col-md-4">
                <Label>Rifa</Label>
                <Select2 ref="multiselect" v-model="filters.raffle" :options="dependencies.raffles" :multiple="false" :clear-on-select="true" :preserve-search="true" label="name" placeholder="Selecciona" track-by="id" @select="search" />
            </div>
            <div class="col-md-4">
                <Input v-model="filters.number" required="0" label="Número"></Input>
            </div>
        </div>
        <!-- <div class="mt-3 d-flex justify-content-center" v-if="typeScreen == 'admin'">
            <Button :disabled="!filters.raffle" @click="search">Buscar</Button>
        </div> -->

        <div class="w-100 d-flex justify-content-center" v-if="typeScreen == 'client' && ticket.number">
           <Button class="mt-3" data-toggle="modal" :data-target="`#customer-form`" @click="getPromotionsByRaffle">Comprar</Button> 

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
            <div v-if="typeScreen == 'admin'">
                <Input disabled v-model="ticket.number" class="mb-3" label="Números seleccionados"></Input>
                <div class="w-100 d-flex justify-content-center">
                    <Button class="mt-3" data-toggle="modal" :data-target="`#${modal}`" @click="getPromotionsByRaffle">Comprar</Button>
                </div>
            </div>
        </div>
        <CustomerForm @customerData="customerEmit"   />
    
    </div>
</template>

<script setup>
import { ref, onMounted, computed, defineProps } from 'vue';
import { TicketServices } from '@/services/ticket.service'
import { PromotionServices } from '@/services/promotion.service'
import Swal from 'sweetalert2'
import CustomerForm from '@views/customer/CustomerForm.vue';



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

const buttons = ref(Array.from({ length: 999 }, (_, i) => `${i + 1}`));

const payment_methods = ref(['Efectivo', 'Tarjeta de crédito', 'Tarjeta de débito', 'Transferencia', 'Consignación'])
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
const cifrar = ref("")

const referencia = "c8d3fa5b7e99a21k";
const monto = "200000";
const moneda = "COP";
const secretoIntegridad = "prod_integrity_3FCZzpavOOU1wtUttCkAZLxLYthemogy";
const mensaje = `${referencia}${monto}${moneda}${secretoIntegridad}`;
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
hashSHA256(mensaje).then(hash => console.log("Hash SHA-256:", hash));
onMounted(async () => {
    limpiarFormulario()
    search()
    dependencies.value = await TicketServices.dependencies()
    const script = document.createElement('script');
     script.src = 'https://checkout.wompi.co/widget.js';
     script.setAttribute('data-render', 'button');
     script.setAttribute('data-public-key', 'pub_prod_KI6rFlfUF70XgHhKL1UcE4l5umZaE68v');
     script.setAttribute('data-currency', moneda);
     script.setAttribute('data-amount-in-cents', monto);
     script.setAttribute('data-reference', referencia);
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
      console.log('Pago aprobado:', data.transaction);
    } else if (data.event === 'unprocessabletransaction') {
    
      console.log('Pago declinado:', data.transaction);
      saveEntity()

    } else if (data.event === 'transaction_error') {
      // Error en el pago
      console.log('Error en el pago:', data.transaction);
    }
  }
});
})

const isActive = (button) => {
    return activeButtons.value.has(button);
}
const prueba = () => {
    const modalElement = document.getElementById('wompi-modal');

    modal.show(); 
}
const customerEmit = async (customerData) => {
  dependencies.value = await TicketServices.dependencies()
   ticket.value.customer = customerData.customer
    document.getElementById('closeModal').click()
   document.getElementById('modalTicket').click()
}

const search = async () => {
    let filterJson = {}
    console.log('props.raffle ==> ', props.raffle);
    
    if(props.typeScreen == 'client') {
        filterJson = {
            raffle: props.raffle?.id
        }
    }else {
        if(!filters.value.raffle) {
            return
        }
        filterJson = {
            raffle: filters.value.raffle?.id
        }
    }
    console.log('filterJson ==> ', filterJson);
    
    const response = await TicketServices.getTiketsByRaffle(filterJson.raffle)

    if (filters.value.number) {
        console.log('response.tickets ==> ', response.tickets);

        if (response.tickets.some(ticket => ticket.number == filters.value.number)) {
            buttons.value = [filters.value.number]
        } else {
            buttons.value = [];
        }
    } else {
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
        payments: ticket.value.payments,
        promotion_id: ticket.value.promotion_id,
        value_to_pay: ticket.value.value_to_pay,
    }
    if (ticket.value.id) {
        await TicketServices.updateCustomer(form, ticket.value.id)
    } else {
        
        await TicketServices.createCustomer(form)

    }
    document.getElementById('closeModal').click()
    Swal.fire({
        title: '¡Éxito!',
        text: 'Datos guardados con Éxito.',
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
        ticket.value.raffle = filters.value.raffle
    }
    
    promotion.value =  await PromotionServices.promotionsByRaffle(ticket.value.raffle?.id)
    if(promotion.value[0].number_of_tickets <= ticket.value.number.length){
        Swal.fire({
            title: '¡Felicitaciones!',
            text: `Genial se te aplicará la promoción ${promotion.value[0].name} con un valor de ${promotion.value[0].new_value} por boleta`,
            icon: 'info',
            confirmButtonText: 'Continuar'
        })
        ticket.value.promotion_id = promotion.value[0].id
        ticket.value.value_to_pay = promotion.value[0].new_value
    } else {
        if(props.typeScreen == 'client') {
            ticket.value.value_to_pay = props.raffle.value_ticket
        } else {
            ticket.value.value_to_pay = filters.value.raffle.value_ticket
            ticket.value.promotion_id = null
        }
    }

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