<template>
    <div>
        <div class="container-fluid pt-3">
            <div class="my-3">
                <div class="d-flex justify-content-between">
                    <h3>Clientes</h3>
                </div>
                <hr>
                <div class="row mb-3">
                    <div class="col-md-3">
                        <Label required="0">Nombre</Label>
                        <Input v-model="filters.name" />
                    </div>
                    <div class="col-md-3">
                        <Label required="0">Teléfono</Label>
                        <Input v-model="filters.phone" />
                    </div>
                    <div class="col-md-3">
                        <Label required="0">Documento</Label>
                        <Input v-model="filters.document" />
                    </div>
                    <div class="col-md-3">
                        <Label required="0">Ciudad</Label>
                        <Select v-model="filters.city" optionValue="id" optionLabel="name" class="w-100" :options="cities" filter />
                    </div>
                </div>
                <div class="d-flex justify-content-center">
                    <Button @click="listCustomers">Buscar</Button>
                </div>
    
                <hr>
    
                <div class="d-flex justify-content-end mt-3">
                    <Button @click="limpiarData">Registrar</Button>
                </div>
                <Dialog v-model:visible="visible" modal header="Gestionar Cliente" :style="{ width: '80rem' }">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <Label>Nombre</Label>
                            <Input v-model="customer.name" label="Nombre"></Input>
                        </div>
                        <div class="col-md-6 mb-3">
                            <Label>Documento</Label>
                            <Input v-model="customer.document" label="Documento"></Input>
                        </div>
                        <div class="col-md-6 mb-3">
                            <Label>Teléfono</Label>
                            <div class="row">
                                <Select v-model="customer.country_code" optionLabel="name" :options="countries" class="col-3">
                                    <template #value="slotProps">
                                        <div v-if="slotProps.value" class="d-flex align-items-center justify-content-center">
                                            <img :src="slotProps.value.flag" style="width: 20px" />
                                        </div>
                                    </template>
                                    <template #option="slotProps">
                                        <div class="d-flex align-items-center">
                                            <img :src="slotProps.option.flag" class="mr-2" style="width: 20px" />
                                            <div>{{ slotProps.option.name }}</div>
                                        </div>
                                    </template>
                                </Select>
                                <Input class="col-9" v-model="customer.phone" label="Teléfono"></Input>
                            </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <Label>Ciudad</Label>
                        <Select v-model="customer.city" optionValue="id" optionLabel="name" class="w-100" :options="cities" filter />
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
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Documento</th>
                <th>Ciudad</th>
                <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in customers" :key="index">
                <td>{{item.name}}</td>
                <td>{{item.phone}}</td>
                <td>{{ Helper.thousandSeparator(item.document)}}</td>
                <td>{{item.city.name}}</td>
                <td class="text-center"><button class="btn text-darkslategrey" @click="showData(item.id); visible = true"><i class="fas fa-edit"></i></button></td>
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
import Swal from 'sweetalert2'
// @ts-ignore
import Helper from "@/helpers/Helper";

const customers = ref([])
const customer = ref({})
const visible = ref(false)

const filters = ref({
    name: "",
    document: "",
    phone: "",
    city: ""
})

const countries = ref([{
        name: "Mexico",
        dialCode: "+52",
        flag: "https://flagcdn.com/mx.svg"
    },
    {
        name: "Chile",
        dialCode: "+56",
        flag: "https://flagcdn.com/cl.svg"
    },
    {
        name: "Colombia",
        dialCode: "+57",
        flag: "https://flagcdn.com/co.svg"
    },
    {
        name: "Argentina",
        dialCode: "+54",
        flag: "https://flagcdn.com/ar.svg"
    },
    {
        name: "Bolivia",
        dialCode: "+591",
        flag: "https://flagcdn.com/bo.svg"
    },
    {
        name: "Brazil",
        dialCode: "+55",
        flag: "https://flagcdn.com/br.svg"
    },
    {
        name: "Ecuador",
        dialCode: "+593",
        flag: "https://flagcdn.com/ec.svg"
    },
    {
        name: "Paraguay",
        dialCode: "+595",
        flag: "https://flagcdn.com/py.svg"
    },
    {
        name: "Peru",
        dialCode: "+51",
        flag: "https://flagcdn.com/pe.svg"
    },
    {
        name: "Uruguay",
        dialCode: "+598",
        flag: "https://flagcdn.com/uy.svg"
    },
    {
        name: "Venezuela",
        dialCode: "+58",
        flag: "https://flagcdn.com/ve.svg"
    }
]);

const modal = ref('customer_list')
const cities = ref([])

onMounted(async () => {
    cities.value = await CustomerServices.listCities()
    limpiarData()
    listCustomers()
})

const listCustomers = async () => {
    console.log("entro")
    customers.value = await CustomerServices.list(filters.value)
}

const saveEntity = async () => {
    // console.log('customer.value ==> ', customer.value);
    // return
    customer.value.country_code = customer.value.country_code.dialCode
    if (customer.value.id != null) {
        await CustomerServices.updateCustomer(customer.value, customer.value.id)
    } else {
        await CustomerServices.createCustomer(customer.value)
    }
    await listCustomers()
    visible.value = false
    Swal.fire({
        title: '¡Éxito!',
        text: 'Datos guardados con Éxito.',
        icon: 'success',
        confirmButtonText: 'Continuar'
    })
}

const showData = async (id) => {
    customer.value = await CustomerServices.show(id)
    customer.value.country_code = countries.value.find(item => item.dialCode == customer.value.country_code)
}

const limpiarData = () => {
    visible.value = true
    customer.value = {
        name: "",
        country_code: countries.value[2],
        document: "",
        phone: "",
        city: ""
    }
}
</script>

<!--<style src="vue-multiselect/dist/vue-multiselect.css">

</style>-->