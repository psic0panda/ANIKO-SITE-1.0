import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { childName, caseDetails, characterPreference } = await req.json();

    if (!caseDetails || !caseDetails.trim()) {
      return NextResponse.json({ error: 'Por favor, descreva os detalhes do caso especial para a IA.' }, { status: 400 });
    }

    const groqKey = process.env.GROQ_API_KEY?.trim();
    const geminiKey = process.env.GEMINI_API_KEY?.trim();

    if (!groqKey && !geminiKey) {
      return NextResponse.json({ error: 'Nenhuma chave de API de IA encontrada no servidor.' }, { status: 500 });
    }

    const prompt = `Você é uma Inteligência Artificial especialista em Psicologia Infantil, Terapia ABA (Análise do Comportamento Aplicada) e Intervenções em Autismo (TEA).

Sua tarefa é criar um GUIA PEDAGÓGICO E COMPORTAMENTAL PERSONALIZADO PARA UM CASO ESPECIAL.

DADOS DO CASO INFORMADOS PELO ESPECIALISTA/ADMINISTRADOR:
- Nome da Criança: ${childName || 'Aluno(a)'}
- Personagem Favorito/Hiperfoco (se houver): ${characterPreference || 'Lúdico generalizado'}
- Descrição Detalhada do Caso e Desafios:
${caseDetails}

FORMATO EXIGIDO DE RESPOSTA (Estruturado em tópicos legíveis para pais, professores e terapeutas):

# 🐧 Guia Pedagógico Personalizado — ANIKO
**Criança:** ${childName || 'Aluno(a)'} | **Foco:** Intervenção Especializada

## 1. 🧠 Análise do Comportamento e Sensibilidades
(Explique sucintamente os gatilhos e o padrão comportamental identificado neste caso com base em ABA e integração sensorial).

## 2. 🎨 Adaptação de Ambiente e Estímulos Visuais
(Orientações práticas de iluminação, ruídos, rotina visual e preparação do espaço antes de introduzir a demanda).

## 3. 🎬 Estratégia de Video Modeling e Exibição
(Como apresentar o vídeo do personagem, horário recomendado de exibição, número de repetições por semana e conduta dos pais durante o vídeo).

## 4. 🤝 Passos Práticos de Intervenção para Pais e Terapeutas
(Passo a passo sequencial em 4 etapas para ser aplicado no dia a dia quando o comportamento desafiador ocorrer).

## 5. ⭐️ Sistema de Reforço Positivo Recomendado
(Sugestões de reforçadores sociais, tangíveis ou de atividade alinhados ao hiperfoco da criança).

Gere um texto rico, empático, altamente científico e prático.`;

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
            max_tokens: 1800,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const guideText = data.choices?.[0]?.message?.content;
          if (guideText) return NextResponse.json({ guideText });
        }
      } catch (err) {
        console.error('Groq guide error:', err);
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
              generationConfig: { temperature: 0.7, maxOutputTokens: 1800 },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const guideText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (guideText) return NextResponse.json({ guideText });
        }
      } catch (err) {
        console.error('Gemini guide error:', err);
      }
    }

    return NextResponse.json({ error: 'Erro ao gerar o guia pedagógico via IA.' }, { status: 500 });
  } catch (error: any) {
    console.error('Erro na API de Guia IA:', error);
    return NextResponse.json({ error: error.message || 'Erro interno.' }, { status: 500 });
  }
}
