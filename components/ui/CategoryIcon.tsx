 "use client"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Category } from "@/src/generated/prisma/client"

type CategoryIconProps = {
    category: Category
}

export default function CategoryIcon({ category }: CategoryIconProps) {
    const params = useParams<{ category: string }>()
    const isActive = category.slug === params.category

    return (
        <div className={`
            flex items-center gap-4 w-full border-t border-gray-200 p-3 last-of-type:border-b
            transition-all duration-300 ease-in-out
            hover:bg-gray-50 hover:shadow-sm
            ${isActive 
                ? 'bg-amber-400 border-amber-300 shadow-md' 
                : 'bg-white'
            }
            group cursor-pointer rounded-lg
        `}>
            <div className={`
                relative size-16 p-2 rounded-full
                transition-all duration-300
                ${isActive 
                    ? 'bg-amber-500 scale-110' 
                    : 'bg-gray-100 group-hover:bg-amber-100'
                }
            `}>
                <Image
                    src={`/icon_${category.slug}.svg`}
                    alt={`Imagen de la categoría: ${category.name}`}
                    fill
                    className={`
                        object-contain p-2
                        transition-transform duration-300
                        ${isActive ? 'scale-110' : 'group-hover:scale-105'}
                    `}
                />
            </div>
            
            <Link 
                className={`
                    text-lg font-bold transition-all duration-300
                    ${isActive 
                        ? 'text-amber-900 scale-105' 
                        : 'text-gray-800 group-hover:text-amber-700'
                    }
                `}
                href={`/order/${category.slug}`}
            >
                {category.name}
            </Link>
        </div>
    )
}