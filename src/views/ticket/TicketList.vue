<template>
    <div>
      <div class="container-fluid pt-3">
          <div class="my-3">

            <div class="row mb-3">
                <div class="col-md-3"> <Input v-model="filters.name" label="Número" /> </div>
                <div class="col-md-3"> <Input v-model="filters.phone" label="Cliente" /> </div>
                <div class="col-md-3"> <Input v-model="filters.document" label="Vendedor" /> </div>
                <div class="col-md-3">
                    <Label>Estado</Label>
                    <Select2 ref="multiselect" v-model="ticket.city" :options="[]" :multiple="false"
                        :clear-on-select="true" :preserve-search="true" placeholder="Selecciona" label="name" track-by="id" @select="myChangeEvent" />
                </div>
            </div>
            <div class="d-flex justify-content-center">
                <Button @click="listCustomers">Buscar</Button>
            </div>
            <div class="d-flex justify-content-end">
                <Button :id="`${modal}_button`" data-toggle="modal" :data-target="`#${modal}`" @click="limpiarFormulario">Registrar</Button>
            </div>
              <Modal :id="modal" label="Registrar" title="Crear Boleta" size="xl">
                  <div class="row">
                      <div class="col-md-6 mb-3">
                          <Input v-model="ticket.name" label="Número"></Input>
                      </div>
                      <div class="col-md-6 mb-3">
                        <Label>Vendedor</Label>
                        <Select2 ref="multiselect" v-model="ticket.city" :options="[]" :multiple="false"
                        :clear-on-select="true" :preserve-search="true" placeholder="Selecciona" label="name" track-by="id" @select="myChangeEvent" />
                      </div>
                      <div class="col-md-6 mb-3">
                        <Label>Cliente (a quien se vende)</Label>
                        <Select2 ref="multiselect" v-model="ticket.city" :options="[]" :multiple="false"
                        :clear-on-select="true" :preserve-search="true" placeholder="Selecciona" label="name" track-by="id" @select="myChangeEvent" />
                      </div>
                      <div class="col-md-6 mb-3">
                        <Label>Rifa</Label>
                        <Select2 ref="multiselect" v-model="ticket.city" :options="[]" :multiple="false"
                        :clear-on-select="true" :preserve-search="true" placeholder="Selecciona" label="name" track-by="id" @select="myChangeEvent" />
                      </div>
                      <div class="col-md-6 mb-3">
                        <Label>Estado de la boleta</Label>
                        <Select2 ref="multiselect" v-model="ticket.city" :options="[]" :multiple="false"
                        :clear-on-select="true" :preserve-search="true" placeholder="Selecciona" label="name" track-by="id" @select="myChangeEvent" />
                      </div>
                  </div>

                  <hr>
                  
                  <div>
                    <div class="d-flex justify-content-end">
                        <button class="btn btn-success" @click="add_award()">+</button>
                    </div>
                    <div class="row" v-for="(i, index) in ticket.awards" :key="index">
                        <div class="col-4">
                            <Input v-model="i.award" label="Método de pago"></Input>
                        </div>
                        <div class="col-4">
                            <Input v-model="i.date" type="text" label="Valor"></Input>
                        </div>
                        <div class="col-4">
                            <div class="row">
                                <div class="col-10">
                                    <Input v-model="i.date" type="date" label="Fecha de expiración"></Input>
                                </div>
                                <div class="col-2">
                                    <button class="btn btn-danger mt-4 ml-3" @click="remove_award(index)">X</button>
                                </div>
                            </div>
                        </div>
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
                    <th>Número</th>
                    <th>Rifa</th>
                    <th>Vendedor</th>
                    <th>Cliente</th>
                    <th>Valor pagado</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
              <tr v-for="(i, index) in tickets" :key="index">
                  <td>{{i.name}}</td>
                  <td>{{i.ticket_date}}</td>
                  <td>{{i.value_ticket}}</td>
                  <td>Bogotá</td>
                  <td>Bogotá</td>
                  <td>Bogotá</td>
                  <td class="text-center"><button class="btn text-danger" data-toggle="modal" :data-target="`#${modal}`" @click="showData(i.id)"><i class="fas fa-edit"></i></button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  <script setup>
  
  import { ref, onMounted } from "vue";
  import { RaffleServices } from '@/services/ticket.service'
  
  const tickets = ref([])
  const ticket = ref({})
  const modal = ref('ticket_modal')

  const filters = ref({
      name: "",
      document: "",
      phone: "",
      city: ""
  })
  
  onMounted(async () => {
      tickets.value = await RaffleServices.list()
      limpiarFormulario()
  })
  
  const saveEntity = () => {
      if (ticket.value.id) {
          RaffleServices.updateCustomer(ticket.value, ticket.value.id)
      } else {
          RaffleServices.createCustomer(ticket.value)
      }
  }

  const add_award = () => {
    console.log('awards', ticket.value);
    
    ticket.value.awards.push({award: "", date: "", type_award: ""})
  }

  const remove_award = (index) => {   
    ticket.value.awards.splice(index, 1);
  }

  const showData = async(id) => {
    ticket.value = await RaffleServices.show(id)
  }

  const limpiarFormulario = () => {
    ticket.value = {
      name: "",
      ticket_date: "",
      start_number: "",
      final_number: "",
      value_ticket: "",
      description: "",
      awards: [{
        award: "",
        date: "",
        type_award: ""
      }]
    }
  }
  
  </script>
  
  <style src="vue-multiselect/dist/vue-multiselect.css"></style>