import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API_KEY_MISSING', details: 'Add ELEVENLABS_API_KEY in Vercel Environment Variables.' }, { status: 500 });
    }

    const response = await fetch(
      'https://api.elevenlabs.io/v1/text-to-speech/ajq54GdZVkI2Mhmng8t5',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.5,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs Error:', response.status, errorText);
      return NextResponse.json({ error: 'TTS_FAILED', details: errorText }, { status: 500 });
    }

    const audioBuffer = await response.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');
    
    return NextResponse.json({ 
      audioContent: audioBase64 
    });
  } catch (error) {
    console.error('TTS API Error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR', details: String(error) }, { status: 500 });
  }
}
