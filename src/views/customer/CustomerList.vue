<template>
  <div>
    <div class="container-fluid pt-3">
        <div class="my-3">

            <div class="row mb-3">
                <div class="col-md-3"> <Input v-model="filters.name" label="Nombre" /> </div>
                <div class="col-md-3"> <Input v-model="filters.phone" label="Teléfono" /> </div>
                <div class="col-md-3"> <Input v-model="filters.document" label="Documento" /> </div>
                <div class="col-md-3"> <Input v-model="filters.city" label="Ciudad" /> </div>
            </div>
            <div class="d-flex justify-content-center">
                <Button @click="listCustomers">Buscar</Button>
            </div>

            <hr>

            <div class="d-flex justify-content-end mt-3">
                <Button :id="`${modal}_button`" data-toggle="modal" :data-target="`#${modal}`" @click="limpiarData">Registrar</Button>
            </div>
            <Modal :id="modal" label="Registrar" title="Crear Cliente" size="lg">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <Input v-model="customer.first_name" label="Nombre"></Input>
                    </div>
                    <div class="col-md-6 mb-3">
                        <Input v-model="customer.last_name" label="Apellido"></Input>
                    </div>
                    <div class="col-md-6 mb-3">
                        <Input v-model="customer.phone" label="Teléfono"></Input>
                    </div>
                    <div class="col-md-6 mb-3">
                        <Input v-model="customer.document" label="Documento"></Input>
                    </div>
                    <div class="col-md-6 mb-3">
                        <Label>Ciudad</Label>
                        <Select2 ref="multiselect" v-model="customer.city" :options="cities" :multiple="false"
                        :clear-on-select="true" :preserve-search="true" placeholder="Selecciona" label="name" track-by="id" @select="myChangeEvent" />
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
                <th>Apellidos</th>
                <th>Teléfono</th>
                <th>Documento</th>
                <th>Ciudad</th>
                <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in customers" :key="index">
                <td>{{item.first_name}}</td>
                <td>{{item.last_name}}</td>
                <td>{{item.phone}}</td>
                <td>{{item.document}}</td>
                <td>{{item.city.name}}</td>
                <td class="text-center"><button class="btn text-danger" data-toggle="modal" :data-target="`#${modal}`" @click="showData(item.id)"><i class="fas fa-edit"></i></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script setup>

import { ref, onMounted } from "vue";
import { CustomerServices } from '@/services/customer.service'
const customers = ref([])
const customer = ref({})

const filters = ref({
    name: "",
    document: "",
    phone: "",
    city: ""
})

const modal = ref('customer_list')
const cities = ref([])

onMounted(async () => {
    cities.value = await CustomerServices.listCities()
    listCustomers()
})

const listCustomers = async () => {
    customers.value = await CustomerServices.list(filters.value)
}

const saveEntity = () => {
    customer.value.city = customer.value.city.id
    
    if (customer.value.id != null) {
        CustomerServices.updateCustomer(customer.value, customer.value.id)
    } else {
        CustomerServices.createCustomer(customer.value)
    }
    listCustomers()
    document.getElementById('closeModal').click()
}

const showData = async(id) => {
    customer.value = await CustomerServices.show(id)
}

const myChangeEvent = (event) => {
    console.log('event ==> ', customer.value.city);
}

const limpiarData = () => {
    customer.value = {
        first_name: "",
        last_name: "",
        document: "",
        phone: "",
        city: ""
    }
}

</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>