<template>
    <div class="card flex justify-center">
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th></th>
                    <!-- <th>Rifa</th> -->
                    <th>Cantidad</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(i, index) in tickets" :key="index">
                    <td>#{{i.number}}</td>
                    <!-- <td>{{i.raffle.name}}</td> -->
                    <td>{{ i.customer?.name ?? 'N/A' }}</td>
                </tr>
            </tbody>
        </table>
        <!-- <Chart type="bar" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" /> -->
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { TicketServices } from "@/services/ticket.service";

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
    tickets.value = await TicketServices.getnumberticket(7);
    console.log('tickets.value', tickets.value);
    
    raffles.value = await TicketServices.getnumberrafle(7);
    console.log("t", tickets.value);
    console.log("r", raffles.value);

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
