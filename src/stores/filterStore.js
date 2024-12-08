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