<template>

    <div class="container-fluid pt-3">
        
      
        
        <div class="my-3">
        <div class="d-flex justify-content-end mt-3">
                <Button :id="`${modal}_button`" data-toggle="modal" :data-target="`#${modal}`" @click="limpiarData">Registrar</Button>
        </div>
     
        <Modal :id="modal" label="Registrar" title="Crear Cliente" size="lg">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <Input v-model="promotion.name" label="Nombre"></Input>
                    </div>
                    <div class="col-md-6 mb-3">
                        <Input v-model="promotion.number_of_tickets" type="number" label="Numero de ticketes"></Input>
                    </div>
                    <div class="col-md-6 mb-3">
                        <Input v-model="promotion.new_value" type="number" label="Nuevo Valor"></Input>

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
                <th>Editar</th>
                <th>Eliminar</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="promotion in promotions" :key="promotion.id">
                <td>{{ promotion.name }}</td>
                <td>{{ promotion.number_of_tickets }}</td>
                <td>{{ promotion.new_value }}</td>
                <td>{{ promotion.expiration_date }}</td>
                <td>{{ promotion.raffle.name }}</td>
                
                <td class="text-center"><button class="btn text-danger" data-toggle="modal" :data-target="`#${modal}`" @click="showData(promotion.id)"><i class="fas fa-edit"></i></button></td>
                    
                <td><button @click="deletePromotion(promotion.id)" class="btn btn-danger">Eliminar</button></td>
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
const promotions = ref([])
const promotion = ref({})

const modal = ref('promotion_list')
const dependencies = ref({
    sellers: [],
    customers: [],
    raffles: []
})

onMounted(async() => {
    listPromotions()
    dependencies.value = await TicketServices.dependencies()
})
const showData = async(id) => {
    console.log("entro")
    promotion.value = await PromotionServices.show(id)
}



const listPromotions = async () => {
    promotions.value = await PromotionServices.list()
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
const saveEntity = () => {

    const from ={
        name: promotion.value.name,
        number_of_tickets: promotion.value.number_of_tickets,
        new_value: promotion.value.new_value,
        expiration_date: promotion.value.expiration_date,
        raffle_id: promotion.value.raffle.id
    }
    
    if (promotion.value.id != null) {
        PromotionServices.updatePromotion(from, promotion.value.id)
    } else {
        PromotionServices.createPromotion(from)
    }
    listPromotions()
    document.getElementById('closeModal').click()
}
const deletePromotion = async(id) => {
    const form = {
        state : 0
    }
    await PromotionServices.deletePromotion(form,id)
    listPromotions()
}

</script>