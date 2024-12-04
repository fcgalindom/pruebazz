<template>
   <div class="row">

    <div class="col-md-12">
                <Label>Documento</Label>
                <Input class="form-control" v-model="customer.document" type="number" ></Input>
    </div>


   </div>
   <div class="d-flex justify-content-center my-3">
            <Button @click="listCustomers" >Guardar</Button>
    </div>

</template>
<script setup>
import { ref, onMounted, defineEmits  } from "vue";
import { CustomerServices } from '@/services/customer.service'



const customer = ref({})
const emit = defineEmits(['customerData']);

const listCustomers = async () => {
 console.log("entrof")
  await CustomerServices.getByDocument(customer.value.document)
  .then(response => {﻿
     
    if( response.length == 0){
        customer.value = {
         document: customer.value.document,
         name: "",
         phone: "",
         city: ""
      }
      emit('customerData', null)
    }else{
        customer.value = {
        name: response[0].name,
        document: response[0].document,
        phone: response[0].phone,
        city: response[0].city.id

       
     }
     emit('customerData', response[0])
    }
  })
  .catch(error => {
    // Manejar el error aquí
    console.error(error);
  });
   
    
   
} 







</script>