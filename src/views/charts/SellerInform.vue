<template>
    <div class="row">
        <div class="col-md-5 mb-3">
            <Label required="0">Fecha inicial</Label>
            <DatePicker v-model="initialDate" showIcon fluid dateFormat="yy-mm-dd" :manualInput="false" @date-select="initialDate = Helper.formatDateForm($event)" />
        </div>
        <div class="col-md-5 mb-3">
            <Label required="0">Fecha final</Label>
            <DatePicker v-model="finalDate" showIcon fluid dateFormat="yy-mm-dd" :manualInput="false" @date-select="finalDate = Helper.formatDateForm($event)" />
        </div>
        <div class="col-md-2">
            <div class="d-flex flex-column">
                <Button class="btn-sm mb-3">Total en boletas: {{ Helper.thousandSeparator(totalBoletos) }}</Button>
                <Button class="btn-sm mb-3">Total en Recaudo: {{ Helper.formatNumber(totalRecaudado) }}</Button>
            </div>
    
        </div>
        <div class=" col-md-12 d-flex justify-content-center">
            <Button @click="showData" :disabled="loading">
                <i v-if="!loading" class="fas fa-search mr-2"></i>
                <div v-if="loading" class="spinner-border spinner-border-sm mr-2" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
                {{ loading ? 'Cargando...' : 'Buscar' }}
            </Button>
        </div>
    
    </div>
    
    <div class="d-flex justify-content-between mt-5">
        <h3>Reporte de Vendedores</h3>
    
    </div>
    <div class="card flex justify-center" style="position: relative;">
        <!-- Loading Overlay -->
        <div v-if="loading" class="d-flex justify-content-center align-items-center" 
             style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(255, 255, 255, 0.8); z-index: 1000; min-height: 200px;">
            <div class="text-center">
                <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                    <span class="sr-only">Loading...</span>
                </div>
                <div class="mt-2">
                    <strong>Cargando reporte de vendedores...</strong>
                </div>
            </div>
        </div>

        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Vendedor</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>

                <tr v-for="ticket in tickets.data" :key="ticket.customer_id">
                    <td>{{ getSellerNameById(ticket.seller_id) }}</td>
                    <td>{{ ticket.cantidad_boletos }}</td>
                    <td>{{ ticket.total_recaudado.toLocaleString('es-CO') }}</td>
                </tr>


            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { TicketServices } from "@/services/ticket.service";
import { RaffleServices } from "@/services/raffle.service";
import { SellerServices } from "@/services/seller.service";
import Helper from "@/helpers/Helper";

const tickets = ref({});
const raffles = ref({});
const seller = ref({})
const initialDate = ref('');
const finalDate = ref('');
const totalBoletos = ref(0);
const totalRecaudado = ref(0);
const dependencies = ref({});
const free = ref(0);
const loading = ref(false);

onMounted(async () => {
    loading.value = true;
    
    try {
        await showData();
        dependencies.value = await TicketServices.dependencies();
        chartData.value = setChartData();
        chartOptions.value = setChartOptions();
    } catch (error) {
        console.error('Error en la inicialización:', error);
    } finally {
        loading.value = false;
    }
});

const getSellerNameById = (id) => {
    const seller = dependencies.value.sellers.find(seller => seller.id == id);
    return seller ? seller.name : 'Desconocido';
}


const chartData = ref();
const chartOptions = ref();


const showData = async () => {
    loading.value = true;
    
    try {
        raffles.value = await RaffleServices.listlast();

        tickets.value = await TicketServices.getnumberRaflessbysellerInform(
            raffles.value.id,
            initialDate.value,
            finalDate.value
        );

        const totalTickets = (raffles.value.final_number - raffles.value.start_number) + 1;
        free.value = totalTickets - tickets.value.data.total;

        totalBoletos.value = tickets.value.data.reduce((sum, item) => sum + item.cantidad_boletos, 0);
        totalRecaudado.value = tickets.value.data.reduce((sum, item) => sum + item.total_recaudado, 0);
    } catch (error) {
        console.error('Error cargando datos:', error);
    } finally {
        loading.value = false;
    }
}

const setChartData = () => {

    const documentStyle = getComputedStyle(document.body);

    return {
        labels: ['Disponibles', 'Pendientes', 'Reservados', 'Pagados'],
        datasets: [{
            data: [1, 2, 1, 3],
            backgroundColor: [documentStyle.getPropertyValue('--p-cyan-500'), documentStyle.getPropertyValue('--p-orange-500'), documentStyle.getPropertyValue('--p-gray-500')],
            hoverBackgroundColor: [documentStyle.getPropertyValue('--p-cyan-400'), documentStyle.getPropertyValue('--p-orange-400'), documentStyle.getPropertyValue('--p-gray-400')]
        }]
    };
};

const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');

    return {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor
                }
            }
        }
    };
};
</script>
