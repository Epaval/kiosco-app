 // src/schema/index.ts
import { z } from 'zod'

// Regex para números venezolanos: 0412, 0414, 0416, 0424, 0426
const venezuelanPhoneRegex = /^(0412|0414|0416|0424|0426|0412)-\d{7}$/

export const OrderSchema = z.object({
    name: z.string().min(1, 'Tu nombre es obligatorio'),
    phone: z.string()
        .min(1, 'El teléfono es obligatorio')
        .regex(venezuelanPhoneRegex, 'El teléfono debe tener el formato: 0412-1234567 (solo operadoras: 0412, 0414, 0416, 0424, 0426)'),
    total: z.number()
        .min(1, 'Hay errores en la orden'),
    order: z.array(z.object ({
        id: z.number(),
        name: z.string(),
        price: z.number(),
        quantity: z.number(),
        subtotal: z.number()
    }))    
})

 export const ProductSchema = z.object({
    name: z.string()
        .trim()
        .min(1, { message: 'El Nombre del Producto no puede ir vacio'}),
    price: z.string()
        .trim()
        .transform((value) => parseFloat(value)) 
        .refine((value) => value > 0, { message: 'Precio no válido' })
        .or(z.number().min(1, {message: 'La Categoría es Obligatoria' })),
    categoryId: z.string()
        .trim()
        .transform((value) => parseInt(value)) 
        .refine((value) => value > 0, { message: 'La Categoría es Obligatoria' })
        .or(z.number().min(1, {message: 'La Categoría es Obligatoria' })),
    image: z.string()
        .url({ message: 'La URL de la imagen no es válida' })
        .min(1, { message: 'La imagen es obligatoria' })
})