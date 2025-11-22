 'use client'

import { useState, useRef } from "react"
import { UploadManager } from "@bytescale/sdk"

type ImageUploaderProps = {
  onImageUpload: (imageUrl: string) => void
  currentImage?: string
  fieldError?: string
  onClearError?: () => void
}

// Configuración de Bytescale
const uploadManager = new UploadManager({
  apiKey: process.env.NEXT_PUBLIC_BYTESCALE_API_KEY || "public_kW2K8gKC2Dc7c1vp42UbW1k4iBNS" 
})

export default function ImageUploader({ 
  onImageUpload, 
  currentImage, 
  fieldError, 
  onClearError 
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(currentImage || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (PNG, JPG, JPEG, WebP)')
      return
    }

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('La imagen no debe superar los 10MB')
      return
    }

    setIsUploading(true)
    if (onClearError) onClearError()

    try {
      // Crear vista previa local
      const localPreview = URL.createObjectURL(file)
      setPreviewUrl(localPreview)

      // Subir a Bytescale - SIN PROGRESO TEMPORALMENTE
      const result = await uploadManager.upload({
        data: file
        // Removemos onProgress temporalmente hasta encontrar las propiedades correctas
      })

      // Usar la URL completa de Bytescale
      const fileUrl = result.fileUrl

      // Limpiar la URL local y usar la de Bytescale
      URL.revokeObjectURL(localPreview)
      setPreviewUrl(fileUrl)
      onImageUpload(fileUrl)

      console.log('✅ Imagen subida exitosamente:', fileUrl)

    } catch (error) {
      console.error('❌ Error subiendo imagen:', error)
      setPreviewUrl('')
      alert('Error al subir la imagen. Intenta nuevamente.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50')
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50')
    
    const file = e.dataTransfer.files[0]
    if (file && fileInputRef.current) {
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      fileInputRef.current.files = dataTransfer.files
      fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }

  const triggerFileInput = () => {
    if (!isUploading) {
      fileInputRef.current?.click()
    }
  }

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreviewUrl('')
    onImageUpload('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="group">
      <label
        className="text-sm font-semibold text-gray-800 mb-3 flex items-center"
        htmlFor="image"
      >
        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Imagen del Producto
        <span className="text-red-500 ml-1">*</span>
      </label>

      {/* Área de subida */}
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300
          ${fieldError ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <div>
              <p className="text-blue-700 font-medium">Subiendo imagen...</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse"></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">Procesando...</p>
            </div>
          </div>
        ) : previewUrl ? (
          <div className="space-y-3">
            <div className="relative mx-auto w-32 h-32">
              <img
                src={previewUrl}
                alt="Vista previa"
                className="w-full h-full object-cover rounded-lg shadow-md border border-gray-200"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
                title="Eliminar imagen"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div>
              <p className="text-green-600 font-medium flex items-center justify-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Imagen cargada exitosamente
              </p>
              <p className="text-sm text-gray-600 mt-1">Haz clic para cambiar la imagen</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div>
              <p className="text-gray-700 font-medium">
                <span className="text-blue-600">Haz clic para subir</span> o arrastra y suelta
              </p>
              <p className="text-sm text-gray-500 mt-1">
                PNG, JPG, JPEG, WebP hasta 10MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Campo oculto para el formulario - guardar URL completa */}
      <input
        type="hidden"
        name="image"
        value={previewUrl}
        required
      />

      {fieldError && (
        <p className="text-red-600 text-sm mt-2 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {fieldError}
        </p>
      )}

      {/* Información de ayuda */}
      <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
        <div className="flex items-start space-x-3">
          <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-blue-800 font-medium text-sm">Subida con Bytescale</p>
            <p className="text-blue-700 text-sm mt-1">
              Las imágenes se almacenan de forma segura en Bytescale. Formatos soportados: PNG, JPG, JPEG, WebP. Tamaño máximo: 10MB.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}