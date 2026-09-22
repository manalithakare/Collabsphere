import { GoogleGenAI, Type } from '@google/genai';

let aiClient = null;

function getAiClient() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export async function generateContentIdeasService(params) {
  const {
    productName,
    productDescription = '',
    targetAudience = 'General consumers',
    platform = 'Instagram Reels',
    campaignType = 'Paid',
    tone = 'Engaging & Authentic',
    contentType = 'Short Product Video',
  } = params;

  const prompt = `You are a world-class creator marketing strategist and creative director.
Generate 3 distinct, viral, high-converting content collaboration ideas for an influencer campaign with the following details:
- Product Name: ${productName}
- Product Description: ${productDescription}
- Target Audience: ${targetAudience}
- Platform: ${platform}
- Campaign Type: ${campaignType}
- Tone: ${tone}
- Content Format/Type: ${contentType}

For each of the 3 ideas, provide:
1. title: catchy name for the concept
2. hook: the first 3 seconds visual/verbal pattern interrupt hook
3. videoConcept: concise summary of the visual progression
4. suggestedScript: step-by-step dialogue or voiceover script (0-15s, 15-30s, 30-45s)
5. callToAction: high-converting CTA (link in bio, promo code, comment keyword)
6. caption: engaging social media caption with emojis
7. hashtags: array of 5-8 relevant trending hashtags
`;

  const client = getAiClient();

  if (client) {
    try {
      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are an expert social media and influencer marketing strategist. Always return structured JSON matching the requested schema.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            description: 'Array of 3 creative collaboration content concepts',
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                hook: { type: Type.STRING },
                videoConcept: { type: Type.STRING },
                suggestedScript: { type: Type.STRING },
                callToAction: { type: Type.STRING },
                caption: { type: Type.STRING },
                hashtags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['title', 'hook', 'videoConcept', 'suggestedScript', 'callToAction', 'caption', 'hashtags'],
            },
          },
        },
      });

      if (response && response.text) {
        const parsed = JSON.parse(response.text.trim());
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('Gemini API call failed, using intelligent creative fallback:', error.message);
    }
  }

  // Fallback high-quality curated creative ideas if API key is not present or temporary network limits
  return [
    {
      title: `The "Unfiltered Reality" Test: ${productName}`,
      hook: `“Stop scrolling if you’re tired of fake product hype. Let’s see what ${productName} ACTUALLY does…”`,
      videoConcept: `A split-screen comparison: Morning routine chaos vs. effortless efficiency after introducing ${productName}. Influencer speaks directly to camera, showing macro texture and authentic first impressions.`,
      suggestedScript: `[0-3s]: “I tested this so you don’t waste your money.” \n[3-15s]: Show close-up of ${productName}. Break down the 2 biggest game-changers for ${targetAudience}. \n[15-30s]: Demonstrate real-time application and results. \n[30-45s]: Final verdict and exclusive community discount.`,
      callToAction: `Use code COLLAB20 for 20% off at the link in bio — first 100 orders get free shipping!`,
      caption: `Real talk: Does ${productName} live up to the hype? 👀 I put it to the test all week, and honestly, step 2 blew my mind. Link in bio for the limited creator discount! #CollabSphere`,
      hashtags: [`#${productName.replace(/\s+/g, '')}`, '#InfluencerCollab', '#HonestReview', '#CreatorFinds', '#MustHave', '#ViralProducts'],
    },
    {
      title: `Day in the Life: How I Integrate ${productName}`,
      hook: `“Come spend 24 hours with me and watch how this one switch upgraded my entire routine…”`,
      videoConcept: `A fast-paced, aesthetic mini-vlog with ASMR sound design, ambient lofi beat, and dynamic angles showing lifestyle integration of ${productName} for ${targetAudience}.`,
      suggestedScript: `[0-5s]: Wake up b-roll, fast transition to grabbing ${productName}. \n[5-20s]: Voiceover explaining why this fits seamlessly into a busy schedule with ${tone} energy. \n[20-40s]: Show tangible benefits and high-energy montage. \n[40-50s]: Direct prompt for viewers to comment.`,
      callToAction: `Comment 'DETAILS' below and I’ll DM you the exact link and bundle!`,
      caption: `If you’ve been looking for something that actually works for ${targetAudience}, you need ${productName}. It has officially earned permanent residence on my shelf! ✨ What's your go-to routine?`,
      hashtags: ['#DayInMyLife', '#ProductivityHacks', '#AestheticRoutine', `#${productName.replace(/\s+/g, '')}`, '#DailyUpgrade'],
    },
    {
      title: `3 Reasons Why ${targetAudience} Are Obsessed With ${productName}`,
      hook: `“Number 3 is the reason everyone in my DMs is asking about this…”`,
      videoConcept: `Top-3 listicle format with on-screen text overlays, green-screen commentary, and punchy transitions tailored for ${platform}.`,
      suggestedScript: `[0-4s]: “Here are 3 reasons why ${productName} is taking over right now.” \n[4-15s]: Reason 1: The key feature and immediate benefit. \n[15-28s]: Reason 2: How it solves the everyday pain point of ${targetAudience}. \n[28-40s]: Reason 3: The unbeatable value and creator guarantee.`,
      callToAction: `Tap the bio link before it sells out again!`,
      caption: `Found the holy grail so you don’t have to search forever! 3 honest reasons why ${productName} is worth every penny. Drop a 🔥 if you want a part 2 tutorial!`,
      hashtags: ['#CreatorPicks', '#Top3Recommendations', '#ShoppingTips', `#${productName.replace(/\s+/g, '')}`, '#TrendingNow'],
    },
  ];
}
