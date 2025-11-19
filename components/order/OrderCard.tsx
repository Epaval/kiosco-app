 'use client'

import { useState } from 'react'
import Image from 'next/image'
import { handleMarkAsReady } from '@/actions/complete-order'

interface OrderCardProps {
  order: {
    id: number;
    name: string;
    total: number;
    date: Date;
    status: boolean;
    phone: string;
    orderProducts: Array<{
      id: number;
      quantity: number;
      product: {
        id: number;
        name: string;
        price: number;
        image: string;
      };
    }>;
  };
}

export default function OrderCard({ order }: OrderCardProps) {
  const [isMarking, setIsMarking] = useState(false)

  const handleClick = async () => {
    setIsMarking(true)
    try {
      const result = await handleMarkAsReady(order.id)
      
      if (result.success) {           
        window.location.reload()
      } else {
        alert('Error al marcar la orden como lista')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al procesar la solicitud')
    } finally {
      setIsMarking(false)
    }
  } 
   
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-white font-bold text-xl">Orden #{order.id}</h2>
          <span className="bg-yellow-400 text-blue-900 px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
            Pendiente
          </span>
        </div>
        <p className="text-blue-100 text-sm mt-1">
          {formatDate(order.date)}
        </p>
      </div>

      {/* Información del cliente */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{order.name}</h3>
            <p className="text-gray-600 text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {order.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="p-6 border-b border-gray-100">
        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Productos ({order.orderProducts.length})
        </h4>
        <div className="space-y-3">
          {order.orderProducts.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-200 group">
                  <Image
                    fill
                    src={`/products/${item.product.image}.jpg`}
                    alt={`Imagen del platillo ${item.product.name}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{item.product.name}</p>
                  <p className="text-sm text-gray-600">${item.product.price}</p>
                </div>
              </div>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-semibold">
                x{item.quantity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer con total y botón */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600 font-medium">Total:</span>
          <span className="text-2xl font-bold text-gray-800">${order.total}</span>
        </div>
        
        <button
          onClick={handleClick}
          disabled={isMarking}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:shadow-none"
        >
          {isMarking ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Procesando...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Marcar como Lista</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

 
function formatDate(date: Date) {
  return new Date(date).toLocaleString('es-ES', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}