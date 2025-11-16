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