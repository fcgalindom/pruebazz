<template>
    <div>
      <div class="container-fluid pt-3">
          <div class="my-3">
              <Modal id="raffle-list" label="Registrar" title="Crear Rifa" size="lg">
                  <div class="row">
                      <div class="col-md-6 mb-3">
                          <Input v-model="raffle.name" label="Nombre"></Input>
                      </div>
                      <div class="col-md-6 mb-3">
                          <Input type="date" v-model="raffle.raffle_date" label="Fecha de rifa"></Input>
                      </div>
                      <div class="col-md-6 mb-3">
                          <Input v-model="raffle.start_number" label="Número mínimo de la boleta" placeholder="0"></Input>
                      </div>
                      <div class="col-md-6 mb-3">
                          <Input v-model="raffle.final_number" label="Número máximo de la boleta" placeholder="9999"></Input>
                      </div>
                      <div class="col-md-6 mb-3">
                          <Label>Premio principal</Label>
                          <textarea v-model="raffle.main_prize" class="form-control"></textarea>
                      </div>
                      <div class="col-md-6 mb-3">
                        <Label>Descripción</Label>
                          <textarea class="form-control" v-model="raffle.description"></textarea>
                      </div>
                      <div class="col-md-6 mb-3">
                          <Input v-model="raffle.value_ticket" label="Valor de boleta"></Input>
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
                <tr>
                    <th>Nombre</th>
                    <th>Premio principal</th>
                    <th>Fecha de rifa</th>
                    <th>Valor de boleta</th>
                    <th>Cant. de boletas vendidas</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in raffles" :key="index">
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
  import { CustomerServices } from '@/services/raffle.service'
  
  const raffles = ref([])
  
  const raffle = ref({
      id: "",
      name: "",
      last_name: "",
      document: "",
      phone: "",
      city_id: ""
  })
  
  onMounted(async () => {
      // raffles.value = await CustomerServices.list()
  })
  
  const saveEntity = () => {
      if (raffle.value.id) {
          CustomerServices.updateCustomer(raffle.value)
      } else {
          CustomerServices.createCustomer(raffle.value)
      }
  }
  
  </script>
  