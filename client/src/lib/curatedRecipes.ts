import type { FullRecipe } from './recipeSchema';

export const CURATED_PRESETS: FullRecipe[] = [
  {
    id: 'preset-sea-bass',
    title: 'Pan-Seared Chilean Sea Bass with Saffron Emulsion & Charred Asparagus',
    subtitle: 'Crisp crackling skin over velvety saffron-white wine velouté',
    description: 'A study in textural contrast: sustainably sourced sea bass pan-seared to a golden, shatteringly crisp finish, resting atop sweet saffron-perfumed reduction, charred baby asparagus spears, and finished with delicate micro-herbs.',
    cuisine: 'French Haute Cuisine',
    difficulty: 'Michelin Star',
    prepTime: '15 mins',
    cookTime: '18 mins',
    totalTime: '33 mins',
    servings: 2,
    calories: 520,

    tags: ['Pescatarian', 'Gluten-Free', 'Low-Carb', 'Gourmet'],
    winePairing: {
      alcoholic: '2021 Domaine Vacheron Sancerre or crisp Premier Cru Chablis',
      nonAlcoholic: 'Sparkling Silver Needle White Tea infused with Yuzu peel & Thyme',
      notes: 'The razor-sharp acidity and flinty minerality slices through the rich buttery fat of the sea bass, beautifully illuminating the delicate floral saffron notes.'
    },
    chefSecret: 'Pat the fish skin bone-dry on paper towels 30 minutes prior. When placing it into the smoking-hot skillet, immediately press down gently with a fish spatula for 45 seconds to prevent curling and ensure uniform skin-to-iron contact.',
    ingredients: [
      { name: 'Chilean Sea Bass Fillets', amount: 2, unit: 'fillets (7 oz each)', category: 'protein', swapSuggestion: 'Black Cod, Halibut, or Salmon' },
      { name: 'Fresh Asparagus', amount: 1, unit: 'bunch (trimmed)', category: 'produce', swapSuggestion: 'Broccolini or Romanesco florets' },
      { name: 'Saffron Threads', amount: 1, unit: 'pinch (steeped in 2 tbsp warm broth)', category: 'spice', swapSuggestion: 'Turmeric + pinch of smoked sweet paprika' },
      { name: 'French Shallot', amount: 1, unit: 'finely minced', category: 'produce', swapSuggestion: 'Sweet Vidalia onion' },
      { name: 'Dry White Wine', amount: 0.33, unit: 'cup', category: 'pantry', swapSuggestion: 'White verjus or non-alcoholic dry white cooking wine' },
      { name: 'Heavy Cream', amount: 0.25, unit: 'cup', category: 'dairy', swapSuggestion: 'Cashew cream or rich coconut milk' },
      { name: 'Cold Unsalted Butter', amount: 3, unit: 'tbsp (cubed)', category: 'dairy', swapSuggestion: 'Artisanal vegan cultured butter' },
      { name: 'Maldon Sea Salt Flakes', amount: 1, unit: 'tsp', category: 'pantry', swapSuggestion: 'Fleur de sel' },
      { name: 'Edible Micro-Herbs', amount: 2, unit: 'tbsp (garnish)', category: 'produce', swapSuggestion: 'Fresh baby dill or tarragon fronds' }
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Pat the sea bass fillets thoroughly dry with paper towels on both sides. Score the skin micro-lightly in crosshatches and season generously with flaky sea salt and cracked white pepper.',
        technique: 'Mise-en-place',
        timerSeconds: 0,
        chefTip: 'Any moisture on the skin produces steam instead of a crackling golden sear.'
      },
      {
        stepNumber: 2,
        instruction: 'In a small copper saucepan, sweat the minced shallot in 1 tbsp butter over medium-low heat until translucent (3 minutes). Pour in the white wine and steeped saffron liquid. Simmer until reduced by two-thirds.',
        technique: 'Reduction',
        timerSeconds: 240,
        chefTip: 'Allow the saffron aromatics to bloom gently without scorching.'
      },
      {
        stepNumber: 3,
        instruction: 'Whisk in the heavy cream and bring to a gentle simmer for 2 minutes. Lower heat to minimum and whisk in the remaining chilled butter one cube at a time to form an unctuous, velvety emulsion. Season to taste and keep warm.',
        technique: 'Monté au Beurre',
        timerSeconds: 120,
        chefTip: 'Chilled butter creates a stable gloss without breaking the sauce.'
      },
      {
        stepNumber: 4,
        instruction: 'Heat a heavy cast iron or stainless steel skillet over high heat with high-smoke-point oil until wisps of smoke rise. Place fish skin-side down and press gently with a spatula for 45 seconds.',
        technique: 'Sauté Sear',
        timerSeconds: 45,
        chefTip: 'Continuous gentle pressure ensures total contact with the sizzling pan surface.'
      },
      {
        stepNumber: 5,
        instruction: 'Reduce heat to medium-high and allow skin to crisp undisturbed for 4 minutes until edges turn opaque white. Flip carefully and kiss the flesh side for just 90 seconds until flaking tender. Rest on warm plate.',
        technique: 'Crisping',
        timerSeconds: 240,
        chefTip: 'Let the fish rest for 2 minutes before plating so juices redistribute evenly.'
      },
      {
        stepNumber: 6,
        instruction: 'In the same pan drippings, toss trimmed asparagus spears over high flame for 3 minutes until blistered yet crisp-tender. Spoon the golden saffron emulsion onto warmed slate plates, arrange asparagus, crown with the sea bass, and sprinkle edible micro-herbs.',
        technique: 'Plating',
        timerSeconds: 180,
        chefTip: 'Serve immediately on pre-warmed plates to preserve sauce temperature.'
      }
    ],
    macros: [
      { name: 'Protein', value: 46, unit: 'g', color: '#10b981', dailyPct: 92 },
      { name: 'Net Carbs', value: 8, unit: 'g', color: '#f59e0b', dailyPct: 15 },
      { name: 'Healthy Fats', value: 28, unit: 'g', color: '#6366f1', dailyPct: 40 },
      { name: 'Dietary Fiber', value: 4, unit: 'g', color: '#ec4899', dailyPct: 16 }
    ],
    createdAt: Date.now() - 3600000
  },
  {
    id: 'preset-mushroom-risotto',
    title: 'Wild Forest Mushroom & Truffle Arborio Risotto with Aged Reggiano',
    subtitle: 'Creamy slow-simmered grains infused with earth, thyme, and golden shallots',
    description: 'An ode to Piedmontese comfort: plump Arborio pearls slowly toasted in brown butter, bathed in rich simmering mushroom broth, folded with caramelized chanterelles, porcini essence, and 24-month Parmigiano-Reggiano.',
    cuisine: 'Northern Italian Artisanal',
    difficulty: 'Bistro',
    prepTime: '15 mins',
    cookTime: '25 mins',
    totalTime: '40 mins',
    servings: 3,
    calories: 460,

    tags: ['Vegetarian', 'Gluten-Free', 'Italian', 'Comfort Food'],
    winePairing: {
      alcoholic: '2019 Barolo or elegant Langhe Nebbiolo',
      nonAlcoholic: 'Sparkling Tart Cherry Juice with Smoked Oak Bitters & Rosemary',
      notes: 'The forest-floor earthiness of Nebbiolo mirrors the dried porcini fungi and cut through the rich creamy starch.'
    },
    chefSecret: 'Never wash risotto rice. The surface starch is crucial for achieving that silky, wave-like consistency known in Italy as "all’onda". Add broth that is piping hot, never cold.',
    ingredients: [
      { name: 'Arborio or Carnaroli Rice', amount: 1.5, unit: 'cups', category: 'pantry', swapSuggestion: 'Farro or Pearl Barley' },
      { name: 'Mixed Wild Mushrooms (Chanterelles, Cremini, Shiitake)', amount: 12, unit: 'oz (sliced)', category: 'produce', swapSuggestion: 'Portobello or Oyster mushrooms' },
      { name: 'Vegetable or Porcini Broth', amount: 4.5, unit: 'cups (piping hot)', category: 'pantry', swapSuggestion: 'Rich vegetable stock with dried mushroom soak' },
      { name: 'Dry Italian White Wine (Pinot Grigio)', amount: 0.5, unit: 'cup', category: 'pantry', swapSuggestion: '1 tbsp white wine vinegar + 0.5 cup broth' },
      { name: 'Shallots', amount: 2, unit: 'finely diced', category: 'produce', swapSuggestion: 'Sweet leek or yellow onion' },
      { name: 'Garlic Cloves', amount: 3, unit: 'grated', category: 'produce', swapSuggestion: 'Roasted garlic paste' },
      { name: 'Parmigiano-Reggiano (24-Month)', amount: 0.75, unit: 'cup (freshly grated)', category: 'dairy', swapSuggestion: 'Pecorino Romano or Grana Padano' },
      { name: 'Fresh Thyme Leaves', amount: 1, unit: 'tbsp', category: 'produce', swapSuggestion: 'Fresh rosemary or sage' },
      { name: 'Cold Butter', amount: 3, unit: 'tbsp', category: 'dairy', swapSuggestion: 'Cultured plant butter' },
      { name: 'White Truffle Finishing Oil', amount: 1, unit: 'tsp', category: 'pantry', swapSuggestion: 'Extra virgin olive oil with lemon zest' }
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'In a wide sauté pan over high heat, sear wild mushrooms in 1 tbsp olive oil undisturbed for 3 minutes until deeply caramelized and fragrant. Season with salt, thyme, and set aside.',
        technique: 'High-Heat Sear',
        timerSeconds: 180,
        chefTip: 'Do not salt mushrooms until they have released their moisture and begun browning.'
      },
      {
        stepNumber: 2,
        instruction: 'In a heavy saucepan, melt 1 tbsp butter over medium heat. Sauté minced shallots and garlic until fragrant and translucent (2 minutes).',
        technique: 'Soffritto',
        timerSeconds: 120,
        chefTip: 'Cook gently without letting garlic take on brown bitterness.'
      },
      {
        stepNumber: 3,
        instruction: 'Add the Arborio rice and toast for 2 minutes until translucent on edges with a tiny pearl center, smelling nutty.',
        technique: 'Tostatura',
        timerSeconds: 120,
        chefTip: 'Toasting coats the starch granules, preventing the rice from becoming gummy.'
      },
      {
        stepNumber: 4,
        instruction: 'Pour in the white wine and stir continuously until completely absorbed by the rice pearls.',
        technique: 'Deglazing',
        timerSeconds: 90,
        chefTip: 'The sizzle and aroma release will deepen the flavour profile.'
      },
      {
        stepNumber: 5,
        instruction: 'Add hot broth one ladle at a time, stirring steadily. Wait until each ladle is mostly absorbed before adding the next. Continue for 18 minutes until rice is al dente.',
        technique: 'Simmer & Agitation',
        timerSeconds: 1080,
        chefTip: 'Stirring sloughs off surface starches to form a naturally creamy suspension.'
      },
      {
        stepNumber: 6,
        instruction: 'Remove from heat. Fold in the sautéed mushrooms, chilled butter cubes, and grated Parmigiano. Cover for 2 minutes to rest, then drizzle with white truffle essence and serve.',
        technique: 'Mantecatura',
        timerSeconds: 120,
        chefTip: 'Mantecatura off the heat creates that legendary silky Italian ripple.'
      }
    ],
    macros: [
      { name: 'Protein', value: 16, unit: 'g', color: '#10b981', dailyPct: 32 },
      { name: 'Net Carbs', value: 68, unit: 'g', color: '#f59e0b', dailyPct: 48 },
      { name: 'Healthy Fats', value: 15, unit: 'g', color: '#6366f1', dailyPct: 22 },
      { name: 'Dietary Fiber', value: 6, unit: 'g', color: '#ec4899', dailyPct: 24 }
    ],
    createdAt: Date.now() - 7200000
  },
  {
    id: 'preset-steak-bites',
    title: 'Herb-Basted Garlic Butter Ribeye with Blistered Tomatoes & Rosemary',
    subtitle: 'Cast iron crusted prime beef finished with foaming garlic-herb butter',
    description: 'Thick hand-cut ribeye seared aggressively in cast iron to achieve a deeply savory caramelized crust, then continuously basted with foaming European butter infused with smashed garlic cloves and aromatic woody rosemary.',
    cuisine: 'Modern Steakhouse Atelier',
    difficulty: 'Bistro',
    prepTime: '10 mins',
    cookTime: '12 mins',
    totalTime: '22 mins',
    servings: 2,
    calories: 640,

    tags: ['Keto', 'High-Protein', 'Gluten-Free', 'Fast'],
    winePairing: {
      alcoholic: '2018 Napa Valley Cabernet Sauvignon or Bold Argentine Malbec',
      nonAlcoholic: 'Blackberry Shrub with Sparkling Tonic and Charred Rosemary sprig',
      notes: 'Robust tannins and dark berry notes marry effortlessly with the rich ribeye marbling and herb butter.'
    },
    chefSecret: 'Bring your steak to room temperature 45 minutes before cooking. A cold steak drops skillet temperature instantly and prevents achieving that deep mahogany Maillard crust.',
    ingredients: [
      { name: 'Prime Ribeye Steak', amount: 16, unit: 'oz (1.5-inch thick)', category: 'protein', swapSuggestion: 'New York Strip, Filet Mignon, or Portobello Caps' },
      { name: 'Unsalted European Butter', amount: 3, unit: 'tbsp', category: 'dairy', swapSuggestion: 'Ghee or avocado oil' },
      { name: 'Garlic Cloves', amount: 4, unit: 'lightly crushed', category: 'produce', swapSuggestion: 'Black garlic or shallots' },
      { name: 'Fresh Rosemary Sprigs', amount: 2, unit: 'sprigs', category: 'produce', swapSuggestion: 'Fresh thyme or oregano' },
      { name: 'Cherry or Campari Tomatoes', amount: 1, unit: 'cup (on the vine)', category: 'produce', swapSuggestion: 'Baby bell peppers' },
      { name: 'Coarse Kosher Salt & Black Peppercorns', amount: 1, unit: 'tbsp', category: 'pantry', swapSuggestion: 'Steak seasoning rub' }
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Pat ribeye bone-dry. Season generously on all sides with coarse salt and freshly cracked black pepper. Allow to sit at ambient room temperature for 30 minutes.',
        technique: 'Pre-seasoning',
        timerSeconds: 0,
        chefTip: 'Salt dissolves into the surface moisture, creating a brine that gets reabsorbed for deeper flavor.'
      },
      {
        stepNumber: 2,
        instruction: 'Preheat a heavy cast-iron skillet over high heat until smoking hot. Add 1 tbsp avocado or high-heat oil. Lay the steak into the skillet away from you.',
        technique: 'Sear Entry',
        timerSeconds: 120,
        chefTip: 'Laying the steak away from you prevents dangerous hot oil splashing toward your hands.'
      },
      {
        stepNumber: 3,
        instruction: 'Sear undisturbed for 2.5 minutes until a deep golden mahogany crust develops. Flip and sear the second side for 2 minutes.',
        technique: 'Maillard Reaction',
        timerSeconds: 150,
        chefTip: 'Do not move the steak during the initial sear to let the crust caramelize.'
      },
      {
        stepNumber: 4,
        instruction: 'Drop heat to medium. Add butter, crushed garlic, rosemary sprigs, and cherry tomatoes to the pan. Tilt skillet and spoon the frothing butter over the steak continuously for 2 minutes.',
        technique: 'Arrosé (Butter Basting)',
        timerSeconds: 120,
        chefTip: 'Basting cooks the interior gently while perfuming every fiber with garlic herb butter.'
      },
      {
        stepNumber: 5,
        instruction: 'Remove steak when internal temperature reaches 125°F (for medium-rare). Transfer to cutting board and rest for 7 minutes before slicing against the grain.',
        technique: 'Resting & Carving',
        timerSeconds: 420,
        chefTip: 'Resting prevents the savory juices from running out onto your cutting board.'
      }
    ],
    macros: [
      { name: 'Protein', value: 54, unit: 'g', color: '#10b981', dailyPct: 108 },
      { name: 'Net Carbs', value: 5, unit: 'g', color: '#f59e0b', dailyPct: 4 },
      { name: 'Healthy Fats', value: 44, unit: 'g', color: '#6366f1', dailyPct: 62 },
      { name: 'Dietary Fiber', value: 2, unit: 'g', color: '#ec4899', dailyPct: 8 }
    ],
    createdAt: Date.now() - 10800000
  },
  {
    id: 'preset-burrata-carpaccio',
    title: 'Artisanal Burrata & Heirloom Tomato Carpaccio with Basil Oil Infusion',
    subtitle: 'Creamy Pugliese burrata over multicolored heirloom tomatoes and aged balsamic',
    description: 'An immaculate celebration of garden freshness: lush whole burrata torn open to reveal molten stracciatella, surrounded by jewel-toned heirloom tomatoes, fragrant cold-pressed basil oil, toasted pine nuts, and 12-year Modena balsamic glaze.',
    cuisine: 'Modern Mediterranean Atelier',
    difficulty: 'Amateur',
    prepTime: '12 mins',
    cookTime: '0 mins',
    totalTime: '12 mins',
    servings: 2,
    calories: 390,

    tags: ['Vegetarian', 'Gluten-Free', 'No-Cook', 'Quick'],
    winePairing: {
      alcoholic: 'Crisp Italian Vermentino or chilled Provençal Rosé',
      nonAlcoholic: 'Sparkling Lemon Verbena Infusion with Muddled Cucumber',
      notes: 'Crisp green notes and citrus acidity accentuate the sweet tomato acids while cutting the decadent cream of the burrata.'
    },
    chefSecret: 'Never serve burrata straight from the refrigerator. Take it out 30 minutes before assembling so the creamy core reaches ambient temperature and flows effortlessly.',
    ingredients: [
      { name: 'Fresh Pugliese Burrata', amount: 2, unit: 'balls (4 oz each)', category: 'dairy', swapSuggestion: 'Buffalo Mozzarella or Cashew Mozzarella' },
      { name: 'Assorted Heirloom Tomatoes', amount: 3, unit: 'large (sliced)', category: 'produce', swapSuggestion: 'Campari or Cherry tomatoes on the vine' },
      { name: 'Fresh Genovese Basil Leaves', amount: 1, unit: 'cup', category: 'produce', swapSuggestion: 'Baby arugula or fresh mint' },
      { name: 'Extra Virgin Olive Oil', amount: 0.25, unit: 'cup (cold-pressed)', category: 'pantry', swapSuggestion: 'Avocado oil' },
      { name: 'Toasted Pine Nuts', amount: 2, unit: 'tbsp', category: 'pantry', swapSuggestion: 'Toasted slivered almonds or pistachio dust' },
      { name: 'Aged Balsamic Glaze of Modena', amount: 1, unit: 'tbsp', category: 'pantry', swapSuggestion: 'Pomegranate molasses' },
      { name: 'Flaky Sea Salt & Coarse Black Pepper', amount: 0.5, unit: 'tsp', category: 'pantry', swapSuggestion: 'Smoked sea salt' }
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Bring burrata to room temperature. Blanch half the basil in boiling water for 5 seconds, shock in ice water, drain dry, and blend with olive oil and a pinch of salt until vibrant emerald green.',
        technique: 'Herb Oil Infusion',
        timerSeconds: 90,
        chefTip: 'Shocking in ice water sets the chlorophyll, keeping the basil oil vividly bright green.'
      },
      {
        stepNumber: 2,
        instruction: 'Slice heirloom tomatoes into varied rounds and wedges. Arrange across a wide ceramic platter in overlapping fans. Sprinkle with flaky sea salt and cracked pepper.',
        technique: 'Carpaccio Arrangement',
        timerSeconds: 0,
        chefTip: 'Salting the tomatoes 5 minutes early draws out sweet nectar that mingles with the dressing.'
      },
      {
        stepNumber: 3,
        instruction: 'Nestle burrata balls in the center of the tomatoes. Gently tear the crowns open with your fingers to expose the lush, silky stracciatella core.',
        technique: 'Plating Presentation',
        timerSeconds: 0,
        chefTip: 'Tearing rather than slicing with a knife gives a rustic, artisanal appearance.'
      },
      {
        stepNumber: 4,
        instruction: 'Drizzle the vibrant basil oil and aged balsamic glaze generously around the platter. Scatter toasted pine nuts and torn fresh basil leaves. Serve with warm crusty sourdough.',
        technique: 'Finishing Touches',
        timerSeconds: 0,
        chefTip: 'Warm crusty bread provides the ultimate vessel for capturing every drop.'
      }
    ],
    macros: [
      { name: 'Protein', value: 18, unit: 'g', color: '#10b981', dailyPct: 36 },
      { name: 'Net Carbs', value: 11, unit: 'g', color: '#f59e0b', dailyPct: 8 },
      { name: 'Healthy Fats', value: 29, unit: 'g', color: '#6366f1', dailyPct: 42 },
      { name: 'Dietary Fiber', value: 3, unit: 'g', color: '#ec4899', dailyPct: 12 }
    ],
    createdAt: Date.now() - 14400000
  }
];

/** Synthesizes an artisanal culinary recipe tailored to user ingredients when offline or without API key */
export function synthesizeArtisanalRecipe(userIngredients: string[], parameters?: {
  diet?: string;
  timeLimit?: string;
  spice?: string;
  mealType?: string;
}): FullRecipe {
  const ingLower = userIngredients.map(i => i.toLowerCase());
  
  // Check if matches sea bass or seafood
  if (ingLower.some(i => i.includes('fish') || i.includes('salmon') || i.includes('bass') || i.includes('shrimp') || i.includes('seafood'))) {
    return { ...CURATED_PRESETS[0], id: 'synth-' + Date.now() };
  }
  
  // Check if matches steak, beef, chicken
  if (ingLower.some(i => i.includes('steak') || i.includes('beef') || i.includes('chicken') || i.includes('meat') || i.includes('pork'))) {
    return { ...CURATED_PRESETS[2], id: 'synth-' + Date.now() };
  }

  // Check if matches cheese, tomato, salad
  if (ingLower.some(i => i.includes('tomato') || i.includes('cheese') || i.includes('burrata') || i.includes('salad') || i.includes('mozzarella'))) {
    return { ...CURATED_PRESETS[3], id: 'synth-' + Date.now() };
  }

  // Default to wild mushroom risotto or customize with provided ingredients
  const base = CURATED_PRESETS[1];
  const customIngredients = userIngredients.length > 0 ? userIngredients.map((name, idx) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    amount: idx === 0 ? 2 : 1,
    unit: idx === 0 ? 'cups' : 'portion',
    category: 'pantry',
    swapSuggestion: 'Chef choice'
  })) : base.ingredients;

  return {
    ...base,
    id: 'synth-' + Date.now(),
    title: userIngredients.length > 0 ? `Artisanal Composition with ${userIngredients.slice(0, 2).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' & ')}` : base.title,
    ingredients: customIngredients.length >= 3 ? customIngredients : base.ingredients,
  };
}
