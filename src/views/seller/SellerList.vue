<template>
    <div>
      <div class="container-fluid pt-3">
          <div class="my-3">
            <div class="row mb-3">
                    <div class="col-md-4">
                        <Input v-model="filters.name" label="Nombre" /> 
                    </div>
                    <div class="col-md-4">
                        <Input v-model="filters.document_number" label="Documento" /> 
                    </div>
                    <div class="col-md-4">
                        <Input v-model="filters.email" label="Correo" /> 
                    </div>
            </div>
            <div class="d-flex justify-content-center">
              <Button @click="datatable">Buscar</Button>
            </div>
            <div class="d-flex justify-content-end">
              <Button :id="`${modal}_button`" data-toggle="modal" :data-target="`#${modal}`" @click="limpiarData">Registrar</Button>
            </div>
              <Modal :id="modal" label="Registrar" title="Crear Vendedor" size="lg">
                  <div class="row">
                      <div class="col-md-6">
                          <Input v-model="seller.name" label="Nombre"></Input>
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
                  <th>Documento</th>
                  <th>Correo</th>
                  <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in sellers" :key="index">
                <td>{{item.name}}</td>
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
  import Swal from 'sweetalert2'
  
  const sellers = ref([])
  const modal = ref('seller_list')
  const filters = ref({
    name: "",
    document_number: "",
    email: ""
})
 
  const seller = ref( [])
  
  onMounted(async () => {
      await datatable()
  })

  const datatable = async () => {
    sellers.value = await SellerServices.list(filters.value)
  }
  
  const saveEntity = async() => {
      const formupdate = {
        name: seller.value.name,
        document_number: seller.value.document_number,
        email: seller.value.email,
        password: seller.value.password
      
      }
      if (seller.value.id != null) {
         await SellerServices.updateSeller(formupdate, seller.value.id)
      } else {
        await SellerServices.createSeller(formupdate)
      }
      await datatable()
      Swal.fire("¡Guardado!", "Datos guardados con éxito", "success");
      document.getElementById('closeModal').click()

  }
  const showData = async(id) => {
    seller.value = await SellerServices.show(id)
}
  const limpiarData = () => {
    seller.value = {
        name: "",
        document: "",
        email: "",
        password: ""
    }
}

  
  </script>
  