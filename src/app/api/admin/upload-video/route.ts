import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dorusgnpe',
  api_key: process.env.CLOUDINARY_API_KEY || '558996165765813',
  api_secret: process.env.CLOUDINARY_API_SECRET || '_yn0cw_Rt2yN0GWg6JvZQRMWFXg',
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    // Converter File para Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    // Upload para o Cloudinary via SDK (sem CORS, servidor para servidor)
    const result = await cloudinary.uploader.upload(dataUri, {
      resource_type: 'video',
      folder: 'aniko_videos',
    });

    return NextResponse.json({ success: true, secure_url: result.secure_url });
  } catch (err: any) {
    console.error('Erro no upload Cloudinary (server):', err);
    return NextResponse.json({ error: err.message || 'Erro interno no upload.' }, { status: 500 });
  }
}

// Configuração do Next.js App Router para aceitar arquivos grandes (até 500MB)
export const maxDuration = 300; // 5 minutos de timeout

export const runtime = 'nodejs';

