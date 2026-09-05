# نظرة عامة على موقع nspiredbeauty.com

## نوع الموقع
متجر إلكتروني (E-commerce) مبني على **Shopify**، بيبيع عطور (perfumes) بأسعار أقل من البراندات العالمية ("luxury dupes"). البراند اسمه **nspired beauty**.

## الطابع العام للتصميم
- تصميم **Minimalist / Clean** فيه مساحات فاضية (white space) كتير.
- استخدام فيديوهات خلفية (Hero video + video sections) بدل الصور الثابتة في أكتر من مكان، ده بيدي إحساس "براند فاخر" (premium).
- ألوان أساسية: أبيض/كريمي كخلفية + أسود للنصوص + لون accent واحد بس (زي الأحمر/الوردي في نسخة "Red Rush") بيتغير حسب المنتج المعروض في الهيرو.
- خطوط: خط عريض بسيط (Sans-serif) للعناوين، وخط تاني أخف للنصوص الفرعية، مع استخدام lowercase في بعض العناوين (زي "the common sense in scents") كأسلوب براندنج متعمد.
- الموقع بيعتمد على **social proof** بشكل كبير (تقييمات، partnerships، ضمان استرجاع).

## هيكل الصفحة الرئيسية (بالترتيب)
1. Announcement bar (شحن مجاني)
2. Header / Navigation
3. Hero Section (فيديو + عرض المنتج الجديد)
4. Bestsellers (كاروسيل منتجات)
5. Philosophy Video Section
6. "Common Sense in Scents" statement section
7. Partnerships/Brand logos strip
8. "0% Risk Factor" - How it works (3 خطوات)
9. Risk/Trust section مع صورة + 3 مميزات
10. Testimonials Carousel
11. Footer (روابط + newsletter + سوشيال)
12. Cart Drawer + Search Drawer (عناصر تفاعلية جانبية)

كل سكشن من دول موضحله ملف منفصل بالتفاصيل.

## أفضل الأدوات/السكيلز اللي الـ AI Agent يستخدمها للوصول للمستوى ده

| الهدف | السكيل/الأداة المقترحة |
|---|---|
| بناء الهوية البصرية والألوان (Color palette بديل لألوان nspired) | **design** (فيه design tokens + brand identity) أو **ui-ux-pro-max** (فيه 192 palette جاهزة) |
| بناء الواجهة (Components: header, carousel, drawer, footer) | **frontend-design** + **ui-styling** (shadcn/ui + Tailwind) |
| القرارات التصميمية الدقيقة (Typography pairing, spacing, depth) | **frontend-design-principles** (يوجهك لـ marketing.md لصفحات زي دي) |
| تصميم بانرات الهيرو/العروض (زي "Meet Red Rush") | **banner-design** |
| مراجعة/اختبار التصميم بعد التنفيذ | **grill-me** (يسألك أسئلة تتحدى بيها القرارات وتتأكد إنها متسقة) |
| بناء المتجر الفعلي (لو Shopify) | مش سكيل في المحادثة دي، لكن ينفع تستخدم Shopify Liquid + Dawn theme كأساس بدل ما تبني من الصفر |

## نصيحة تقنية
لو الهدف موقع مستقل (مش Shopify)، أنسب Stack:
- **Next.js / React** + **Tailwind CSS** + **shadcn/ui** للكمبوننتس (زي الـ cart drawer والـ search drawer).
- **Framer Motion** أو **GSAP** للـ transitions البسيطة (فتح/قفل الـ drawers، الـ carousel).
- فيديوهات خلفية بصيغة MP4 مضغوطة + poster image (thumbnail) عشان الأداء على الموبايل.
