import OpenAI from "openai";

const openai = new OpenAI({ apiKey: 'secret' });
export async function getFlashcardsOrStory(userPrompt) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo", // en uygun ve akıllı model
    messages: [
      {
        role: "system",
        content: `
Kullanıcıdan gelen komutu işle. Eğer kullanıcı flashcard isterse şu şekilde JSON olarak dön:
{kelime1: anlam1, kelime2: anlam2, ...}
Eğer kullanıcı hikaye isterse sadece hikaye metnini ver.

Açıklama ekleme. Yalnızca veri dön.
`,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}
