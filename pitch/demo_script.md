# ReLoop — Demo Script

**Minute 1: The Hook & Prevention**
- Open `http://localhost:3000` (Landing Page).
- Explain the "data death" problem.
- Click "Customer Experience".
- Show shopping cart with multiple sizes of the same shirt.
- "We detect size bracketing. AI nudges the user to use the fit predictor instead of buying three."

**Minute 2-3: The Grading Wow Moment**
- Navigate to "Return Flow".
- Customer initiates a return on a phone.
- Customer uploads a photo (Use a pre-prepared photo of an item with a minor scratch).
- "Instead of shipping this to a warehouse, Bedrock analyzes it instantly."
- Show the Grade (B), Defect (Scratch on back panel), and Value.

**Minute 4: Optimal Routing**
- "Now that we know what the item is, we route it."
- Click "Find Best Path".
- Show the routing decision (e.g., Local P2P).
- Highlight the CO2 and cost savings.

**Minute 5: The Dashboard Impact**
- Open `http://localhost:3000/dashboard` (Admin View).
- "This isn't just one item. Look at the aggregate impact."
- Show ₹ saved, CO2 prevented.
- Summarize: "Every item travels once. To exactly where it creates the most value."

**Fallback Plan**
- If Bedrock fails, ensure `MOCK_MODE=true` is set in the backend `.env` file to serve realistic static responses.
