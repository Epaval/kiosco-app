 "use client"
import { useMemo, useState } from "react"
import { toast } from "react-toastify"
import { useStore } from "@/src/store"
import ProductDetails from "./ProductDetails"
import { formatCurrency } from "@/src/utils"
import { XCircleIcon, ShoppingBagIcon, ExclamationTriangleIcon, PhoneIcon } from "@heroicons/react/24/outline"
import { createOrder } from "@/actions/create-order-action"
import { OrderSchema } from "@/src/schema"

export default function OrderSummary() {
  const order = useStore((state) => state.order)
  const clearOrder = useStore((state) => state.clearOrder)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  
  const total = useMemo(() => 
    order.reduce((total, item) => total + (item.quantity * item.price), 0), 
    [order]
  )

  const itemCount = useMemo(() => 
    order.reduce((total, item) => total + item.quantity, 0), 
    [order]
  )

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!customerName.trim()) {
        toast.error("Por favor ingresa tu nombre")
        return
    }

    if (!customerPhone.trim()) {
        toast.error("Por favor ingresa tu teléfono")
        return
    }

    // Validar formato del teléfono antes de enviar
    const phoneRegex = /^(0412|0414|0416|0424|0426)-\d{7}$/
    if (!phoneRegex.test(customerPhone)) {
        toast.error("El teléfono debe tener el formato: 0412-1234567")
        return
    }

    setIsSubmitting(true)

    const data = {
        name: customerName.trim(),
        phone: customerPhone.trim(),
        total,
        order
    }

    // Validar con schema
    const result = OrderSchema.safeParse(data)
    if (!result.success) {
        result.error.issues.forEach((issue) => {
            toast.error(issue.message)
        })
        setIsSubmitting(false)
        return
    }

    try {
        const response = await createOrder(data)
        
        if (response?.errors) {
            response.errors.forEach((issue) => {
                toast.error(issue.message)
            })
        } else if (response?.success) {
            toast.success("¡Pedido creado exitosamente! Se envió notificación por WhatsApp.")
            clearOrder()
            setCustomerName("")
            setCustomerPhone("")
            setShowOrderModal(false)
        } else {
            toast.success("¡Pedido creado exitosamente!")
            clearOrder()
            setCustomerName("")
            setCustomerPhone("")
            setShowOrderModal(false)
        }
    } catch (error) {
        console.error('Error:', error)
        toast.error("Error al crear el pedido")
    } finally {
        setIsSubmitting(false)
    }
  }

  const handleClearOrder = () => {
    clearOrder()
    setShowConfirm(false)
  }

  const openConfirmDialog = () => {
    if (order.length > 0) {
      setShowConfirm(true)
    }
  }

  const closeConfirmDialog = () => {
    setShowConfirm(false)
  }

  const openOrderModal = () => {
    if (order.length > 0) {
      setShowOrderModal(true)
    }
  }

  const closeOrderModal = () => {
    setShowOrderModal(false)
    setCustomerName("")
    setCustomerPhone("")
  }

  // Función para formatear el teléfono mientras se escribe
  const formatPhoneNumber = (value: string) => {
    // Remover todos los caracteres no numéricos
    const cleaned = value.replace(/\D/g, '')
    
    // Limitar a 11 dígitos (0412-1234567)
    if (cleaned.length > 11) return customerPhone
    
    // Aplicar formato: 0412-1234567
    if (cleaned.length <= 4) {
        return cleaned
    } else {
        return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`
    }
  }

  // Función para validar el formato del teléfono
  const isValidPhone = (phone: string) => {
    const phoneRegex = /^(0412|0414|0416|0424|0426)-\d{7}$/
    return phoneRegex.test(phone)
  }

  const isFormValid = customerName.trim() && customerPhone.trim() && isValidPhone(customerPhone)

  return (
    <>
      <aside className="h-screen flex flex-col bg-white shadow-xl border-l border-gray-200">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <ShoppingBagIcon className="h-8 w-8" />
                {order.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold">Mi Pedido</h1>
            </div>
            
            {order.length > 0 && (
              <button
                onClick={openConfirmDialog}
                className="p-2 hover:bg-amber-700 rounded-lg transition-colors duration-200"
                title="Vaciar carrito"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {order.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
              <ShoppingBagIcon className="h-24 w-24 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 mb-2">
                Carrito Vacío
              </h3>
              <p className="text-gray-400 max-w-sm">
                Agrega algunos productos deliciosos a tu pedido
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {/* Items List */}
              <div className="p-4 space-y-4">
                {order.map(item => (
                  <ProductDetails
                    key={item.id}
                    item={item}            
                  />
                ))}
              </div>

              {/* Total Section - Sticky Bottom */}
              <div className="border-t border-gray-200 bg-white sticky bottom-0">
                {/* Subtotal */}
                <div className="p-4 space-y-3">
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">{formatCurrency(total)}</span>
                  </div>
                  
                  {/* Tax (optional) - Solo si hay productos */}
                  {total > 0 && (
                    <>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Impuestos (10%):</span>
                        <span>{formatCurrency(total * 0.10)}</span>
                      </div>
                      
                      {/* Divider */}
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between text-xl font-bold">
                          <span>Total:</span>
                          <span className="text-amber-600">{formatCurrency(total * 1.10)}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Checkout Button */}
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <button 
                    onClick={openOrderModal}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>Confirmar Pedido</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  
                  {/* Continue Shopping */}
                  <button className="w-full mt-3 border-2 border-amber-500 text-amber-600 hover:bg-amber-50 py-3 px-6 rounded-lg font-semibold transition-colors duration-200">
                    Seguir Comprando
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Modal de Confirmación para vaciar carrito */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-8 w-8 text-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  ¿Vaciar carrito?
                </h3>
                <p className="text-gray-600 mt-1">
                  Esta acción eliminará todos los productos ({itemCount} items) de tu pedido y no se puede deshacer.
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={closeConfirmDialog}
                className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleClearOrder}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <XCircleIcon className="h-5 w-5" />
                <span>Vaciar Carrito</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para confirmar pedido */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Confirmar Pedido
                </h3>
                <p className="text-gray-600 mt-1">
                  Ingresa tus datos para completar el pedido con delivery
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              {/* Input para el nombre */}
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                  Tu Nombre *
                </label>
                <input
                  type="text"
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ingresa tu nombre completo"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>

              {/* Input para el teléfono */}
              <div>
                <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="customerPhone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(formatPhoneNumber(e.target.value))}
                    placeholder="0412-1234567"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 ${
                      customerPhone && !isValidPhone(customerPhone) 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                </div>
                {customerPhone && !isValidPhone(customerPhone) && (
                  <p className="text-xs text-red-600 mt-1">
                    Formato requerido: 0412-1234567 (Operadoras: 0412, 0414, 0416, 0424, 0426)
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Para contactarte sobre tu pedido de delivery
                </p>
              </div>

              {/* Resumen del pedido */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2">Resumen del Pedido:</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Items:</span>
                    <span>{itemCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Impuestos:</span>
                    <span>{formatCurrency(total * 0.10)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total:</span>
                    <span className="text-green-600">{formatCurrency(total * 1.10)}</span>
                  </div>
                </div>
              </div>

              {/* Información de WhatsApp */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893 0-3.176-1.24-6.165-3.495-8.411"/>
                  </svg>
                  <span className="text-sm font-medium text-blue-800">
                    Se enviará notificación por WhatsApp
                  </span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeOrderModal}
                  disabled={isSubmitting}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !isFormValid}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
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
                      <span>Confirmar Pedido</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}