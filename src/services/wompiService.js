export const initWompi = () => {
  return new Promise((resolve, reject) => {
    try {
      // Si el script ya existe, no lo volvemos a cargar
      if (document.querySelector('script[src="https://checkout.wompi.co/widget.js"]')) {
        resolve(window.Wompi);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.wompi.co/widget.js';
      script.async = true;
      
      script.onload = () => {
        // Esperamos un momento para asegurarnos que Wompi se inicialice
        setTimeout(() => {
          if (window.Wompi) {
            resolve(window.Wompi);
          } else {
            reject(new Error('No se pudo inicializar Wompi'));
          }
        }, 1000);
      };

      script.onerror = () => {
        reject(new Error('Error al cargar el script de Wompi'));
      };

      document.head.appendChild(script);
    } catch (error) {
      reject(error);
    }
  });
};