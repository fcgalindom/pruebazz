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
        <div class="d-flex justify-content-center w-100">
          <div class="w-50">
            <label class="poppins-bold" for="">NÚMEROS AL AZAR</label>
              <div class="input-group mb-3">
                  <input type="text" class="form-control input-customer" placeholder="Cantidad de números" aria-label="Cantidad de números" aria-describedby="basic-addon2">
                  <div class="input-group-append">
                      <span class="input-group-text" id="basic-addon2"><i class="fas fa-search fa-xl"></i></span>
                  </div>
              </div>
          </div>
        </div>
    </div>
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
            ]
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
  
<style scoped>
.background-container {
    height: 100vh;
    background-image: url('@/assets/customers/background_black_friday.png');
    background-size: cover;
}

.carousel-indicators li {
    background-color: #fff;
}

.card {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.card-img-top {
    max-height: 200px;
    object-fit: cover;
}
</style>