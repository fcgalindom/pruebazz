<template>
    <canvas ref="reciboCanvas" width="1350" height="1350" style="display: none; "></canvas>
    
    <div class="container">
        <div class="row">
            <div class="col-2">
            </div>
            <div class="col-4">
                <button class="btn btn-primary" @click="downloadImage"><i class="fas fa-images"></i></button>
            </div>
            <div class="col-4">
                <button class="btn btn-danger" @click="downloadPDF"><i class="fas fa-file-pdf"></i></button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, toRefs } from "vue";
import loteriaBoyaca from "@/assets/customers/firstpayment2.png";
import drdentix from "@/assets/customers/dr_denix_logo.png";
import { jsPDF } from "jspdf";
import Helper from '@/helpers/Helper';
const reciboCanvas = ref(null);
8
const props = defineProps({
    ticketData: {
        type: Object,
        required: true
    }
});
const { ticketData } = toRefs(props);


onMounted(() => {
    const canvas = reciboCanvas.value;
    const ctx = canvas.getContext("2d");


    // Cargar la imagen de fondo
    const fondo = new Image();
    fondo.src = loteriaBoyaca; // Cambia esta ruta a la imagen que subiste
    fondo.onload = () => {

        const margenSuperior = 700;
        canvas.width = fondo.width;
        canvas.height = fondo.height + margenSuperior;
        ctx.fillRect(0, 0, canvas.width, margenSuperior);

        // Dibujar la imagen de fondo
        ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);

        ctx.shadowBlur = 4; // Nivel de desenfoque
        ctx.shadowOffsetX = 2; // Desplazamiento en X de la sombra
        ctx.shadowOffsetY = 2; // Desplazamiento en Y de la sombra
        // Añadir texto en la parte superior

        ctx.fillStyle = "black";
        ctx.textAlign = "left";
        const startX = 120; // Coordenada X inicial para el texto
        let currentY = 80; // Coordenada Y inicial para el texto, ajustada para que se vea bien

        // Posiciones de las columnas
        const col1X = 10; // Primera columna
        const col2X = 250; // Segunda columna

        ctx.font = "25px Arial";
        ctx.fillText(ticketData.value.customer.name, col1X + 310, currentY); // Valor de ejemplo
        ctx.font = "25px Arial";
        currentY += 48;


        // Campo: Documento
        ctx.fillText(ticketData.value.customer.document, col1X + 250, currentY); // Valor de ejemplo
        ctx.font = "25px Arial";
        currentY += 48;

        // Campo: Celular
        ctx.fillText(ticketData.value.customer.phone, col1X + 200, currentY); // Valor de ejemplo
        ctx.font = "25px Arial";
        currentY += 47;

        // Campo: Ciudad
        ctx.fillText(ticketData.value.customer.city.name, col1X + 200, currentY); // Valor de ejemplo
        ctx.font = "25px Arial";
        currentY += 45;

        //Campo: Seller 
        ctx.fillText(ticketData.value.seller.name, col1X + 220, currentY); // Valor de ejemplo

        // Separador vertical entre columnas
        ctx.strokeStyle = "#ddd";
        ctx.beginPath();
        ctx.moveTo(350, 20);
        // Reiniciar Y para la segunda columna
        currentY += 65;

        // Campo: Abono
        ctx.fillText(Helper.formatNumber(ticketData.value.value), col2X - 30, currentY); // Valor de ejemplo
        ctx.font = "25px Arial";

        // Campo: Saldo
        ctx.fillText(Helper.formatNumber(ticketData.value.value_to_pay - ticketData.value.value), col2X + 250, currentY); // Valor de ejemplo
        //Numero de boleta
        ctx.font = "normal 30px Arial";
        ctx.fillStyle = "red";
        ctx.fillText("Nº" + ticketData.value.number, 300, 1330);

    };
});


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
    console.log(pdfHeight);

    // Agrega la imagen al PDF
    pdf.addImage(imageUrl, "PNG", 0, 0, pdfWidth, pdfHeight - 150);

    // Descarga el PDF
    pdf.save("recibo.pdf");
};
</script>

