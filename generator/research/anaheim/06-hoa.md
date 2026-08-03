# Anaheim — HOA & design review

Researched **2026-08-02** via Firecrawl, following `HOA-DISCOVERY-RECIPE.md`.

**Confidence: LOW. This is the weakest file in the cluster and the copy must respect that.**

---

## 🔴 THE HEADLINE: Anaheim has no official HOA lookup

Irvine publishes one at `cityofirvine.gov/community-development/irvine-homeowners-associations`
— a government primary source mapping parcel → HOA → management company. It is what let us
satisfy the never-invent rule outright for the Irvine cluster.

**Anaheim publishes no equivalent.** Searched directly; the results are management-company
marketing pages and third-party directories, not a city register.

**Consequence:** every HOA claim in Anaheim has to be verified per community, one at a time,
from a source that is not the city. There is no shortcut here.

---

## WHAT IS ACTUALLY CONFIRMED

| Community | Association | Management | Confidence |
|---|---|---|---|
| **Peralta Hills** | **Peralta Hills Estates Improvement Association** | not found | **Medium** — named on a realtor site |
| **Summit Pointe** | Summit Pointe Association | **likely Keystone Pacific** — see below | **Low, conflicted** |
| **Belsomet** | not found | not found | none |
| **Crown Pointe** | not found | not found | none |

### The Keystone Pacific lead — promising, not proven

An MLS listing for a Summit Pointe property lists **"Summit Pointe Association, Phone Number
(949) 833-2600"**. That number is **Keystone Pacific Property Management**, verified in our own
Irvine research (`irvine/06-hoa.md`), where KPPM runs at least four of six target villages.

**If it holds, it is the highest-leverage finding in this market** — one relationship reaching
across both cities, Woodbury's 4,067 units *and* Anaheim Hills.

**But it does not hold yet.** Other listings for the same subdivision name
**First Service Residential** and **Coastal Management**, with a different phone
(800) 428-5588. A separate **"The Summit Estates Association"** appears at (949) 506-5807.

MLS community fields are filled in freehand by agents and are frequently wrong or stale.
**Three conflicting managers for one subdivision means none of them is verified.**

**To resolve:** call (949) 833-2600 and ask whether KPPM manages Summit Pointe, or check
KPPM's own client list. Fabian can settle this in one phone call faster than any scrape.

---

## WHAT THIS MEANS FOR THE PAGES

**Do not build a dedicated `/anaheim/hoa-painting/` page yet.** Irvine's works because it
names real associations, a real management company, and real unit counts. Anaheim has one
association name and a conflicted lead. A B2B page that cannot name who it is talking to is
a thin page, and thin is worse than absent.

**On the community pages:** it is safe to say VIP prepares design-review submittal packages —
that is a fact about our own service, not a claim about their rules. It is **not** safe to
state that a specific community requires approval, what its palette rules are, or how long
review takes. None of that is verified.

**Frame it as ours, not theirs:**
> ✅ "We prepare your association's design review package as part of the project."
> ❌ "Summit Pointe requires board approval before any exterior colour change."

---

## STILL TO DO

1. **Settle the Keystone question** — one phone call.
2. **Find management for Belsomet and Crown Pointe.** Crown Pointe has 16 homes and may be
   self-managed, which would be worth knowing — self-managed boards buy differently.
3. **Confirm whether any of the four run formal design review**, and get the actual
   architectural guidelines before writing a word about their rules.
4. **386 HOA/condo communities exist in Anaheim** (communitypay directory). The B2B
   opportunity is real and unmapped; this file barely scratches it.

## SOURCES

homes.com MLS community detail fields *(conflicting, treat with caution)* ·
activerealty.com *(Peralta Hills association name)* · communitypay.us directory ·
`irvine/06-hoa.md` *(the Keystone phone number we are matching against)* ·
searched and confirmed absent: any City of Anaheim HOA register
