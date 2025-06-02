<template>

    <div class="container-fluid pt-3">
        <div class="my-3">
            <div class="d-flex justify-content-between">
                <h3>Promociones</h3>
            </div>
            <hr>
            <div class="row mb-3">
                <div class="col-md-4">
                    <Label required="0">Rifa</Label>
                    <Select v-model="filters.raffle_id" :options="dependencies.raffles" filter optionLabel="name" optionValue="id" class="w-100"></Select>
                </div>
                <div class="col-md-4">
                    <Label required="0">Nombre</Label>
                    <Input v-model="filters.name" /> 
                </div>
                <div class="col-md-4">
                    <Label required="0">Fecha de expiración</Label>
                    <DatePicker v-model="filters.expiration_date" showIcon fluid  dateFormat="yy-mm-dd" :manualInput="false" @date-select="filters.expiration_date = Helper.formatDateForm($event)" />
                </div>
            </div>
            <div class="d-flex justify-content-center">
              <Button @click="datatable">Buscar</Button>
            </div>
        <div class="d-flex justify-content-end mt-3">
                <Button @click="limpiarData">Registrar</Button>
        </div>
     
        <Dialog v-model:visible="visible" modal header="Gestionar Promociones" :style="{ width: '80rem' }">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <Label>Nombre</Label>
                        <Input v-model="promotion.name"></Input>
                    </div>
                    <div class="col-md-6 mb-3">
                        <Label>Número de tickets</Label>
                        <Input v-model="promotion.number_of_tickets" type="number"></Input>
                    </div>
                    <div class="col-md-6 mb-3">
                        <Label>Nuevo Valor</Label>
                        <InputGroup>
                            <InputGroupAddon>$</InputGroupAddon>
                            <InputNumber v-model="promotion.new_value" fluid />
                        </InputGroup>

                    </div>
                    <div class="col-md-6 mb-3">
                        <Label>Fecha de Fin</Label>
                        <DatePicker v-model="promotion.expiration_date" showIcon fluid :showOnFocus="false" @date-select="promotion.expiration_date = Helper.formatDateForm($event)" />
                    </div>
                    <div class="col-md-6 mb-3">
                        <Label>Rifa</Label>
                        <Select v-model="promotion.raffle" :options="dependencies.raffles" filter optionLabel="name" optionValue="id" class="w-100"></Select>
                    </div>
                    
                </div>
                <div class="d-flex justify-content-center my-3">
                    <Button @click="saveEntity">Guardar</Button>
                </div>
        </Dialog>
        </div>
        <div class="table-responsive">
            <table class="table table-bordered table-raffles">
            <thead>
                <tr>                  
                <th>Nombre</th>

                <th>Numero de Boletas</th>
                <th>Valor nuevo</th>
                <th>Fecha de Fin</th>
                <th>Rifa</th>
                <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="promotion in promotions" :key="promotion.id">
                <td>{{ promotion.name }}</td>
                <td>{{ promotion.number_of_tickets }}</td>
                <td>{{ Helper.formatNumber(promotion.new_value) }}</td>
                <td>{{ Helper.formatDate(promotion.expiration_date) }}</td>
                <td>{{ promotion.raffle.name }}</td>
                
                <td class="text-center">
                    <button class="btn text-darkslategrey" @click="showData(promotion.id); visible = true"><i class="fas fa-edit"></i></button>
                    <button @click="deletePromotion(promotion.id)" class="btn text-darkslategrey"><i class="fas fa-trash"></i></button>
                </td>
                    
                </tr>
            </tbody>
            </table>
        </div>
    </div>
</template>
<script setup>

import { ref, onMounted } from 'vue'
import { PromotionServices } from '@/services/promotion.service'
import { TicketServices } from '@/services/ticket.service'
import Swal from 'sweetalert2'
// @ts-ignore
import Helper from '@/helpers/Helper';

const promotions = ref([])
const promotion = ref({})
const visible = ref(false)
const filters = ref({
    name: "",
    raffle_id: "",
    expiration_date: ""
})

const modal = ref('promotion_list')
const dependencies = ref({
    sellers: [],
    customers: [],
    raffles: []
})

onMounted(async() => {
    datatable()
    dependencies.value = await TicketServices.dependencies()
})
const showData = async(id) => {
    promotion.value = await PromotionServices.show(id)
}



const datatable = async () => {
    promotions.value = await PromotionServices.list(filters.value)
}
const limpiarData = () => {
    promotion.value = {
        name: "",
        number_of_tickets: "",
        new_value: "",
        expiration_date: "",
        raffle: ""
    }
    visible.value = true
}
const saveEntity = async() => {

    if (promotion.value.id != null) {
        await PromotionServices.updatePromotion(promotion.value, promotion.value.id)
    } else {
        await PromotionServices.createPromotion(promotion.value)
    }
    Swal.fire("¡Guardado!", "Datos guardados con éxito", "success");
    await datatable()
    visible.value = false
}
const deletePromotion = async(id) => {
    const form = {
        state : 0
    }
    Swal.fire({
        title: "¿Está seguro que desea eliminar esta promoción?",
        showDenyButton: true,
        confirmButtonText: "Aceptar",
        denyButtonText: `Cancelar`,
    }).then(async(result) => {
        if (result.isConfirmed) {
            await PromotionServices.deletePromotion(form, id)
            await datatable()
            Swal.fire("Eliminado!", "Datos eliminados con éxito", "success");
        }
    });
}

</script>