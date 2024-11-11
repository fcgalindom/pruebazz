<template>

    <div class="container-fluid pt-3">
        <div class="my-3">
            <div class="d-flex justify-content-between">
                <h3>Promociones</h3>
            </div>
            <hr>
            <div class="row mb-3">
                <div class="col-md-4">
                    <Label>Rifa</Label>
                    <Select2 ref="multiselect" v-model="filters.raffle" :options="dependencies.raffles" :multiple="false" :clear-on-select="true" :preserve-search="true" placeholder="Selecciona" label="name" track-by="id"  />
                </div>
                <div class="col-md-4">
                    <Input v-model="filters.name" label="Nombre" /> 
                </div>
                <div class="col-md-4">
                    <Input type="date" v-model="filters.expiration_date" label="Fecha de expiración" /> 
                </div>
            </div>
            <div class="d-flex justify-content-center">
              <Button @click="datatable">Buscar</Button>
            </div>
        <div class="d-flex justify-content-end mt-3">
                <Button :id="`${modal}_button`" data-toggle="modal" :data-target="`#${modal}`" @click="limpiarData">Registrar</Button>
        </div>
     
        <Modal :id="modal" label="Registrar" title="Gestión Promociones" size="lg">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <Input v-model="promotion.name" label="Nombre"></Input>
                    </div>
                    <div class="col-md-6 mb-3">
                        <Input v-model="promotion.number_of_tickets" type="number" label="Número de tickets"></Input>
                    </div>
                    <div class="col-md-6 mb-3">
                        <!-- <Input v-model="promotion.new_value" type="number" label="Nuevo Valor"></Input> -->
                        <Label>Nuevo Valor</Label>
                        <input class="form-control ileven-input font-light" v-model="promotion.new_value" type="text" label="Nuevo Valor" @keyup="promotion.new_value = Helper.thousandSeparator(promotion.new_value)"></input>

                    </div>
                    <div class="col-md-6 mb-3">
                        <Input v-model="promotion.expiration_date" type="date" label="Fecha de Fin"></Input>
                    </div>
                    <div class="col-md-6 mb-3">
                            <Label>Rifa</Label>
                            <Select2 ref="multiselect" v-model="promotion.raffle" :options="dependencies.raffles" :multiple="false" :clear-on-select="true" :preserve-search="true" placeholder="Selecciona" label="name" track-by="id"  />
                    </div>
                    
                </div>
                <div class="d-flex justify-content-center my-3">
                    <Button @click="saveEntity">Guardar</Button>
                </div>
        </Modal>
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
                    <button class="btn text-darkslategrey" data-toggle="modal" :data-target="`#${modal}`" @click="showData(promotion.id)"><i class="fas fa-edit"></i></button>
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
const filters = ref({
    name: "",
    raffle: "",
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
    console.log("entro")
    promotion.value = await PromotionServices.show(id)
}



const datatable = async () => {
    console.log(filters.value);
    const filtersSend = {
        name: filters.value.name,
        raffle_id: filters.value.raffle.id,
        expiration_date: filters.value.expiration_date
    }
    promotions.value = await PromotionServices.list(filtersSend)
}
const limpiarData = () => {
    promotion.value = {
        name: "",
        number_of_tickets: "",
        new_value: "",
        expiration_date: "",
        raffle: ""
    }
}
const saveEntity = async() => {

    const from ={
        name: promotion.value.name,
        number_of_tickets: promotion.value.number_of_tickets,
        new_value: promotion.value.new_value,
        expiration_date: promotion.value.expiration_date,
        raffle_id: promotion.value.raffle.id
    }
    
    if (promotion.value.id != null) {
        await PromotionServices.updatePromotion(from, promotion.value.id)
    } else {
        await PromotionServices.createPromotion(from)
    }
    Swal.fire("¡Guardado!", "Datos guardados con éxito", "success");
    await datatable()
    document.getElementById('closeModal').click()
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