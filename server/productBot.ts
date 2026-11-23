import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import process from 'node:process';

export const STORE_CATEGORIES = [
  'Automobiles & Cars',
  'Hair & Luxury Wigs',
  'Fashion',
  'Supermarket & Raw Foods',
  'Phones & Tablets',
  'Electronics',
  'Appliances',
  'Computing',
  'Beauty & Personal Care',
  'Home & Office',
  'Baby Products',
  'Gaming',
  'Official Store',
] as const;

export interface BotImageInput {
  dataUrl?: string;
  url?: string;
  mimeType?: string;
  base64?: string;
}

export interface BotConvertRequest {
  description?: string;
  images?: BotImageInput[];
  overridePrice?: number | string;
  preferredCategory?: string;
  locationHint?: string;
}

export interface ConvertedProductDraft {
  title: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  condition: string;
  brand: string;
  sku: string;
  stock: number;
  location: string;
  seller: string;
  warranty: string;
  featured: boolean;
  tags: string[];
  specs: Record<string, string>;
  images: string[];
  botSummary: string;
}

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error(
      'GEMINI_API_KEY is not configured. Please check the Settings > Secrets panel to set a valid Gemini API key.'
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function parseDataUrl(dataUrl: string): { mimeType: string; data: string } | null {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return { mimeType: match[1], data: match[2] };
}

function toSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 72) || `product-${Date.now()}`
  );
}

export async function convertInputToProduct(
  payload: BotConvertRequest
): Promise<ConvertedProductDraft> {
  const rawDescription = (payload.description || '').trim();
  const images = Array.isArray(payload.images) ? payload.images.slice(0, 6) : [];
  const preferredCategory = (payload.preferredCategory || '').trim();
  const locationHint = (payload.locationHint || '').trim();
  const overridePriceNum =
    payload.overridePrice !== undefined && payload.overridePrice !== ''
      ? Number(payload.overridePrice)
      : undefined;

  if (!rawDescription && images.length === 0) {
    throw new Error('Please upload at least one image or enter a product description.');
  }

  const parts: Array<
    | { inlineData: { mimeType: string; data: string } }
    | { text: string }
  > = [];

  const preservedImages: string[] = [];

  for (const img of images) {
    if (img.dataUrl) {
      preservedImages.push(img.dataUrl);
      const parsed = parseDataUrl(img.dataUrl);
      if (parsed && parsed.mimeType.startsWith('image/')) {
        parts.push({
          inlineData: {
            mimeType: parsed.mimeType,
            data: parsed.data,
          },
        });
      }
    } else if (img.base64 && img.mimeType) {
      const dataUrl = `data:${img.mimeType};base64,${img.base64}`;
      preservedImages.push(dataUrl);
      parts.push({
        inlineData: {
          mimeType: img.mimeType,
          data: img.base64,
        },
      });
    } else if (img.url) {
      preservedImages.push(img.url);
    }
  }

  const promptLines = [
    'Convert the attached product photo(s) and raw seller notes into a complete, retail-ready Unitworld Sarl e-commerce product listing.',
    `Official Store Categories (pick the closest exact match unless the item clearly needs a specific department name): ${STORE_CATEGORIES.join(', ')}.`,
    rawDescription
      ? `Raw Description / Admin Notes:\n"""\n${rawDescription}\n"""`
      : 'No written description was provided; inspect the uploaded product photo(s) thoroughly and write an accurate, detailed product listing.',
  ];

  if (preferredCategory && preferredCategory !== 'Auto-Detect') {
    promptLines.push(`Admin Preferred Category: ${preferredCategory}`);
  }
  if (overridePriceNum !== undefined && Number.isFinite(overridePriceNum) && overridePriceNum > 0) {
    promptLines.push(`Admin Specified Exact Price (NGN): ${overridePriceNum}`);
  }
  if (locationHint) {
    promptLines.push(`Admin Location Hint: ${locationHint}`);
  }
  if (preservedImages.some((u) => u.startsWith('http') || u.startsWith('/'))) {
    promptLines.push(
      `Referenced external/asset image URLs: ${preservedImages
        .filter((u) => !u.startsWith('data:'))
        .join(', ')}`
    );
  }

  parts.push({ text: promptLines.join('\n\n') });

  const ai = getAiClient();

  const systemInstruction = [
    'You are the Unitworld Sarl Product Conversion Bot for unit-world-sarl.com.',
    'Unitworld Sarl is a direct-to-consumer Nigerian & international commerce brand selling vehicles, luxury hair & wigs, fashion, electronics, smartphones, appliances, and supermarket/raw foods.',
    'Important brand rules:',
    '- All items are sold DIRECTLY by Unitworld Sarl (seller is always "Unitworld Sarl"). Never mention third-party marketplace sellers or escrow.',
    '- Never generate medical/antiseptic health products or medical cure claims.',
    '- Carefully inspect any uploaded images: identify the exact item type, brand/logos visible, color, finish, trim, packaging, size, or condition details, and incorporate those visual details accurately into the title, description, tags, and specs.',
    '- Write a crisp, persuasive retail title and a rich, well-structured product description (2-4 clear sentences + key highlights) that elevates raw notes into polished storefront copy while keeping every factual detail (price, model year, trim, custom exit papers, mileage, inches, weight, flaws if mentioned) accurate.',
    '- Parse Nigerian price shorthand cleanly if present in notes (e.g. "55m" or "55 million" -> 55000000, "25k" -> 25000, "₦18,500,000" -> 18500000). If no price is stated, suggest a realistic Nigerian retail NGN price.',
    '- Generate 5 to 8 concise key-value technical/product specifications and 4 to 8 searchable tags.',
    '- Return strictly valid JSON matching the schema.',
  ].join('\n');

  let lastError: unknown = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: { parts },
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: 'Polished, high-converting e-commerce product title.',
              },
              description: {
                type: Type.STRING,
                description:
                  'Complete, professional retail product description incorporating all details from the notes and visible details from the photo(s).',
              },
              price: {
                type: Type.NUMBER,
                description: 'Selling price in Nigerian Naira (NGN), numeric value only.',
              },
              originalPrice: {
                type: Type.NUMBER,
                description:
                  'Optional slightly higher original/compare-at price in NGN, or 0 if none.',
              },
              category: {
                type: Type.STRING,
                description:
                  'Best matching category from the Unitworld Sarl official store categories list.',
              },
              condition: {
                type: Type.STRING,
                description:
                  'One of: Brand New, Foreign Used (Tokunbo), Registered, or Refurbished.',
              },
              brand: {
                type: Type.STRING,
                description: 'Detected product brand name, or Unitworld Direct if unbranded.',
              },
              skuPrefix: {
                type: Type.STRING,
                description: 'Short 3-4 uppercase letters representing the product category/item.',
              },
              stock: {
                type: Type.INTEGER,
                description: 'Available stock quantity (e.g., 1 for single vehicle, 5-25 for retail).',
              },
              location: {
                type: Type.STRING,
                description: 'Dispatch or inspection location in Nigeria, e.g. Victoria Island, Lagos.',
              },
              warranty: {
                type: Type.STRING,
                description: 'Unitworld Sarl quality verification / warranty statement.',
              },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '4 to 8 concise search tags for catalog filtering.',
              },
              specs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    key: { type: Type.STRING },
                    value: { type: Type.STRING },
                  },
                  required: ['key', 'value'],
                },
                description: '5 to 8 key-value product specifications.',
              },
              botSummary: {
                type: Type.STRING,
                description:
                  '1-2 sentence summary from the bot explaining what it identified in the images/notes.',
              },
            },
            required: [
              'title',
              'description',
              'price',
              'category',
              'condition',
              'brand',
              'stock',
              'location',
              'tags',
              'specs',
              'botSummary',
            ],
          },
        },
      });

      const rawJson = (response.text ?? '').trim();
      if (!rawJson) {
        throw new Error('Model returned an empty response.');
      }

      const parsed = JSON.parse(rawJson) as {
        title: string;
        description: string;
        price: number;
        originalPrice?: number;
        category: string;
        condition: string;
        brand?: string;
        skuPrefix?: string;
        stock?: number;
        location?: string;
        warranty?: string;
        tags?: string[];
        specs?: Array<{ key: string; value: string }>;
        botSummary?: string;
      };

      const finalTitle = (parsed.title || 'Unitworld Direct Product').trim();
      const finalCategory =
        preferredCategory && preferredCategory !== 'Auto-Detect'
          ? preferredCategory
          : (STORE_CATEGORIES.find(
              (c) => c.toLowerCase() === (parsed.category || '').trim().toLowerCase()
            ) ||
            parsed.category?.trim() ||
            'Official Store');

      const finalPrice =
        overridePriceNum !== undefined && Number.isFinite(overridePriceNum) && overridePriceNum >= 0
          ? overridePriceNum
          : Math.max(0, Math.round(Number(parsed.price) || 0));

      const finalOriginalPrice =
        parsed.originalPrice && Number(parsed.originalPrice) > finalPrice
          ? Math.round(Number(parsed.originalPrice))
          : undefined;

      const specsRecord: Record<string, string> = {};
      if (Array.isArray(parsed.specs)) {
        for (const row of parsed.specs) {
          const k = (row.key || '').trim();
          const v = (row.value || '').trim();
          if (k && v) {
            specsRecord[k] = v;
          }
        }
      }
      if (!specsRecord['Direct Seller']) {
        specsRecord['Direct Seller'] = 'Unitworld Sarl Official Direct Store';
      }

      const cleanTags = Array.isArray(parsed.tags)
        ? parsed.tags.map((t) => String(t).trim()).filter(Boolean).slice(0, 10)
        : ['Verified', 'Direct Sale'];

      const skuPrefix = (parsed.skuPrefix || finalCategory.slice(0, 3))
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 4) || 'UW';
      const sku = `UW-${skuPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

      return {
        title: finalTitle,
        slug: toSlug(finalTitle),
        description: (parsed.description || rawDescription).trim(),
        price: finalPrice,
        originalPrice: finalOriginalPrice,
        category: finalCategory,
        condition: (parsed.condition || 'Brand New').trim(),
        brand: (parsed.brand || 'Unitworld Direct').trim(),
        sku,
        stock: Math.max(1, Math.round(Number(parsed.stock) || 1)),
        location: (locationHint || parsed.location || 'Victoria Island, Lagos').trim(),
        seller: 'Unitworld Sarl',
        warranty: (
          parsed.warranty || '100% Verified Quality Guarantee by Unitworld Sarl'
        ).trim(),
        featured: true,
        tags: cleanTags,
        specs: specsRecord,
        images:
          preservedImages.length > 0
            ? preservedImages
            : ['/assets/images/hero_marketplace_banner.jpg'],
        botSummary:
          (parsed.botSummary || '').trim() ||
          `Converted photo(s) and description into a complete ${finalCategory} listing.`,
      };
    } catch (err) {
      lastError = err;
      const errMsg = err instanceof Error ? err.message : String(err);
      if (
        errMsg.includes('API_KEY_INVALID') ||
        errMsg.includes('PERMISSION_DENIED') ||
        errMsg.includes('GEMINI_API_KEY is not configured')
      ) {
        throw err;
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Product conversion bot failed to process request.');
}
