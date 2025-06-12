<template>
    <div>
        <hr>
        <div class="d-flex justify-content-between mb-3">
            <h2>Rangos por vendedor</h2>
            <div>
                <button class="btn btn-success" @click="addRange">+</button>
            </div>
        </div>
        <div>
            <Button class="my-3" @click="saveEntity">Guardar</Button>
        </div>

        <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                <button :class="{ 'show active': activeTab === position }" v-for="(item, position) in range_tickets"
                    :key="position" class="nav-link" :id="`nav-${position}-tab`" data-toggle="tab"
                    :data-target="`#nav-${position}`" type="button" role="tab" aria-controls="nav-home"
                    aria-selected="true" @click="search(item)">
                    {{ item.raffle ? item.raffle.name : 'Home' }}
                </button>
            </div>
        </nav>
        <div class="tab-content" id="nav-tabContent">
            <div class="tab-pane fade" :class="{ 'show active': activeTab === position }" :id="`nav-${position}`"
                role="tabpanel" :aria-labelledby="`nav-${position}-tab`" v-for="(item, position) in range_tickets"
                :key="position">
                <div class="d-flex justify-content-end">
                    <button class="btn btn-danger" @click="deleteRange(position)">X</button>
                </div>
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-4">
                            <Label>Rifa</Label>
                            <Select2 ref="multiselect" v-model="item.raffle" :options="dependencies.raffles"
                                :multiple="false" :clear-on-select="true" :preserve-search="true" label="name"
                                placeholder="Selecciona" track-by="id" @select="search(item)" />
                        </div>
                        <div class="col-md-8">
                            <Label required="0">Filtrar Números</Label>
                            <Input v-model="filters.number"></Input>
                        </div>
                        <!-- <div class="col-md-8">
                            <Label required="0">Números seleccionados</Label>
                            <MultiSelect v-model="range_tickets[position].numbers" display="chip" :options="range_tickets[position].numbers" filter fluid
                                :maxSelectedLabels="15" class="w-full md:w-80"  @change="deleteTicket($event, position)" />
                        </div> -->
                    </div>
                </div>
                <div class="row">
                    <div class="col-9">
                        <div class="container-fluid d-flex justify-content-between mt-3 pb-5" v-if="showKeyboard">
                            <div class="button-grid w-80 grid-buttons-tickets scroll-container"
                                style="grid-template-columns: repeat(10, 1fr);">
                                <button :class="{ active: isActive(button) }" v-for="(button, index) in filteredButtons"
                                    :key="index" class="grid-button" @click="buyTicket(index, button, position)">
                                    {{ button }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="col-3 d-flex flex-column align-items-center">
                        <div class="text-center mb-3">
                            <strong>Ticket seleccionado</strong><br />

                        </div>

                        <div class="bg-light p-2 d-flex flex-wrap" style="width: 100%;">
                            <div v-for="number in range_tickets[0].numbers" :key="number" class="p-1"
                                style="width: 50%;">
                                <Button :label="number" class="p-button-sm p-button-rounded p-button-info w-100"
                                    @click="selectedTicket = number" />
                            </div>
                        </div>
                    </div>
                </div>



            </div>
            <!-- <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">...</div>
                    <div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">...</div> -->
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { SellerTicketsServices } from "@/services/seller_tickets.service";
import { TicketServices } from '@/services/ticket.service'
import { useRoute } from "vue-router";
import Swal from 'sweetalert2'
import Button from 'primevue/button'; 

const route = useRoute()
const range_tickets = ref([])
const showKeyboard = ref(false)
const activeTab = ref()
const activeButtons = ref(new Set());
const buttons = ref(Array.from({ length: 999 }, (_, i) => `${i + 1}`));
const filters = ref({
    number: "",
    raffle: ""
})
const dependencies = ref({
    raffles: []
})
const numbers = ['0047', '0060', '0073', '0084', '0096', '0111'];

const isActive = (button) => {
    return activeButtons.value.has(button);
}

onMounted(async () => {
    limpiarFormulario()
    getRangeForClients()
    dependencies.value = await SellerTicketsServices.dependencies()
})

const buyTicket = (index, button, position) => {
    
    if (activeButtons.value.has(button)) {
        range_tickets.value[position].numbers = range_tickets.value[position].numbers.filter(num => num !== (button))
        activeButtons.value.delete(button);
        console.log("rango de tickets", range_tickets.value);
        console.log("activeButtons", activeButtons.value);
    } else {
        range_tickets.value[position].numbers.push(button)
        activeButtons.value.add(button);
        console.log("rango de ticketselse", range_tickets.value);
        console.log("activeButtonselse", activeButtons.value);  
    }
    // ticket.value.raffle = filters.value.raffle
}

const filteredButtons = computed(() => {
    return buttons.value.filter(button => {
        return button.toString().includes(filters.value.number);
    });
});

const search = async (item) => {
    
    if(!item.raffle) {
        showKeyboard.value = false
        return
    }

    showKeyboard.value = true
    
    const response = await SellerTicketsServices.getTiketsFreeForSeller(item.raffle.id, route.params.id)
    buttons.value = [];
    let counter = 0
    activeButtons.value = new Set();
    for (let index = response.raffle.start_number; index <= response.raffle.final_number; index++) {
        let formattedNumber = index.toString().padStart(4, '0');
        if (!response.tickets_excluded.some(ticket => ticket.toString().padStart(4, '0') === formattedNumber)) {
            buttons.value.push(formattedNumber);
        }

        response.seller_range.forEach(range => {
        range.numbers.forEach(number => {
            counter++

            let formattedIndex = index.toString().padStart(4, '0');
            let formattedNumber = number.toString().padStart(4, '0');
            
            if (formattedIndex == formattedNumber) {
                console.log(formattedIndex, formattedNumber);
                activeButtons.value.add(formattedNumber)    ;
            }
        });
  });
  }
  
}

const deleteTicket = (ticketEvent, position) => {
    activeButtons.value = new Set()
    
    range_tickets.value[position].numbers.forEach(element => {
        activeButtons.value.add(element);
    });
}

const saveEntity = async () => {
    const form = range_tickets.value.map(item => {
        return {
            raffle_id: item.raffle.id,
            numbers: item.numbers,
        }
    })
    try {
        await SellerTicketsServices.store(form, route.params.id)
        Swal.fire("¡Guardado!", "Datos guardados con éxito", "success");
    } catch (error) {
        Swal.fire("¡Guardado!", error.error, "error");

    }

}

const addRange = () => {
    range_tickets.value.push({
        raffles: "",
        numbers: []
    })
}

const getRangeForClients = async () => {
    range_tickets.value = await SellerTicketsServices.show(route.params.id);
    
    range_tickets.value.forEach((range, position) => {
        range.numbers.forEach(number => {
            activeButtons.value.add(`${number}`);
        });
    });
};

const deleteRange = (index) => {
    range_tickets.value.splice(index, 1)
}

const limpiarFormulario = () => {
    range_tickets.value = [
        {
            raffles: "",
            numbers: []
        }
    ]
}

</script>


<style src="vue-multiselect/dist/vue-multiselect.css">

</style>

<style scoped>

button.active {
    background-color: #28a745;
}

button:hover {
    background-color: #0056b3;
}
</style>