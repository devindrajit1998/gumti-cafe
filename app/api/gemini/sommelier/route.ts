import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import type { MenuItem } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { prompt, dietPreference, budget, partySize, menuItems, restaurantName } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const menu = Array.isArray(menuItems) ? menuItems as MenuItem[] : [];
    if (menu.length === 0) {
      return NextResponse.json({ error: 'The live menu is not available yet.' }, { status: 503 });
    }
    const restaurantId = menu[0].restaurantId || 'my-restaurant';
    const safeRestaurantName = typeof restaurantName === 'string' ? restaurantName : 'Restaurant';
    const menuCatalog = [{
      restaurantId,
      restaurantName: safeRestaurantName,
      popularItems: menu.filter((item) => item && typeof item.id === 'string' && typeof item.name === 'string').map((item) => ({
        itemId: item.id,
        name: item.name,
        price: item.price,
        vegType: item.vegType,
        category: item.category,
        description: item.description,
        isBestseller: item.isBestseller,
      })),
    }];

    const apiKey = process.env.GEMINI_API_KEY;

    // If Gemini API Key is configured, use Gemini 3.7 Flash for deep culinary reasoning & recommendation
    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `
You are "Zaika AI", a master Indian food sommelier and craving specialist.
Your goal is to recommend the best dishes and meal pairings from the provided menu catalog based on the user's craving, budget, party size, and dietary preferences.

Rules:
1. Recommend 2 to 4 specific items from the catalog that best satisfy the craving.
2. Provide an upbeat, enticing reason for each recommendation.
3. Suggest a brief "Chef's Pairing Tip" (e.g., pairing Biryani with Mirchi ka Salan or Gulab Jamun).
4. Strictly return your answer as valid JSON matching this schema:
{
  "heading": "Catchy short title for the recommendation",
  "reasoning": "1-2 sentences on why this fits their vibe and budget",
  "recommendedItems": [
    {
      "itemId": "exact item id from catalog",
      "restaurantId": "exact restaurant id",
      "restaurantName": "exact restaurant name",
      "name": "dish name",
      "price": 250,
      "vegType": "veg" | "non-veg" | "egg" | "vegan",
      "recommendationReason": "Why this dish was chosen"
    }
  ],
  "estimatedMealCost": 550,
  "pairingTip": "Pro tip on what to eat or drink with it"
}
`;

      const userContent = `
User Craving / Query: "${prompt}"
Preferences:
- Diet: ${dietPreference || 'Any'}
- Budget: ${budget ? `₹${budget}` : 'Flexible'}
- For: ${partySize || '1-2 people'}

Available Restaurant & Food Catalog:
${JSON.stringify(menuCatalog)}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: userContent,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });

      const text = response.text;
      if (text) {
        try {
          const parsed = JSON.parse(text);
          return NextResponse.json(parsed);
        } catch {
          // fallback if json parse error
        }
      }
    }

    // Smart heuristic fallback if API key is not present or rate-limited
    const lowerPrompt = prompt.toLowerCase();
    const isVegOnly = dietPreference === 'veg' || lowerPrompt.includes('veg') || lowerPrompt.includes('paneer');
    
    // Find matching items from catalog
    const matches: Array<{
      itemId: string;
      restaurantId: string;
      restaurantName: string;
      name: string;
      price: number;
      vegType: 'veg' | 'non-veg' | 'egg' | 'vegan';
      recommendationReason: string;
    }> = [];

    for (const m of menu) {
        if (isVegOnly && m.vegType !== 'veg') continue;

        const matchesWord = lowerPrompt.split(' ').some((w) => 
          w.length > 2 && (m.name.toLowerCase().includes(w) || m.category.toLowerCase().includes(w) || safeRestaurantName.toLowerCase().includes(w))
        );

        if (matchesWord || m.isBestseller) {
          matches.push({
            itemId: m.id,
            restaurantId,
            restaurantName: safeRestaurantName,
            name: m.name,
            price: m.price,
            vegType: m.vegType,
            recommendationReason: m.isBestseller ? 'Top rated customer bestseller with rich aromatic spices.' : 'Specially matched for your craving.',
          });
          if (matches.length >= 3) break;
        }
      if (matches.length >= 3) break;
    }

    // Default fallback if no match
    if (matches.length === 0) {
      const firstItem = menu.find((item) => !isVegOnly || item.vegType === 'veg');
      if (!firstItem) {
        return NextResponse.json({ error: 'No matching dishes are available.' }, { status: 404 });
      }
      matches.push({
        itemId: firstItem.id,
        restaurantId,
        restaurantName: safeRestaurantName,
        name: firstItem.name,
        price: firstItem.price,
        vegType: firstItem.vegType,
        recommendationReason: 'Signature bestseller dish loved by thousands across the city.',
      });
    }

    const total = matches.reduce((acc, it) => acc + it.price, 0);

    return NextResponse.json({
      heading: 'Zaika Chef Recommendation',
      reasoning: `Curated hot & fresh dishes perfectly matching "${prompt}".`,
      recommendedItems: matches,
      estimatedMealCost: total,
      pairingTip: 'Pair with chilled spiced buttermilk or warm gulab jamuns for the complete feast!',
    });
  } catch (error) {
    console.error('Zaika Sommelier error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI recommendation' },
      { status: 500 }
    );
  }
}
