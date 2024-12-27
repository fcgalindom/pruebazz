<template>
    <div class="w-100 d-flex justify-content-center mt-2 mb-5">
        <img class="main-logo-head" src="@/assets/customers/dr_denix_logo.png">
    </div>
    <div class="w-100 d-flex justify-content-center">
        <div class="container-main-head">
            <div class="mb-4">
                <span class="color-primary-raffle poppins-bold text-center" style="font-size: 5em;">COMBO</span>
            </div>
            <div class="d-flex justify-content-center mb-5">
                <div class="container-awards">
                    <span class="color-primary-raffle poppins-semibold" style="font-size: 2em;"> NMAX CONNECTED - </span>
                    <span class="color-primary-raffle poppins-semibold" style="font-size: 2em;">XTZ 250 0 KILÓMETROS</span>
                </div>
            </div>
            <div class="d-flex justify-content-center mb-5">
                <div class="container-description" style="border-radius: 30px;">
                    <span class="text-white poppins-semibold text-center" style="font-size: 1.45em;">ESTE MARTES 4 GANADORES 3 DE CADA UNO POR $500.000 Y 1 POR $1.000.000</span>
                    <!-- <span class="color-primary-raffle poppins-semibold" style="font-size: 4em;"> NMAX CONNECTED - </span>
                    <span class="color-primary-raffle poppins-semibold" style="font-size: 4em;">XTZ 250 0 KILÓMETROS</span> -->
                </div>
            </div>
            <!-- <div class="text-white text-center py-2">
                
            </div> -->
        </div>  
    </div>
    <div class="d-flex justify-content-center my-5 ">
        <button class="blinking-button poppins-semibold">Compra tus números</button>
    </div>
    <div>
        <img src="@/assets/customers/background_raffle.jpeg" alt="" style="width: 100%; height: 30em;">
    </div>

    <div class="mt-5">
        <span class="color-primary-raffle text-center poppins-bold" style="font-size: 3em;">JUEGA ESTE 28 DE DICIEMBRE</span>
    </div>
    <div class="text-center mt-5">
        <span class="mt-4 poppins-semibold" style="color: #0B0B0B; font-size: 2.5em;">Valor unitario por número</span><br>
        <span class="mt-4 poppins-bold" style="color: #01B1EB; font-size: 3em;">$80.000</span>
        <div class="w-100 d-flex justify-content-center">
            <img class="size-lotery-image" src="@/assets/customers/loteria_boyaca.png">
        </div>
    </div>
    <div class="mt-2 text-center">
        <span class="poppins-regular">Todos los sorteos juegan con las 4 últimas cifras del premio mayor de la Lotería Boyacá, sin serie.</span>
    </div>

    <div class=" mt-5">
        <!-- <div class="text-center">
            <span>Todos los sorteos juegan con las últimas cuatro cifras de la lotería de Boyacá, sin serie</span>
        </div>
        <div class="d-flex justify-content-center">
            <img src="@/assets/customers/loteria_boyaca.png" alt="" style="max-width: 80%;">
        </div> -->
        <TicketFree v-if="domLoaded" typeScreen="client" :raffle="raffle" />
    </div>

    <footer class="footer-customer">
        <div class="d-flex justify-content-center buttons-social-networks">
            <a target="_blank" href="https://www.facebook.com/profile.php?id=61559489645594&mibextid=LQQJ4d"><button><i class="fab fa-facebook"></i></button></a>
            <a target="_blank" href="https://wa.me/message/OI3ATU3KA44DP1"><button><i class="fab fa-whatsapp"></i></button></a>
            <a target="_blank" href="https://www.tiktok.com/@rifacasavijesvalle?_t=8r81sPg1AYg&_r=1"><button><i class="fab fa-tiktok"></i></button></a>
            <a target="_blank" href="https://www.instagram.com/rifacasavijesvalle?igsh=cXFyNDNnYmpiankx"><button><i class="fab fa-instagram"></i></button></a>
        </div>
        <div class="text-center pt-2">
            <span class="text-white poppins-medium">Rifa auspiciado por:</span>
        </div>
        <div style="margin-left: 5%; padding-bottom: .5em;">
            <img src="@/assets/customers/dr_denix_logo.png" alt="" style="width: 15%;">
        </div>
    </footer>

    <button @click="messageBuy" class="btn-float-whatsapp"><i class="fab fa-whatsapp"></i></button>
</template>
  
<script setup>
import { ref, computed, onMounted } from 'vue';
import { RaffleServices } from '@/services/raffle.service';
import TicketFree from '@views/ticket/TicketFree.vue';
// @ts-ignore
import Helper from '@/helpers/Helper';

const raffle = ref({});
const domLoaded = ref(false);
    

const items = ref([]);

const buttons = ref(Array.from({ length: 999 }, (_, i) => `${i + 1}`));

const groupedItems = computed(() => {
           const groups = [];
            for (let i = 0; i < items.value.length; i += 3) {
              groups.push(items.value.slice(i, i + 3));
            }
            return groups;
        });
        const formatNumber = (value) => {
               return (value !== null && value !== undefined) ? value.toLocaleString('es-ES') : '0';
        };


        const listRaffles = async () => {
              raffle.value  = await RaffleServices.listlast();
              raffle.value.images_awards.forEach(element => {
                   items.value.push(
                    { img: element.image , title: element.award, text: 'todo lo que quieras podrá ser tuyo' })
              });
        };
       
    

        onMounted(async() => {
            //$('#carouselExample').carousel({
             //   interval: 60000 // 60 segundos
            //});
            await listRaffles()
            domLoaded.value = true;
            //loadWompiScript();
        });
       function isVideo(url) {
          const videoExtensions = ['mp4', 'webm', 'ogg'];
          const extension = url.split('.').pop();
          return videoExtensions.includes(extension);
       }

       const messageBuy = () => {
          window.open('https://wa.me/573152532377?text=Hola,%20quiero%20comprar%20la%20boleta%20por%20este%20medio.', '_blank');
       }

</script>