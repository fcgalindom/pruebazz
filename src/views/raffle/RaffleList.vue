<template>
    <div>
      <div class="container-fluid pt-3">
          <div class="my-3">
            <Button :id="`${modal}_button`" data-toggle="modal" :data-target="`#${modal}`" @click="limpiarFormulario">Registrar</Button>
              <Modal :id="modal" label="Registrar" title="Crear Rifa" size="xl">
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
                          <Input v-model="raffle.value_ticket" label="Valor de boleta"></Input>
                      </div>
                      <div class="col-md-6 mb-3">
                        <Label>Descripción</Label>
                          <textarea class="form-control" v-model="raffle.description"></textarea>
                      </div>
                  </div>

                  <hr>
                  
                  <div>
                    <div class="d-flex justify-content-end">
                        <button class="btn btn-success" @click="add_award()">+</button>
                    </div>
                    <div class="row" v-for="(i, index) in raffle.awards" :key="index">
                        <div class="col-4">
                            <Input v-model="i.award" label="Premio"></Input>
                        </div>
                        <div class="col-4">
                            <Input v-model="i.date" type="date" label="Fecha de sorteo"></Input>
                        </div>
                        <div class="col-4">
                            <div class="row">
                                <div class="col-10">
                                    <Label>Tipo de premio</Label>
                                    <select v-model="i.type_award" class="form-control" name="" id="">
                                        <option value="1">Principal</option>
                                        <option value="2">Secundario</option>
                                    </select>
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
                    <th>Nombre</th>
                    <th>Fecha de rifa</th>
                    <th>Valor de boleta</th>
                    <th>Cant. de boletas vendidas</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
              <tr v-for="(i, index) in raffles" :key="index">
                  <td>{{i.name}}</td>
                  <td>{{i.raffle_date}}</td>
                  <td>{{i.value_ticket}}</td>
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
  import { RaffleServices } from '@/services/raffle.service'
  
  const raffles = ref([])
  const raffle = ref({})
  const modal = ref('raffle_modal')
  
  onMounted(async () => {
      raffles.value = await RaffleServices.list()
      limpiarFormulario()
  })
  
  const saveEntity = () => {
      if (raffle.value.id) {
          RaffleServices.updateCustomer(raffle.value, raffle.value.id)
      } else {
          RaffleServices.createCustomer(raffle.value)
      }
  }

  const add_award = () => {
    console.log('awards', raffle.value);
    
    raffle.value.awards.push({award: "", date: "", type_award: ""})
  }

  const remove_award = (index) => {   
    raffle.value.awards.splice(index, 1);
  }

  const showData = async(id) => {
    raffle.value = await RaffleServices.show(id)
  }

  const limpiarFormulario = () => {
    raffle.value = {
      name: "",
      raffle_date: "",
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
  