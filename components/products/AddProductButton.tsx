 "use client"

import { Product } from "@/src/generated/prisma/client"
import { useStore } from "@/src/store"

type AddProductButtonProps = {
    product: Product
}

export default function AddProductButton({ product }: AddProductButtonProps) {
    const addToOrder = useStore((state) => state.addToOrder)
    
    return (
        <button
            type="button"
            className="
                w-full py-3 md:py-4 px-4 md:px-6
                bg-gradient-to-r from-amber-500 to-amber-600
                hover:from-amber-600 hover:to-amber-700
                text-white 
                font-semibold 
                rounded-lg
                shadow-md
                hover:shadow-lg
                transform
                hover:scale-[1.02]
                active:scale-[0.98]
                transition-all
                duration-200
                ease-out
                uppercase
                tracking-wide
                flex items-center justify-center gap-2
                text-sm md:text-base
            "
            onClick={() => addToOrder(product)}
        >
            <svg 
                className="w-4 h-4 md:w-5 md:h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
            >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                />
            </svg>
            <span className="hidden xs:inline">Agregar</span>
            <span className="xs:hidden">+</span>
        </button>
    )
}