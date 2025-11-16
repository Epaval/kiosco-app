 import { XCircleIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline"
import { OrderItem } from "@/src/types"
import { formatCurrency } from "@/src/utils"
import { useStore } from "@/src/store"
import { useMemo } from "react"

type ProductDetailsProps = {
    item: OrderItem
}

export default function ProductDetails({ item }: ProductDetailsProps) {
    const increaseQuantity = useStore((state) => state.increaseQuantity)
    const decreaseQuantity = useStore((state) => state.decreaseQuantity)
    const removeItem = useStore((state) => state.removeItem)
    
    const disableDecreaseButton = useMemo(() => item.quantity === 1, [item.quantity])
    const subtotal = useMemo(() => item.quantity * item.price, [item.quantity, item.price])

    return (
        <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-6">
            {/* Header con nombre y botón de eliminar */}
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-800 leading-tight flex-1 pr-4 line-clamp-2">
                    {item.name}
                </h3>
                
                <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 transform hover:scale-110"
                    title="Eliminar producto"
                >
                    <XCircleIcon className="h-6 w-6" />
                </button>
            </div>

            {/* Precio unitario */}
            <div className="mb-4">
                <p className="text-2xl font-bold text-amber-600">
                    {formatCurrency(item.price)}
                </p>
                <p className="text-sm text-gray-500 mt-1">Precio unitario</p>
            </div>

            {/* Controles de cantidad */}
            <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-600">Cantidad:</span>
                    
                    <div className="flex items-center space-x-3 bg-white rounded-lg border border-gray-300 p-1">
                        <button
                            type="button"
                            onClick={() => decreaseQuantity(item.id)}
                            disabled={disableDecreaseButton}
                            className={`
                                p-1 rounded-md transition-all duration-200
                                ${disableDecreaseButton
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                                }
                            `}
                            title="Disminuir cantidad"
                        >
                            <MinusIcon className="h-5 w-5" />
                        </button>

                        <span className="text-lg font-bold text-gray-800 min-w-8 text-center">
                            {item.quantity}
                        </span>

                        <button
                            type="button"
                            onClick={() => increaseQuantity(item.id)}
                            className="p-1 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-all duration-200"
                            title="Aumentar cantidad"
                        >
                            <PlusIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Indicador visual de cantidad */}
                <div className="text-right">
                    <div className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded border">
                        {item.quantity} {item.quantity === 1 ? 'unidad' : 'unidades'}
                    </div>
                </div>
            </div>

            {/* Subtotal y información adicional */}
            <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-600">Subtotal:</p>
                        <p className="text-xs text-gray-400">
                            {item.quantity} × {formatCurrency(item.price)}
                        </p>
                    </div>
                    <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(subtotal)}
                    </p>
                </div>
                
                {/* Barra de progreso visual (opcional) */}
                {item.quantity > 1 && (
                    <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Cantidad</span>
                            <span>{item.quantity} items</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                                style={{ 
                                    width: `${Math.min(item.quantity * 10, 100)}%` 
                                }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Efectos de hover en toda la card */}
            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-amber-200 pointer-events-none transition-all duration-300" />
        </div>
    )
}