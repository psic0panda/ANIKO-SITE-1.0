import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dorusgnpe',
  api_key: process.env.CLOUDINARY_API_KEY || '558996165765813',
  api_secret: process.env.CLOUDINARY_API_SECRET || '_yn0cw_Rt2yN0GWg6JvZQRMWFXg',
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (key !== 'aniko_admin_segredo_2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = 'aniko_videos';

  // Gerar assinatura para upload direto do browser (auto permite arquivos grandes e qualquer formato)
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET || '_yn0cw_Rt2yN0GWg6JvZQRMWFXg'
  );

  return NextResponse.json({
    signature,
    timestamp,
    folder,
    api_key: process.env.CLOUDINARY_API_KEY || '558996165765813',
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dorusgnpe',
  });
}
