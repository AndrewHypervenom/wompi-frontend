import React from 'react';
import { Receipt, ShoppingBag, CreditCard, MapPin, Mail } from 'lucide-react';

const ReceiptPreview = ({ formData, producto, calcularTotal }) => {
  const formatDate = () => {
    const today = new Date();
    return today.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-[425px] bg-white rounded-lg shadow-lg p-6 mt-6">
      {/* Encabezado de la factura */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-2">
          <Receipt className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-800">Detalles del Pago</h3>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Fecha:</p>
          <p className="text-sm font-medium">{formatDate()}</p>
        </div>
      </div>

      {/* Datos del cliente */}
      <div className="space-y-3 mb-6">
        <div className="flex items-start space-x-3">
          <Mail className="w-4 h-4 text-gray-400 mt-1" />
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-sm font-medium">{formData.email || 'N/A'}</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <CreditCard className="w-4 h-4 text-gray-400 mt-1" />
          <div>
            <p className="text-xs text-gray-500">Tarjeta</p>
            <p className="text-sm font-medium">
              **** **** **** {formData.numeroTarjeta?.slice(-4) || '****'}
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <MapPin className="w-4 h-4 text-gray-400 mt-1" />
          <div>
            <p className="text-xs text-gray-500">Dirección de envío</p>
            <p className="text-sm font-medium">
              {formData.direccionEntrega || 'N/A'}
            </p>
            <p className="text-sm">
              {formData.ciudad}{formData.codigoPostal ? `, ${formData.codigoPostal}` : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Detalles del producto */}
      <div className="border-t border-gray-200 pt-4 mb-4">
        <div className="flex items-start space-x-3">
          <ShoppingBag className="w-4 h-4 text-gray-400 mt-1" />
          <div className="flex-1">
            <p className="text-xs text-gray-500">Producto</p>
            <p className="text-sm font-medium">{producto?.nombre || 'Producto'}</p>
            <p className="text-xs text-gray-500">{producto?.descripcion}</p>
          </div>
          <p className="text-sm font-medium">${producto?.precio?.toLocaleString()}</p>
        </div>
      </div>

      {/* Resumen de costos */}
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Tarifa base:</span>
          <span>$1,000</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Envío:</span>
          <span>$5,000</span>
        </div>
        <div className="flex justify-between font-medium text-base pt-2 border-t border-gray-200">
          <span>Total</span>
          <span className="text-blue-600">${calcularTotal().toLocaleString()}</span>
        </div>
      </div>

      {/* Estado del pago */}
      <div className="mt-6 bg-blue-50 rounded-lg p-3 flex items-center justify-center space-x-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span className="text-sm text-blue-700 font-medium">
          Procesando pago...
        </span>
      </div>
    </div>
  );
};

export default ReceiptPreview;