import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setTransaccion } from '../../store/slices/pagoSlice';
import { CreditCard, Mail, User, MapPin, Building, Hash, Phone } from 'lucide-react';
import CreditCardPreview from '../common/CreditCardPreview';
import ReceiptPreview from '../common/ReceiptPreview';
import ErrorAlert from '../common/ErrorAlert';
import LoadingSpinner from '../common/LoadingSpinner';
import { createTransaction } from '../../services/api';

const PagoForm = () => {
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const producto = useSelector((state) => state.pago.producto);

  const [formData, setFormData] = useState({
    numeroTarjeta: '',
    fechaExpiracion: '',
    cvv: '',
    nombreTitular: '',
    tipoDocumento: 'CC',
    numeroDocumento: '',
    email: '',
    telefono: '',
    direccionEntrega: '',
    ciudad: '',
    codigoPostal: ''
  });

  const [cardType, setCardType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getCardTypeInfo = (numero) => {
    const patterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      discover: /^6(?:011|5)/,
    };

    const cardInfo = {
      visa: {
        name: 'Visa',
        bgcolor: 'bg-blue-500',
        textcolor: 'text-white',
        icon: '💳'
      },
      mastercard: {
        name: 'Mastercard',
        bgcolor: 'bg-red-500',
        textcolor: 'text-white',
        icon: '💳'
      },
      amex: {
        name: 'American Express',
        bgcolor: 'bg-gray-500',
        textcolor: 'text-white',
        icon: '💳'
      },
      discover: {
        name: 'Discover',
        bgcolor: 'bg-orange-500',
        textcolor: 'text-white',
        icon: '💳'
      }
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(numero)) {
        return cardInfo[type];
      }
    }

    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setError('');
    
    if (name === 'numeroTarjeta') {
      const cleaned = value.replace(/\D/g, '');
      const cardInfo = getCardTypeInfo(cleaned);
      setCardType(cardInfo);
      const formattedValue = cleaned
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
      setFormData({
        ...formData,
        [name]: formattedValue
      });
      return;
    }
  
    if (name === 'fechaExpiracion') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 2) {
        setFormData({
          ...formData,
          [name]: cleaned
        });
      } else if (cleaned.length <= 4) {
        setFormData({
          ...formData,
          [name]: `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`
        });
      }
      return;
    }
  
    if (name === 'cvv') {
      const cleaned = value.replace(/\D/g, '');
      setFormData({
        ...formData,
        [name]: cleaned.slice(0, 4)
      });
      return;
    }

    if (name === 'telefono') {
      const cleaned = value.replace(/\D/g, '').slice(0, 10);
      setFormData({
        ...formData,
        [name]: cleaned
      });
      return;
    }
  
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validarTarjeta = () => {
    const numero = formData.numeroTarjeta.replace(/\D/g, '');
    if (numero.length !== 16) return false;
    
    let sum = 0;
    let isEven = false;

    for (let i = numero.length - 1; i >= 0; i--) {
      let digit = parseInt(numero[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  const validarFormulario = () => {
    if (!validarTarjeta()) {
      setError('Número de tarjeta inválido');
      return false;
    }

    const expDate = formData.fechaExpiracion.split('/');
    if (expDate.length !== 2 || expDate[0].length !== 2 || expDate[1].length !== 2) {
      setError('Fecha de expiración inválida');
      return false;
    }

    const month = parseInt(expDate[0]);
    const year = parseInt('20' + expDate[1]);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (month < 1 || month > 12 || year < currentYear || 
       (year === currentYear && month < currentMonth)) {
      setError('Fecha de expiración inválida');
      return false;
    }

    if (formData.cvv.length < 3) {
      setError('CVV inválido');
      return false;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError('Email inválido');
      return false;
    }

    const telefono = formData.telefono.replace(/\D/g, '');
    if (telefono.length < 10) {
      setError('El número de teléfono debe tener 10 dígitos');
      return false;
    }

    return true;
  };

  const calcularTotal = () => {
    if (!producto?.precio) return 0;
    const tarifaBase = 1000;
    const tarifaEnvio = 5000;
    return producto.precio + tarifaBase + tarifaEnvio;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    if (name === 'numeroDocumento') {
      const cleaned = value.replace(/\D/g, '').slice(0, 20);
      setFormData({
        ...formData,
        [name]: cleaned
      });
      return;
    }
  
    setLoading(true);
    setError('');
  
    try {
      const checkout = new window.WidgetCheckout({
        currency: 'COP',
        amountInCents: calcularTotal() * 100,
        reference: `ORDER-${Date.now()}`,
        publicKey: 'pub_test_X0zDA9xoKdePzhd8a0x9HAez7HgGO9WJ',
        redirectUrl: 'https://wompi-store.netlify.app/resumen',
        taxInCents: {
          vat: 1000 * 100,
          consumption: 5000 * 100
        },
        customerData: {
          email: formData.email,
          fullName: formData.nombreTitular,
          phoneNumber: formData.telefono.replace(/\D/g, ''),
          phoneNumberPrefix: "+57",
          legalId: formData.numeroDocumento,
          legalIdType: formData.tipoDocumento
        },
        shippingAddress: {
          addressLine1: formData.direccionEntrega,
          city: formData.ciudad,
          phoneNumber: formData.telefono.replace(/\D/g, ''),
          region: formData.ciudad,
          country: "CO",
          postalCode: formData.codigoPostal
        }
      });
  
      checkout.open((result) => {
        if (result && result.transaction && result.transaction.id) {
          if (result.transaction.status === 'APPROVED') {
            createTransaction({
              productoId: producto._id,
              wompiId: result.transaction.id,
              monto: calcularTotal(),
              telefono: formData.telefono,
              direccionEntrega: formData.direccionEntrega,
              ciudad: formData.ciudad,
              codigoPostal: formData.codigoPostal
            })
            .then(response => {
              dispatch(setTransaccion(response.transaction));
              navigate('/resumen');
            })
            .catch(error => {
              setError('Error al registrar la transacción');
              console.error(error);
            });
          } else {
            setError(`La transacción fue ${result.transaction.status}`);
          }
        } else {
          setError('Error al procesar el pago');
        }
        setLoading(false);
      });
    } catch (error) {
      console.error('Error al inicializar el widget:', error);
      setError('Error al inicializar el pago. Por favor, intente nuevamente.');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Columna izquierda: Formulario */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Información de Pago</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="3001234567"
                  required
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <CreditCard className="w-4 h-4 inline mr-2" />
                  Número de Tarjeta
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="numeroTarjeta"
                    value={formData.numeroTarjeta}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-16"
                    maxLength="19"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                  {cardType && (
                    <div className={`absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 rounded-md ${cardType.bgcolor} ${cardType.textcolor} text-sm font-medium flex items-center gap-1`}>
                      {cardType.icon}
                      <span>{cardType.name}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Expiración
                  </label>
                  <input
                    type="text"
                    name="fechaExpiracion"
                    value={formData.fechaExpiracion}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="MM/YY"
                    maxLength="5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    onFocus={() => setIsCardFlipped(true)}
                    onBlur={() => setIsCardFlipped(false)}
                    onClick={() => setIsCardFlipped(true)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength="4"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="w-4 h-4 inline mr-2" />
                  Nombre del Titular
                </label>
                <input
                  type="text"
                  name="nombreTitular"
                  value={formData.nombreTitular}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Campos de documento */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="w-4 h-4 inline mr-2" />
                    Tipo de Documento
                  </label>
                  <select
                    name="tipoDocumento"
                    value={formData.tipoDocumento}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="CC">Cédula de Ciudadanía</option>
                    <option value="CE">Cédula de Extranjería</option>
                    <option value="PPN">Pasaporte</option>
                  </select>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Hash className="w-4 h-4 inline mr-2" />
                    Número de Documento
                  </label>
                  <input
                    type="text"
                    name="numeroDocumento"
                    value={formData.numeroDocumento}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1234567890"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Información de Entrega
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección de Entrega
                  </label>
                  <input
                    type="text"
                    name="direccionEntrega"
                    value={formData.direccionEntrega}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Building className="w-4 h-4 inline mr-2" />
                      Ciudad
                    </label>
                    <input
                      type="text"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Hash className="w-4 h-4 inline mr-2" />
                      Código Postal
                    </label>
                    <input
                      type="text"
                      name="codigoPostal"
                      value={formData.codigoPostal}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Resumen de Pago</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Producto:</span>
                  <span className="font-medium">${producto?.precio?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tarifa base:</span>
                  <span className="font-medium">$1,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío:</span>
                  <span className="font-medium">$5,000</span>
                </div>
                <div className="flex justify-between pt-2 border-t text-lg font-bold">
                  <span>Total:</span>
                  <span>${calcularTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2
                ${loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'} 
                text-white font-medium`}
            >
              <CreditCard className="w-5 h-5" />
              <span>{loading ? 'Procesando...' : 'Pagar ahora'}</span>
            </button>
          </form>
        </div>

        {/* Columna derecha: Vista previa de la tarjeta */}
        <div className="lg:sticky lg:top-8 space-y-8">
          {/* Vista previa de la tarjeta */}
          <div className="flex justify-center lg:justify-start">
            <CreditCardPreview 
              cardData={formData}
              cardType={cardType?.name?.toLowerCase()}
              isFlipped={isCardFlipped}
            />
          </div>
          
          {/* Vista previa del recibo */}
          <div className="flex justify-center lg:justify-start">
            <ReceiptPreview 
              formData={formData}
              producto={producto}
              calcularTotal={calcularTotal}
            />
          </div>
        </div>
      </div>

      {/* Modal de Confirmación */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-lg font-medium text-gray-700">Procesando su pago...</p>
              <p className="text-sm text-gray-500 text-center">
                Por favor, no cierre esta ventana mientras procesamos su transacción.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de Error Flotante */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r shadow-lg">
          <div className="flex items-center">
            <div className="py-1">
              <svg className="h-6 w-6 text-red-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Error en el pago</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PagoForm;