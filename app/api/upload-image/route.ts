import { put } from '@vercel/blob'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const file = await request.blob()

    if (file.size === 0) {
      return Response.json({ error: 'Archivo vacío' }, { status: 400 })
    }

    // Obtener el nombre original del archivo desde los headers
    const originalName = request.headers.get('x-file-name') || 'unnamed'

    // Generar un nombre único (opcional: añadir timestamp)
    const fileName = `${Date.now()}-${originalName.replace(/\s+/g, '-')}`

    // Subir a Vercel Blob
    const blob = await put(`img-minuto-cero/${fileName}`, file, {
      access: 'public',
    })

    return Response.json({ url: blob.url })
  } catch (error: any) {
    console.error('Error al subir imagen:', error)
    return Response.json({ error: 'Error al subir la imagen' }, { status: 500 })
  }
}