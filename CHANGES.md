# Perfume Shop Admin: what changed

Converted from the restaurant admin (Burak) into a perfume shop admin panel.

## How to run
1. `npm install`
2. Create a `.env` with `MONGO_URL`, `SESSION_SECRET`, `SECRET_TOKEN` (and optionally `PORT`).
3. Make sure these folders exist: `uploads/members` and `uploads/products`.
4. `npm run start:dev`, then open http://localhost:3003/admin

Use a NEW database (or delete the old restaurant member): the owner role was renamed
from `RESTAURANT` to `SHOP_OWNER`, so an old restaurant account can no longer log in.

## Pages
- Logged out: Home, Signup, Login
- Logged in: Home, Perfumes, Users, Logout

## Backend
- `MemberType.RESTAURANT` -> `SHOP_OWNER`; `restaurant.controller.ts` -> `shop.controller.ts`
- Product fields: removed size (SMALL/NORMAL/LARGE/SET) and drink volume.
  Added `productBrand`, `productConcentration` (Parfum, Eau de Parfum, Eau de Toilette,
  Eau de Cologne) and `productVolume` (ml).
- Collections: WOMEN, MEN, UNISEX, GIFT_SET
- Only the shop owner can log in to the admin panel (customers are rejected)
- Admin can only change a user's status (ACTIVE / BLOCK / DELETE)
- Customer API route `/member/restaurant` -> `/member/shop`
- Fixes: signup cookie lifetime, `updateAt` -> `updatedAt` sort, password no longer logged,
  search text is escaped before use in a regex, unused imports removed
- Browser `alert()` replaced by SweetAlert2 popups (`libs/utils/alert.ts`)

## Frontend
- New design (ivory, gold and charcoal, serif headings) in one `public/css/main.css`
- Bootstrap and the extra jQuery/popper scripts removed; jQuery, axios and SweetAlert2 kept (pinned versions)
- New shared `includes/nav.ejs`; header/footer now produce valid HTML
- Home page animation and the frying-pan preloader removed
