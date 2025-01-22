import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Producto from './components/Producto/Producto';
import PagoForm from './components/PagoForm/PagoForm';
import Resumen from './components/Resumen/Resumen';
import { initWompi } from './services/wompiService';

function App() {

  useEffect(() => {
    const loadWompi = async () => {
      try {
        await initWompi();
        console.log('Wompi inicializado correctamente');
      } catch (error) {
        console.error('Error al inicializar Wompi:', error);
      }
    };

    loadWompi();
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Producto />} />
          <Route path="/pago" element={<PagoForm />} />
          <Route path="/resumen" element={<Resumen />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;