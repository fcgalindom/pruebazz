<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <h2 class="text-center mt-5">Login</h2>
        <div class="mb-3">
          <label for="email" class="form-label">Correo</label>
          <input v-model="user.email" type="email" class="form-control" id="username"
            placeholder="email.dentix@example.com">
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">contraseña</label>
          <input v-model="user.password" type="password" class="form-control" id="password" placeholder="Contraseña">
        </div>
        <Button @click="saveEntity">Login</Button>
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

    if (user.value.email == 'rifasysorteos4@gmail.com') {
      Cookies.set('is_admin', true, {
        vsecure: true,    // Solo se enviará a través de HTTPS
        sameSite: 'Strict',  // Para prevenir ataques CSRF
        expires: 1       // Duración de 7 días
      });
    } else {
      Cookies.set('is_admin', false, {
        vsecure: true,    // Solo se enviará a través de HTTPS
        sameSite: 'Strict',  // Para prevenir ataques CSRF
        expires: 1       // Duración de 7 días
      });

    }
    if (response.user.is_superuser) {
      Cookies.set('name', response.user.username, {
        vsecure: true,    // Solo se enviará a través de HTTPS
        sameSite: 'Strict',  // Para prevenir ataques CSRF
        expires: 1       // Duración de 7 días
      });
    } else {
      Cookies.set('name', response.seller[0].name, {
        vsecure: true,    // Solo se enviará a través de HTTPS
        sameSite: 'Strict',  // Para prevenir ataques CSRF
        expires: 1       // Duración de 7 días
      });
      Cookies.set('seller_id', response.seller[0].id, {
        vsecure: true,    // Solo se enviará a través de HTTPS
        sameSite: 'Strict',  // Para prevenir ataques CSRF
        expires: 1       // Duración de 7 días
      });
    }

    window.location.href = '/home';



  })
}

</script>