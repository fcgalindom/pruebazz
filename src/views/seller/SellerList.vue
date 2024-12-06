<template>
    <div>
      <div class="container-fluid pt-3">
          <div class="my-3">
            <div class="d-flex justify-content-between">
                <h3>Vendedores</h3>
            </div>
            <hr>
            <div class="row mb-3">
                    <div class="col-md-4">
                        <Label required="0">Nombre</Label>
                        <Input v-model="filters.name" label="Nombre" /> 
                    </div>
                    <div class="col-md-4">
                        <Label required="0">Documento</Label>
                        <Input v-model="filters.document_number" label="Documento" /> 
                    </div>
                    <div class="col-md-4">
                        <Label required="0">Correo</Label>
                        <Input v-model="filters.email" label="Correo" /> 
                    </div>
            </div>
            <div class="d-flex justify-content-center">
              <Button @click="datatable">Buscar</Button>
            </div>
            <div class="d-flex justify-content-end">
              <Button @click="limpiarData; visible = true">Registrar</Button>
            </div>
              <Dialog v-model:visible="visible" modal header="Gestionar vendedores" :style="{ width: '80rem' }">
                  <div class="row">
                      <div class="col-md-6">
                          <Label>Nombre</Label>
                          <Input v-model="seller.name" label="Nombre"></Input>
                      </div>
                      <div class="col-md-6">
                          <Label>Documento</Label>
                          <Input v-model="seller.document_number" label="Documento"></Input>
                      </div>
                      <div class="col-md-6">
                          <Label>Correo</Label>
                            <Input v-model="seller.user.email" label="Correo"></Input>
                      </div>
                      <div class="col-md-6">
                          <Label>Contraseña</Label>
                        <Input v-model="seller.user.password" label="Contraseña" type="password"></Input>
                      </div>
                  </div>
                  <div class="d-flex justify-content-center my-3">
                      <Button @click="saveEntity">Guardar</Button>
                  </div>
              </Dialog>
          </div>
        <div class="table-responsive">
          <table class="table table-bordered table-raffles">
            <thead>
              <tr>
                  <th style="width: 30%;">Nombre</th>
                  <th style="width: 20%;">Documento</th>
                  <th style="width: 30%;">Correo</th>
                  <th>Acciones</th>
                  <th>Habilitar</th>
              </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in sellers" :key="index">
                <td>{{item.name}}</td>
                <td>{{ Helper.thousandSeparator(item.document_number) }}</td>
                <td>{{item.user.email}}</td>
                <td>
                  <div class="d-flex justify-content-center">
                    <Button    :disabled="item.state === 0"  class="btn text-darkslategrey" @click="showData(item.id); visible = true" variant="text" ><i class="fas fa-edit"></i></Button>
                    <router-link  :to="`sellers-tracking/${item.id}/`"> <Button  :disabled="item.state === 0" class="btn btn-info mr-3"> Seguimiento </Button> </router-link>
                    <router-link   :to="`sellers-tickets/${item.id}/`"> <Button  :disabled="item.state === 0"  class="btn btn-info"> Asignar </Button> </router-link>
                  </div>
                </td>
                <td>
                  <div class="d-flex justify-content-center">
                    <ToggleSwitch   :modelValue="item.state === 1" @update:modelValue="toggleState($event, item)"/>
                  </div>
                </td>
            </tr>
          </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  <script setup>
  
  import { ref, onMounted } from "vue";
  import { SellerServices } from "@/services/seller.service";
  import Swal from 'sweetalert2'
  import Helper from '@/helpers/Helper';

  const checked = ref(true);
  
  const sellers = ref([])
  const modal = ref('seller_list')
  const visible = ref(false)
  const filters = ref({
    name: "",
    document_number: "",
    email: ""
})
 
  const seller = ref({ name: "",
        document: "",
        user : {
            email: "",
            password: ""
        }})
  const usersatus = ref({"status": 0})
  
  onMounted(async () => {
      await datatable()
  })

  const datatable = async () => {
    sellers.value = await SellerServices.list(filters.value)
  }
  const changeState = async(id, status) => {
    console.log("sser",id, status)
    if (status === 1) {
      status = 0
    } else {
      status = 1
    }
    usersatus.value.status = status
    await SellerServices.updateSellerStatus(id, usersatus.value)
    await datatable()
  }
  const saveEntity = async() => {
      const formupdate = {
        name: seller.value.name,
        document_number: seller.value.document_number,
        email: seller.value.user.email,
        password: seller.value.user.password
      
      }
      if (seller.value.id != null) {
         await SellerServices.updateSeller(formupdate, seller.value.id)
      } else {
        await SellerServices.createSeller(formupdate)
      }
      await datatable()
      Swal.fire("¡Guardado!", "Datos guardados con éxito", "success");
      visible.value = false

  }
  const showData = async(id) => {

    seller.value = await SellerServices.show(id)
    seller.value.user.password = ""

  }
  const limpiarData = () => {
    seller.value = {
        name: "",
        document: "",
        user : {
            email: "",
            password: ""
        }
    }
  }
  function toggleState(newValue, item) {
    changeState(item.id, item.state)
    item.state = newValue ? 1 : 0;
   }

  
  </script>
  