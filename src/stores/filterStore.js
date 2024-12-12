import { defineStore } from 'pinia';

export const useFilterStore = defineStore('filter', {
  state: () => ({
    filter: "", // Aquí almacenaremos los filtros
  }),
  actions: {
    setFilter(newFilter) {
      this.filter = String(newFilter); // Actualiza los filtros
    },
    clearFilter() {
      this.filter = ""; // Limpia los filtros
    },
  },
});

export const useModalStore = defineStore('modal', {
  state: () => ({
    isOpen: false, // Estado de la modal
  }),
  actions: {
    openModal() {
      this.isOpen = true;
    },
    closeModal() {
      this.isOpen = false;
    },
  },
});

export const useFilterCustomer = defineStore('filter', {
  state: () => ({
    filter: "", // Aquí almacenaremos los filtros
  }),
  actions: {
    setFilter(newFilter) {
      
      this.filter = String(newFilter); // Actualiza los filtros
    },
    clearFilter() {
      this.filter = ""; // Limpia los filtros
    },
  },
});

export const useFilterTicket = defineStore('filterTicket', {
  state: () => ({
    filterTicket: "", // Aquí almacenaremos los filtros
  }),
  actions: {
    
    setFilter(newFilter) {
      this.filter = String(newFilter); // Actualiza los filtros
    },
    clearFilter() {
      this.filter = ""; // Limpia los filtros
    },
  },
});