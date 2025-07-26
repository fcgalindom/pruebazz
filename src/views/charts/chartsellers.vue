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
        <div class=" col-md-12 d-flex">
            <Button @click="showData">Buscar</Button>
        </div>
    
    </div>
    
    <div class="d-flex justify-content-between mt-5">
        <h3>Reporte de boletas</h3>
    
    </div>
    <div class="card flex justify-center">
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Usuario</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
    
                <tr v-for="ticket in tickets.data" :key="ticket.customer_id">
                    <td>{{ ticket.seller_name }}</td>
                    <td>{{ ticket.cantidad_boletos }}</td>
                    <td>{{ ticket.total_recaudado.toLocaleString('es-CO') }}</td>
                </tr>
    
    
            </tbody>
        </table>
        <!-- <Chart type="bar" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" /> -->
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
const free = ref(0);

onMounted(async () => {
    showData();
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});


const chartData = ref();
const chartOptions = ref();


const showData = async () => {
    raffles.value = await RaffleServices.listlast();

    tickets.value = await TicketServices.gernumbertickerbyseller(
        raffles.value.id,
        initialDate.value,
        finalDate.value
    );

    const totalTickets = (raffles.value.final_number - raffles.value.start_number) + 1;
    free.value = totalTickets - tickets.value.data.total;

    // Suma total de boletos y recaudado
    totalBoletos.value = tickets.value.data.reduce((sum, item) => sum + item.cantidad_boletos, 0);
    totalRecaudado.value = tickets.value.data.reduce((sum, item) => sum + item.total_recaudado, 0);
    for (const ticket of tickets.value.data) {
        
        const sellerData = await SellerServices.showseller(ticket.user_id)
        if(ticket.user_id == 1){
            sellerData.name = "rifas y sorteos"
        }
        console.log("see",sellerData.name)
        ticket.seller_name = sellerData?.name ?? 'Desconocido'
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
