import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { childName, age, character, topic, observation } = await req.json();

    const groqKey = process.env.GROQ_API_KEY?.trim();
    const geminiKey = process.env.GEMINI_API_KEY?.trim();

    if (!groqKey && !geminiKey) {
      return NextResponse.json(
        { error: 'Nenhuma chave de API de IA configurada no servidor.' },
        { status: 500 }
      );
    }

    const charName = character || 'O Personagem';
    const name = childName || 'João';

    const prompt = `Você é um roteirista especializado em animações infantis adaptadas para crianças no espectro autista (TEA), utilizando Video Modeling e Terapia ABA.

Sua tarefa é criar um ROTEIRO onde APENAS O PERSONAGEM FALA DIRETO COM A CRIANÇA em primeira pessoa, chamando-a sempre pelo nome (${name}).

DADOS DO PEDIDO:
- Nome da criança: ${name}
- Idade: ${age ? `${age} anos` : 'Não informada'}
- Personagem Favorito/Hiperfoco: ${charName}
- Objetivo/Tema do Vídeo: ${topic || 'Previsibilidade e Autonomia'}
- Observações da Família/Sensibilidades: ${observation || 'Nenhuma registrada'}

REGRAS DE FORMATAÇÃO E ESTILO (EXATAMENTE NESTE FORMATO):

Siga ESTRITAMENTE o exemplo de estrutura abaixo. Não coloque introduções ou notas de rodapé, comece direto na Cena 1:

Cena 1: [Nome da Cena]

"[Descrição curta da ação visual do personagem na tela em aspas]"

${charName}
"[Fala em primeira pessoa onde o personagem chama a criança pelo nome (${name}) com muita empatia, fala calma e encorajadora em aspas]"

Cena 2: [Nome da Cena]

"[Descrição curta da ação visual do personagem mostrando a tarefa/solução em aspas]"

${charName}
"[Fala do personagem em primeira pessoa continuando a explicação amigável para a criança em aspas]"

Cena 3: [Nome da Cena]

"[Descrição curta da ação visual de encerramento em aspas]"

${charName}
"[Mensagem final de incentivo e despedida calorosa chamando a criança pelo nome em aspas]"

Gere o roteiro exatamente neste padrão.`;

    // 1. Tentar Groq primeiro
    if (groqKey) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 1200,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const script = data.choices?.[0]?.message?.content;
          if (script) return NextResponse.json({ script });
        }
      } catch (err) {
        console.error('Groq script error:', err);
      }
    }

    // 2. Fallback Gemini
    if (geminiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.7, maxOutputTokens: 1200 },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const script = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (script) return NextResponse.json({ script });
        }
      } catch (err) {
        console.error('Gemini script error:', err);
      }
    }

    return NextResponse.json({ error: 'Falha ao comunicar com os serviços de IA.' }, { status: 500 });
  } catch (error: any) {
    console.error('Erro na API de Roteiro:', error);
    return NextResponse.json({ error: error.message || 'Erro interno.' }, { status: 500 });
  }
}
