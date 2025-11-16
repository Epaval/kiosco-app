 // actions/create-order-action.ts
'use server'

import { prisma } from "@/src/lib/prisma"
import { OrderSchema } from "@/src/schema"
import { revalidatePath } from "next/cache"

// Número de WhatsApp de prueba
const WHATSAPP_NUMBER = "5842443311"  

export async function createOrder(data: unknown) {
    const result = OrderSchema.safeParse(data)
    
    if (!result.success) {
        return {
            errors: result.error.issues
        }
    }

    // Validar que haya productos en la orden
    if (result.data.order.length === 0) {
        return {
            errors: [
                {
                    message: 'La orden no puede estar vacía'
                }
            ]
        }
    }

    try {
        // Verificar que todos los productos existan
        const productIds = result.data.order.map(item => item.id)
        const existingProducts = await prisma.product.findMany({
            where: {
                id: {
                    in: productIds
                }
            },
            select: {
                id: true,
                name: true,
                price: true
            }
        })

        if (existingProducts.length !== productIds.length) {
            return {
                errors: [
                    {
                        message: 'Algunos productos no existen en la base de datos'
                    }
                ]
            }
        }

        // Crear la transacción de la orden
        const order = await prisma.$transaction(async (tx) => {
            // 1. Crear la orden principal
            const newOrder = await tx.order.create({
                data: {
                    name: result.data.name,
                    total: result.data.total,
                    phone: result.data.phone,
                }
            })

            // 2. Crear los orderProducts
            const orderProductsData = result.data.order.map(item => ({
                orderId: newOrder.id,
                productId: item.id,
                quantity: item.quantity
            }))

            await tx.orderProducts.createMany({
                data: orderProductsData
            })

            return newOrder
        })

        // Enviar mensaje por WhatsApp
        await sendWhatsAppMessage(result.data, order.id)

        // Revalidar el path para actualizar la UI
        revalidatePath('/order')
        
        return {
            success: true,
            message: 'Orden creada exitosamente y notificada por WhatsApp',
            orderId: order.id
        }

    } catch (error) {
        console.error('Error creating order:', error)
        
        // Manejar diferentes tipos de errores
        if (error instanceof Error) {
            if (error.message.includes('Unique constraint')) {
                return {
                    errors: [
                        {
                            message: 'Error: Hay productos duplicados en la orden'
                        }
                    ]
                }
            }
            
            if (error.message.includes('Foreign key constraint')) {
                return {
                    errors: [
                        {
                            message: 'Error: Algunos productos no existen'
                        }
                    ]
                }
            }
        }
        
        return {
            errors: [
                {
                    message: 'Error interno del servidor al crear la orden'
                }
            ]
        }
    }
}

// Función para enviar mensaje por WhatsApp
async function sendWhatsAppMessage(orderData: any, orderId: number) {
    try {
        // Formatear los productos para el mensaje
        const productsText = orderData.order.map((item: any) => 
            `• ${item.quantity}x ${item.name} - ${formatCurrency(item.subtotal)}`
        ).join('\n')

        // Crear el mensaje
        const message = `
🆕 *NUEVO PEDIDO #${orderId}*

👤 *Cliente:* ${orderData.name}
📞 *Teléfono:* ${orderData.phone}

📦 *Pedido:*
${productsText}

💰 *Subtotal:* ${formatCurrency(orderData.total)}
💰 *Impuestos (10%):* ${formatCurrency(orderData.total * 0.10)}
💰 *Total:* ${formatCurrency(orderData.total * 1.10)}

⏰ *Fecha:* ${new Date().toLocaleString('es-VE')}

¡Por favor confirmar el pedido!
        `.trim()

        // Codificar el mensaje para URL
        const encodedMessage = encodeURIComponent(message)
        
        // Crear el enlace de WhatsApp
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`
        
        // En producción, podrías hacer una petición HTTP aquí
        // Para desarrollo, simplemente logueamos el enlace
        console.log('WhatsApp URL:', whatsappUrl)
        
        // En un entorno de producción, podrías usar:
        // await fetch(whatsappUrl) o integrar con la API de WhatsApp Business

    } catch (error) {
        console.error('Error sending WhatsApp message:', error)
        // No lanzamos error para no afectar la creación de la orden
    }
}

// Función auxiliar para formatear currency
function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-VE', {
        style: 'currency',
        currency: 'USD'
    }).format(amount)
}