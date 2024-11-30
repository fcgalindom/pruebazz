<template>
    <div class="d-flex justify-content-between mt-5">
        <h3>Reporte de boletas</h3>
        <div class="d-flex flex-column">
            <Button disabled class="btn-sm mb-3">800 Boletas En proceso o terminadas</Button>
            <Button disabled class="btn-sm mb-3">Total: 15.000.000</Button>
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
                    <td>700</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>Pendientes</td>
                    <td>20</td>
                    <td>100.000</td>
                </tr>
                <tr>
                    <td>Abonadas</td>
                    <td>10</td>
                    <td>500.000</td>
                </tr>
                <tr>
                    <td>Pagadas</td>
                    <td>237</td>
                    <td>15.000.000</td>
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

const tickets = ref({});
const raffles = ref({});

onMounted(async () => {
        showData(7);
        chartData.value = setChartData();
        chartOptions.value = setChartOptions();
    }
);


const chartData = ref();
const chartOptions = ref();


const showData = async (id) => {
    tickets.value = await TicketServices.getnumberticket(id);
    console.log('tickets.value', tickets.value);
    raffles.value = await RaffleServices.listlast();
    console.log("raffles", raffles.value);
}

const setChartData = () => {

    const documentStyle = getComputedStyle(document.body);

    console.log("t", tickets.value);
    console.log("r", raffles.value);
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
