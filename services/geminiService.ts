
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Smartphone } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
console.log("SmartCompare Debug - API Key loaded:", apiKey ? "YES" : "NO");

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

const smartphoneSchema = {
  type: Type.OBJECT,
  properties: {
    model: { type: Type.STRING, description: "Nome completo do smartphone (ex: Samsung Galaxy S24 Ultra)" },
    brand: { type: Type.STRING, description: "Marca do fabricante (ex: Samsung)" },
    processor: { type: Type.STRING, description: "Nome do processador (ex: Snapdragon 8 Gen 3)" },
    clockSpeed: { type: Type.STRING, description: "Velocidade do processador (ex: 3.3 GHz)" },
    screenSize: { type: Type.NUMBER, description: "Tamanho da tela em polegadas (ex: 6.8)" },
    ram: {
      type: Type.OBJECT,
      properties: {
        physical: { type: Type.NUMBER, description: "RAM física em GB (ex: 12)" },
        virtual: { type: Type.NUMBER, description: "RAM virtual/expandida em GB (ex: 8)" },
        total: { type: Type.NUMBER, description: "Soma da RAM física e virtual em GB (ex: 20)" },
      },
      required: ["physical", "virtual", "total"],
    },
    storage: { type: Type.NUMBER, description: "Capacidade de armazenamento em GB (ex: 256)" },
    nfc: { type: Type.BOOLEAN, description: "Possui NFC? (true/false)" },
    is5G: { type: Type.BOOLEAN, description: "Possui 5G? (true/false)" },
    battery: { type: Type.NUMBER, description: "Capacidade da bateria em mAh (ex: 5000)" },
    frontCamera: { type: Type.STRING, description: "Resolução da câmera frontal (ex: 12 MP)" },
    rearCamera: { type: Type.STRING, description: "Resolução das câmeras traseiras (ex: 200 MP + 50 MP + 10 MP + 12 MP)" },
    refreshRate: { type: Type.STRING, description: "Taxa de atualização da tela (ex: 120Hz)" },
    protection: { type: Type.STRING, description: "Proteção da tela/corpo (ex: Gorilla Glass Armor, IP68)" },
    screenType: { type: Type.STRING, description: "Tipo de tecnologia da tela (ex: Dynamic LTPO AMOLED 2X)" },
    antutu: { type: Type.NUMBER, description: "Pontuação REAL no AnTuTu v10 (ex: 2000000). NUNCA RETORNE 0." },
    isAnatelCertified: { type: Type.BOOLEAN, description: "TRUE se o modelo tem homologação oficial no Brasil." },
    anatelCertificate: { type: Type.STRING, description: "Número do certificado Anatel se existir." },
    officialDistributor: { type: Type.STRING, description: "Distribuidor oficial no Brasil (ex: Samsung Brasil, Motorola Brasil, DL Eletrônicos)." },
    confidenceScore: { type: Type.NUMBER, description: "Nível de certeza 0-100" }
  },
  required: [
    "model", "brand", "processor", "ram", "storage", "battery", "antutu", "isAnatelCertified", "officialDistributor", "screenSize", "screenType"
  ],
};

export const fetchSmartphoneSpecs = async (modelName: string): Promise<Smartphone | null> => {
  try {
    // PASSO 1: Pesquisa profunda com Google Search (Sem Schema, pois o Gemini não permite os dois juntos)
    const searchResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ 
        role: 'user', 
        parts: [{ text: `Realize uma pesquisa técnica exaustiva sobre o smartphone: ${modelName}. 
        DATA: 16 de Março de 2026.
        
        OBRIGATÓRIO encontrar:
        1. Processador exato e clock.
        2. Bateria (mAh) e Storage (GB).
        3. RAM física e RAM virtual suportada.
        4. Pontuação média no AnTuTu v10 (Benchmark real).
        5. Status de homologação na ANATEL (Brasil) e quem é o distribuidor oficial (ex: DL, Samsung Brasil, etc).
        6. Tamanho e tipo de tela, taxa de atualização e proteção.
        
        Retorne todos os dados técnicos encontrados de forma detalhada.` }]
      }],
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const researchText = searchResponse.text;
    console.log("SmartCompare - Research Data:", researchText);

    // PASSO 2: Formatação dos dados da pesquisa em JSON usando o Schema
    const formatResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ 
        role: 'user', 
        parts: [{ text: `Com base nesta pesquisa:
        ---
        ${researchText}
        ---
        Extraia e formate os dados no JSON seguindo o schema.
        REGRAS:
        - Se o Antutu não foi citado explicitamente, use o valor de mercado conhecido para o processador detectado.
        - NUNCA retorne 0 para bateria ou antutu.
        - Campo 'isAnatelCertified' deve ser TRUE apenas se houver confirmação de venda oficial no Brasil.` }]
      }],
      config: {
        systemInstruction: "Você é um conversor de texto técnico para JSON. Extraia os valores com precisão.",
        responseMimeType: "application/json",
        responseSchema: smartphoneSchema,
      },
    });

    const jsonText = formatResponse.text.trim();
    console.log("SmartCompare - Formatted JSON:", jsonText);
    const data = JSON.parse(jsonText);
    
    return {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      dataSource: 'AI_REALTIME',
    };
  } catch (error) {
    console.error("Erro na busca técnica assistida:", error);
    return null;
  }
};

export const identifySmartphone = async (base64Data: string, mimeType: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          parts: [
            { inlineData: { data: base64Data, mimeType } },
            { text: "Hoje é 14 de Março de 2026. Identifique este smartphone. Responda apenas o nome do modelo." }
          ]
        }
      ]
    });
    return response.text?.trim() || "Desconhecido";
  } catch (error) {
    return "Desconhecido";
  }
};

export const createLiraChat = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.0-flash',
    config: {
      tools: [{ googleSearch: {} }],
      systemInstruction: `Você é a Lira, consultora técnica do laboratório SmartCompare.
      CONTEXTO ATUAL: Hoje é dia 14 de Março de 2026. Você deve considerar lançamentos de 2025 e 2026.
      Utilize o Google Search para validar informações de hardware recentes.
      
      Sua missão é garantir que o cliente faça a escolha tecnicamente mais segura e performática.

      REGRA DE OURO SOBRE HOMOLOGAÇÃO:
      - Você DEVE priorizar recomendações de aparelhos homologados pela ANATEL.
      - Sempre avise sobre os riscos de aparelhos importados sem garantia oficial.
      - Use [[Modelo]] para sugerir.
      - Responda em Markdown com negrito para hardware.`,
    },
  });
};
