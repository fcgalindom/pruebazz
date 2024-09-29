<template>
  <div>
    <div class="container-fluid pt-3">
        <div class="my-3">
            <Modal id="customer-list" label="Registrar" title="Crear Cliente" size="lg">
                <div class="row">
                    <div class="col-md-6">
                        <Input v-model="customer.name" label="Nombre"></Input>
                    </div>
                    <div class="col-md-6">
                        <Input v-model="customer.last_name" label="Apellido"></Input>
                    </div>
                    <div class="col-md-6">
                        <Input v-model="customer.phone" label="Teléfono"></Input>
                    </div>
                    <div class="col-md-6">
                        <Input v-model="customer.document" label="Documento"></Input>
                    </div>
                    <div class="col-md-6">
                        <Input v-model="customer.city_id" label="Ciudad"></Input>
                    </div>
                </div>
                <div class="d-flex justify-content-center my-3">
                    <Button @click="saveEntity">Guardar</Button>
                </div>
            </Modal>
        </div>
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Teléfono</th>
            <th>Documento</th>
            <th>Ciudad</th>
            <th>Acciones</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in customers" :key="index">
                <td>Jefferson</td>
                <td>Linares</td>
                <td>302024602</td>
                <td>1231892123</td>
                <td>Bogotá</td>
                <td>Delete & Update</td>
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

const customer = ref({
    id: "",
    name: "",
    last_name: "",
    document: "",
    phone: "",
    city_id: ""
})

onMounted(async () => {
    // customers.value = await CustomerServices.list()
})

const saveEntity = () => {
    if (customer.value.id) {
        CustomerServices.updateCustomer(customer.value)
    } else {
        CustomerServices.createCustomer(customer.value)
    }
}

</script>
