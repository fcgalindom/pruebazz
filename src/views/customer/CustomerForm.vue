<template>
    <div class="row">
        <div class="col-12 mb-3">
            <Label>Documento</Label>
            <Input class="form-control" v-model="customer.document" type="number" @blur="listCustomers"></Input>
        </div>
        <div class="col-12 mb-3">
            <Label>Nombre</Label>
            <Input v-model="customer.name" :disabled="isDisabled" label="Nombre"></Input>
        </div>
        <div class="col-12 mb-3">
            <Label>Teléfono</Label>
            <div class="row">
                <Select v-model="customer.country_code" optionLabel="name" :options="countries"
                    class="col-6 col-md-3 mb-3 mb-md-0">
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
                <Input class="col-md-9" v-model="customer.phone" :disabled="isDisabled" label="Teléfono"></Input>
            </div>
        </div>
        <div class="col-12 mb-3">
            <Label>Ciudad</Label>
            <Select filter optionValue="id" fluid optionLabel="name" ref="multiselect" v-model="customer.city"
                :disabled="isDisabled" :options="cities" :multiple="false" :clear-on-select="true"
                :customer-search="true" placeholder="Selecciona" label="name" track-by="id"
                @select="myChangeEvent"></Select>
        </div>
    </div>
    <!-- <div class="d-flex justify-content-center my-3">
        <Button @click="saveEntity">Guardar</Button>
    </div> -->

</template>

<script setup>
import { ref, onMounted, defineEmits, defineProps } from "vue";
import { CustomerServices } from '@/services/customer.service'
import Swal from 'sweetalert2'

const customer = ref({})
const cities = ref([])
const customers = ref([])
const isDisabled = ref(false)
const visible = ref(false)

const props = defineProps({
    datadocument: String,
    default: ""
});

const countries = ref([{
    name: "Mexico",
    dialCode: "52",
    flag: "https://flagcdn.com/mx.svg"
},
{
    name: "Chile",
    dialCode: "56",
    flag: "https://flagcdn.com/cl.svg"
},
{
    name: "España",
    dialCode: "34",
    flag: "https://flagcdn.com/es.svg"
},
{
    name: "Colombia",
    dialCode: "57",
    flag: "https://flagcdn.com/co.svg"
},
{
    name: "Argentina",
    dialCode: "54",
    flag: "https://flagcdn.com/ar.svg"
},
{
    name: "Bolivia",
    dialCode: "591",
    flag: "https://flagcdn.com/bo.svg"
},
{
    name: "Brazil",
    dialCode: "55",
    flag: "https://flagcdn.com/br.svg"
},
{
    name: "Ecuador",
    dialCode: "593",
    flag: "https://flagcdn.com/ec.svg"
},
{
    name: "Paraguay",
    dialCode: "595",
    flag: "https://flagcdn.com/py.svg"
},
{
    name: "Peru",
    dialCode: "51",
    flag: "https://flagcdn.com/pe.svg"
},
{
    name: "Uruguay",
    dialCode: "598",
    flag: "https://flagcdn.com/uy.svg"
},
{
    name: "Venezuela",
    dialCode: "58",
    flag: "https://flagcdn.com/ve.svg"
}
]);

onMounted(async () => {

    cities.value = await CustomerServices.listCities()
    chargeForm()

})
const emit = defineEmits(['closedialog']);

const chargeForm = () => {
    customer.value = {
        name: "",
        document: "",
        country_code: countries.value[3],
        phone: "",
        city: ""
    }

    customer.value.document = props.datadocument
}

const listCustomers = async () => {
    await CustomerServices.getByDocument(customer.value.document)
        .then(response => {

            if (response.length == 0) {
                customer.value = {
                    document: customer.value.document,
                    name: "",
                    phone: "",
                    city: ""
                }
                isDisabled.value = false
            } else {
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
    customer.value.country_code = customer.value.country_code.dialCode
    const customerData = await CustomerServices.createCustomer(customer.value)
    Swal.fire({
        title: '¡Éxito!',
        text: 'Datos guardados con Éxito.',
        icon: 'success',
        confirmButtonText: 'Continuar'
    })
    emit('customerData', customerData)
    emit('closedialog', false)
}
</script>