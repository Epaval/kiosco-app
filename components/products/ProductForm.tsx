 'use client'

import { useEffect, useState } from "react"
import ImageUploader from "./ImageUploader"

type Category = {
  id: number
  name: string
  slug: string
}

type ProductFormProps = {
  fieldErrors?: Record<string, string>
  onClearError?: (fieldName: string) => void
}

export default function ProductForm({ fieldErrors = {}, onClearError }: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (!response.ok) {
          throw new Error('Error al cargar categorías')
        }
        const data = await response.json()
        setCategories(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        console.error('Error fetching categories:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleInputChange = (fieldName: string) => {
    // Limpiar error cuando el usuario empiece a escribir
    if (fieldErrors[fieldName] && onClearError) {
      onClearError(fieldName)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <span className="text-gray-700 font-medium">Cargando categorías...</span>
        <p className="text-sm text-gray-500 mt-2">Preparando el formulario</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 shadow-lg">
        <div className="flex items-start space-x-3">
          <div className="bg-red-100 p-2 rounded-full">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-red-800 font-semibold text-lg">Error al cargar</h3>
            <p className="text-red-700 mt-1">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Campo Nombre */}
      <div className="group">
        <label
          className="text-sm font-semibold text-gray-800 mb-3 flex items-center"
          htmlFor="name"
        >
          <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Nombre del Producto
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          <input
            id="name"
            type="text"
            name="name"
            className={`block w-full p-4 pl-12 border-2 rounded-xl bg-white 
                     focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                     transition-all duration-300 shadow-sm
                     placeholder:text-gray-400
                     group-hover:border-gray-300
                     ${fieldErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
            placeholder="Ej: Hamburguesa Clásica"
            required
            onChange={() => handleInputChange('name')}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
            <svg className={`w-5 h-5 ${fieldErrors.name ? 'text-red-500' : 'text-gray-400 group-focus-within:text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
        {fieldErrors.name && (
          <p className="text-red-600 text-sm mt-2 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {fieldErrors.name}
          </p>
        )}
      </div>

      {/* Campo Precio */}
      <div className="group">
        <label
          className="text-sm font-semibold text-gray-800 mb-3 flex items-center"
          htmlFor="price"
        >
          <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          Precio
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            className={`block w-full p-4 pl-12 border-2 rounded-xl bg-white 
                     focus:border-green-500 focus:ring-4 focus:ring-green-100 
                     transition-all duration-300 shadow-sm
                     placeholder:text-gray-400
                     group-hover:border-gray-300
                     ${fieldErrors.price ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
            placeholder="0.00"
            required
            onChange={() => handleInputChange('price')}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
            <span className={`${fieldErrors.price ? 'text-red-500' : 'text-gray-400 group-focus-within:text-green-500'} font-medium`}>$</span>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <span className="text-gray-400 text-sm">USD</span>
          </div>
        </div>
        {fieldErrors.price && (
          <p className="text-red-600 text-sm mt-2 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {fieldErrors.price}
          </p>
        )}
      </div>

      {/* Campo Categoría */}
      <div className="group">
        <label
          className="text-sm font-semibold text-gray-800 mb-3 flex items-center"
          htmlFor="categoryId"
        >
          <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Categoría
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          <select
            className={`block w-full p-4 pl-12 border-2 rounded-xl bg-white 
                     focus:border-purple-500 focus:ring-4 focus:ring-purple-100 
                     transition-all duration-300 shadow-sm appearance-none
                     group-hover:border-gray-300 cursor-pointer
                     ${fieldErrors.categoryId ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
            id="categoryId"
            name="categoryId"
            required
            onChange={() => handleInputChange('categoryId')}
          >
            <option value="">-- Seleccione una categoría --</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
            <svg className={`w-5 h-5 ${fieldErrors.categoryId ? 'text-red-500' : 'text-gray-400 group-focus-within:text-purple-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {fieldErrors.categoryId && (
          <p className="text-red-600 text-sm mt-2 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {fieldErrors.categoryId}
          </p>
        )}
      </div>

      {/* Campo Imagen con Bytescale */}
      <ImageUploader
        onImageUpload={(url) => {
          setImageUrl(url)
          if (onClearError) onClearError('image')
        }}
        currentImage={imageUrl}
        fieldError={fieldErrors.image}
        onClearError={() => onClearError?.('image')}
      />

      {/* Indicador de campos requeridos */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
        <p className="text-blue-800 text-sm flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Los campos marcados con <span className="text-red-500 mx-1">*</span> son obligatorios
        </p>
      </div>
    </div>
  )
}