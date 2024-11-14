class Helper {
    static formatNumber = (value) => {
        return new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
        }).format(value);
    }

    static thousandSeparator = (value) => {
      return new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    };

    static formatDate(dateString) {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    }
    
}

export default Helper;
