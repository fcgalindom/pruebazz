<template>
    <div class="row">
        <div class="col-12 mb-3">
            <label for="total">Total</label>
            <InputNumber id="total" v-model="total" fluid disabled />
        </div>

        <div class="col-12 mb-3">
            <label for="percentage">Porcentaje</label>
            <input id="percentage" v-model="percentage" fluid @input="calculate" maxlength="2" />
        </div>

        <div class="col-12 mb-3">
            <label for="totalToPay">Total a pagar</label>
            <InputNumber id="totalToPay" v-model="totalToPay" fluid disabled />
        </div>

        <div class="col-12 text-center">
            <Button @click="pay">Pagar</Button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, defineProps, defineEmits } from 'vue'

const props = defineProps({
    totalProp: {
        type: Number,
        required: true
    }
})

const total = ref(0)
const percentage = ref(0)
const emit = defineEmits(['closedialog', 'pay']);

onMounted(() => {
    total.value = props.totalProp.total
})

const totalToPay = computed(() => {
    const result = (total.value * percentage.value) / 100
    return isNaN(result) ? 0 : result
})

// Acción al pagar
function pay() {
    emit('pay', {
        percentage: percentage.value,
        totalToPay: totalToPay.value
    })
}
</script>