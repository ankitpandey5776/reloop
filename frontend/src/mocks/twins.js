export const MOCK_TWINS = [
  // ACTIVE (3)
  {
    twin_id: "twin-001",
    item: { sku: "SKU-SAM-M34", title: "Samsung Galaxy M34 5G (128GB)", category: "electronics", original_price: 15999, purchase_date: "2026-06-01T00:00:00Z", image_url: "https://m.media-amazon.com/images/I/71NybWDVrBL._SY355_.jpg" },
    customer: { customer_id: "cust-001", pincode: "400001", name: "Rahul Sharma" },
    state: "ACTIVE",
    prevention: { risk_score: 0.45, risk_factors: [], nudge_shown: false, nudge_type: "none", prevented: false },
    grading: null, valuation: null, routing: null,
    credits: { earned: 0, action: null, lifetime_credits: 350 },
    created_at: "2026-06-01T10:00:00Z", updated_at: "2026-06-01T10:00:00Z"
  },
  {
    twin_id: "twin-002",
    item: { sku: "SKU-ALLEN-SHIRT", title: "Allen Solly Men's Slim Fit Shirt (Size L)", category: "fashion", original_price: 1299, purchase_date: "2026-06-03T00:00:00Z", image_url: "https://m.media-amazon.com/images/I/81ib3x3M1QL._UY400_.jpg" },
    customer: { customer_id: "cust-001", pincode: "400001", name: "Rahul Sharma" },
    state: "ACTIVE",
    prevention: { risk_score: 0.87, risk_factors: ["size_bracketing", "high_return_category"], nudge_shown: true, nudge_type: "size_suggestion", prevented: false },
    grading: null, valuation: null, routing: null,
    credits: { earned: 0, action: null, lifetime_credits: 350 },
    created_at: "2026-06-03T10:00:00Z", updated_at: "2026-06-03T10:00:00Z"
  },
  {
    twin_id: "twin-003",
    item: { sku: "SKU-KINDLE-PW", title: "Kindle Paperwhite (16GB)", category: "electronics", original_price: 13999, purchase_date: "2026-06-05T00:00:00Z", image_url: "https://m.media-amazon.com/images/I/61bCiVJbCsL._SY355_.jpg" },
    customer: { customer_id: "cust-002", pincode: "560001", name: "Priya Menon" },
    state: "ACTIVE",
    prevention: { risk_score: 0.3, risk_factors: [], nudge_shown: false, nudge_type: "none", prevented: false },
    grading: null, valuation: null, routing: null,
    credits: { earned: 0, action: null, lifetime_credits: 120 },
    created_at: "2026-06-05T10:00:00Z", updated_at: "2026-06-05T10:00:00Z"
  },
  {
    twin_id: "twin-019",
    item: { sku: "SKU-NOISE-BUDS", title: "Noise Buds VS104 TWS Earbuds", category: "electronics", original_price: 1199, purchase_date: "2026-06-06T00:00:00Z", image_url: null },
    customer: { customer_id: "cust-001", pincode: "400001", name: "Rahul Sharma" },
    state: "ACTIVE",
    prevention: { risk_score: 0.42, risk_factors: ["high_return_category"], nudge_shown: false, nudge_type: "none", prevented: false },
    grading: null, valuation: null, routing: null,
    credits: { earned: 0, action: null, lifetime_credits: 350 },
    created_at: "2026-06-06T10:00:00Z", updated_at: "2026-06-06T10:00:00Z"
  },
  {
    twin_id: "twin-020",
    item: { sku: "SKU-HRX-JACKET", title: "HRX Men's Hooded Sweatshirt (Size M)", category: "fashion", original_price: 1799, purchase_date: "2026-06-07T00:00:00Z", image_url: null },
    customer: { customer_id: "cust-002", pincode: "560001", name: "Priya Menon" },
    state: "ACTIVE",
    prevention: { risk_score: 0.78, risk_factors: ["size_bracketing", "high_return_category"], nudge_shown: true, nudge_type: "size_suggestion", prevented: false },
    grading: null, valuation: null, routing: null,
    credits: { earned: 0, action: null, lifetime_credits: 120 },
    created_at: "2026-06-07T10:00:00Z", updated_at: "2026-06-07T10:00:00Z"
  },
  {
    twin_id: "twin-021",
    item: { sku: "SKU-INSTANT-POT", title: "Wonderchef Nutri-Blend Mixer", category: "home", original_price: 2899, purchase_date: "2026-06-08T00:00:00Z", image_url: null },
    customer: { customer_id: "cust-003", pincode: "110001", name: "Amit Verma" },
    state: "ACTIVE",
    prevention: { risk_score: 0.33, risk_factors: [], nudge_shown: false, nudge_type: "none", prevented: false },
    grading: null, valuation: null, routing: null,
    credits: { earned: 0, action: null, lifetime_credits: 80 },
    created_at: "2026-06-08T10:00:00Z", updated_at: "2026-06-08T10:00:00Z"
  },
  {
    twin_id: "twin-022",
    item: { sku: "SKU-PSYCHOLOGY-MONEY", title: "The Psychology of Money by Morgan Housel", category: "books", original_price: 399, purchase_date: "2026-06-09T00:00:00Z", image_url: null },
    customer: { customer_id: "cust-004", pincode: "700001", name: "Sunita Das" },
    state: "ACTIVE",
    prevention: { risk_score: 0.22, risk_factors: [], nudge_shown: false, nudge_type: "none", prevented: false },
    grading: null, valuation: null, routing: null,
    credits: { earned: 0, action: null, lifetime_credits: 200 },
    created_at: "2026-06-09T10:00:00Z", updated_at: "2026-06-09T10:00:00Z"
  },
  {
    twin_id: "twin-023",
    item: { sku: "SKU-BOAT-ROCKERZ", title: "boAt Rockerz 450 Bluetooth Headphones", category: "electronics", original_price: 1499, purchase_date: "2026-06-10T00:00:00Z", image_url: null },
    customer: { customer_id: "cust-005", pincode: "711101", name: "Deepak Roy" },
    state: "ACTIVE",
    prevention: { risk_score: 0.51, risk_factors: ["high_return_category"], nudge_shown: false, nudge_type: "none", prevented: false },
    grading: null, valuation: null, routing: null,
    credits: { earned: 0, action: null, lifetime_credits: 50 },
    created_at: "2026-06-10T10:00:00Z", updated_at: "2026-06-10T10:00:00Z"
  },
  {
    twin_id: "twin-024",
    item: { sku: "SKU-ADIDAS-TEE", title: "Adidas Men's Training T-Shirt (Size L)", category: "fashion", original_price: 1399, purchase_date: "2026-06-11T00:00:00Z", image_url: null },
    customer: { customer_id: "cust-001", pincode: "400001", name: "Rahul Sharma" },
    state: "ACTIVE",
    prevention: { risk_score: 0.69, risk_factors: ["size_bracketing", "high_return_category"], nudge_shown: true, nudge_type: "fit_predictor", prevented: false },
    grading: null, valuation: null, routing: null,
    credits: { earned: 0, action: null, lifetime_credits: 350 },
    created_at: "2026-06-11T10:00:00Z", updated_at: "2026-06-11T10:00:00Z"
  },
  // RETURN_INTENT (2)
  {
    twin_id: "twin-004",
    item: { sku: "SKU-NIKE-REV6", title: "Nike Revolution 6 Running Shoes (UK 9)", category: "fashion", original_price: 3695, purchase_date: "2026-05-25T00:00:00Z", image_url: "https://m.media-amazon.com/images/I/71K96V+b5uL._UY400_.jpg" },
    customer: { customer_id: "cust-002", pincode: "560001", name: "Priya Menon" },
    state: "RETURN_INTENT",
    prevention: { risk_score: 0.72, risk_factors: ["high_return_category", "review_fit_warnings"], nudge_shown: true, nudge_type: "fit_predictor", prevented: false },
    grading: null, valuation: null, routing: null,
    credits: { earned: 0, action: null, lifetime_credits: 120 },
    created_at: "2026-05-25T10:00:00Z", updated_at: "2026-06-08T09:00:00Z"
  },
  {
    twin_id: "twin-005",
    item: { sku: "SKU-BOAT-141", title: "boAt Airdopes 141 TWS", category: "electronics", original_price: 1299, purchase_date: "2026-05-28T00:00:00Z", image_url: "https://m.media-amazon.com/images/I/61mZDYMHkNL._SY355_.jpg" },
    customer: { customer_id: "cust-003", pincode: "110001", name: "Amit Verma" },
    state: "RETURN_INTENT",
    prevention: { risk_score: 0.55, risk_factors: ["high_return_category"], nudge_shown: false, nudge_type: "none", prevented: false },
    grading: null, valuation: null, routing: null,
    credits: { earned: 0, action: null, lifetime_credits: 80 },
    created_at: "2026-05-28T10:00:00Z", updated_at: "2026-06-09T11:00:00Z"
  },
  // GRADED (3)
  {
    twin_id: "twin-006",
    item: { sku: "SKU-FIRE-4K", title: "Fire TV Stick 4K Max", category: "electronics", original_price: 3999, purchase_date: "2026-05-20T00:00:00Z", image_url: "https://m.media-amazon.com/images/I/61WMEnwRa7L._SY355_.jpg" },
    customer: { customer_id: "cust-003", pincode: "110001", name: "Amit Verma" },
    state: "GRADED",
    prevention: { risk_score: 0.4, risk_factors: [], nudge_shown: false, nudge_type: "none", prevented: false },
    grading: {
      grade: "A", confidence: 0.94,
      defects: [],
      photo_urls: [],
      condition_report: "Item is in excellent condition with no visible defects. All accessories and original packaging are present. Functions perfectly as tested.",
      graded_at: "2026-06-10T14:30:00Z"
    },
    valuation: { resale_price: 3200, price_multiplier: 0.80, demand_factor: 1.1 },
    routing: null,
    credits: { earned: 0, action: null, lifetime_credits: 80 },
    created_at: "2026-05-20T10:00:00Z", updated_at: "2026-06-10T14:30:00Z"
  },
  {
    twin_id: "twin-007",
    item: { sku: "SKU-LEVIS-511", title: "Levi's 511 Slim Fit Jeans (32)", category: "fashion", original_price: 2999, purchase_date: "2026-05-18T00:00:00Z", image_url: "https://m.media-amazon.com/images/I/81e4JZG9DPL._UY400_.jpg" },
    customer: { customer_id: "cust-004", pincode: "700001", name: "Sunita Das" },
    state: "GRADED",
    prevention: { risk_score: 0.65, risk_factors: ["size_bracketing"], nudge_shown: true, nudge_type: "size_suggestion", prevented: false },
    grading: {
      grade: "B", confidence: 0.88,
      defects: [{ type: "scratch", location: "Back right pocket area", severity: "minor" }],
      photo_urls: [],
      condition_report: "Jeans are in good condition with minor surface wear on the back pocket area. No tears or significant damage. Washed and ready to wear.",
      graded_at: "2026-06-10T15:00:00Z"
    },
    valuation: { resale_price: 1800, price_multiplier: 0.60, demand_factor: 0.95 },
    routing: null,
    credits: { earned: 0, action: null, lifetime_credits: 200 },
    created_at: "2026-05-18T10:00:00Z", updated_at: "2026-06-10T15:00:00Z"
  },
  {
    twin_id: "twin-008",
    item: { sku: "SKU-PRESTIGE-IC", title: "Prestige Induction Cooktop", category: "home", original_price: 2499, purchase_date: "2026-05-15T00:00:00Z", image_url: null },
    customer: { customer_id: "cust-005", pincode: "711101", name: "Deepak Roy" },
    state: "GRADED",
    prevention: { risk_score: 0.35, risk_factors: [], nudge_shown: false, nudge_type: "none", prevented: false },
    grading: {
      grade: "C", confidence: 0.82,
      defects: [
        { type: "scratch", location: "Glass cooktop surface", severity: "moderate" },
        { type: "discoloration", location: "Side panel", severity: "minor" }
      ],
      photo_urls: [],
      condition_report: "Cooktop shows moderate usage with scratches on the glass surface. Heating elements work correctly. Side panel has minor discoloration from heat exposure.",
      graded_at: "2026-06-09T11:00:00Z"
    },
    valuation: { resale_price: 1100, price_multiplier: 0.44, demand_factor: 0.85 },
    routing: null,
    credits: { earned: 0, action: null, lifetime_credits: 50 },
    created_at: "2026-05-15T10:00:00Z", updated_at: "2026-06-09T11:00:00Z"
  },
  // ROUTED (3)
  {
    twin_id: "twin-009",
    item: { sku: "SKU-JBL-T230", title: "JBL Tune 230NC TWS", category: "electronics", original_price: 4999, purchase_date: "2026-05-10T00:00:00Z", image_url: null },
    customer: { customer_id: "cust-001", pincode: "400001", name: "Rahul Sharma" },
    state: "ROUTED",
    prevention: { risk_score: 0.5, risk_factors: [], nudge_shown: false, nudge_type: "none", prevented: false },
    grading: {
      grade: "A", confidence: 0.96,
      defects: [],
      photo_urls: [],
      condition_report: "Earbuds are in like-new condition. No scratches or defects. Charging case fully functional. Comes with all original accessories.",
      graded_at: "2026-06-08T10:00:00Z"
    },
    valuation: { resale_price: 3500, price_multiplier: 0.70, demand_factor: 1.2 },
    routing: {
      decision: "RESELL_P2P",
      reasoning: "High demand for JBL earbuds in the local P2P market. Grade A condition makes it ideal for direct resale without any refurbishment needed.",
      destination: { type: "buyer", name: "Local P2P Buyer", pincode: "400002" },
      savings: { cost_saved: 420, co2_saved_kg: 1.8, km_avoided: 850 },
      routed_at: "2026-06-08T10:30:00Z"
    },
    credits: { earned: 70, action: "p2p_local_handoff", lifetime_credits: 420 },
    created_at: "2026-05-10T10:00:00Z", updated_at: "2026-06-08T10:30:00Z"
  },
  {
    twin_id: "twin-010",
    item: { sku: "SKU-PUMA-TSHIRT", title: "Puma Men's Running T-Shirt (M)", category: "fashion", original_price: 999, purchase_date: "2026-05-12T00:00:00Z", image_url: null },
    customer: { customer_id: "cust-004", pincode: "700001", name: "Sunita Das" },
    state: "ROUTED",
    prevention: { risk_score: 0.6, risk_factors: ["high_return_category"], nudge_shown: true, nudge_type: "keep_discount", prevented: false },
    grading: {
      grade: "B", confidence: 0.85,
      defects: [{ type: "stain", location: "Left shoulder area", severity: "minor" }],
      photo_urls: [],
      condition_report: "T-shirt is in good condition with a minor stain on the left shoulder that can likely be washed out. No tears or structural damage.",
      graded_at: "2026-06-07T09:00:00Z"
    },
    valuation: { resale_price: 500, price_multiplier: 0.50, demand_factor: 0.9 },
    routing: {
      decision: "DONATE",
      reasoning: "Low resale value makes P2P sale inefficient. Donation to a local NGO provides maximum social impact while minimising logistics cost.",
      destination: { type: "ngo", name: "Goonj Foundation", pincode: "700010" },
      savings: { cost_saved: 180, co2_saved_kg: 0.6, km_avoided: 320 },
      routed_at: "2026-06-07T09:30:00Z"
    },
    credits: { earned: 40, action: "donated", lifetime_credits: 240 },
    created_at: "2026-05-12T10:00:00Z", updated_at: "2026-06-07T09:30:00Z"
  },
  {
    twin_id: "twin-011",
    item: { sku: "SKU-PIGEON-MG", title: "Pigeon by Stovekraft Mixer Grinder", category: "home", original_price: 1899, purchase_date: "2026-04-28T00:00:00Z", image_url: null },
    customer: { customer_id: "cust-005", pincode: "711101", name: "Deepak Roy" },
    state: "ROUTED",
    prevention: { risk_score: 0.3, risk_factors: [], nudge_shown: false, nudge_type: "none", prevented: false },
    grading: {
      grade: "D", confidence: 0.79,
      defects: [
        { type: "missing_part", location: "One grinding jar missing", severity: "major" },
        { type: "scratch", location: "Motor body", severity: "moderate" }
      ],
      photo_urls: [],
      condition_report: "Mixer grinder has significant damage with one grinding jar missing and visible scratches on the motor body. Motor functions but needs professional assessment.",
      graded_at: "2026-06-06T16:00:00Z"
    },
    valuation: { resale_price: 400, price_multiplier: 0.21, demand_factor: 0.5 },
    routing: {
      decision: "RECYCLE",
      reasoning: "Missing parts and grade D condition make resale or refurbishment uneconomical. Recycling recovers material value while ensuring responsible disposal.",
      destination: { type: "recycler", name: "EcoRecycle Partners", pincode: "711105" },
      savings: { cost_saved: 150, co2_saved_kg: 2.1, km_avoided: 210 },
      routed_at: "2026-06-06T16:30:00Z"
    },
    credits: { earned: 30, action: "donated", lifetime_credits: 80 },
    created_at: "2026-04-28T10:00:00Z", updated_at: "2026-06-06T16:30:00Z"
  },
  // LISTED (3)
  {
    twin_id: "twin-012",
    item: { sku: "SKU-CAMPUS-SHOES", title: "Campus Men's Running Shoes (UK 8)", category: "fashion", original_price: 1499, purchase_date: "2026-04-20T00:00:00Z", image_url: "https://m.media-amazon.com/images/I/71K96V+b5uL._UY400_.jpg" },
    customer: { customer_id: "cust-002", pincode: "560001", name: "Priya Menon" },
    state: "LISTED",
    prevention: { risk_score: 0.68, risk_factors: ["size_bracketing", "review_fit_warnings"], nudge_shown: true, nudge_type: "fit_predictor", prevented: false },
    grading: {
      grade: "A", confidence: 0.91,
      defects: [],
      photo_urls: [],
      condition_report: "Shoes are in excellent condition, worn only once. No scuffs or sole wear. Original box included.",
      graded_at: "2026-06-05T12:00:00Z"
    },
    valuation: { resale_price: 1050, price_multiplier: 0.70, demand_factor: 1.0 },
    routing: {
      decision: "RESELL_P2P",
      reasoning: "Grade A condition and high demand for Campus shoes locally. Direct P2P sale avoids warehouse handling and maximises seller recovery.",
      destination: { type: "buyer", name: "Local P2P Buyer", pincode: "560002" },
      savings: { cost_saved: 270, co2_saved_kg: 1.1, km_avoided: 580 },
      routed_at: "2026-06-05T12:30:00Z"
    },
    credits: { earned: 50, action: "p2p_local_handoff", lifetime_credits: 170 },
    created_at: "2026-04-20T10:00:00Z", updated_at: "2026-06-05T12:30:00Z"
  },
  {
    twin_id: "twin-013",
    item: { sku: "SKU-ATOMIC-HABITS", title: "Atomic Habits by James Clear", category: "books", original_price: 499, purchase_date: "2026-04-15T00:00:00Z", image_url: "https://m.media-amazon.com/images/I/81YkqyaFVEL._SY355_.jpg" },
    customer: { customer_id: "cust-003", pincode: "110001", name: "Amit Verma" },
    state: "LISTED",
    prevention: { risk_score: 0.2, risk_factors: [], nudge_shown: false, nudge_type: "none", prevented: false },
    grading: {
      grade: "B", confidence: 0.90,
      defects: [{ type: "packaging_damage", location: "Back cover corner", severity: "minor" }],
      photo_urls: [],
      condition_report: "Book is in good readable condition with minor corner wear on the back cover. All pages intact with no markings or highlights.",
      graded_at: "2026-06-04T10:00:00Z"
    },
    valuation: { resale_price: 300, price_multiplier: 0.60, demand_factor: 1.3 },
    routing: {
      decision: "RESELL_P2P",
      reasoning: "Atomic Habits has consistently high demand on P2P platforms. Grade B condition acceptable for book buyers at this price point.",
      destination: { type: "buyer", name: "Local P2P Buyer", pincode: "110002" },
      savings: { cost_saved: 90, co2_saved_kg: 0.3, km_avoided: 150 },
      routed_at: "2026-06-04T10:30:00Z"
    },
    credits: { earned: 30, action: "p2p_local_handoff", lifetime_credits: 110 },
    created_at: "2026-04-15T10:00:00Z", updated_at: "2026-06-04T10:30:00Z"
  },
  {
    twin_id: "twin-014",
    item: { sku: "SKU-MILTON-FLASK", title: "Milton Thermosteel Flask 1L", category: "home", original_price: 699, purchase_date: "2026-04-10T00:00:00Z", image_url: null },
    customer: { customer_id: "cust-001", pincode: "400001", name: "Rahul Sharma" },
    state: "LISTED",
    prevention: { risk_score: 0.25, risk_factors: [], nudge_shown: false, nudge_type: "none", prevented: false },
    grading: {
      grade: "A", confidence: 0.93,
      defects: [],
      photo_urls: [],
      condition_report: "Flask is in excellent condition with no dents or scratches. Insulation fully functional. Original packaging intact.",
      graded_at: "2026-06-03T14:00:00Z"
    },
    valuation: { resale_price: 490, price_multiplier: 0.70, demand_factor: 1.1 },
    routing: {
      decision: "RESELL_P2P",
      reasoning: "High demand for quality flasks locally. Grade A condition and trusted brand make this an easy P2P sell.",
      destination: { type: "buyer", name: "Local P2P Buyer", pincode: "400003" },
      savings: { cost_saved: 120, co2_saved_kg: 0.4, km_avoided: 200 },
      routed_at: "2026-06-03T14:30:00Z"
    },
    credits: { earned: 30, action: "p2p_local_handoff", lifetime_credits: 380 },
    created_at: "2026-04-10T10:00:00Z", updated_at: "2026-06-03T14:30:00Z"
  },
  {
    twin_id: "twin-025",
    item: { sku: "SKU-SONY-WH", title: "Sony WH-CH520 Wireless Headphones", category: "electronics", original_price: 4490, purchase_date: "2026-04-18T00:00:00Z", image_url: "https://m.media-amazon.com/images/I/61VEnzBl4jL._SY355_.jpg" },
    customer: { customer_id: "cust-003", pincode: "110001", name: "Amit Verma" },
    state: "LISTED",
    prevention: { risk_score: 0.4, risk_factors: [], nudge_shown: false, nudge_type: "none", prevented: false },
    grading: {
      grade: "A", confidence: 0.95,
      defects: [],
      photo_urls: [],
      condition_report: "Headphones are in excellent condition with no visible wear. Battery holds full charge. All accessories and original box included.",
      graded_at: "2026-06-04T11:00:00Z"
    },
    valuation: { resale_price: 3100, price_multiplier: 0.69, demand_factor: 1.2 },
    routing: {
      decision: "RESELL_P2P",
      reasoning: "Grade A audio gear has strong local demand. Direct P2P sale maximises value recovery with no refurbishment needed.",
      destination: { type: "buyer", name: "Local P2P Buyer", pincode: "110004" },
      savings: { cost_saved: 310, co2_saved_kg: 1.6, km_avoided: 640 },
      routed_at: "2026-06-04T11:30:00Z"
    },
    credits: { earned: 50, action: "p2p_local_handoff", lifetime_credits: 130 },
    created_at: "2026-04-18T10:00:00Z", updated_at: "2026-06-04T11:30:00Z"
  },
  {
    twin_id: "twin-026",
    item: { sku: "SKU-WROGN-SHIRT", title: "WROGN Men's Casual Shirt (Size M)", category: "fashion", original_price: 1599, purchase_date: "2026-04-22T00:00:00Z", image_url: null },
    customer: { customer_id: "cust-004", pincode: "700001", name: "Sunita Das" },
    state: "LISTED",
    prevention: { risk_score: 0.6, risk_factors: ["size_bracketing"], nudge_shown: true, nudge_type: "size_suggestion", prevented: false },
    grading: {
      grade: "B", confidence: 0.87,
      defects: [{ type: "discoloration", location: "Inner collar", severity: "minor" }],
      photo_urls: [],
      condition_report: "Shirt is in good condition with very minor collar discoloration from wear. No tears or stains. Freshly laundered and ready to wear.",
      graded_at: "2026-06-04T13:00:00Z"
    },
    valuation: { resale_price: 800, price_multiplier: 0.50, demand_factor: 0.95 },
    routing: {
      decision: "RESELL_P2P",
      reasoning: "Branded apparel in good condition sells well locally. P2P route avoids warehouse fees and speeds up turnaround.",
      destination: { type: "buyer", name: "Local P2P Buyer", pincode: "700004" },
      savings: { cost_saved: 140, co2_saved_kg: 0.5, km_avoided: 260 },
      routed_at: "2026-06-04T13:30:00Z"
    },
    credits: { earned: 30, action: "p2p_local_handoff", lifetime_credits: 230 },
    created_at: "2026-04-22T10:00:00Z", updated_at: "2026-06-04T13:30:00Z"
  },
  {
    twin_id: "twin-027",
    item: { sku: "SKU-PHILIPS-IRON", title: "Philips Steam Iron GC1905", category: "home", original_price: 1495, purchase_date: "2026-04-25T00:00:00Z", image_url: null },
    customer: { customer_id: "cust-005", pincode: "711101", name: "Deepak Roy" },
    state: "LISTED",
    prevention: { risk_score: 0.3, risk_factors: [], nudge_shown: false, nudge_type: "none", prevented: false },
    grading: {
      grade: "A", confidence: 0.92,
      defects: [],
      photo_urls: [],
      condition_report: "Steam iron in excellent working condition. Soleplate clean with no scratches. Lightly used, original box and manual included.",
      graded_at: "2026-06-05T09:00:00Z"
    },
    valuation: { resale_price: 1050, price_multiplier: 0.70, demand_factor: 1.05 },
    routing: {
      decision: "RESELL_P2P",
      reasoning: "Reliable small appliance with steady demand. Grade A condition makes direct resale the most efficient route.",
      destination: { type: "buyer", name: "Local P2P Buyer", pincode: "711104" },
      savings: { cost_saved: 130, co2_saved_kg: 0.6, km_avoided: 280 },
      routed_at: "2026-06-05T09:30:00Z"
    },
    credits: { earned: 35, action: "p2p_local_handoff", lifetime_credits: 140 },
    created_at: "2026-04-25T10:00:00Z", updated_at: "2026-06-05T09:30:00Z"
  },
  {
    twin_id: "twin-028",
    item: { sku: "SKU-IKIGAI-BOOK", title: "Ikigai by Héctor García", category: "books", original_price: 450, purchase_date: "2026-04-28T00:00:00Z", image_url: null },
    customer: { customer_id: "cust-002", pincode: "560001", name: "Priya Menon" },
    state: "LISTED",
    prevention: { risk_score: 0.2, risk_factors: [], nudge_shown: false, nudge_type: "none", prevented: false },
    grading: {
      grade: "A", confidence: 0.94,
      defects: [],
      photo_urls: [],
      condition_report: "Book is in like-new condition. No markings, creases, or spine damage. Read once and well kept.",
      graded_at: "2026-06-05T15:00:00Z"
    },
    valuation: { resale_price: 320, price_multiplier: 0.71, demand_factor: 1.25 },
    routing: {
      decision: "RESELL_P2P",
      reasoning: "Popular title with consistent demand. Like-new condition supports a strong P2P resale price.",
      destination: { type: "buyer", name: "Local P2P Buyer", pincode: "560004" },
      savings: { cost_saved: 70, co2_saved_kg: 0.2, km_avoided: 130 },
      routed_at: "2026-06-05T15:30:00Z"
    },
    credits: { earned: 25, action: "p2p_local_handoff", lifetime_credits: 145 },
    created_at: "2026-04-28T10:00:00Z", updated_at: "2026-06-05T15:30:00Z"
  },
  {
    twin_id: "twin-029",
    item: { sku: "SKU-REDMI-BAND", title: "Redmi Smart Band 2", category: "electronics", original_price: 1999, purchase_date: "2026-05-02T00:00:00Z", image_url: null },
    customer: { customer_id: "cust-001", pincode: "400001", name: "Rahul Sharma" },
    state: "LISTED",
    prevention: { risk_score: 0.45, risk_factors: ["high_return_category"], nudge_shown: false, nudge_type: "none", prevented: false },
    grading: {
      grade: "B", confidence: 0.86,
      defects: [{ type: "scratch", location: "Display surface", severity: "minor" }],
      photo_urls: [],
      condition_report: "Smart band functions perfectly with a faint scratch on the display. Strap in good condition. Charger included.",
      graded_at: "2026-06-06T10:00:00Z"
    },
    valuation: { resale_price: 1100, price_multiplier: 0.55, demand_factor: 1.0 },
    routing: {
      decision: "RESELL_P2P",
      reasoning: "Wearables retain decent resale value when functional. Grade B condition is acceptable for budget buyers via P2P.",
      destination: { type: "buyer", name: "Local P2P Buyer", pincode: "400005" },
      savings: { cost_saved: 160, co2_saved_kg: 0.7, km_avoided: 300 },
      routed_at: "2026-06-06T10:30:00Z"
    },
    credits: { earned: 35, action: "p2p_local_handoff", lifetime_credits: 385 },
    created_at: "2026-05-02T10:00:00Z", updated_at: "2026-06-06T10:30:00Z"
  },
  {
    twin_id: "twin-030",
    item: { sku: "SKU-FASTRACK-WATCH", title: "Fastrack Reflex Smart Watch", category: "fashion", original_price: 2495, purchase_date: "2026-05-05T00:00:00Z", image_url: null },
    customer: { customer_id: "cust-003", pincode: "110001", name: "Amit Verma" },
    state: "LISTED",
    prevention: { risk_score: 0.5, risk_factors: [], nudge_shown: false, nudge_type: "none", prevented: false },
    grading: {
      grade: "A", confidence: 0.90,
      defects: [],
      photo_urls: [],
      condition_report: "Smart watch in excellent condition with no scratches on the dial or strap. Fully functional with original charger and box.",
      graded_at: "2026-06-06T14:00:00Z"
    },
    valuation: { resale_price: 1700, price_multiplier: 0.68, demand_factor: 1.1 },
    routing: {
      decision: "RESELL_P2P",
      reasoning: "Stylish wearable with strong local demand. Grade A condition supports premium P2P pricing without refurbishment.",
      destination: { type: "buyer", name: "Local P2P Buyer", pincode: "110006" },
      savings: { cost_saved: 200, co2_saved_kg: 0.9, km_avoided: 420 },
      routed_at: "2026-06-06T14:30:00Z"
    },
    credits: { earned: 45, action: "p2p_local_handoff", lifetime_credits: 125 },
    created_at: "2026-05-05T10:00:00Z", updated_at: "2026-06-06T14:30:00Z"
  },
  // SOLD (2)
  {
    twin_id: "twin-015",
    item: { sku: "SKU-HP-BOXSET", title: "Harry Potter Complete Box Set", category: "books", original_price: 2500, purchase_date: "2026-03-20T00:00:00Z", image_url: "https://m.media-amazon.com/images/I/91eopoePl+L._SY355_.jpg" },
    customer: { customer_id: "cust-004", pincode: "700001", name: "Sunita Das" },
    state: "SOLD",
    prevention: { risk_score: 0.15, risk_factors: [], nudge_shown: false, nudge_type: "none", prevented: false },
    grading: {
      grade: "B", confidence: 0.87,
      defects: [{ type: "discoloration", location: "Spine of Book 3", severity: "minor" }],
      photo_urls: [],
      condition_report: "Box set in good condition. Minor yellowing on the spine of Book 3 due to age. All 7 books present with no missing pages.",
      graded_at: "2026-05-25T10:00:00Z"
    },
    valuation: { resale_price: 1500, price_multiplier: 0.60, demand_factor: 1.4 },
    routing: {
      decision: "RESELL_P2P",
      reasoning: "Harry Potter sets have perennial demand. Local P2P sale ensures fast turnaround and maximum value recovery.",
      destination: { type: "buyer", name: "Ananya Bose", pincode: "700005" },
      savings: { cost_saved: 380, co2_saved_kg: 1.5, km_avoided: 720 },
      routed_at: "2026-05-25T10:30:00Z"
    },
    credits: { earned: 60, action: "p2p_local_handoff", lifetime_credits: 260 },
    created_at: "2026-03-20T10:00:00Z", updated_at: "2026-06-01T09:00:00Z"
  },
  {
    twin_id: "twin-016",
    item: { sku: "SKU-WIPRO-LED", title: "Wipro 9W LED Bulb (Pack of 4)", category: "home", original_price: 449, purchase_date: "2026-03-15T00:00:00Z", image_url: null },
    customer: { customer_id: "cust-005", pincode: "711101", name: "Deepak Roy" },
    state: "SOLD",
    prevention: { risk_score: 0.2, risk_factors: [], nudge_shown: false, nudge_type: "none", prevented: false },
    grading: {
      grade: "A", confidence: 0.98,
      defects: [],
      photo_urls: [],
      condition_report: "Unopened pack of 4 LED bulbs. Packaging intact. Purchased in error (wrong fitting size).",
      graded_at: "2026-05-20T10:00:00Z"
    },
    valuation: { resale_price: 360, price_multiplier: 0.80, demand_factor: 1.0 },
    routing: {
      decision: "RESELL_P2P",
      reasoning: "Sealed, unused product is ideal for P2P resale. High recovery rate possible given like-new condition.",
      destination: { type: "buyer", name: "Mohan Rao", pincode: "711102" },
      savings: { cost_saved: 100, co2_saved_kg: 0.3, km_avoided: 180 },
      routed_at: "2026-05-20T10:30:00Z"
    },
    credits: { earned: 25, action: "p2p_local_handoff", lifetime_credits: 105 },
    created_at: "2026-03-15T10:00:00Z", updated_at: "2026-05-28T11:00:00Z"
  },
  // DONATED (1)
  {
    twin_id: "twin-017",
    item: { sku: "SKU-RICH-DAD", title: "Rich Dad Poor Dad", category: "books", original_price: 399, purchase_date: "2026-02-10T00:00:00Z", image_url: null },
    customer: { customer_id: "cust-002", pincode: "560001", name: "Priya Menon" },
    state: "DONATED",
    prevention: { risk_score: 0.18, risk_factors: [], nudge_shown: false, nudge_type: "none", prevented: false },
    grading: {
      grade: "C", confidence: 0.83,
      defects: [
        { type: "stain", location: "Front cover", severity: "moderate" },
        { type: "discoloration", location: "Page edges", severity: "minor" }
      ],
      photo_urls: [],
      condition_report: "Book is readable with a moderate coffee stain on the front cover and yellowed page edges. Content fully intact.",
      graded_at: "2026-05-15T10:00:00Z"
    },
    valuation: { resale_price: 100, price_multiplier: 0.25, demand_factor: 0.7 },
    routing: {
      decision: "DONATE",
      reasoning: "Condition makes P2P sale unsuitable, but book remains readable and valuable for donation to a community library.",
      destination: { type: "ngo", name: "Pratham Books", pincode: "560010" },
      savings: { cost_saved: 80, co2_saved_kg: 0.2, km_avoided: 120 },
      routed_at: "2026-05-15T10:30:00Z"
    },
    credits: { earned: 35, action: "donated", lifetime_credits: 155 },
    created_at: "2026-02-10T10:00:00Z", updated_at: "2026-05-20T10:00:00Z"
  },
  // RECYCLED (1)
  {
    twin_id: "twin-018",
    item: { sku: "SKU-BAJAJ-ROD", title: "Bajaj Immersion Rod 1500W", category: "home", original_price: 599, purchase_date: "2026-01-20T00:00:00Z", image_url: null },
    customer: { customer_id: "cust-003", pincode: "110001", name: "Amit Verma" },
    state: "RECYCLED",
    prevention: { risk_score: 0.28, risk_factors: [], nudge_shown: false, nudge_type: "none", prevented: false },
    grading: {
      grade: "D", confidence: 0.91,
      defects: [
        { type: "missing_part", location: "Heating element cracked", severity: "major" },
        { type: "dent", location: "Handle", severity: "moderate" }
      ],
      photo_urls: [],
      condition_report: "Immersion rod is non-functional with a cracked heating element and dented handle. Not safe for use. Suitable only for material recycling.",
      graded_at: "2026-05-10T10:00:00Z"
    },
    valuation: { resale_price: 50, price_multiplier: 0.08, demand_factor: 0.2 },
    routing: {
      decision: "RECYCLE",
      reasoning: "Non-functional and unsafe. Material recycling is the only responsible option to recover metal value.",
      destination: { type: "recycler", name: "GreenMetal Recyclers", pincode: "110005" },
      savings: { cost_saved: 60, co2_saved_kg: 0.8, km_avoided: 300 },
      routed_at: "2026-05-10T10:30:00Z"
    },
    credits: { earned: 20, action: "donated", lifetime_credits: 100 },
    created_at: "2026-01-20T10:00:00Z", updated_at: "2026-05-15T10:00:00Z"
  }
]

export const MOCK_DASHBOARD_STATS = {
  total_twins: 150,
  returns_prevented: 23,
  total_cost_saved: 48500,
  total_co2_saved_kg: 187.5,
  items_by_state: {
    ACTIVE: 15, RETURN_INTENT: 10, GRADED: 10,
    ROUTED: 10, LISTED: 10, SOLD: 5, DONATED: 5, RECYCLED: 5
  },
  items_by_route: {
    RESELL_P2P: 20, RESELL_RENEWED: 8, REFURBISH: 5, DONATE: 10, RECYCLE: 7
  }
}

export const MOCK_RISK_RESPONSE = {
  risk_score: 0.87,
  risk_factors: ["size_bracketing", "high_return_category"],
  nudge_type: "size_suggestion",
  nudge_message: "87% of buyers your size found this runs small. Consider ordering Size XL instead."
}

export const MOCK_CREDITS = {
  customer_id: "cust-001",
  total_credits: 350,
  history: [
    { twin_id: "twin-014", action: "p2p_local_handoff", credits: 30, timestamp: "2026-06-03T14:30:00Z" },
    { twin_id: "twin-009", action: "p2p_local_handoff", credits: 70, timestamp: "2026-06-08T10:30:00Z" },
    { twin_id: "twin-015", action: "p2p_local_handoff", credits: 60, timestamp: "2026-05-25T10:30:00Z" },
    { twin_id: "twin-002", action: "kept_with_discount", credits: 20, timestamp: "2026-06-03T11:00:00Z" },
    { twin_id: "twin-001", action: "p2p_local_handoff", credits: 50, timestamp: "2026-06-01T10:30:00Z" }
  ]
}
