import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setProducto } from '../../store/slices/pagoSlice';
import { 
  CreditCard, 
  Package2, 
  ShoppingCart, 
  AlertTriangle 
} from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const Producto = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/productos')
      .then(response => response.json())
      .then(data => {
        setProductos(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error al cargar productos');
        setLoading(false);
      });
  }, []);

  const handleComprar = (producto) => {
    if (producto.stock > 0) {
      dispatch(setProducto(producto));
      navigate('/pago');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner className="h-12 w-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Productos Disponibles
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productos.map(producto => (
            <div 
              key={producto._id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              <div className="relative">
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="w-full h-48 object-cover"
                />
                {producto.stock < 5 && producto.stock > 0 && (
                  <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    ¡Últimas unidades!
                  </div>
                )}
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {producto.nombre}
                </h2>
                
                <p className="text-gray-600 mb-4">
                  {producto.descripcion}
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Package2 className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Stock disponible:
                      </span>
                    </div>
                    <span className={`font-medium ${
                      producto.stock > 5 
                        ? 'text-green-600' 
                        : producto.stock > 0 
                          ? 'text-yellow-600' 
                          : 'text-red-600'
                    }`}>
                      {producto.stock} unidades
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ShoppingCart className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Precio:
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">
                      ${producto.precio.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleComprar(producto)}
                    disabled={producto.stock === 0}
                    className={`w-full py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2
                      ${producto.stock > 0 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl' 
                        : 'bg-gray-100 cursor-not-allowed text-gray-500'}`}
                  >
                    <CreditCard className={`h-5 w-5 ${producto.stock > 0 ? 'text-white' : 'text-gray-400'}`} />
                    <span className="font-medium">
                      {producto.stock > 0 ? 'Pagar' : 'Agotado'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Producto;