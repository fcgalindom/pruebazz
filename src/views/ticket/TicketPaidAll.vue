<template>

    <canvas ref="reciboCanvas" width="1550" height="1350"  style="display: none;" ></canvas>
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
    import loteriaBoyaca from "@/assets/customers/paymentall.png";
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
        ctx.font = "18px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "left";
        const startX = 120; // Coordenada X inicial para el texto
        let currentY = 160; // Coordenada Y inicial para el texto, ajustada para que se vea bien
    
           // Posiciones de las columnas
        const col1X = 10; // Primera columna
        const col2X = 250; // Segunda columna
        
        ctx.font = "25px Arial";
         ctx.fillText(ticketData.value.customer.name, col1X + 310, currentY); // Valor de ejemplo
        ctx.font = "25px Arial";
         currentY += 55;
        
        
    
    
        // Campo: Documento
        ctx.fillText(ticketData.value.customer.document, col1X + 250, currentY); // Valor de ejemplo
        ctx.font = "25px Arial";
         currentY += 58;
    
        // Campo: Celular
        ctx.fillText(ticketData.value.customer.phone, col1X + 200, currentY); // Valor de ejemplo
         ctx.font = "25px Arial";
         currentY += 52;
    
        // Campo: Ciudad
        ctx.fillText(ticketData.value.customer.city.name, col1X + 200, currentY); // Valor de ejemplo
        ctx.font = "25px Arial";
        currentY += 54;

        //Campo: Seller 
        ctx.fillText(ticketData.value.seller.name, col1X + 220, currentY); // Valor de ejemplo
    
        // Separador vertical entre columnas
        ctx.strokeStyle = "#ddd";
        ctx.beginPath();
        ctx.moveTo(350, 20);
        // Reiniciar Y para la segunda columna
        currentY += 78;
    
        // Campo: Abono
         ctx.fillText(Helper.formatNumber(ticketData?.value?.payments[0]?.amount  === undefined ? 0 : ticketData?.value?.payments[0]?.amount  ), col2X  - 40, currentY); // Valor de ejemplo
         ctx.font = "25px Arial";
    
        // Campo: Saldo
         ctx.fillText(Helper.formatNumber(ticketData.value.value_to_pay), col2X + 250, currentY); // Valor de ejemplo
         currentY += 159;
        //Numero de boleta
        ctx.fillStyle = "red";
        ctx.font = "normal 35px Arial";
        ctx.fillText( "#"+ticketData.value.number, 320,currentY);
         //Numero de boleta
        ctx.fillStyle = "red";
        ctx.font = "normal 35px Arial";
        
        ctx.fillText( "#"+ticketData.value.number, 320, 1648);
       
      };
    });
    
    const handleUpdateData = (data) => {
    }
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
      pdf.addImage(imageUrl, "PNG", 0, 0, pdfWidth, pdfHeight-220);
    
      // Descarga el PDF
      pdf.save("recibo.pdf");
    };
    
    
    </script>
    
    