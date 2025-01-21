import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getTransaction } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const Resumen = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { transaccion } = useSelector(state => state.pago);
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id');
    
    if (id) {
      getTransaction(id)
        .then(response => {
          dispatch(setTransaccion(response.transaction));
        })
        .catch(error => {
          setError('Error al obtener detalles de la transacción');
          console.error(error);
        });
    }

    if (!transaccion) {
      navigate('/');
      return;
    }

    const checkStatus = async () => {
      try {
        const response = await getTransaction(transaccion._id);
        if (response.transaction.estado === 'APPROVED') {
          setLoading(false);
        } else if (response.transaction.estado === 'DECLINED' || response.transaction.estado === 'ERROR') {
          setError('La transacción no pudo ser completada');
          setLoading(false);
        }
      } catch (err) {
        setError('Error al verificar el estado de la transacción');
        setLoading(false);
      }
    };

    if (transaccion.estado === 'PENDING') {
      const interval = setInterval(checkStatus, 3000);
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [transaccion, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center text-red-600 mb-4">
          <span className="text-5xl">×</span>
        </div>
        <h2 className="text-2xl font-bold text-red-600 text-center mb-4">
          {error}
        </h2>
        <button
          onClick={() => navigate('/')}
          className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Volver a la tienda
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <div className="text-green-600 text-5xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-green-600">¡Pago Exitoso!</h2>
      </div>

      <div className="space-y-4">
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Detalles de la transacción:</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-gray-600">ID de Transacción:</span>
            <span>{transaccion._id}</span>
            <span className="text-gray-600">Estado:</span>
            <span>{transaccion.estado}</span>
            <span className="text-gray-600">Monto:</span>
            <span>${transaccion.monto?.toLocaleString()}</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Detalles de envío:</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-gray-600">Dirección:</span>
            <span>{transaccion.direccionEntrega}</span>
            <span className="text-gray-600">Ciudad:</span>
            <span>{transaccion.ciudad}</span>
            <span className="text-gray-600">Código Postal:</span>
            <span>{transaccion.codigoPostal}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate('/')}
        className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Volver a la tienda
      </button>
    </div>
  );
};

export default Resumen;