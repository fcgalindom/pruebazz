<template>
    <div>
      <div class="container-fluid pt-3">
          <div class="my-3">
            <div class="d-flex justify-content-end">
              <Button :id="`${modal}_button`" data-toggle="modal" :data-target="`#${modal}`" @click="limpiarData">Registrar</Button>
            </div>
              <Modal :id="modal" label="Registrar" title="Crear Vendedor" size="lg">
                  <div class="row">
                      <div class="col-md-6">
                          <Input v-model="seller.first_name" label="Nombre"></Input>
                      </div>
                      <div class="col-md-6">
                          <Input v-model="seller.last_name" label="Apellido"></Input>
                      </div>
                      <div class="col-md-6">
                          <Input v-model="seller.document_number" label="Documento"></Input>
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
                  <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in sellers" :key="index">
                <td>{{item.first_name}}</td>
                <td>{{item.last_name}}</td>
                <td>{{item.document_number}}</td>
                <td>{{item.user.email}}</td>
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
  import { SellerServices } from "@/services/seller.service";
  
  const sellers = ref([])
  const modal = ref('seller_list')
 
  const seller = ref( [])
  
  onMounted(async () => {
      sellers.value = await SellerServices.list()
      listSellers()
  })

  const listSellers = async () => {
    seller.value = await SellerServices.list()
  }
  
  const saveEntity = () => {
      const formupdate ={

        first_name: seller.value.first_name,
        last_name: seller.value.last_name,
        document_number: seller.value.document_number,
        email: seller.value.email,
        password: seller.value.password
      
      }
      if (seller.value.id != null) {
         SellerServices.updateSeller(formupdate, seller.value.id)
      } else {
         SellerServices.createSeller(seller.value)
      }
      listSellers()
      document.getElementById('closeModal').click()

  }
  const showData = async(id) => {
    seller.value = await SellerServices.show(id)
    console.log("seller =>",seller.value.user.email)
}
  const limpiarData = () => {
    seller.value = {
        first_name: "",
        last_name: "",
        document: "",
        email: "",
        password: ""
    }
}

  
  </script>
  