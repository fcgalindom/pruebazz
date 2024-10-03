<template>
  <div>
    <div class="container-fluid pt-3">
        <div class="my-3">
            <Button :id="`${modal}_button`" data-toggle="modal" :data-target="`#${modal}`" @click="limpiarData">Registrar</Button>
            <Modal :id="modal" label="Registrar" title="Crear Cliente" size="lg">
                <div class="row">
                    <div class="col-md-6">
                        <Input v-model="customer.first_name" label="Nombre"></Input>
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
                        <Input v-model="customer.city" label="Ciudad"></Input>
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
                <td>{{item.city}}</td>
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
const modal = ref('customer_list')

const customer = ref({})

onMounted(async () => {
    customers.value = await CustomerServices.list()
})

const saveEntity = () => {
    if (customer.value.id != null) {
        CustomerServices.updateCustomer(customer.value, customer.value.id)
    } else {
        CustomerServices.createCustomer(customer.value)
    }
}

const showData = async(id) => {
    customer.value = await CustomerServices.show(id)
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
