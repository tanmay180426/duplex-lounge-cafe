export const MENU_CATEGORIES = [
  { id: "all", name: "All Items" },
  { id: "pizzas", name: "Pizzas" },
  { id: "wraps", name: "Wraps" },
  { id: "mojitos-coolers", name: "Mojitos & Coolers" },
  { id: "fries", name: "Fries & Platters" },
  { id: "momos", name: "Momos" },
  { id: "burgers", name: "Burgers & Sliders" },
  { id: "pasta", name: "Pasta" },
  { id: "cold-beverages", name: "Cold Coffee & Lattes" },
  { id: "hot-beverages", name: "Hot Coffee & Teas" },
  { id: "milkshakes", name: "Milkshakes" },
  { id: "garlic-bread", name: "Garlic Bread" },
  { id: "cuban-sandwiches", name: "Grill / Cuban Toast" },
  { id: "smoothies", name: "Smoothies" },
  { id: "special-brews", name: "Special Brews & Cortado" },
  { id: "grab-and-go", name: "Grab & Go Snacks" },
  { id: "nachos", name: "Nachos" },
  { id: "hot-chocolate", name: "Hot Chocolate" },
  { id: "iced-tea", name: "Iced Tea" }
];

export const SIGNATURE_PICKS = [
  {
    id: "pick-pizza",
    name: "Margherita Pizza",
    category: "pizzas",
    pricingDisplay: "₹129 (6\") | ₹149 (8\") | ₹229 (10\")",
    variants: [
      { label: "6 Inch", price: 129 },
      { label: "8 Inch", price: 149 },
      { label: "10 Inch", price: 229 }
    ],
    description: "Classic Italian marinara sauce, bubbling fresh mozzarella cheese blend, and fragrant basil leaves on stone-baked crust.",
    isVeg: true,
    image: "/assets/food/duplex-margherita-pizza.jpg",
    tag: "Stone-Baked Signature"
  },
  {
    id: "pick-wrap",
    name: "Chicken Jalfrezi Wrap",
    category: "wraps",
    pricingDisplay: "₹99",
    price: 99,
    description: "Spiced grilled chicken chunks, sautéed bell peppers, onions, and house special sauce wrapped in toasted flatbread.",
    isVeg: false,
    image: "/assets/food/duplex-jalfrezi-wrap.jpg",
    tag: "House Favourite"
  },
  {
    id: "pick-mojito",
    name: "Blue Ocean Mojito",
    category: "mojitos-coolers",
    pricingDisplay: "₹160",
    price: 160,
    description: "Vibrant tropical blue curacao layered with sparkling soda, freshly muddled mint leaves, lime wheel, and crushed ice.",
    isVeg: true,
    image: "/assets/food/duplex-blue-ocean-mojito.jpg",
    tag: "Barista Special"
  },
  {
    id: "pick-fries",
    name: "Peri Peri Cheesy Fries",
    category: "fries",
    pricingDisplay: "₹79",
    price: 79,
    description: "Crispy golden french fries dusted with fiery African peri-peri spices and smothered in warm melted cheese sauce.",
    isVeg: true,
    image: "/assets/food/duplex-peri-peri-fries.jpg",
    tag: "Crowd Favourite"
  }
];

export const MENU_ITEMS = [
  // PIZZAS (6" / 8" / 10" sizes)
  {
    id: "pz-1",
    name: "Margherita Pizza",
    category: "pizzas",
    pricingDisplay: "₹129 (6\") | ₹149 (8\") | ₹229 (10\")",
    variants: [{ label: "6 Inch", price: 129 }, { label: "8 Inch", price: 149 }, { label: "10 Inch", price: 229 }],
    description: "Classic Italian marinara sauce, fresh mozzarella cheese blend, and basil.",
    isVeg: true,
    popular: true,
    image: "/assets/food/duplex-margherita-pizza.jpg"
  },
  {
    id: "pz-2",
    name: "Chicken Loaded Pizza",
    category: "pizzas",
    pricingDisplay: "₹179 (6\") | ₹199 (8\") | ₹269 (10\")",
    variants: [{ label: "6 Inch", price: 179 }, { label: "8 Inch", price: 199 }, { label: "10 Inch", price: 269 }],
    description: "Loaded with double marinated chicken chunks, bell peppers, and mozzarella.",
    isVeg: false,
    popular: true,
    image: null
  },
  {
    id: "pz-3",
    name: "Paneer Tikka Pizza",
    category: "pizzas",
    pricingDisplay: "₹169 (6\") | ₹199 (8\") | ₹249 (10\")",
    variants: [{ label: "6 Inch", price: 169 }, { label: "8 Inch", price: 199 }, { label: "10 Inch", price: 249 }],
    description: "Tandoori spiced paneer cubes, crunchy capsicum, red onion, and mozzarella.",
    isVeg: true,
    image: null
  },
  {
    id: "pz-4",
    name: "Chicken BBQ Pizza",
    category: "pizzas",
    pricingDisplay: "₹169 (6\") | ₹199 (8\") | ₹249 (10\")",
    variants: [{ label: "6 Inch", price: 169 }, { label: "8 Inch", price: 199 }, { label: "10 Inch", price: 249 }],
    description: "Smoky sweet BBQ shredded chicken with caramelized red onions and cheese.",
    isVeg: false,
    image: null
  },
  {
    id: "pz-5",
    name: "Chicken Tikka Pizza",
    category: "pizzas",
    pricingDisplay: "₹169 (6\") | ₹199 (8\") | ₹249 (10\")",
    variants: [{ label: "6 Inch", price: 169 }, { label: "8 Inch", price: 199 }, { label: "10 Inch", price: 249 }],
    description: "Char-grilled spiced chicken tikka morsels on golden crust with mozzarella.",
    isVeg: false,
    image: null
  },
  {
    id: "pz-6",
    name: "Chicken Fusion Pizza",
    category: "pizzas",
    pricingDisplay: "₹139 (6\") | ₹169 (8\") | ₹249 (10\")",
    variants: [{ label: "6 Inch", price: 139 }, { label: "8 Inch", price: 169 }, { label: "10 Inch", price: 249 }],
    description: "Fusion herbs, tender chicken cubes, and house special spicy sauce.",
    isVeg: false,
    image: null
  },
  {
    id: "pz-7",
    name: "Farm House Pizza",
    category: "pizzas",
    pricingDisplay: "₹139 (6\") | ₹169 (8\") | ₹249 (10\")",
    variants: [{ label: "6 Inch", price: 139 }, { label: "8 Inch", price: 169 }, { label: "10 Inch", price: 249 }],
    description: "Fresh mushrooms, sweet corn, bell peppers, tomatoes, and melted cheese.",
    isVeg: true,
    image: null
  },
  {
    id: "pz-8",
    name: "Duplex Veggie Pizza",
    category: "pizzas",
    pricingDisplay: "₹139 (6\") | ₹169 (8\") | ₹219 (10\")",
    variants: [{ label: "6 Inch", price: 139 }, { label: "8 Inch", price: 169 }, { label: "10 Inch", price: 219 }],
    description: "House signature veggie mix, olives, jalapeños, and premium mozzarella.",
    isVeg: true,
    image: null
  },
  {
    id: "pz-9",
    name: "Queens Garden Pizza",
    category: "pizzas",
    pricingDisplay: "₹139 (6\") | ₹169 (8\") | ₹249 (10\")",
    variants: [{ label: "6 Inch", price: 139 }, { label: "8 Inch", price: 169 }, { label: "10 Inch", price: 249 }],
    description: "A garden bounty of crisp vegetables, Italian seasoning, and rich cheese.",
    isVeg: true,
    image: null
  },

  // WRAPS
  {
    id: "wr-1",
    name: "Chicken Jalfrezi Wrap",
    category: "wraps",
    pricingDisplay: "₹99",
    price: 99,
    description: "Spiced grilled chicken, sautéed bell peppers, onions, and house sauce wrapped in toasted flatbread.",
    isVeg: false,
    popular: true,
    image: "/assets/food/duplex-jalfrezi-wrap.jpg"
  },
  {
    id: "wr-2",
    name: "BBQ Bliss Wrap",
    category: "wraps",
    pricingDisplay: "₹109",
    price: 109,
    description: "Smoky BBQ filling with crunchy vegetables and creamy spread.",
    isVeg: true,
    image: null
  },
  {
    id: "wr-3",
    name: "Cheesy Chicken Wrap",
    category: "wraps",
    pricingDisplay: "₹119",
    price: 119,
    description: "Tender seasoned chicken breast and molten cheese in a toasted wrap.",
    isVeg: false,
    popular: true,
    image: null
  },
  {
    id: "wr-4",
    name: "Peri Peri Power Wrap",
    category: "wraps",
    pricingDisplay: "₹109",
    price: 109,
    description: "Fiery peri-peri marinated fillings with fresh lettuce and garlic dip.",
    isVeg: true,
    image: null
  },
  {
    id: "wr-5",
    name: "The Duplex Signature Wrap",
    category: "wraps",
    pricingDisplay: "₹129",
    price: 129,
    description: "Chef's signature combination roll loaded with cheese, grilled fillings, and house secret sauce.",
    isVeg: true,
    popular: true,
    image: null
  },

  // MOJITOS & COOLERS
  {
    id: "mc-1",
    name: "Classic Mojito",
    category: "mojitos-coolers",
    pricingDisplay: "₹150",
    price: 150,
    description: "Muddled fresh mint leaves, lime wedges, simple syrup, and sparkling soda.",
    isVeg: true,
    image: null
  },
  {
    id: "mc-2",
    name: "Blue Ocean Mojito",
    category: "mojitos-coolers",
    pricingDisplay: "₹160",
    price: 160,
    description: "Vibrant tropical blue curacao with sparkling soda, mint, lime, and crushed ice.",
    isVeg: true,
    popular: true,
    image: "/assets/food/duplex-blue-ocean-mojito.jpg"
  },
  {
    id: "mc-2b",
    name: "Watermelon / Green Apple Mojito",
    category: "mojitos-coolers",
    pricingDisplay: "₹160",
    price: 160,
    description: "Refreshing watermelon or green apple sparkling mojito over crushed ice.",
    isVeg: true,
    image: null
  },
  {
    id: "mc-3",
    name: "Coolers (Lovely Lemonade / Exotica / Tropical Sunset)",
    category: "mojitos-coolers",
    pricingDisplay: "₹140 – ₹160",
    price: 140,
    description: "Refreshing layered fruit chillers and sparkling lemonades.",
    isVeg: true,
    image: null
  },
  {
    id: "mc-4",
    name: "Coco Pine Bliss",
    category: "mojitos-coolers",
    pricingDisplay: "₹180",
    price: 180,
    description: "Tropical blend of coconut cream, pineapple juice, and crushed ice.",
    isVeg: true,
    image: null
  },

  // FRIES & PLATTERS
  {
    id: "fr-1",
    name: "Classic Fries",
    category: "fries",
    pricingDisplay: "₹69",
    price: 69,
    description: "Crispy golden salted potato french fries.",
    isVeg: true,
    image: null
  },
  {
    id: "fr-2",
    name: "Peri Peri Fries",
    category: "fries",
    pricingDisplay: "₹79",
    price: 79,
    description: "Golden fries generously dusted with spicy tangy African peri-peri seasoning and cheese.",
    isVeg: true,
    popular: true,
    image: "/assets/food/duplex-peri-peri-fries.jpg"
  },
  {
    id: "fr-3",
    name: "Cheesy Fries",
    category: "fries",
    pricingDisplay: "₹89",
    price: 89,
    description: "Hot crisp fries smothered in warm molten cheese sauce.",
    isVeg: true,
    popular: true,
    image: null
  },
  {
    id: "fr-4",
    name: "Loaded Fries",
    category: "fries",
    pricingDisplay: "₹99",
    price: 99,
    description: "Crispy fries loaded with cheese sauce, jalapenos, and spicy sauces.",
    isVeg: true,
    image: null
  },
  {
    id: "fr-5",
    name: "Barbeque Fries",
    category: "fries",
    pricingDisplay: "₹89",
    price: 89,
    description: "Crisp french fries drizzled with smoky barbecue glaze.",
    isVeg: true,
    image: null
  },
  {
    id: "fr-6",
    name: "Spicy Lemon Fries / Masala Fries",
    category: "fries",
    pricingDisplay: "₹79",
    price: 79,
    description: "Zesty chatpata masala tossed fries with a twist of fresh lemon.",
    isVeg: true,
    image: null
  },
  {
    id: "fr-7",
    name: "Chicken & Fiery Fries Platter",
    category: "fries",
    pricingDisplay: "₹239",
    price: 239,
    description: "Huge sharing platter with crispy fries, spicy chicken chunks, and dual dipping sauces.",
    isVeg: false,
    popular: true,
    image: null
  },

  // MOMOS (Steam / Fry variants)
  {
    id: "mo-1",
    name: "Chicken Cheese Momos",
    category: "momos",
    pricingDisplay: "₹119 (Steam) / ₹139 (Fry)",
    variants: [{ label: "Steam", price: 119 }, { label: "Fry", price: 139 }],
    description: "Handcrafted dumplings filled with seasoned juicy minced chicken and gooey cheese.",
    isVeg: false,
    popular: true,
    image: null
  },
  {
    id: "mo-2",
    name: "Chicken Momos",
    category: "momos",
    pricingDisplay: "₹109 (Steam) / ₹129 (Fry)",
    variants: [{ label: "Steam", price: 109 }, { label: "Fry", price: 129 }],
    description: "Authentic Himalayan style minced chicken dumplings served with spicy garlic schezwan chutney.",
    isVeg: false,
    image: null
  },
  {
    id: "mo-3",
    name: "Mix Veg Momos",
    category: "momos",
    pricingDisplay: "₹99 (Steam) / ₹119 (Fry)",
    variants: [{ label: "Steam", price: 99 }, { label: "Fry", price: 119 }],
    description: "Finely diced farm veggies, cabbage, and herbs wrapped in thin delicate dough.",
    isVeg: true,
    image: null
  },
  {
    id: "mo-4",
    name: "Paneer Momos",
    category: "momos",
    pricingDisplay: "₹109 (Steam) / ₹129 (Fry)",
    variants: [{ label: "Steam", price: 109 }, { label: "Fry", price: 129 }],
    description: "Soft marinated paneer cubes and mild spices rolled in handmade wrappers.",
    isVeg: true,
    image: null
  },
  {
    id: "mo-5",
    name: "Chicken Peri Peri Momos",
    category: "momos",
    pricingDisplay: "₹119 (Steam) / ₹139 (Fry)",
    variants: [{ label: "Steam", price: 119 }, { label: "Fry", price: 139 }],
    description: "Seasoned chicken momos dusted with fiery African peri-peri spices.",
    isVeg: false,
    image: null
  },
  {
    id: "mo-6",
    name: "Corn & Cheese Kurkure Momos (Fry Only)",
    category: "momos",
    pricingDisplay: "₹139",
    price: 139,
    description: "Super crunchy cornflake crust with sweet corn and melted cheese filling.",
    isVeg: true,
    image: null
  },
  {
    id: "mo-7",
    name: "Chicken Kurkure Momos (Fry Only)",
    category: "momos",
    pricingDisplay: "₹139",
    price: 139,
    description: "Extra crispy cornflake-crusted chicken momos fried to golden perfection.",
    isVeg: false,
    popular: true,
    image: null
  },

  // BURGERS & SLIDERS
  {
    id: "bg-1",
    name: "Crispy Veg Burger",
    category: "burgers",
    pricingDisplay: "₹89",
    price: 89,
    description: "Golden fried seasoned veggie patty with crunchy lettuce, sliced onions, and mayo in a toasted sesame bun.",
    isVeg: true,
    image: null
  },
  {
    id: "bg-2",
    name: "Crispy Chicken Burger",
    category: "burgers",
    pricingDisplay: "₹129",
    price: 129,
    description: "Crispy fried chicken breast fillet with creamy garlic aioli, tomato, and fresh lettuce.",
    isVeg: false,
    popular: true,
    image: null
  },
  {
    id: "bg-3",
    name: "Smashed Cheesy Chicken Burger",
    category: "burgers",
    pricingDisplay: "₹209",
    price: 209,
    description: "Double seasoned chicken patty smashed on the grill, smothered in melted cheddar cheese and house secret glaze.",
    isVeg: false,
    popular: true,
    image: null
  },
  {
    id: "bg-4",
    name: "Crispy Paneer Burger",
    category: "burgers",
    pricingDisplay: "₹179",
    price: 179,
    description: "Spicy crumbed paneer steak with tandoori mayo, caramelized onions, and crisp greens.",
    isVeg: true,
    image: null
  },

  // PASTA (Veg / Non-Veg options)
  {
    id: "ps-1",
    name: "Alfredo Pasta",
    category: "pasta",
    pricingDisplay: "₹139 (Veg) | ₹159 (Non-Veg)",
    variants: [{ label: "Veg", price: 139 }, { label: "Non-Veg", price: 159 }],
    description: "Penne pasta in rich parmesan cheese cream sauce with garlic and Italian herbs.",
    isVeg: true,
    popular: true,
    image: null
  },
  {
    id: "ps-2",
    name: "Pink Sauce Pasta",
    category: "pasta",
    pricingDisplay: "₹150 (Veg) | ₹170 (Non-Veg)",
    variants: [{ label: "Veg", price: 150 }, { label: "Non-Veg", price: 170 }],
    description: "Harmonious blend of tangy red arrabiata sauce and velvety white alfredo sauce.",
    isVeg: true,
    image: null
  },
  {
    id: "ps-3",
    name: "Arabiata Pasta",
    category: "pasta",
    pricingDisplay: "₹200 (Veg) | ₹220 (Non-Veg)",
    variants: [{ label: "Veg", price: 200 }, { label: "Non-Veg", price: 220 }],
    description: "Penne tossed in spicy garlic tomato marinara with chili flakes and black olives.",
    isVeg: true,
    image: null
  },
  {
    id: "ps-4",
    name: "Pesto Pasta",
    category: "pasta",
    pricingDisplay: "₹209 (Veg) | ₹229 (Non-Veg)",
    variants: [{ label: "Veg", price: 209 }, { label: "Non-Veg", price: 229 }],
    description: "Fragrant basil pesto sauce tossed with extra virgin olive oil and parmesan.",
    isVeg: true,
    image: null
  },
  {
    id: "ps-5",
    name: "Duplex Special Pasta",
    category: "pasta",
    pricingDisplay: "₹249 (Veg) | ₹269 (Non-Veg)",
    variants: [{ label: "Veg", price: 249 }, { label: "Non-Veg", price: 269 }],
    description: "Chef's signature multi-cheese baked pasta loaded with special seasonings.",
    isVeg: true,
    popular: true,
    image: null
  },

  // GARLIC BREAD
  {
    id: "gb-1",
    name: "Classic Garlic Bread",
    category: "garlic-bread",
    pricingDisplay: "₹59",
    price: 59,
    description: "Toasted baguette slices brushed with fragrant garlic butter and roasted Italian herbs.",
    isVeg: true,
    image: null
  },
  {
    id: "gb-2",
    name: "Cheese Garlic Bread",
    category: "garlic-bread",
    pricingDisplay: "₹79",
    price: 79,
    description: "Toasted garlic bread baked with bubbling melted mozzarella and herbs.",
    isVeg: true,
    popular: true,
    image: null
  },
  {
    id: "gb-3",
    name: "Cheese & Pepper Garlic Bread",
    category: "garlic-bread",
    pricingDisplay: "₹89",
    price: 89,
    description: "Melted cheese toast topped with crushed black pepper and bell peppers.",
    isVeg: true,
    image: null
  },
  {
    id: "gb-4",
    name: "Sizzler Chicken Garlic Bread",
    category: "garlic-bread",
    pricingDisplay: "₹119",
    price: 119,
    description: "Toasted garlic baguette topped with spiced chicken chunks and melted mozzarella.",
    isVeg: false,
    image: null
  },
  {
    id: "gb-5",
    name: "Duplex Special Garlic Bread",
    category: "garlic-bread",
    pricingDisplay: "₹129",
    price: 129,
    description: "Signature loaded garlic bread with three cheeses, jalapeños, sweet corn, and chili oil.",
    isVeg: true,
    popular: true,
    image: null
  },

  // GRILL / TOAST CUBAN & SANDWICHES
  {
    id: "cb-1",
    name: "Classic Veggie Cuban",
    category: "cuban-sandwiches",
    pricingDisplay: "₹89",
    price: 89,
    description: "Crispy grilled Cuban toast stuffed with seasoned vegetables, cheese, and spicy mayo.",
    isVeg: true,
    image: null
  },
  {
    id: "cb-2",
    name: "Smoky Chicken Cuban",
    category: "cuban-sandwiches",
    pricingDisplay: "₹129",
    price: 129,
    description: "Grilled Cuban bread layered with smoked spiced chicken and melted cheese.",
    isVeg: false,
    popular: true,
    image: null
  },
  {
    id: "cb-3",
    name: "Cheesy Chicken Cuban",
    category: "cuban-sandwiches",
    pricingDisplay: "₹189",
    price: 189,
    description: "Double cheese and loaded chicken filling pressed till golden crisp.",
    isVeg: false,
    image: null
  },
  {
    id: "cb-4",
    name: "Fiery Paneer Cuban",
    category: "cuban-sandwiches",
    pricingDisplay: "₹160",
    price: 160,
    description: "Spicy marinated cottage cheese with capsicum, onions, and molten cheese.",
    isVeg: true,
    image: null
  },
  {
    id: "cb-5",
    name: "Masala Toast Sandwich",
    category: "cuban-sandwiches",
    pricingDisplay: "₹69",
    price: 69,
    description: "Traditional Bombay spiced potato masala toasted with butter and mint chutney.",
    isVeg: true,
    image: null
  },
  {
    id: "cb-6",
    name: "Masala Cheese Sandwich",
    category: "cuban-sandwiches",
    pricingDisplay: "₹79",
    price: 79,
    description: "Spicy potato masala sandwich loaded with grated cheese and grilled.",
    isVeg: true,
    image: null
  },

  // GRAB & GO
  {
    id: "gg-1",
    name: "Seasoned Potato Wedges",
    category: "grab-and-go",
    pricingDisplay: "₹69",
    price: 69,
    description: "Crispy thick-cut herb seasoned potato wedges with dip.",
    isVeg: true,
    image: null
  },
  {
    id: "gg-2",
    name: "Classic Veg Nuggets",
    category: "grab-and-go",
    pricingDisplay: "₹69",
    price: 69,
    description: "Golden crispy breaded vegetable nuggets.",
    isVeg: true,
    image: null
  },
  {
    id: "gg-3",
    name: "Chicken Nuggets",
    category: "grab-and-go",
    pricingDisplay: "₹99",
    price: 99,
    description: "Crispy battered tender chicken nuggets served with ketchup.",
    isVeg: false,
    image: null
  },
  {
    id: "gg-4",
    name: "Peri Peri Chicken Pops",
    category: "grab-and-go",
    pricingDisplay: "₹120",
    price: 120,
    description: "Bite-sized crispy chicken pops dusted in fiery peri peri.",
    isVeg: false,
    popular: true,
    image: null
  },
  {
    id: "gg-4b",
    name: "Chicken Strips",
    category: "grab-and-go",
    pricingDisplay: "₹120",
    price: 120,
    description: "Tender crispy seasoned chicken fillet strips with dipping sauce.",
    isVeg: false,
    image: null
  },
  {
    id: "gg-5",
    name: "Cheese Triangle",
    category: "grab-and-go",
    pricingDisplay: "₹120",
    price: 120,
    description: "Molten cheesy crumbed triangles fried to golden crunch.",
    isVeg: true,
    image: null
  },

  // NACHOS
  {
    id: "nc-1",
    name: "Crunchy Nachos with Zesty Salsa",
    category: "nachos",
    pricingDisplay: "₹99",
    price: 99,
    description: "Corn tortilla chips served with fresh Mexican tomato salsa.",
    isVeg: true,
    image: null
  },
  {
    id: "nc-2",
    name: "Chips and Dips (with Salsa & Dip)",
    category: "nachos",
    pricingDisplay: "₹119",
    price: 119,
    description: "Crisp nachos paired with both tangy salsa and garlic mayo dip.",
    isVeg: true,
    image: null
  },
  {
    id: "nc-3",
    name: "Cheesy Nachos",
    category: "nachos",
    pricingDisplay: "₹139",
    price: 139,
    description: "Loaded warm tortilla chips baked with liquid cheese and jalapeños.",
    isVeg: true,
    popular: true,
    image: null
  },

  // COLD BEVERAGES
  {
    id: "cbv-1",
    name: "Spanish Iced Latte",
    category: "cold-beverages",
    pricingDisplay: "₹190",
    price: 190,
    description: "Espresso with sweetened condensed milk and cold whole milk over ice.",
    isVeg: true,
    popular: true,
    image: null
  },
  {
    id: "cbv-2",
    name: "Iced Latte",
    category: "cold-beverages",
    pricingDisplay: "₹160",
    price: 160,
    description: "Chilled milk and espresso poured over clear ice cubes.",
    isVeg: true,
    image: null
  },
  {
    id: "cbv-3",
    name: "Flavoured Iced Latte",
    category: "cold-beverages",
    pricingDisplay: "₹180",
    price: 180,
    description: "Choice of Vanilla, Hazelnut, Roasted Hazelnut, Tiramisu, or Irish flavour.",
    isVeg: true,
    image: null
  },
  {
    id: "cbv-4",
    name: "Iced Americano",
    category: "cold-beverages",
    pricingDisplay: "₹140",
    price: 140,
    description: "Double espresso shot diluted with crisp iced water.",
    isVeg: true,
    image: null
  },
  {
    id: "cbv-5",
    name: "Iced Espresso",
    category: "cold-beverages",
    pricingDisplay: "₹130",
    price: 130,
    description: "Bold concentrated double espresso served over ice.",
    isVeg: true,
    image: null
  },
  {
    id: "cbv-6",
    name: "Cold Mocha",
    category: "cold-beverages",
    pricingDisplay: "₹190",
    price: 190,
    description: "Rich dark chocolate blended with cold espresso and chilled milk.",
    isVeg: true,
    image: null
  },
  {
    id: "cbv-7",
    name: "Coffee Tonic (Classic / Flavoured)",
    category: "cold-beverages",
    pricingDisplay: "₹170 – ₹190",
    price: 170,
    description: "Sparkling tonic water topped with espresso (Classic ₹170 / Flavoured ₹190).",
    isVeg: true,
    image: null
  },

  // HOT BEVERAGES
  {
    id: "hb-1",
    name: "Cappuccino",
    category: "hot-beverages",
    pricingDisplay: "₹150",
    price: 150,
    description: "Freshly brewed espresso with steamed milk and dense velvety froth.",
    isVeg: true,
    popular: true,
    image: null
  },
  {
    id: "hb-2",
    name: "Latte",
    category: "hot-beverages",
    pricingDisplay: "₹150",
    price: 150,
    description: "Silky steamed milk poured over a fresh shot of espresso.",
    isVeg: true,
    image: null
  },
  {
    id: "hb-3",
    name: "Flat White",
    category: "hot-beverages",
    pricingDisplay: "₹150",
    price: 150,
    description: "Double ristretto espresso topped with velvety micro-foam.",
    isVeg: true,
    image: null
  },
  {
    id: "hb-4",
    name: "Hot Mocha",
    category: "hot-beverages",
    pricingDisplay: "₹160",
    price: 160,
    description: "Rich dark cocoa melted with espresso and steamed milk.",
    isVeg: true,
    image: null
  },
  {
    id: "hb-5",
    name: "Expresso",
    category: "hot-beverages",
    pricingDisplay: "₹110",
    price: 110,
    description: "Intense single espresso shot extracted under high pressure.",
    isVeg: true,
    image: null
  },
  {
    id: "hb-6",
    name: "Americano",
    category: "hot-beverages",
    pricingDisplay: "₹120",
    price: 120,
    description: "Espresso diluted with piping hot filtered water.",
    isVeg: true,
    image: null
  },
  {
    id: "hb-7",
    name: "Masala Chai",
    category: "hot-beverages",
    pricingDisplay: "₹120",
    price: 120,
    description: "Traditional aromatic spiced tea infused with fragrant herbs and milk.",
    isVeg: true,
    image: null
  },
  {
    id: "hb-8",
    name: "Green Tea",
    category: "hot-beverages",
    pricingDisplay: "₹110",
    price: 110,
    description: "Soothing antioxidant green tea brewed fresh.",
    isVeg: true,
    image: null
  },

  // MILKSHAKES
  {
    id: "ms-1",
    name: "Biscoff Milkshake",
    category: "milkshakes",
    pricingDisplay: "₹210",
    price: 210,
    description: "Decadent thick shake whipped with Lotus Biscoff spread and biscuit crumbs.",
    isVeg: true,
    popular: true,
    image: null
  },
  {
    id: "ms-2",
    name: "Cookie & Crumbs",
    category: "milkshakes",
    pricingDisplay: "₹210",
    price: 210,
    description: "Crushed chocolate cookies blended with rich vanilla ice cream.",
    isVeg: true,
    image: null
  },
  {
    id: "ms-3",
    name: "Chocolate Milkshake",
    category: "milkshakes",
    pricingDisplay: "₹190",
    price: 190,
    description: "Classic rich cocoa chocolate shake with chocolate fudge drizzle.",
    isVeg: true,
    image: null
  },
  {
    id: "ms-4",
    name: "Mango Milkshake / Coco-Mango-Mint",
    category: "milkshakes",
    pricingDisplay: "₹190",
    price: 190,
    description: "Sweet mango pulp blended with chilled whole milk and fresh hints of mint.",
    isVeg: true,
    image: null
  },
  {
    id: "ms-5",
    name: "Duplex Special Milkshake",
    category: "milkshakes",
    pricingDisplay: "₹230",
    price: 230,
    description: "The ultimate house signature triple blend with nuts, chocolate fudge, and toppings.",
    isVeg: true,
    popular: true,
    image: null
  },

  // SPECIAL BREWS & CORTADO
  {
    id: "sb-1",
    name: "Classic Cortado",
    category: "special-brews",
    pricingDisplay: "₹140",
    price: 140,
    description: "Equal parts bold espresso cut with warm steamed silky milk in a small glass.",
    isVeg: true,
    image: null
  },
  {
    id: "sb-2",
    name: "Nutty / Hazelnut Cortado",
    category: "special-brews",
    pricingDisplay: "₹150",
    price: 150,
    description: "Cortado infused with roasted hazelnut or praline essence.",
    isVeg: true,
    image: null
  },

  // SMOOTHIES
  {
    id: "sm-1",
    name: "Berry Blast Smoothie",
    category: "smoothies",
    pricingDisplay: "₹200",
    price: 200,
    description: "Wild berries blended with thick creamy yogurt.",
    isVeg: true,
    popular: true,
    image: null
  },
  {
    id: "sm-2",
    name: "Mango / Strawberry Smoothie",
    category: "smoothies",
    pricingDisplay: "₹190",
    price: 190,
    description: "Chilled fruit yogurt smoothie with real fruit puree.",
    isVeg: true,
    image: null
  },

  // HOT CHOCOLATE
  {
    id: "hc-1",
    name: "Classic Hot Chocolate",
    category: "hot-chocolate",
    pricingDisplay: "₹150",
    price: 150,
    description: "Warm velvety cocoa melted into steamed whole milk.",
    isVeg: true,
    image: null
  },
  {
    id: "hc-2",
    name: "Hazelnut Hot Chocolate",
    category: "hot-chocolate",
    pricingDisplay: "₹170",
    price: 170,
    description: "Rich hot chocolate infused with nutty roasted hazelnut.",
    isVeg: true,
    image: null
  },
  {
    id: "hc-3",
    name: "Hot Chocolate & Topped Marshmallow",
    category: "hot-chocolate",
    pricingDisplay: "₹180",
    price: 180,
    description: "Thick hot chocolate crowned with fluffy toasted marshmallows.",
    isVeg: true,
    popular: true,
    image: null
  },

  // ICED TEA
  {
    id: "it-1",
    name: "Lemon Iced Tea",
    category: "iced-tea",
    pricingDisplay: "₹130",
    price: 130,
    description: "Chilled black tea infused with fresh citrus lemon and mint.",
    isVeg: true,
    image: null
  },
  {
    id: "it-2",
    name: "Peached Iced Tea",
    category: "iced-tea",
    pricingDisplay: "₹140",
    price: 140,
    description: "Sweet delicate white peach infused iced black tea.",
    isVeg: true,
    image: null
  }
];
