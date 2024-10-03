<template>
    <div>
      <div class="container-fluid pt-3">
          <div class="my-3">
              <Modal id="customer-list" label="Registrar" title="Crear Vendedor" size="lg">
                  <div class="row">
                      <div class="col-md-6">
                          <Input v-model="seller.first_name" label="Nombre"></Input>
                      </div>
                      <div class="col-md-6">
                          <Input v-model="seller.last_name" label="Apellido"></Input>
                      </div>
                      <div class="col-md-6">
                          <Input v-model="seller.document" label="Documento"></Input>
                      </div>
                      <div class="col-md-6">
                            <Input v-model="seller.email" label="Correo"></Input>
                      </div>
                      <div class="col-md-6">
                        <Input v-model="seller.password" label="Contraseña" type="password"></Input>
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
                  <th>Apellido</th>
                  <th>Documento</th>
                  <th>Correo</th>
                  <th>Contraseña</th>
              </tr>
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
  
  const sellers = ref([])
  
  const seller = ref({
      id: null,
      first_name: "",
      last_name: "",
      document: "",
      email: "",
      password: ""
  })
  
  onMounted(async () => {
      sellers.value = await CustomerServices.list()
  })
  
  const saveEntity = () => {
      if (customer.value.id != null) {
          CustomerServices.updateCustomer(customer.value)
      } else {
          CustomerServices.createCustomer(customer.value)
      }
  }
  
  </script>
  