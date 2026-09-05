# السكشن 12: Cart Drawer + Search Overlay (عناصر تفاعلية)

## Cart Drawer (سلة الشراء الجانبية)
- بتفتح كـ **panel جانبي** (من الشمال أو اليمين) لما تدوس على أيقونة الكارت، من غير ما تنقلك لصفحة تانية.
- لو فاضية: بتوريك "Your cart is empty" + رسالة "Have an account? Log in to check out faster" + زرار "Continue shopping".
- بيحسب عدد العناصر في الكارت كـ badge على الأيقونة نفسها ("Total items in cart: 0").

## Search Overlay (البحث)
- بيفتح كـ **overlay/modal** فوق الصفحة كلها.
- بيقترح **منتجات فورية** وأنت بتكتب (Live search) — كل نتيجة فيها: صورتين للمنتج (default + hover)، الاسم، السعر.
- مفيش انتظار لحد ما تدوس Enter — النتائج بتظهر لحظيًا.

## ليه العنصرين دول مهمين لتجربة المستخدم
- بيقللوا عدد الصفحات اللي المستخدم محتاج يزورها (كل حاجة بتحصل فوق نفس الصفحة الحالية) → تجربة أسرع وأقل احتكاك (friction) خصوصًا على الموبايل.
- ده نمط قياسي في متاجر Shopify الحديثة (Dawn theme وما شابه).

## أفضل السكيلز لتنفيذه
- **ui-styling**: أساسي هنا — استخدام **Sheet component** (shadcn/ui) للـ cart drawer، و**Command/Dialog component** للـ search overlay مع debounce على الكتابة.
- **frontend-design-principles** (app.md): لضبط الـ micro-interactions (سرعة فتح/قفل الـ drawer، الـ loading state أثناء البحث).
