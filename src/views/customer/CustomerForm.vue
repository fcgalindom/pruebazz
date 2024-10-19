<template>
    <Modal id="customer-form" label="Registrar" title="Crear Cliente" size="lg">
        <div class="row">
            <div class="col-md-6 mb-3">
                <Input v-model="customer.document" label="Documento"></Input>
            </div>
            <div class="col-md-6 mb-3">
                <Input v-model="customer.name" label="Nombre"></Input>
            </div>
            <div class="col-md-6 mb-3">
                <Input v-model="customer.phone" label="Teléfono"></Input>
            </div>
            <div class="col-md-6 mb-3">
                <Label>Ciudad</Label>
                <Select2 ref="multiselect" v-model="customer.city" :options="cities" :multiple="false" :clear-on-select="true" :customer-search="true" placeholder="Selecciona" label="name" track-by="id" @select="myChangeEvent" />
            </div>
        </div>
        <div class="d-flex justify-content-center my-3">
            <Button @click="saveEntity">Guardar</Button>
        </div>
    </Modal>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { CustomerServices } from '@/services/customer.service'
import Swal from 'sweetalert2'

const customer = ref({})
const cities = ref([])

onMounted(async () => {
    cities.value = await CustomerServices.listCities()
    chargeForm()
})

const chargeForm = () => {
    customer.value = {
        first_name: "",
        last_name: "",
        document: "",
        phone: "",
        city: ""
    }
}

const saveEntity = async () => {
    customer.value.city = customer.value.city.id

    await CustomerServices.createCustomer(customer.value)
    document.getElementById('closeModal').click()
    Swal.fire({
        title: '¡Éxito!',
        text: 'Datos guardados con Éxito.',
        icon: 'success',
        confirmButtonText: 'Continuar'
    })
}
</script>