<template>
    <div class="w-100 d-flex justify-content-center mt-2 mb-5">
        <img class="main-logo-head" :src="raffle?.logo || defaultLogo" />
    </div>
    <div class="w-100 d-flex justify-content-center">
        <div class="container-main-head">
            <!-- <div class="mb-4 text-center">
            </div> -->
            <div class="d-flex justify-content-center mb-5">
                <div class="container-description" style="border-radius: 30px;">
                    <span class="text-white poppins-semibold text-center" style="font-size: 1.45em;"> {{
                        raffle?.description ? raffle?.description : 'Sin premio' }} </span>
                </div>
            </div>
            <!-- <div class="text-white text-center py-2">
                    
                </div> -->
        </div>
    </div>
    <div class="d-flex justify-content-center my-5 ">
        <button class="blinking-button poppins-semibold" @click="scrollToBuyNumbers">Compra tus números</button>
    </div>
    <!-- <div>
            <img src="@/assets/customers/background_raffle.jpeg" alt="" style="width: 100%; height: 30em;">
        </div> -->


    <div>
        <div class="card">
            <Carousel :value="awards" :numVisible="3" :numScroll="1" :responsiveOptions="responsiveOptions"
                :autoplayInterval="3000">
                <template #item="slotProps">
                    <div class="border border-surface-200 dark:border-surface-700 rounded m-2  p-4">
                        <div class="mb-4">
                            <div class="relative mx-auto d-flex justify-content-center">
                                <img :src="slotProps.data.image" :alt="slotProps.data.name"
                                    class="w-full rounded carrouse-image-size" />
                            </div>
                        </div>
                        <div class="mb-4 font-medium text-center">{{ slotProps.data.name }}</div>
                    </div>
                </template>
            </Carousel>
        </div>
    </div>

    <!-- <div class="mt-5 text-center">
        <span class="color-primary-raffle poppins-bold text-uppercase" style="font-size: 3em;">JUEGA ESTE {{
            formatDate()
            }}</span>
    </div> -->
    <!-- <div class="text-center mt-5">
        <span class="mt-4 poppins-semibold" style="color: #0B0B0B; font-size: 2.5em;">Valor unitario por
            número</span><br>
        <span class="mt-4 poppins-bold"
            style="color: #01B1EB; font-size: 3em;">${{ Helper.thousandSeparator(raffle.value_ticket) }}</span>
        <div class="w-100 d-flex justify-content-center">
            <img class="size-lotery-image" src="@/assets/customers/loteria_boyaca.png">
        </div>
    </div> -->
    <!-- <div class="mt-2 text-center">
        <span class="poppins-regular">Todos los sorteos juegan con las 4 últimas cifras del premio mayor de la Lotería
            Boyacá, sin serie.</span>
    </div> -->

    <div id="buyNumbers" class="mt-5">
        <TicketFree v-if="domLoaded" typeScreen="client" :raffle="raffle" />
    </div>

    <footer class="footer-customer">
        <div class="d-flex justify-content-center buttons-social-networks">
            <a target="_blank" href="https://www.facebook.com/profile.php?id=61559489645594&mibextid=LQQJ4d"><button><i
                        class="fab fa-facebook"></i></button></a>
            <a target="_blank" href="https://wa.me/message/OI3ATU3KA44DP1"><button><i
                        class="fab fa-whatsapp"></i></button></a>
            <a target="_blank" href="https://www.tiktok.com/@rifacasavijesvalle?_t=8r81sPg1AYg&_r=1"><button><i
                        class="fab fa-tiktok"></i></button></a>
            <a target="_blank" href="https://www.instagram.com/rifacasavijesvalle?igsh=cXFyNDNnYmpiankx"><button><i
                        class="fab fa-instagram"></i></button></a>
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
import Cookies from 'js-cookie';
import defaultLogo from '@/assets/customers/dr_denix_logo.png'

const awards = ref([]);
const responsiveOptions = ref([{
    breakpoint: '1400px',
    numVisible: 2,
    numScroll: 1
},
{
    breakpoint: '1199px',
    numVisible: 3,
    numScroll: 1
},
{
    breakpoint: '767px',
    numVisible: 2,
    numScroll: 1
},
{
    breakpoint: '575px',
    numVisible: 1,
    numScroll: 1
}
]);

const getSeverity = (status) => {
    switch (status) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warn';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
};

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
    raffle.value = await RaffleServices.listlast();

    raffle.value.images_awards.forEach(element => {
        awards.value.push({ image: element.image, name: element.award })
        awards.value.push({ image: element.image, name: element.award })
        awards.value.push({ image: element.image, name: element.award })
        awards.value.push({ image: element.image, name: element.award })
        awards.value.push({ image: element.image, name: element.award })
        awards.value.push({ image: element.image, name: element.award })
        awards.value.push({ image: element.image, name: element.award })
    });
};

const scrollToBuyNumbers = () => {
    const element = document.getElementById('buyNumbers');
    element.scrollIntoView({ behavior: 'smooth' });
}

const cookiesClient = () => {
    Cookies.remove();
    Cookies.set('type_user', 'false', {
        vsecure: true, // Solo se enviará a través de HTTPS
        sameSite: 'Strict', // Para prevenir ataques CSRF
        expires: 1 // Duración de 7 días
    });
    Cookies.set('seller_id', 3, {
        vsecure: true, // Solo se enviará a través de HTTPS
        sameSite: 'Strict', // Para prevenir ataques CSRF
        expires: 1 // Duración de 7 días
    });
}

onMounted(async () => {
    //$('#carouselExample').carousel({
    //   interval: 60000 // 60 segundos
    //});
    cookiesClient();
    await listRaffles()
    domLoaded.value = true;
    //loadWompiScript();
});

const formatDate = () => {
    const date = new Date(raffle.value.raffle_date);
    date.setDate(date.getDate() + 1); // sumar un día
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
};

function isVideo(url) {
    const videoExtensions = ['mp4', 'webm', 'ogg'];
    const extension = url.split('.').pop();
    return videoExtensions.includes(extension);
}


const messageBuy = () => {
    window.open('https://wa.me/573152532377?text=Hola,%20quiero%20comprar%20la%20boleta%20por%20este%20medio.', '_blank');
}
</script>