<template>
    <div>
        <div class="my-3">
            <Button @click="saveEntity">Guardar</Button>
        </div>
        <hr>
        <div class="d-flex justify-content-end mb-3">
            <button class="btn btn-success" @click="addRange">+</button>
        </div>
        <div v-for="(item, index) in range_tickets" :key="index">
            <div class="d-flex justify-content-end">
                <button class="btn btn-danger" @click="deleteRange(index)">X</button>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <Label>Rifa</Label>
                    <Select2 ref="multiselect" v-model="item.raffle" :options="dependencies.raffles" :multiple="false" :clear-on-select="true" :preserve-search="true" label="name" placeholder="Selecciona" track-by="id" />
                </div>
                <div class="col-md-4">
                    <Input v-model="item.start" label="Número inicio"></Input>
                </div>
                <div class="col-md-4">
                    <Input v-model="item.end" label="Número final"></Input>
                </div>
            </div>
            <hr>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { SellerTicketsServices } from "@/services/seller_tickets.service";
import { useRoute } from "vue-router";
import Swal from 'sweetalert2'

const route = useRoute()
const range_tickets = ref([])
const payment_methods = ref([])
const dependencies = ref({
    raffles: []
})

onMounted(async () => {
    limpiarFormulario()
    getRangeForClients()
    dependencies.value = await SellerTicketsServices.dependencies()
})

const saveEntity = async () => {
    const form = range_tickets.value.map(item => {
        return {
            raffle_id: item.raffle.id,
            start: item.start,
            end: item.end
        }
    })
    await SellerTicketsServices.store(form, route.params.id)
    Swal.fire("¡Guardado!", "Datos guardados con éxito", "success");
}

const addRange = () => {
    range_tickets.value.push({
        raffles: "",
        start: "",
        end: ""
    })
}

const getRangeForClients = () => {
    SellerTicketsServices.show(route.params.id).then(response => {
        range_tickets.value = response.data
    })
}

const deleteRange = (index) => {
    range_tickets.value.splice(index, 1)
}

const limpiarFormulario = () => {
    range_tickets.value = [{
        raffles: "",
        start: "",
        end: ""
    }]
}

</script>


<style src="vue-multiselect/dist/vue-multiselect.css">

</style>