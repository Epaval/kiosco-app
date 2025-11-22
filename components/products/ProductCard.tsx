"use client"
import { Product } from "@/src/generated/prisma/client"
import { formatCurrency } from "@/src/utils"
import AddProductButton from "./AddProductButton"

type ProductCardProps = {
    product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-2 flex flex-col h-full">
            
            {/* Imagen */}
            <div className="relative overflow-hidden flex-shrink-0">
                <div className="w-full pt-[75%] relative">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={`Imagen del platillo ${product.name}`}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                                 
                                e.currentTarget.style.display = 'none'
                                const parent = e.currentTarget.parentElement
                                if (parent) {
                                    parent.innerHTML = `
                                        <div class="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                            </svg>
                                        </div>
                                    `
                                }
                            }}
                        />
                    ) : (
                        // Estado cuando no hay imagen
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                </div>
            </div>

            {/* Contenido */}
            <div className="p-4 md:p-6 flex flex-col flex-grow">
                {/* Header con nombre y precio */}
                <div className="mb-3 md:mb-4">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-800 line-clamp-2 mb-2">
                        {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                        <p className="text-2xl md:text-3xl font-bold text-amber-600">
                            {formatCurrency(product.price)}
                        </p>
                        <span className="inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓
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