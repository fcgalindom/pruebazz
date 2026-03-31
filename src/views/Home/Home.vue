
<template>
  <div>
    <h1>entro</h1>
    <button class="btn btn-danger" @click="confirmarEliminar">
      Eliminar datos de rifa
    </button>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import { TicketServices } from '@/services/ticket.service.js'

export default {
  name: 'Home',
  methods: {
    async confirmarEliminar() {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Se eliminarán todos los tickets y pagos. Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      })

      if (!result.isConfirmed) return

      try {
        await TicketServices.deleteAll()
        Swal.fire('Eliminado', 'Todos los tickets y pagos fueron eliminados.', 'success')
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar los datos.', 'error')
      }
    }
  }
}
</script>
