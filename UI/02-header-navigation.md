# السكشن 2: Header / Navigation

## الوصف
هيدر بسيط جدًا (minimal nav) مقسوم لـ 3 مناطق:
- **يمين/شمال**: قايمة روابط (Home / Shop [بيها dropdown لـ Men, Women] / Scent Quiz / More)
- **النص**: اللوجو (شعار nspired) في النص تمامًا
- **الطرف التاني**: أيقونتين — Account (حساب المستخدم) و Cart (عربة الشراء) + Search

## العناصر الوظيفية
1. **Dropdown menu** تحت "Shop" بيفتح فيه Men / Women.
2. **Account panel**: بيفتح كـ drawer جانبي فيه Sign in + روابط (Orders, Profile).
3. **Cart drawer**: بيفتح من الجنب (side panel) بدل ما يودي المستخدم لصفحة تانية — بيوريله "Your cart is empty" لو فاضي، مع زرار "Continue shopping".
4. **Search overlay**: بحث بيقترح منتجات فورًا (بالصورة، الاسم، السعر) وأنت لسه بتكتب.

## الطابع البصري
- خلفية بيضاء/شفافة، اللوجو أسود بسيط (نص فقط، من غير أيقونة معقدة).
- الروابط بخط صغير capitalized أو lowercase حسب الهوية.
- الهيدر عادة **sticky** (بيفضل ظاهر لما تعمل scroll) في مواقع الشوبيفاي زي دي.

## نسخة بألوان مختلفة (اقتراح)
سيب الهيدر أبيض/فاتح عشان يفضل يقرأ كويس مهما كانت خلفية الهيرو تحته، وخلي اللوجو ولون الـ hover على الروابط بلون الهوية بتاعتك.

## أفضل السكيلز لتنفيذه
- **ui-styling**: لعمل الـ dropdown، الـ drawer، والـ sticky header بمكونات shadcn/ui (Sheet component للـ cart/account drawers، NavigationMenu للـ dropdown).
- **frontend-design-principles**: لضبط الـ spacing والـ typography بتاعة الهيدر بشكل احترافي.
- **frontend-design**: لضمان إن اللوجو والروابط متناسقين بصريًا مع باقي الموقع.
