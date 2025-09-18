<template>
    <canvas ref="reciboCanvas" width="1000" height="600" style="display: none;" ></canvas>
    
    <div class="container">
        <div class="row">
            <div class="col-4">
                <button class="btn btn-success" @click="downloadImage"><i class="fas fa-images"></i></button>
            </div>
            <div class="col-4">
                <button class="btn btn-danger" @click="downloadPDF"><i class="fas fa-file-pdf"></i></button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, toRefs } from "vue";
import loteriaBoyaca from "@/assets/customers/paymentmay.jpeg";
import { RaffleServices } from "@/services/raffle.service";
import { jsPDF } from "jspdf";
import Helper from '@/helpers/Helper';

const reciboCanvas = ref(null);


const props = defineProps({
    ticketData: {
        type: Object,
        required: true
    },
    paymentData: {

        type: Array,
        required: true
    },
    index: {
        type: Number,
        required: true
    },
    
});
const { ticketData, paymentData, index  } = toRefs(props);

const getotalAmount = () => {
    let totalAmount = 0;
    for (let f = 0; f <= index.value; f++) {

        totalAmount += paymentData.value[f].amount;
    }
    return totalAmount;

};
const raffle = ref({});

const listRaffles = async () => {

    raffle.value  = await RaffleServices.listlast();



};
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Mes comienza desde 0
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}


onMounted(async() => {
    const canvas = reciboCanvas.value;
    const ctx = canvas.getContext("2d");
    await listRaffles()

    // Cargar la imagen de fondo
    const fondo = new Image();
    fondo.crossOrigin = "Anonymous";
    fondo.src = raffle.value.paymentticket;// Cambia esta ruta a la imagen que subiste
    fondo.onload = () => {
        // Dibujar la imagen de fondo
        ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);

        // Añadir texto encima de la imagen
        ctx.font = "bold 18px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "left";

        ctx.fillText("Nº" + ticketData.value.number, 810, 130);
        ctx.fillText(getCurrentDate(), 200, 295);
        ctx.fillText(Helper.formatNumber(paymentData.value[index.value].amount), 720, 235);
        ctx.fillText(ticketData.value.customer.name, 200, 360);
        ctx.fillText(formatNumber(ticketData.value.value_to_pay - getotalAmount()), 720, 295);
        ctx.fillText(ticketData?.value?.seller?.name ?? 'Cliente', 200, 440);




    };

});
const formatNumber = (value) => {
    return (value !== null && value !== undefined) ? "$" + value.toLocaleString('es-ES') : '0';
};

const downloadImage = () => {
    const canvas = reciboCanvas.value;
    const imageUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = imageUrl;
    downloadLink.download = "recibo.png";
    downloadLink.click();
};
const downloadPDF = () => {
    const canvas = reciboCanvas.value;
    const imageUrl = canvas.toDataURL("image/png"); // Genera la imagen en base64

    const pdf = new jsPDF("p", "mm", "a4"); // Crea un PDF en tamaño A4

    // Configura las dimensiones de la imagen en el PDF
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Agrega la imagen al PDF
    pdf.addImage(imageUrl, "PNG", 0, 0, pdfWidth, pdfHeight);

    // Descarga el PDF
    pdf.save("recibo.pdf");
};
</script>