<template>
    <canvas ref="reciboCanvas"  style="display: none;" ></canvas>
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
    import loteriaBoyaca from "@/assets/customers/firstpaymentmayjun.jpeg";
    import drdentix from "@/assets/customers/dr_denix_logo.png";
    import { jsPDF } from "jspdf";
    import Helper from '@/helpers/Helper';
    const reciboCanvas = ref(null);
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
    
        const margenSuperior = 1000;
        canvas.width = fondo.width;
        canvas.height = fondo.height;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Dibujar la imagen de fondo
        ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);
        
        // Añadir texto en la parte superior
        ctx.font = "18px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "left";
        const startX = 120; // Coordenada X inicial para el texto
        let currentY = 47; // Coordenada Y inicial para el texto, ajustada para que se vea bien
    
           // Posiciones de las columnas
        const col1X = 70; // Primera columna
        const col2X = 270; // Segunda columna
        // Campo: Nombre
        ctx.font = "35px Arial";
         ctx.fillText(ticketData.value.customer.name, col1X + 340, currentY); // Valor de ejemplo
        ctx.font = "35px Arial";
         currentY += 60;
        
        
    
    
        // Campo: Documento
        ctx.fillText(ticketData.value.customer.document, col1X + 220, currentY); // Valor de ejemplo
        ctx.font = "35px Arial";
         currentY += 55;
    
        // Campo: Celular
        ctx.fillText(ticketData.value.customer.phone, col1X + 140, currentY); // Valor de ejemplo
         ctx.font = "35px Arial";
         currentY += 58;
    
        // Campo: Ciudad
        ctx.fillText(ticketData.value.customer.city.name, col1X + 140, currentY); // Valor de ejemplo
        ctx.font = "35px Arial";
        currentY += 58;

        //Campo: Seller 
        ctx.fillText(ticketData.value.seller.name, col1X + 190, currentY); // Valor de ejemplo
    
        // Separador vertical entre columnas
        ctx.strokeStyle = "#ddd";
        ctx.beginPath();
        ctx.moveTo(350, 20);
        // Reiniciar Y para la segunda columna
        currentY += 82;
        ctx.font = "bold 35px Arial";
    
        // Campo: Abono
         ctx.fillText(Helper.formatNumber(ticketData.value.value), col2X  - 70, currentY); // Valor de ejemplo
         ctx.font = "bold 35px Arial";
    
        // Campo: Saldo
         ctx.fillText(Helper.formatNumber(ticketData.value.value_to_pay - ticketData.value.value ), col2X + 490, currentY); // Valor de ejemplo
         currentY += 170;
        //Numero de boleta
        ctx.fillStyle = "red";
        ctx.font = "55px Arial";
        ctx.fillText( "Nº "+ticketData.value.number, 368,currentY);
         //Numero de boleta
        ctx.fillStyle = "red";
        ctx.font = "normal 55px Arial";
        
        ctx.fillText( "Nº "+ticketData.value.number, 368, 1350);
       
      };
    });
    
    const handleUpdateData = (data) => {
    }
    const downloadImage = () => {
          const canvas = reciboCanvas.value;
          const imageUrl = canvas.toDataURL("image/jpg");
          const downloadLink = document.createElement("a");
          downloadLink.href = imageUrl;
          downloadLink.download = "recibo.jpg";
          downloadLink.click();
        }; 
function downloadPDF() {
    const canvas = reciboCanvas.value;
    const pdf = new jsPDF({
        orientation: "portrait", // Orientación vertical
        unit: "pt",              // Unidad de medida en puntos (pt)
        format: "letter",        // Tamaño carta
    });

    // Convierte el canvas a imagen
    const imgData = canvas.toDataURL("image/jpeg", 1.0);

    // Ajusta las dimensiones de la imagen al tamaño carta
    const pageWidth = 612; // Ancho en puntos para tamaño carta
    const pageHeight = 792; // Altura en puntos para tamaño carta
    const canvasAspectRatio = canvas.width / canvas.height;
    const pageAspectRatio = pageWidth / pageHeight;

    let imgWidth, imgHeight;

    if (canvasAspectRatio > pageAspectRatio) {
        // Imagen más ancha que alta
        imgWidth = pageWidth;
        imgHeight = pageWidth / canvasAspectRatio;
    } else {
        // Imagen más alta que ancha
        imgHeight = pageHeight;
        imgWidth = pageHeight * canvasAspectRatio;
    }

    // Centrar la imagen en el PDF
    const xOffset = (pageWidth - imgWidth) / 2;
    const yOffset = (pageHeight - imgHeight) / 2;

    // Agregar la imagen al PDF
    pdf.addImage(imgData, "JPEG", xOffset, yOffset, imgWidth, imgHeight);

    // Descargar el PDF
    pdf.save("ticket.pdf");
}
    
    
    </script>
    
    