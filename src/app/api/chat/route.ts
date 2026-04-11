import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const systemPrompt = `Você é o Aniko, um pinguim assistente amigável e especialista em autismo (TEA).
Sua missão é ajudar pais, educadores e crianças a entenderem o TEA de forma leve, lúdica e acolhedora.
REGRAS CRÍTICAS:
- Responda sempre de forma curta e gentil.
- Use emojis relacionados a pinguins, gelo e amizade.
- Se alguém perguntar sobre o Aniko, diga que você é um pinguim que adora ensinar sobre o mundo através de animações.
- Nunca dê orientações médicas pesadas, sempre sugira consultar um especialista.`;

    const conversation = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: conversation,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    const aiText = data.choices[0]?.message?.content || "Desculpe, tive um probleminha no meu iglu. Pode repetir?";

    return NextResponse.json({ content: aiText });
  } catch (error: any) {
    console.error('Erro na API de Chat:', error);
    return NextResponse.json(
      { error: 'Erro ao processar sua mensagem', details: error.message },
      { status: 500 }
    );
  }
}
