 'use client'

import ProductForm from "./ProductForm"
import { useState, useRef } from "react"

export default function AddProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    
    // Convertir datos
    const formDataObject = Object.fromEntries(formData)
    console.log('📤 Enviando datos del formulario:', formDataObject)
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataObject)
      })

      console.log('📥 Respuesta del servidor - Status:', response.status)
      console.log('📥 Respuesta del servidor - OK:', response.ok)

      // Verificar si la respuesta es JSON válido
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Respuesta del servidor no es JSON válido')
      }

      const result = await response.json()
      console.log('📥 Resultado completo:', result)

      if (response.ok && result.success) {
        setMessage({ 
          type: 'success', 
          text: result.message || '✅ Producto creado exitosamente!' 
        })
        
         
        if (formRef.current) {
          formRef.current.reset()
        }
        
      } else {
        setMessage({ 
          type: 'error', 
          text: result.error || `❌ Error ${response.status}: No se pudo crear el producto` 
        })
      }
    } catch (error: any) {
      console.error('❌ Error completo en el cliente:', error)
      
      let errorMessage = 'Error de conexión. Verifica que el servidor esté funcionando.'
      
      if (error.name === 'TypeError' && error.message.includes('JSON')) {
        errorMessage = 'Error en el formato de respuesta del servidor.'
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'No se pudo conectar con el servidor.'
      } else if (error.name === 'TypeError' && error.message.includes('reset')) {
        errorMessage = 'Error al procesar el formulario. El producto se creó correctamente.'
      }
      
      setMessage({ 
        type: 'error', 
        text: errorMessage 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const clearForm = () => {
    if (formRef.current) {
      formRef.current.reset()
    }
    setMessage(null)
  }

  return (
    <div className="bg-white mt-10 px-8 py-10 rounded-2xl shadow-lg border border-gray-100 max-w-4xl mx-auto"> 
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Crear Nuevo Producto
        </h1>
        <p className="text-gray-600 mt-2">
          Completa todos los campos para agregar un nuevo producto al catálogo
        </p>
      </div>

      {message && (
        <div className={`p-6 rounded-2xl mb-8 border-2 ${
          message.type === 'success' 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-green-200' 
            : 'bg-gradient-to-r from-red-50 to-orange-50 text-red-800 border-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`p-2 rounded-full mr-4 ${
                message.type === 'success' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {message.type === 'success' ? (
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div>
                <p className="font-semibold text-lg">
                  {message.type === 'success' ? '¡Éxito!' : 'Error'}
                </p>
                <p className="mt-1">{message.text}</p>
                {message.type === 'success' && (
                  <p className="text-sm mt-2 text-green-700">
                    El producto ha sido agregado a la base de datos correctamente.
                  </p>
                )}
              </div>
            </div>
            
            {message.type === 'success' && (
              <button
                onClick={clearForm}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Crear Otro
              </button>
            )}
          </div>
        </div>
      )}

      <form 
        ref={formRef}
        className="space-y-8" 
        onSubmit={handleSubmit}
        key={message?.type === 'success' ? 'reset-form' : 'current-form'}  
      >
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200">
          <ProductForm/>
        </div>
        
        <div className="flex justify-center pt-6">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-purple-600 
            hover:from-blue-700 hover:to-purple-700 
            disabled:from-gray-400 disabled:to-gray-500
            text-white 
            w-full max-w-md
            py-4
            px-8
            uppercase
            font-bold
            cursor-pointer
            rounded-2xl
            transition-all
            duration-300
            transform
            hover:scale-105
            disabled:scale-100
            disabled:cursor-not-allowed
            shadow-lg
            hover:shadow-xl
            disabled:shadow-none
            flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando Producto...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Registrar Producto
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}