<template>
    <div class="d-flex justify-content-between mt-5">
        <h3>Reporte de boletas</h3>
        <div class="d-flex flex-column">
            <Button class="btn-sm mb-3">{{tickets.data?.total}} Boletas En proceso o terminadas</Button>
            <Button class="btn-sm mb-3">Total: {{ Helper.formatNumber(tickets.data?.totalSum) }}</Button>
        </div>
    </div>
    <div class="card flex justify-center">
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Estado</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Disponibles</td>
                    <td>{{ Helper.thousandSeparator(free) }}</td>
                    <td>$0,00 COP</td>
                </tr>
                <tr>
                    <td>Pendientes</td>
                    <td>{{ Helper.thousandSeparator(tickets.data?.pendiente) }}</td>
                    <td>{{ Helper.formatNumber(tickets.data?.pendienteSum) }}</td>
                </tr>
                <tr>
                    <td>Abonadas</td>
                    <td>{{ Helper.thousandSeparator(tickets.data?.reservado) }}</td>
                    <td>{{ Helper.formatNumber(tickets.data?.reservadoSum) }}</td>
                </tr>
                <tr>
                    <td>Pagadas</td>
                    <td>{{ Helper.thousandSeparator(tickets.data?.pagado) }}</td>
                    <td>{{ Helper.formatNumber(tickets.data?.pagadoSum) }}</td>
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
import Helper from "@/helpers/Helper";

const tickets = ref({});
const raffles = ref({});
const free = ref(0);

onMounted(async () => {
        showData();
        chartData.value = setChartData();
        chartOptions.value = setChartOptions();
    }
);


const chartData = ref();
const chartOptions = ref();


const showData = async () => {
    raffles.value = await RaffleServices.listlast();
    tickets.value = await TicketServices.getnumberticket(raffles.value.id);
    const tolalTickets = raffles.value.final_number - raffles.value.start_number
    free.value = tolalTickets - tickets.value.data.total;
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
