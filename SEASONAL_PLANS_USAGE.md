# Seasonal Plans - Quick Start Guide

## Dashboard Structure

```
┌─────────────────────────────────────────────┐
│  Seasonal Plans Management                  │
│  Create and manage rental plans             │   [+ Add Plan Button]
├─────────────────────────────────────────────┤
│                                             │
│  ┌─ SUMMER PLANS (2 plans available)      │
│  │                                         │
│  │  ┌──────────────┐  ┌──────────────┐   │
│  │  │ Summer 3M    │  │ Summer 6M    │   │
│  │  │ Base: ₹5000  │  │ Base: ₹7500  │   │
│  │  │ Per Unit:    │  │ Per Unit:    │   │
│  │  │ ₹1500        │  │ ₹1300        │   │
│  │  │ Save 15%     │  │ Save 20%     │   │
│  │  │              │  │              │   │
│  │  │ Valid: Mar   │  │ Valid: Mar   │   │
│  │  │ to May       │  │ to Aug       │   │
│  │  │ [Edit][Del]  │  │ [Edit][Del]  │   │
│  │  └──────────────┘  └──────────────┘   │
│  │                                         │
│  ├─ WINTER PLANS (2 plans available)      │
│  │                                         │
│  │  ┌──────────────┐  ┌──────────────┐   │
│  │  │ Winter 3M    │  │ Winter 6M    │   │
│  │  │ ...          │  │ ...          │   │
│  │  └──────────────┘  └──────────────┘   │
│  │                                         │
│  ├─ YEAR-ROUND PLANS (2 plans available)  │
│  │  ...                                    │
│  │                                         │
│  └─ END SEASON SALES (2 plans available)  │
│     ...                                    │
│                                             │
└─────────────────────────────────────────────┘
```

## How to Create a New Plan

### Step 1: Open Form
Click **"+ Add Plan"** button in top right

### Step 2: Fill in Basic Info
- **Plan Name**: e.g., "Summer Cool - 3 Months"
- **Season**: Select from dropdown (summer, winter, year_round, end_season)
- **Description**: Brief description of the plan

### Step 3: Add Pricing
- **Base Price (₹)**: Base rental cost (e.g., 5000)
- **Price Per Unit (₹)**: Cost per additional unit (e.g., 1500)
- **Discount (%)**: Discount percentage (0-100)

### Step 4: Set Duration & Availability
- **Duration (Months)**: How many months this plan covers (e.g., 3)
- **Start Month (1-12)**: Month when plan becomes available
- **End Month (1-12)**: Month when plan ends

### Step 5: Save
Click **"Create Plan"** button

✅ Success message will appear
✅ Page auto-refreshes to show new plan
✅ Plan appears in correct season section

---

## How to Edit a Plan

### Step 1: Click Edit Button
On the plan card, click the **[Edit]** button

### Step 2: Wait for Load
"Loading plan data..." message appears briefly
Form auto-populates with current values

### Step 3: Modify Fields
Update any fields you want to change

### Step 4: Save
Click **"Update Plan"** button

✅ Success message confirms update
✅ Page refreshes with new data

---

## How to Delete a Plan

### Step 1: Click Delete Button
On the plan card, click the **[Delete]** button (trash icon)

### Step 2: Confirm
Confirmation dialog appears

### Step 3: Remove
Click **"Delete"** to confirm

✅ Plan is immediately removed
✅ Dashboard updates automatically

---

## Plan Fields Explained

| Field | Purpose | Example | Notes |
|-------|---------|---------|-------|
| **Name** | Display name | "Summer Cool - 3 Months" | Shown on booking page |
| **Season** | Category | "summer" | Filters plans on UI |
| **Description** | Marketing text | "Beat the heat..." | Shown to customers |
| **Base Price** | Fixed cost | 5000 | Charged regardless of units |
| **Per Unit Price** | Variable cost | 1500 | Multiplied by number of units |
| **Duration** | Plan length | 3 | Number of months covered |
| **Start Month** | Begin date | 3 | 1=Jan, 12=Dec |
| **End Month** | End date | 5 | When availability ends |
| **Discount** | Savings % | 15 | Show discount badge |

---

## Month Reference

```
1  = January    7  = July
2  = February   8  = August
3  = March      9  = September
4  = April      10 = October
5  = May        11 = November
6  = June       12 = December
```

**Examples:**
- Summer (Mar-May): Start=3, End=5
- Winter (Oct-Dec): Start=10, End=12
- Year-Round: Start=1, End=12

---

## Season Categories

### 🌞 Summer Plans
- AC and cooling units
- Available: March to May
- Typical discount: 15-20%

### ❄️ Winter Plans
- Heaters and warmth units
- Available: October to December
- Typical discount: 15-20%

### 🔄 Year-Round Plans
- Both AC and heaters
- Available: January to December
- Typical discount: 25-35%
- Higher value for customers

### 🎉 End Season Sales
- Clearance pricing
- Limited time offers
- Typical discount: 30%+

---

## Data Validation

✅ **Required Fields**
- Plan Name (text, non-empty)
- Season (dropdown selection)
- Description (text, non-empty)
- Base Price (number, ≥0)
- Per Unit Price (number, ≥0)
- Duration (number, ≥1)
- Start Month (1-12)
- End Month (1-12)

⚠️ **Common Errors**
- **Missing fields**: Fill all required fields
- **Invalid month**: Use numbers 1-12 only
- **Negative price**: Enter positive numbers only
- **Empty fields**: All fields must have content

---

## Tips & Best Practices

### ✅ Good Plan Setup
```
Name: "Summer Cool - 3M (₹5000)"
Season: summer
Description: "AC rental for entire summer season - 3 months"
Base Price: 5000
Per Unit: 1500
Duration: 3
Months: 3 to 5 (March to May)
Discount: 15%
```

### ❌ Avoid
- Overlapping month ranges (unless intentional)
- Too low prices (may indicate data entry error)
- Vague descriptions (customers need clarity)
- Wrong season (verify before saving)

### 💡 Naming Convention
Use consistent naming pattern:
- `[Season] [Benefit] - [Duration]M`
- Example: "Winter Warm - 3 Months"
- Example: "Year-Round Premium - 12 Months"

---

## Pricing Strategy

### Calculate Effective Price
```
Total Cost = Base Price + (Per Unit Price × Number of Units)
With Discount = Total Cost × (100 - Discount%) / 100
```

**Example:**
```
Base: ₹5000
Per Unit: ₹1500
Units: 2
Discount: 15%

Total = 5000 + (1500 × 2) = ₹8000
With 15% Discount = 8000 × 0.85 = ₹6800
Savings = ₹1200
```

### Recommended Discounts
- **3-month plans**: 15%
- **6-month plans**: 25%
- **12-month plans**: 35%
- **End season**: 30-40%

---

## Dashboard Views by Season

### Summer Section Shows
- All `season: 'summer'` plans
- Typically 2-4 plans
- Plans with Mar-May availability
- AC/cooling focused

### Winter Section Shows
- All `season: 'winter'` plans
- Typically 2-4 plans
- Plans with Oct-Dec availability
- Heater focused

### Year-Round Section Shows
- All `season: 'year_round'` plans
- Typically 2-3 plans
- Full year (1-12) availability
- Premium pricing

### End Season Sales Section Shows
- All `season: 'end_season'` plans
- Limited time offers
- Higher discounts
- Clearance focus

---

## Performance Notes

✅ **Fast Operations**
- Create plan: ~1 second
- Update plan: ~500ms
- Delete plan: ~500ms
- Load dashboard: ~2 seconds

⚠️ **Large Datasets**
- Plans are grouped server-side for efficiency
- Dashboard optimized for 100+ plans
- Pagination not needed currently

---

## Support & Troubleshooting

### Plan Won't Create
- ❌ Missing required fields → Fill all fields
- ❌ Invalid numbers → Use numbers only for price/month
- ❌ Not admin → Request admin access

### Form Doesn't Load
- ❌ Network issue → Check internet
- ❌ Browser cache → Refresh page (Ctrl+R)
- ❌ Server error → Try again in 1 minute

### Plan Not Updating
- ❌ Unsaved form → Check success message
- ❌ Stale data → Refresh dashboard
- ❌ Permission issue → Verify admin role

---

## API Reference (For Developers)

### Create Plan
```bash
POST /api/admin/plans
Content-Type: application/json

{
  "name": "Plan Name",
  "season": "summer",
  "description": "Description",
  "base_price": 5000,
  "pricing_per_unit": 1500,
  "discount_percentage": 15,
  "duration_months": 3,
  "start_month": 3,
  "end_month": 5
}
```

### Update Plan
```bash
PUT /api/admin/plans/[id]
Content-Type: application/json

{
  "name": "Updated Name",
  "season": "summer",
  ...same fields as POST
}
```

### Delete Plan
```bash
DELETE /api/admin/plans/[id]/delete
```

### Fetch Plan
```bash
GET /api/admin/plans/[id]
```

### List All Plans
```bash
GET /api/admin/plans
```
