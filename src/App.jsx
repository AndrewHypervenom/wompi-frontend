import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Producto from './components/Producto/Producto';
import PagoForm from './components/PagoForm/PagoForm';
import Resumen from './components/Resumen/Resumen';
import { initWompi } from './services/wompiService';

function App() {
  const [wompiLoaded, setWompiLoaded] = useState(false);

  useEffect(() => {
    const loadWompi = async () => {
      try {
        const wompi = await initWompi();
        console.log('Wompi cargado exitosamente');
        setWompiLoaded(true);
      } catch (error) {
        console.error('Error al cargar Wompi:', error);
      }
    };

    window.wompiConfig = {
      publicKey: 'pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7',
      environment: 'test'
    };

    loadWompi();
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Producto />} />
          <Route path="/pago" element={<PagoForm wompiLoaded={wompiLoaded} />} />
          <Route path="/resumen" element={<Resumen />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;