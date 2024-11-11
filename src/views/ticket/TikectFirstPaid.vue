<template>

<canvas ref="reciboCanvas" width="1350" height="1350" style="display: none;" ></canvas>
<div class="container">
   <div class="row">
         <div class="col-2">
          
         </div>
         <div class="col-4">
          <button  class="btn btn-primary" @click="downloadImage"><i class="fas fa-images"></i></button>
         </div>
         <div class="col-4">
          <button  class="btn btn-danger" @click="downloadPDF"><i class="fas fa-file-pdf"></i></button>
         </div>
   </div>
</div>




</template>

<script setup>
import { ref, onMounted, computed, watch , toRefs  } from "vue";
import loteriaBoyaca from "@/assets/customers/firstpayment.png";
import drdentix from "@/assets/customers/dr_denix_logo.png";
import { jsPDF } from "jspdf";
const reciboCanvas = ref(null);8
const props = defineProps({
  ticketData: {
    type: Object,
    required: true
  }
});
const { ticketData } = toRefs(props);

console.log("seetickedata =>",ticketData?.value?.payments);

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
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, margenSuperior);
    // Dibujar la imagen de fondo
    ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);
    
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)"; // Color de la sombra (negro con 30% de opacidad)
  ctx.shadowBlur = 4; // Nivel de desenfoque
  ctx.shadowOffsetX = 2; // Desplazamiento en X de la sombra
  ctx.shadowOffsetY = 2; // Desplazamiento en Y de la sombra
    // Añadir texto en la parte superior
    ctx.font = "bold 18px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    const startX = 120; // Coordenada X inicial para el texto
    let currentY = 30; // Coordenada Y inicial para el texto, ajustada para que se vea bien

       // Posiciones de las columnas
    const col1X = 10; // Primera columna
    const col2X = 250; // Segunda columna


    // Campo: Documento
    ctx.fillText("Documento:", col1X, currentY);
    ctx.font = "normal 16px Arial";
    ctx.fillText(ticketData.value.customer.document, col1X + 120, currentY); // Valor de ejemplo
    ctx.font = "bold 16px Arial";
    currentY += 30;

    // Campo: Celular
    ctx.fillText("Celular:", col1X, currentY);
    ctx.font = "normal 16px Arial";
    ctx.fillText(ticketData.value.customer.phone, col1X + 100, currentY); // Valor de ejemplo
    ctx.font = "bold 16px Arial";
    currentY += 30;

    // Campo: Ciudad
    ctx.fillText("Ciudad:", col1X, currentY);
    ctx.font = "normal 16px Arial";
    ctx.fillText(ticketData.value.customer.city.name, col1X + 100, currentY); // Valor de ejemplo
    ctx.font = "bold 16px Arial";

    // Separador vertical entre columnas
    ctx.strokeStyle = "#ddd";
    ctx.beginPath();
    ctx.moveTo(350, 20);
    // Reiniciar Y para la segunda columna
    currentY = 40;

    // Campo: Abono
    ctx.fillText("Abono:", col2X, currentY);
    ctx.font = "normal 16px Arial";
    ctx.fillText(formatNumber(ticketData?.value?.payments[0]?.amount), col2X + 80, currentY); // Valor de ejemplo
    ctx.font = "bold 16px Arial";
    currentY += 30;

    // Campo: Saldo
    ctx.fillText("Saldo:", col2X, currentY);
    ctx.font = "normal 16px Arial";
    ctx.fillText(formatNumber(ticketData.value.raffle.value_ticket), col2X + 80, currentY); // Valor de ejemplo
    //Numero de boleta
    ctx.font = "normal 35px Arial";
    ctx.fillText("#324", 270, 1310);
   
    


    

    // Cargar y dibujar el logo
    const logo = new Image();
    logo.src = drdentix; // Cambia a la ruta de tu logo
    logo.onload = () => {
      ctx.drawImage(logo, 500, 20, 170, 100); // Ajusta la posición y tamaño del logo
    };
  };
});
const formatNumber = (value) => {
               return (value !== null && value !== undefined) ?  "$" + value.toLocaleString('es-ES') : '0';
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

