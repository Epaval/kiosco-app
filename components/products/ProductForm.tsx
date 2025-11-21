 'use client'

import { useEffect, useState } from "react"

type Category = {
  id: number
  name: string
  slug: string
}

export default function ProductForm() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
            className="block w-full p-4 pl-12 border-2 border-gray-200 rounded-xl bg-white 
                     focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                     transition-all duration-300 shadow-sm
                     placeholder:text-gray-400
                     group-hover:border-gray-300"
            placeholder="Ej: Hamburguesa Clásica"
            required
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
            <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
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
            className="block w-full p-4 pl-12 border-2 border-gray-200 rounded-xl bg-white 
                     focus:border-green-500 focus:ring-4 focus:ring-green-100 
                     transition-all duration-300 shadow-sm
                     placeholder:text-gray-400
                     group-hover:border-gray-300"
            placeholder="0.00"
            required
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
            <span className="text-gray-400 group-focus-within:text-green-500 font-medium">$</span>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <span className="text-gray-400 text-sm">USD</span>
          </div>
        </div>
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
            className="block w-full p-4 pl-12 border-2 border-gray-200 rounded-xl bg-white 
                     focus:border-purple-500 focus:ring-4 focus:ring-purple-100 
                     transition-all duration-300 shadow-sm appearance-none
                     group-hover:border-gray-300 cursor-pointer"
            id="categoryId"
            name="categoryId"
            required
          >
            <option value="">-- Seleccione una categoría --</option>
            {categories.map(category => (
              <option key={category.id} 
               value={category.id}>
               {category.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
            <svg className="w-5 h-5 text-gray-400 group-focus-within:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Campo Imagen */}
      <div className="group">
        <label
          className="text-sm font-semibold text-gray-800 mb-3 flex items-center"
          htmlFor="image"
        >
          <svg className="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Imagen
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          <input
            id="image"
            name="image"
            type="text"
            className="block w-full p-4 pl-12 border-2 border-gray-200 rounded-xl bg-white 
                     focus:border-orange-500 focus:ring-4 focus:ring-orange-100 
                     transition-all duration-300 shadow-sm
                     placeholder:text-gray-400
                     group-hover:border-gray-300"
            placeholder="hamburguesa-clasica.jpg"
            required
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
            <svg className="w-5 h-5 text-gray-400 group-focus-within:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
        </div>
        <div className="mt-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-100">
          <div className="flex items-start space-x-3">
            <div className="bg-orange-100 p-2 rounded-full flex-shrink-0">
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-orange-800 font-medium text-sm">Formato de imagen</p>
              <p className="text-orange-700 text-sm mt-1">
                Solo el nombre del archivo. Ejemplo: <span className="font-mono bg-orange-200 px-2 py-1 rounded">hamburguesa-clasica.jpg</span>
              </p>
            </div>
          </div>
        </div>
      </div>

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