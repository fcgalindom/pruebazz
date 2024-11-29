<template>

    <div class="card flex justify-center">
        <Chart type="pie" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { TicketServices } from "@/services/ticket.service";

const tickets = ref({});
const raffles = ref({});

onMounted(async () => {
    showData(7);
   
     chartData.value =  setChartData();
    chartOptions.value = setChartOptions();

} 
   
        
        
);


const chartData = ref();
const chartOptions = ref();


const showData = async(id) => {
    tickets.value = await TicketServices.getnumberticket(7);
        raffles.value = await TicketServices.getnumberrafle(7);
        console.log("t",tickets.value);
        console.log("r",raffles.value);
        
}

const setChartData =  () => {
 
    const documentStyle = getComputedStyle(document.body);
    
    console.log("t",tickets.value);
    console.log("r",raffles.value);
    return {
        labels: ['Disponibles', 'Pendientes', 'Reservados', 'Pagados'],
        datasets: [
            {
                data: [1,2,1,3],
                backgroundColor: [documentStyle.getPropertyValue('--p-cyan-500'), documentStyle.getPropertyValue('--p-orange-500'), documentStyle.getPropertyValue('--p-gray-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--p-cyan-400'), documentStyle.getPropertyValue('--p-orange-400'), documentStyle.getPropertyValue('--p-gray-400')]
            }
        ]
    };
};

const setChartOptions =  () => {
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
