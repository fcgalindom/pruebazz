<template>
    <div>
        <div class="container-fluid pt-3">
            <div class="my-3">
                <div class="d-flex justify-content-between">
                    <h1>Rifas</h1>
                </div>
                <hr>
                <Button @click="limpiarFormulario; visible = true" label="Registrar" />
                <!-- <Button :id="`${modal}_button`" data-toggle="modal" :data-target="`#${modal}`" @click="limpiarFormulario">Registrar</Button> -->
                <Dialog v-model:visible="visible" modal header="Edit Profile" :style="{ width: '80rem' }">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <Label>Nombre</Label>
                            <Input v-model="raffle.name"></Input>
                        </div>
                        <div class="col-md-6 mb-3">
                            <Label>Fecha de rifa</Label>
                            <DatePicker v-model="raffle.raffle_date" showIcon fluid :showOnFocus="false" dateFormat="yy-mm-dd" :manualInput="false" @date-select="raffle.raffle_date = Helper.formatDateForm($event)" />
                        </div>
                        <div class="col-md-6 mb-3">
                            <Label>Número mínimo de la boleta</Label>
                            <Input v-model="raffle.start_number" type="number" placeholder="0"></Input>
                        </div>
                        <div class="col-md-6 mb-3">
                            <Label>Número máximo de la boleta</Label>
                            <InputNumber v-model="raffle.final_number" fluid placeholder="9.999" />
                        </div>
                        <div class="col-md-6 mb-3">
                            <!-- <InputNumber v-model="value1" inputId="integeronly" fluid /> -->
                            <!-- <Label>Valor de boleta</Label>
                              <input class="form-control ileven-input font-light" v-model="raffle.value_ticket" label="Valor de boleta" @keyup="raffle.value_ticket = Helper.thousandSeparator(raffle.value_ticket)"></input> -->
                            <Label class="font-bold block mb-2"> Valor de boleta </Label>
                            <InputGroup>
                                <InputGroupAddon>$</InputGroupAddon>
                                <InputNumber v-model="raffle.value_ticket"  fluid />
                            </InputGroup>
                        </div>
                        <div class="col-md-6 mb-3">
                            <Label>Descripción</Label>
                            <!-- <Editor v-model="raffle.description" editorStyle="height: 320px" /> -->
                            <Textarea v-model="raffle.description" class="w-100" rows="5" />
                        </div>
                       
                       
                        <div class="col-3">
                            <Label>Pago total</Label>
                            <Button @click="openpayment('all')"><i class="pi pi-upload"></i></Button>
                            </div>
                        <div class="col-3">
                                <Label>Primer Pago</Label>
                                <Button @click="openpayment('first')"><i class="pi pi-upload"></i></Button>
                        </div>
                        <div class="col-3">
                            <Label>Recivo</Label>
                            <Button @click="openpayment('ticket')"><i class="pi pi-upload"></i></Button>
                        </div>

                        <div class="col-3">
                            <Label>Logo</Label>
                            <Button @click="openLogo()"><i class="pi pi-upload"></i></Button>
                        </div>
                      
                    </div>
    
                    <hr>
    
                    <div>
                        <div class="d-flex justify-content-end">
                            <button class="btn btn-success" @click="add_award()">+</button>
                        </div>
                        <div class="row" v-for="(i, index) in raffle.awards" :key="index">
                            <div class="col-4">
                                <Label>Premio</Label>
                                <Input v-model="i.award"></Input>
                            </div>
                            <div class="col-4">
                                <Label>Fecha de sorteo</Label>
                                <DatePicker v-model="i.date" showIcon fluid :showOnFocus="false" dateFormat="yy-mm-dd" :manualInput="false" @date-select="i.date = Helper.formatDateForm($event)" />
                            </div>
                            <div class="col-4">
                                <div class="row">
                                    <div class="col-10">
                                        <Label>Tipo de premio</Label>
                                        <Select v-model="i.type_award" :options="[
                                          {name: 'Principal', id: 1}, 
                                          {name: 'Secundario', id: 2}
                                        ]" filter optionLabel="name" optionValue="id" class="w-100"></Select>
                                    </div>
                                    <div class="col-2">
                                        <button class="btn btn-danger mt-4 ml-3" @click="remove_award(index)">X</button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12">
                                <Label>Archivo</Label>
                                <Button @click="openWidget(i)">subir archivos</Button>
                            </div>
                            <hr>
                        </div>
                    </div>
    
                    <div class="d-flex justify-content-center my-3">
                        <Button @click="saveEntity">Guardar</Button>
                    </div>
                </Dialog>
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
                            <th>Pago total</th>
                            <th>Primer pago</th>
                            <th>Recivo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(i, index) in raffles" :key="index">
                            <td>{{i.name}}</td>
                            <td>{{ Helper.formatDate(i.raffle_date) }}</td>
                            <td>{{ Helper.formatNumber(i.value_ticket) }}</td>
                            <td>3</td>
                            <td class="text-center"><button class="btn text-darkslategrey" @click="showData(i.id); visible = true"><i class="fas fa-edit"></i></button></td>
                            <td><button @click="openInNewTab(i.paymentall)"><i class="fas fa-download"></i></button></td>
                            <td><button @click="openInNewTab(i.paymentfirst)"><i class="fas fa-download"></i></button></td>
                            <td><button @click="openInNewTab(i.paymentticket)"><i class="fas fa-download"></i></button></td>
                         
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <h1>{{ selectedCountry }}</h1>
    <!-- <Select v-model="selectedCountry" :options="countries" filter optionLabel="name" placeholder="Select a Country" class="form-control"></Select>
        <DatePicker v-model="raffle.raffle_date" showIcon fluid :showOnFocus="false" /> -->
</template>

<script setup>
import { ref, onMounted } from "vue";
import { RaffleServices } from '@/services/raffle.service'
import Swal from 'sweetalert2'
// @ts-ignore
import Helper from '@/helpers/Helper';
const selectedCountry = ref();
const visible = ref(false)
const vasibleinput = ref(false)
const countries = ref([
    { name: 'Australia', code: 'AU' },
    { name: 'Brazil', code: 'BR' },
    { name: 'China', code: 'CN' },
    { name: 'Egypt', code: 'EG' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'India', code: 'IN' },
    { name: 'Japan', code: 'JP' },
    { name: 'Spain', code: 'ES' },
    { name: 'United States', code: 'US' }
]);

const raffles = ref([])
const raffle = ref({})
const modal = ref('raffle_modal')
const image = ref(null)
const images = ref([])
const imageUrl = ref('')

const openInNewTab = (url) => {
  window.open(url, "_blank");
};

onMounted(async () => {
    raffles.value = await RaffleServices.list()
    limpiarFormulario()
})

const saveEntity = async () => {
    
    if (raffle.value.id) {
        console.log("entro", raffle.value)
        await RaffleServices.updateCustomer(raffle.value, raffle.value.id)
    } else {
        await RaffleServices.createCustomer(raffle.value)
    }
    visible.value = false
    Swal.fire("¡Guardado!", "Datos guardados con éxito", "success");
    raffles.value = await RaffleServices.list()
}


const openWidget = (i) => {
    const myWidget = window.cloudinary.createUploadWidget({
            cloudName: 'dsxpe54pz',
            uploadPreset: 'demos1',
        },

        (error, result) => {
            if (!error && result && result.event === "success") {
                i.image = result.info.url;
            }
        }
    );
    myWidget.open();
};
const openpayment = (data) => {
    console.log("entrover", data)
    const myWidget = window.cloudinary.createUploadWidget({
            cloudName: 'dsxpe54pz',
            uploadPreset: 'demos1',
        },

        (error, result) => {

            if(data == 'all'){
                if (!error && result && result.event === "success") {
                    raffle.value.paymentall = result.info.url;
                    console.log("ver", raffle.value)
                }
            }
            if(data == 'first'){
                if (!error && result && result.event === "success") {
                    raffle.value.paymentfirst = result.info.url;
                    console.log("ver", raffle.value)
                }
            }
            if(data == 'ticket'){
                if (!error && result && result.event === "success") {
                    raffle.value.paymentticket = result.info.url;
                    console.log("ver", raffle.value)
                }
            }
         
                
            
        }
    );
    myWidget.open();
};
const openLogo = () =>{
    const myWidget = window.cloudinary.createUploadWidget({
            cloudName: 'dsxpe54pz',
            uploadPreset: 'demos1',
        },

        (error, result) => {
            if (!error && result && result.event === "success") {
                raffle.value.logo = result.info.url;
            }
        }
    );
    myWidget.open();
}

const add_award = () => {
    raffle.value.awards.push({ award: "", date: "", type_award: "", image: "" })
}

const remove_award = (index) => {
    raffle.value.awards.splice(index, 1);
}

const showData = async (id) => {
    raffle.value = await RaffleServices.show(id)
}

const formatDateForm = (date) => {
        return date.toISOString().split('T')[0]
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
  