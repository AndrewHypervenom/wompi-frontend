export const initWompi = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.wompi.co/widget.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  
    return new Promise((resolve, reject) => {
      script.onload = () => {
        const wompi = window.wompi;
        if (wompi) {
          resolve(wompi);
        } else {
          reject(new Error('No se pudo cargar Wompi'));
        }
      };
      script.onerror = () => {
        reject(new Error('Error al cargar el script de Wompi'));
      };
    });
  };