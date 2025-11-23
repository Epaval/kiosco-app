 import { Product } from "@/src/generated/prisma"
import { formatCurrency } from "@/src/utils"
import AddProductButton from "./AddProductButton"
import Image from "next/image"

type ProductCardProps = {
  product: Product
  priority?: boolean
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-2 flex flex-col h-full">
      
      {/* Imagen con el nuevo componente */}
      <div className="relative overflow-hidden flex-shrink-0">
        <div className="w-full pt-[75%] relative">
          <Image
            fill
            src={product.image} 
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            unoptimized  
          />
        </div>
        
        {/* Efecto de overlay al hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 pointer-events-none" />
      </div>

      {/* Contenido */}
      <div className="p-4 md:p-6 flex flex-col flex-grow">
        {/* Header con nombre y precio */}
        <div className="mb-3 md:mb-4">
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-amber-700 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-2xl md:text-3xl font-bold text-amber-600">
              {formatCurrency(product.price)}
            </p>
            <span className="inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
              Disponible
            </span>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mb-4">
          <p className="text-xs md:text-sm text-gray-500">
            Incluye impuestos • Listo para ordenar
          </p>
        </div>

        {/* Botón de agregar */}
        <div className="mt-auto">
          <AddProductButton product={product} />
        </div>
      </div>
    </div>
  )
}