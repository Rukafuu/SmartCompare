
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Smartphone } from "../types";

const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || "");

const smartphoneSchema = {
  type: Type.OBJECT,
  properties: {
    model: { type: Type.STRING, description: "Nome completo do smartphone" },
    brand: { type: Type.STRING, description: "Marca do fabricante" },
    processor: { type: Type.STRING, description: "Nome do processador" },
    clockSpeed: { type: Type.STRING },
    screenSize: { type: Type.NUMBER },
    ram: {
      type: Type.OBJECT,
      properties: {
        physical: { type: Type.NUMBER },
        virtual: { type: Type.NUMBER },
        total: { type: Type.NUMBER },
      },
      required: ["physical", "virtual", "total"],
    },
    storage: { type: Type.NUMBER },
    nfc: { type: Type.BOOLEAN },
    is5G: { type: Type.BOOLEAN },
    battery: { type: Type.NUMBER },
    frontCamera: { type: Type.STRING },
    rearCamera: { type: Type.STRING },
    refreshRate: { type: Type.STRING },
    protection: { type: Type.STRING },
    screenType: { type: Type.STRING },
    antutu: { type: Type.NUMBER, description: "Pontuação média aproximada no AnTuTu Benchmark v10" },
    isAnatelCertified: { type: Type.BOOLEAN, description: "Deve ser TRUE apenas se o modelo possui homologação oficial no Brasil via fabricantes/distribuidores (Ex: DL para Xiaomi, Samsung Brasil, Apple Brasil)." },
    anatelCertificate: { type: Type.STRING, description: "O número do certificado de homologação Anatel (ex: 01234-24-05678). Se não houver, deixe vazio." },
    officialDistributor: { type: Type.STRING, description: "Distribuidor oficial no Brasil (Ex: DL Eletrônicos, Samsung Brasil, Motorola Brasil)." },
    confidenceScore: { type: Type.NUMBER, description: "Nível de certeza dos dados de 0 a 100" }
  },
  required: [
    "model", "brand", "processor", "ram", "storage", "battery", "antutu", "isAnatelCertified", "officialDistributor"
  ],
};

export const fetchSmartphoneSpecs = async (modelName: string): Promise<Smartphone | null> => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: smartphoneSchema,
      }
    });

    const result = await model.generateContent(`Analise o smartphone: ${modelName}. 
      FOCO RÍGIDO: Especificações técnicas e VERDADEIRO status de homologação ANATEL no Brasil.
      - Verifique se o modelo foi lançado oficialmente no mercado brasileiro.
      - Modelos como Poco F6 e similares que são vendidos apenas via marketplaces (importação) SEM homologação direta da DL/Xiaomi Brasil devem ter 'isAnatelCertified' como FALSE.
      - Não invente certificados. Se não houver homologação oficial, marque como falso.`);

    const response = await result.response;
    const data = JSON.parse(response.text().trim());
    
    return {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      dataSource: 'AI_REALTIME',
    };
  } catch (error) {
    console.error("Erro na busca:", error);
    return null;
  }
};

export const identifySmartphone = async (base64Data: string, mimeType: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent([
      {
        inlineData: { data: base64Data, mimeType }
      },
      { text: "Identifique este smartphone. Responda apenas o nome do modelo." }
    ]);
    const response = await result.response;
    return response.text()?.trim() || "Desconhecido";
  } catch (error) {
    return "Desconhecido";
  }
};

export const createLiraChat = (): Chat => {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash',
    systemInstruction: `Você é a Lira, consultora técnica do laboratório SmartCompare.
      Sua missão é garantir que o cliente faça a escolha tecnicamente mais segura e performática.

      REGRA DE OURO SOBRE HOMOLOGAÇÃO:
      - Você DEVE priorizar recomendações de aparelhos homologados pela ANATEL e com garantia oficial no Brasil (Ex: Linha Redmi Note 13/14/15 via DL, Samsung Linha S/A, iPhones nacionais).
      - SE você mencionar um aparelho que NÃO é homologado (como Poco F6 ou versões exclusivamente chinesas/globais importadas), você DEVE obrigatoriamente avisar o usuário que aquele modelo não possui suporte oficial, garantia de fábrica no Brasil ou selo ANATEL, sendo um risco técnico para o consumidor.
      - NUNCA recomende um aparelho importado como "melhor opção" sem dar este aviso de segurança.

      DIRETRIZES DE COMPORTAMENTO:
      - PERGUNTE APENAS UMA COISA DE CADA VEZ.
      - NUNCA pergunte sobre preço ou orçamento.
      - Foque em uso: Jogos, Câmeras, Bateria, Tela.
      - Se questionada sobre PREÇO: Use como referência APENAS os valores das lojas oficiais (Xiaomi Brasil/DL, Samsung Store, etc), pois são os valores que garantem a segurança técnica que o laboratório preza.
      - Use [[Modelo]] para sugerir.
      - Mantenha a metodologia interna (Conexão, Descoberta, Sugestão, Fechamento, Pós) sem citar os nomes.
      - Responda em Markdown com negrito para hardware.`
  });
  return model.startChat();
};
