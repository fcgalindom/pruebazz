<template>
        <div class="row">
            <div class="col-md-6 mb-3">
                <Label>Documento</Label>
                <Input class="form-control" v-model="customer.document" type="number"   @blur="listCustomers" ></Input>
            </div>
            <div class="col-md-6 mb-3">
                <Label>Nombre</Label>
                <Input v-model="customer.name" :disabled="isDisabled" label="Nombre"></Input>
            </div>
            <div class="col-md-6 mb-3">
                <Label>Telefono</Label>
                <Input v-model="customer.phone" :disabled="isDisabled" label="Teléfono"></Input>
            </div>
            <div class="col-md-6 mb-3">
                <Label>Ciudad</Label>
                <Select  filter optionValue="id" fluid optionLabel="name" ref="multiselect" v-model="customer.city" :disabled="isDisabled" :options="cities" :multiple="false" :clear-on-select="true" :customer-search="true" placeholder="Selecciona" label="name" track-by="id" @select="myChangeEvent" ></Select>
            </div>
        </div>
        <div class="d-flex justify-content-center my-3">
            <Button @click="saveEntity" >Guardar</Button>
        </div>
    
</template>

<script setup>
import { ref, onMounted, defineEmits } from "vue";
import { CustomerServices } from '@/services/customer.service'
import Swal from 'sweetalert2'

const customer = ref({})
const cities = ref([])
const customers = ref([])
const isDisabled = ref(false)
const visible = ref(false)



onMounted(async () => {
    cities.value = await CustomerServices.listCities()
    chargeForm()
})
const emit = defineEmits(['closedialog']);




const chargeForm = () => {
    customer.value = {
        first_name: "",
        last_name: "",
        document: "",
        phone: "",
        city: ""
    }
}

const listCustomers = async () => {
  await CustomerServices.getByDocument(customer.value.document)
  .then(response => {

    if( response.length == 0){
        customer.value = {
         document: customer.value.document,
         name: "",
         phone: "",
         city: ""
      }
      isDisabled.value = false
    }else{
        customer.value = {
        name: response[0].name,
        document: response[0].document,
        phone: response[0].phone,
        city: response[0].city.id
       
     }
      isDisabled.value = true
    }
  })
  .catch(error => {
    // Manejar el error aquí
    console.error(error);
  });
   
    
   
}  


const saveEntity = async () => {
    console.log("see data", customer.value)
    

    const customerData =  await CustomerServices.createCustomer(customer.value)
    emit('customerData', customerData)

   
   
}
</script>