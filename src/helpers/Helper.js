export default class Helper {
    static formatNumber = (value) => {
        return new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
        }).format(value);
    }

    static thousandSeparator = (value) => {
      if (!value) return '';
      value = String(value).replace(/\./g, '');

      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    static formatDate(dateString) {
      const date = new Date(dateString + 'T00:00:00');
      return new Intl.DateTimeFormat('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    }

    static formatDateForm(date) {
        return date.toISOString().split('T')[0]
    }
    
}

