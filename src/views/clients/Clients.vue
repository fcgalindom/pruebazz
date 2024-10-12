<template>
    <div class="background-container">
        <div class="w-100 d-flex justify-content-between">
            <div class="margin-customer-main">
                <h3 class="text-white poppins-semibold mb-3">Puedes ganar una</h3>
                <span class="main-award poppins-black mb-3">CASA AMOBLADA</span>
                <h1 class="secondary-award poppins-semibold">+2 MOTOCICLETAS NKD MULTICOLOR 0 KILOMETROS</h1>
                <h3 class="text-white poppins-semibold position-draw_date">SORTEO 21 DE DICIEMBRE</h3>
                <div>
                    <button class="btn-buy poppins-regular">Comprar Boletas</button>
                    <button class="btn-watch poppins-regular"> <i class="btn-play fas fa-play fa-sm"></i> <span>Ver Premios</span> </button>
                </div>
            </div>
            <div class="div-image">
                <img src="@/assets/customers/persons.png" style="width: 46em; height: 92vh;" alt="">
            </div>
        </div>
    </div>
    <div style="background-color: #0B0B0B; padding: 2rem; auto">
        <div id="carouselExample" class="carousel slide" data-ride="carousel">
    
            <!-- Indicators -->
            <ol class="carousel-indicators">
                <li v-for="(group, index) in groupedItems" :key="'indicator-' + index" :class="{ active: index === 0 }" :data-target="'#carouselExample'" :data-slide-to="index"></li>
            </ol>
    
            <div class="carousel-inner">
                <div v-for="(group, index) in groupedItems" :key="'slide-' + index" :class="['carousel-item', { active: index === 0 }]">
                    <div class="row">
                        <div v-for="(item, i) in group" :key="'card-' + i" class="col-md-4">
                            <div class="card">
                                <img :src="item.img" class="card-img-top" :alt="`Image of ${item.title}`">
                                <div class="card-body">
                                    <h5 class="card-title">{{ item.title }}</h5>
                                    <p class="card-text">{{ item.text }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            <!-- Controls -->
            <a class="carousel-control-prev" href="#carouselExample" role="button" data-slide="prev">
                              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                              <span class="sr-only">Previous</span>
                            </a>
            <a class="carousel-control-next" href="#carouselExample" role="button" data-slide="next">
                              <span class="carousel-control-next-icon" aria-hidden="true"></span>
                              <span class="sr-only">Next</span>
                            </a>
        </div>
        <div class="d-flex flex-column text-center mt-5">
            <span class="poppins-black text-white" style="font-size: 5em;">COMPRAR TICKETS</span>
            <span class="poppins-semibold" style="color: rgb(205, 175, 46); font-size: 3.5em;">Valor Unitario: $80.000</span>
        </div>
    </div>
    <div class="div-select-ticket">
        <div class="text-center">
            <span>Todos los sorteos juegan con las últimas cuatro cifras de la lotería de Boyacá, sin serie</span>
        </div>
        <div class="d-flex justify-content-center">
            <img src="@/assets/customers/loteria_boyaca.png" alt="" style="max-width: 80%;">
        </div>
        <div class="d-flex justify-content-center w-100 mb-3">
            <div class="w-70 text-center">
                <label class="poppins-bold fs-random-number" for="">NÚMEROS AL AZAR</label>
                <div class="input-group mb-3 input-customer">
                    <input type="text" class="form-control poppins-medium" placeholder="Cantidad de números" aria-label="Cantidad de números" aria-describedby="basic-addon2">
                    <div class="input-group-append">
                        <span class="input-group-text" id="basic-addon2"><i class="fas fa-search fa-lg"></i></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-center w-100 mt-5">
            <div class="w-70 text-center">
                <label class="poppins-bold fs-random-number" for="">BUSQUE SU NÚMERO</label>
                <div class="input-group mb-3 input-customer">
                    <input type="text" class="form-control poppins-medium" placeholder="Ingrese el número a buscar" aria-label="Ingrese el número a buscar" aria-describedby="basic-addon2">
                    <div class="input-group-append">
                        <span class="input-group-text" id="basic-addon2"><i class="fas fa-search fa-lg"></i></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-center w-100 mt-5">
            <div class="w-70 text-center">
                <label class="poppins-bold fs-random-number" for="">&nbsp;</label>
                <div class="input-group mb-3 input-customer">
                    <input type="text" class="form-control poppins-medium text-center" placeholder="Números seleccionados" readonly
                    aria-label="Números seleccionados" aria-describedby="basic-addon2" style="border-top-right-radius: 12px; border-bottom-right-radius: 12px;">
                </div>
            </div>
        </div>
        <div class="container-fluid d-flex justify-content-center mt-3 pb-5">
            <div class="button-grid w-50 grid-buttons-tickets scroll-container">
                <button v-for="(button, index) in buttons" :key="index" class="grid-button">
              {{ button }}
            </button>
            </div>
        </div>
    </div>

    <footer class="footer-customer">
        <div class="d-flex justify-content-center buttons-social-networks">
            <button><i class="fab fa-facebook"></i></button>
            <button><i class="fab fa-whatsapp"></i></button>
            <button><i class="fab fa-tiktok"></i></button>
            <button><i class="fab fa-instagram"></i></button>
        </div>
        <div class="text-center pt-2">
            <span class="text-white poppins-medium">Rifa auspiciado por:</span>
        </div>
        <div style="margin-left: 5%;
padding-bottom: 2em;">
            <img src="@/assets/customers/dr_denix_logo.png" alt="" style="width: 15%;">
        </div>
    </footer>

    <button class="btn-float-whatsapp"><i class="fab fa-whatsapp"></i></button>
</template>
  
<script>
export default {
    data() {
        return {
            items: [
                { img: 'https://via.placeholder.com/150', title: 'Card 1', text: 'This is card 1 content.' },
                { img: 'https://via.placeholder.com/150', title: 'Card 2', text: 'This is card 2 content.' },
                { img: 'https://via.placeholder.com/150', title: 'Card 3', text: 'This is card 3 content.' },
                { img: 'https://via.placeholder.com/150', title: 'Card 4', text: 'This is card 4 content.' },
                { img: 'https://via.placeholder.com/150', title: 'Card 5', text: 'This is card 5 content.' },
                { img: 'https://via.placeholder.com/150', title: 'Card 6', text: 'This is card 6 content.' }
            ],
            buttons: Array.from({ length: 999 }, (_, i) => `${i + 1}`), // 28 botones
        };
    },
    computed: {
        // Agrupar los elementos de 3 en 3 para mostrarlos en cada slide
        groupedItems() {
            const groups = [];
            for (let i = 0; i < this.items.length; i += 3) {
                groups.push(this.items.slice(i, i + 3));
            }
            return groups;
        }
    },
    mounted() {
        // Inicializamos el carrusel al montar el componente
        $('#carouselExample').carousel({
            interval: 60000 // 60 segundos
        });
    }
};
</script>
