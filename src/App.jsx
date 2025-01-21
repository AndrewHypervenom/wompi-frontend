import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Producto from './components/Producto/Producto';
import PagoForm from './components/PagoForm/PagoForm';
import Resumen from './components/Resumen/Resumen';

function App() {
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