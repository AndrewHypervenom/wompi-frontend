import React, { useState, useEffect } from 'react';
import { Wifi } from 'lucide-react';

const CreditCardPreview = ({ cardData, cardType, isFlipped }) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    setRotation(isFlipped ? 180 : 0);
  }, [isFlipped]);

  const formatCardNumber = (number) => {
    if (!number) return '4555 5555 5555 5555';
    const cleaned = number.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}|.+/g) || [];
    return groups.map(group => group.padEnd(4, '5')).join(' ');
  };

  const getCardStyle = () => {
    const styles = {
      visa: {
        background: '#0040C1',
        logo: 'VISA'
      },
      mastercard: {
        background: '#3f37c9',
        logo: 'MASTERCARD'
      },
      default: {
        background: '#0040C1',
        logo: 'VISA'
      }
    };

    return styles[cardType] || styles.default;
  };

  const cardStyle = getCardStyle();

  return (
    <div className="perspective-1000 select-none">
      <div 
        className="relative w-[425px] h-[270px] transition-all duration-700 transform-gpu"
        style={{ 
          transformStyle: 'preserve-3d',
          transform: `rotateY(${rotation}deg)`
        }}
      >
        {/* Frente de la tarjeta */}
        <div 
          className="absolute w-full h-full rounded-[20px] p-8 backface-hidden"
          style={{ 
            background: cardStyle.background,
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
          }}
        >
          <div className="relative flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              {/* Chip y logo contactless */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-11 rounded-[4px] bg-[#E7BE18]" />
                <Wifi className="w-8 h-8 text-white/80 rotate-90" />
              </div>
              {/* Logo de la marca */}
              <span className="text-white text-2xl font-bold">
                {cardStyle.logo}
              </span>
            </div>

            {/* Número de tarjeta */}
            <div className="text-[28px] tracking-[3px] text-white font-medium mt-8">
              {formatCardNumber(cardData.numeroTarjeta)}
            </div>

            {/* Información del titular y fecha */}
            <div className="flex justify-between items-end mt-4">
              <div>
                <p className="text-sm text-white/80 font-light mb-1">Titular de la Tarjeta</p>
                <p className="text-lg text-white tracking-wider">
                  {(cardData.nombreTitular || 'NOMBRE DE EJEMPLO').toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/80 font-light mb-1">Válida hasta</p>
                <p className="text-lg text-white tracking-wider">
                  {cardData.fechaExpiracion || '06/25'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reverso de la tarjeta */}
        <div 
          className="absolute w-full h-full rounded-[20px] backface-hidden"
          style={{ 
            background: cardStyle.background,
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
            transform: 'rotateY(180deg)'
          }}
        >
          {/* Banda magnética */}
          <div className="w-full h-16 bg-[#2C2C2C] mt-8" />
          
          {/* Panel de firma y CVV */}
          <div className="px-8 mt-8">
            <div className="relative flex justify-end">
              <div className="w-[80%] bg-white rounded-[4px] py-4 px-4">
                <span className="font-mono text-black text-right text-lg float-right">
                  {cardData.cvv?.padEnd(3, '3') || '033'}
                </span>
              </div>
            </div>
            <p className="text-sm text-white/80 mt-2">
              Código de seguridad
            </p>
          </div>

          {/* Texto legal */}
          <div className="px-8 mt-6">
            <p className="text-[9px] text-white/60 leading-tight">
              Esta tarjeta es intransferible y de uso exclusivo del titular.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCardPreview;