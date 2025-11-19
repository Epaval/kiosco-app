'use server'

import { prisma } from '@/src/lib/prisma'

export async function handleMarkAsReady(orderId: number) {
  try {
    await prisma.order.update({
      where: { 
        id: orderId
      },
      data: {
        status: true,
        orderReadyAt: new Date()
      }
    })
    
    // Retornar éxito para recargar la página
    return { success: true }
  } catch (error) {
    console.log(error)
    return { success: false, error: 'No se pudo actualizar la orden' }
  }
}