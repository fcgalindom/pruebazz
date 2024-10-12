<template>
    <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <h2 class="text-center mt-5">Login</h2>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input v-model="user.email" type="email" class="form-control" id="username" placeholder="Enter your email">
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input v-model="user.password" type="password" class="form-control" id="password" placeholder="Enter your password">
          </div>
          <button @click="saveEntity">Login</button>
      </div>
    </div>
  </div>
      
  </template>
   <script setup>
    import { ref, onMounted } from "vue";
    import { LoginServices } from "@/services/login.service";
    import Cookies from 'js-cookie';


    


    const user = ref({})
    

    const saveEntity = () => {
        LoginServices.login(user.value).then(response => {
            //sessionStorage.setItem('key', response.data.token);
            console.log("Respuesta del servidor:", response);
            Cookies.set('token', response.token, {
                
                vsecure: true,    // Solo se enviará a través de HTTPS
                sameSite: 'Strict',  // Para prevenir ataques CSRF
                expires: 1       // Duración de 7 días
            });
            Cookies.set('type_user', response.user.is_superuser, {
                
                vsecure: true,    // Solo se enviará a través de HTTPS
                sameSite: 'Strict',  // Para prevenir ataques CSRF
                expires: 1       // Duración de 7 días
            });
            

            window.location.href = '/customers';

            

        })
    }

   </script>