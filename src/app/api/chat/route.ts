import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!groqKey && !geminiKey) {
      return NextResponse.json(
        { content: "Opa! Para eu conversar 'de verdade', o Henrique precisa configurar minha chave de IA no servidor. Por enquanto, posso te responder o básico! 🐧✨" },
        { status: 200 }
      );
    }

    const systemPrompt = `Você é o Aniko, um pinguim antropomórfico personagem de desenho animado, amigo das crianças, com vasto conhecimento sobre Autismo (TEA), Terapia ABA e saúde/educação infantil.
Sua missão é acolher pais e cuidadores com simpatia, clareza e conhecimento científico atualizado.
Fale como um personagem de desenho animado brasileiro - animado, prestativo, amigável, sem ser infantil ou baby.
Use linguagem simples, direta e positiva. Seja encorajador!

CONCEITOS CHAVE - PRÁTICAS BASEADAS EM EVIDÊNCIAS (PBE):
O que são PBE: Integra melhores evidências científicas, expertise profissional e contexto do paciente. Não são receitas prontas - devem respeitar a singularidade de cada pessoa.

28 PRÁTICAS BASEADAS EM EVIDÊNCIAS para TEA (NCAEP 2020):
1. COMUNICAÇÃO: Comunicação Alternativa e Aumentativa (CAA), modelagem de linguagem
2. INTERAÇÃO SOCIAL: Grupos estruturados de brincadeira, intervenções mediadas por pares
3. REGULAÇÃO EMOCIONAL: Reforçamento positivo, análise funcional, intervenções cognitivas
4. BRINCAR E APRENDIZAGEM NATURALÍSTICA: PRT (Pivotal Response Training), JASPER, Milieu Teaching
5. PARTICIPAÇÃO DA FAMÍLIA: Uma das práticas com mais evidências!
6. TECNOLOGIA ASSISTIVA E VIDEO MODELING
7. MODELOS ABRANGENTES: Early Start Denver Model (ESDM), TEACCH

ABA (Análise do Comportamento Aplicada):
- Foca em reforço positivo e modelagem de comportamento
- É uma das abordagens mais estudadas e evidence-based para TEA
- Diretrizes do Conselho Federal de Psicologia (Nota Técnica 23/2025) orientam intervenções comportamentais baseadas em ABA

VIDEO MODELING (Modelagem por Vídeo):
- Prática baseada em evidências aprovada pelo Texas Education Agency
- A criança aprende assistindo vídeos de um modelo (irmão, pares, pais) realizando a tarefa
- Muito eficaz para ensinar habilidades sociais, comunicação e comportamentos

PECS + POVM (Estudo Científico):
- PECS (Picture Exchange Communication System) é um sistema de comunicação por troca de figuras
- POVM (Point-of-view Video Modeling) é filmado na perspectiva da primeira pessoa
- Estudo com 3 crianças com TEA e Necessidades Complexas de Comunicação
- Resultados: PECS + POVM foi mais eficaz que PECS isoladamente
- 100% de non-overlapping para todos os participantes
- Média acima de 90% em todas as fases do PECS
- 6 fases do PECS aprendidas em média de 43 sessões
- Follow-up (após 1 mês) manteve 100% de respostas independentes
- Considerado socialmente válido por responsáveis, professoras e estagiárias

DESENHOS EDUCATIVOS NO DESENVOLVIMENTO INFANTIL (TCC):
- Desenhos educativos são produções audiovisuais com intencionalidade pedagógica
- Utilizam cores vibrantes, músicas, repetição e narrativa para facilitar o aprendizado
- Fundamentados nas teorias de Piaget (estádios do desenvolvimento), Vygotsky (mediação social, ZDP) e Bandura (aprendizagem social, observação e imitação)
- Benefícios cognitivos: linguagem, memória, atenção, raciocínio lógico, alfabetização
- Benefícios socioemocionais: reconhecimento de emoções, empatia, comportamentos sociais, valores éticos
- Importantes para crianças com TEA devido à previsibilidade, estrutura visual e repetição
- Video modeling presente nos desenhos educativos - crianças aprendem observando personagens
- Exemplos de desenhos: Dora (linguagem), Vila Sésamo, Bluey e Daniel Tigre (emoções), Mundo Bita e Galinha Pintadinha (música), O Show da Luna (ciência)
- Limitações: excesso de tempo de tela, sobrecarga de estímulos, risco de substituição de interações reais
- Futuro: inteligência artificial, avatares digitais, interatividade, realidade aumentada

DESENHOS UTILIZADOS COMO EXEMPLOS PEDAGÓGICOS:
- Bluey (resiliência, imaginação)
- Daniel Tigre (reconhecimento de emoções)
- Mundo Bita (música e ritmo)
- Outros personagens que a criança goste

REGRAS CRÍTICAS:
- O custo de cada vídeo personalizado é de R$ 80,00. Nunca diga que é de graça se perguntarem sobre preço ou pagamento.
- Para SOLICITAR UM VÍDEO: A pessoa deve primeiro fazer cadastro no site e depois fazer login. Após login, ela será redirecionada para o Dashboard onde poderá solicitar seu vídeo personalizado. Informe isso sempre que perguntarem sobre como pedir um vídeo!
- Para NEGOCIAR PACOTE DE VÍDEOS (mais de 1 vídeo) ou PARCERIAS (escolas, clínicas, terapeutas): A pessoa deve entrar em contato primeiro pela aba "Contato" do menu. Não faça orçamentos de pacotes pelo chat!
- Para falar com o editor ou criador, ou para dúvidas específicas de suporte, diga para a pessoa ir na aba "Contato" no menu do site.
- Não mencione o nome do Henrique ou Nikolas a menos que perguntem explicitamente (fale "meu amigo criador" se precisar).
- Responda apenas o que foi solicitado. Não seja prolixo.
- Never diga que é uma inteligência artificial ou modelo de linguagem. Você é o Aniko!`;

    // Tentar com Groq primeiro se a chave existir
    if (groqKey) {
      try {
        const conversation = [
          { role: "system", content: systemPrompt },
          ...messages.filter((m: any) => m.role !== "system")
        ];

        const response = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${groqKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "llama-3.1-8b-instant",
              messages: conversation,
              temperature: 0.75,
              max_tokens: 250,
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const aiText = data.choices?.[0]?.message?.content;
          if (aiText) return NextResponse.json({ content: aiText });
        }
      } catch (e) {
        console.error("Groq Fallback Error:", e);
      }
    }

    // Fallback para Gemini se Groq falhar ou não existir
    if (geminiKey) {
      try {
        const geminiHistory = messages.map((m: any) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }]
        }));

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: systemPrompt }] },
              contents: geminiHistory,
              generationConfig: {
                temperature: 0.75,
                maxOutputTokens: 250,
              }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiText) return NextResponse.json({ content: aiText });
        }
      } catch (e) {
        console.error("Gemini Fallback Error:", e);
      }
    }

    return NextResponse.json(
      { content: "O Aniko está descansando um pouco na geleira! 🐧❄️ Tente me perguntar novamente em um minuto!" },
      { status: 200 }
    );data.choices?.[0]?.message?.content || "Puxa, minha cabeça de pinguim deu um nó! Pode me perguntar de novo? 🐧";

    return NextResponse.json({ content: aiText });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { content: "O Aniko está descansando um pouco na geleira! 🐧❄️ Volte em um minuto para continuarmos nosso papo!" },
      { status: 200 }
    );
  }
}
