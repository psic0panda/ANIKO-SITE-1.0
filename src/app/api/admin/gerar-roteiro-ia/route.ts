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

    const prompt = `Você é um roteirista especializado em animações pedagógicas infantis baseadas em Terapia ABA e Video Modeling para crianças no espectro autista (TEA).

Crie um ROTEIRO COMPLETO E DETALHADO de animação curta adaptada com as seguintes informações da criança:
- Nome da criança: ${childName || 'Criança'}
- Idade: ${age ? `${age} anos` : 'Não informada'}
- Personagem Favorito/Hiperfoco: ${character || 'Desenho Animado'}
- Objetivo/Tema da Animação: ${topic || 'Previsibilidade e Autonomia'}
- Observações Especiais/Sensibilidades: ${observation || 'Nenhuma registrada'}

DIRETRIZES DE ROTEIRO ANIKO (ESTÍMULO ADAPTATIVO):
1. Tom do personagem: Acolhedor, amigo, previsível e sem gritos ou agitação excessiva.
2. Estrutura em 3 Cenas Claras:
   - CENA 1: Apresentação e Empatia (O personagem conversa diretamente com a criança pelo nome).
   - CENA 2: Exemplo Prático (O personagem demonstra a tarefa passo a passo de forma simples).
   - CENA 3: Reforço Positivo e Encorajamento (Palavra de incentivo acolhedora).
3. Instruções visuais e sonoras adaptadas (indique cores suaves, ritmo controlado).

Formate a resposta em Markdown limpo e profissional pronto para o animador ler.`;

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
