<template>
    <table class="table table-bordered">
        <thead>
            <tr>
                <th>Número</th>
                <th>Rifa</th>
                <th>Cliente</th>
                <th>Documento</th>
                <th>Teléfono</th>
                <th>Ciudad</th>
                <th>Vendedor</th>
                <th>Abonado</th>
                <th>Saldo</th>
                <th>Acciones</th>
                <th>Cerficado</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(i, index) in tickets" :key="index">
                <td>#{{i.number}}</td>
                <td>{{i.raffle.name}}</td>
                <td>{{i.customer.name}}</td>
                <td>{{ Helper.thousandSeparator(i.customer.document) }}</td>
                <td>{{ i.customer.phone }}</td>
                <td>{{ i.customer.city.name }}</td>
                <td>{{i.seller?.name}}</td>
                <td>{{ Helper.formatNumber(i.value) }}</td>
                <td>{{ Helper.formatNumber(i.value_to_pay) }}</td>
                <td class="text-center">
                    <div class="d-flex justify-content-between">
                        <button class="btn text-darkslategrey" @click="showData(i.id); visible = true"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-success btn-sm" style="border-radius: 50%;" @click="changeState(i.id, status)"><i class="fas fa-check"></i></button>
                        <button class="btn btn-danger btn-sm" style="border-radius: 50%;" @click="changeState(i.id, 'Libre')"><i class="fas fa-times"></i></button>
                    </div>
                </td>
                <td>
                    <div class="row">
                        <div class="col-6">
                            <button class="btn text-darkslategrey" data-toggle="modal" @click="showTicketAlert(i)"><i class="fas fa-download"></i></button>
                        </div>
                        <div class="col-6">
                            <button class="btn text-darkslategrey" data-toggle="modal" :data-target="`#${ticketsmodal}`" @click="paymentdata(i.payments)"><i class="fas fa-ticket-alt"></i></button>
                        </div>
                    </div>
                    <Modal :id="firstpaymentmodal" label="Descargar" title="Descarcar Boleta" size="xl">
                        <TikectFirstPaid :ticketData="i" />
                    </Modal>
    
                    <Modal :id="ticketsmodal" label="Descargar" title="Descarcar Boleta" size="xl">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Número</th>
                                    <th>abono</th>
                                    <th>metodo de pago</th>
                                    <th>Descarga</th>
    
                                </tr>
                            </thead>
                            <tbody>
    
                                <tr v-for="(f, index) in payments1" :key="index">
    
                                    <td>{{f.ticket}}</td>
                                    <td>{{f.amount}}</td>
                                    <td>{{f.payment_method}}</td>
                                    <td>
                                        <TicketPaid :ticketData="i" :paymentData="f" /> </td>
    
                                </tr>
    
                            </tbody>
    
                        </table>
                    </Modal>
                </td>
            </tr>
        </tbody>
    </table>
</template>
<script setup>
import Helper from '@/helpers/Helper';
</script>