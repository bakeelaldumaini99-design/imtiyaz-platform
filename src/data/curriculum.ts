// المنهج الدراسي — الصف الثالث الثانوي (علمي) — اليمن

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  free?: boolean;
  kind: "video" | "review" | "exam";
}

export interface Unit {
  id: string;
  index: string;
  title: string;
  desc: string;
  formula: string;
  icon: string;
  lessons: Lesson[];
}

export const units: Unit[] = [
  {
    id: "u1",
    index: "01",
    title: "الأعداد المركبة",
    desc: "الأعداد العقدية والعمليات والقوى والجذور",
    formula: "z = a + bi",
    icon: "Sigma",
    lessons: [
      { id: "u1-l1", title: "العدد المركب", duration: "24:10", free: true, kind: "video" },
      { id: "u1-l2", title: "جمع الأعداد المركبة وطرحها", duration: "18:32", free: true, kind: "video" },
      { id: "u1-l3", title: "ضرب الأعداد المركبة وقسمتها", duration: "27:45", kind: "video" },
      { id: "u1-l4", title: "الصورة القطبية للعدد المركب", duration: "31:05", kind: "video" },
      { id: "u1-l5", title: "القوى والجذور", duration: "26:18", kind: "video" },
      { id: "u1-l6", title: "حل معادلات الدرجة الثانية", duration: "22:41", kind: "video" },
      { id: "u1-l7", title: "مراجعة الوحدة", duration: "35:00", kind: "review" },
      { id: "u1-l8", title: "اختبار الوحدة", duration: "45 دقيقة", kind: "exam" },
    ],
  },
  {
    id: "u2",
    index: "02",
    title: "مبدأ العد ومبرهنة ذات الحدين",
    desc: "التباديل والتوافيق ومبدأ العد",
    formula: "n!",
    icon: "Hash",
    lessons: [
      { id: "u2-l1", title: "مبدأ العد", duration: "19:20", free: true, kind: "video" },
      { id: "u2-l2", title: "التباديل", duration: "23:15", kind: "video" },
      { id: "u2-l3", title: "التوافيق", duration: "25:40", kind: "video" },
      { id: "u2-l4", title: "مبرهنة ذات الحدين", duration: "28:52", kind: "video" },
      { id: "u2-l5", title: "مراجعة الوحدة", duration: "30:00", kind: "review" },
      { id: "u2-l6", title: "اختبار الوحدة", duration: "40 دقيقة", kind: "exam" },
    ],
  },
  {
    id: "u3",
    index: "03",
    title: "الاحتمالات",
    desc: "الاحتمال الشرطي والحوادث المستقلة",
    formula: "P(A)",
    icon: "Dices",
    lessons: [
      { id: "u3-l1", title: "المبرهنات الأساسية في الاحتمالات", duration: "21:14", kind: "video" },
      { id: "u3-l2", title: "بناء النموذج الاحتمالي", duration: "17:48", kind: "video" },
      { id: "u3-l3", title: "الاحتمال الشرطي وقانون الضرب", duration: "26:30", kind: "video" },
      { id: "u3-l4", title: "الحوادث المستقلة", duration: "20:22", kind: "video" },
      { id: "u3-l5", title: "متتاليات التكرارات المستقلة", duration: "29:11", kind: "video" },
      { id: "u3-l6", title: "السحب مع الإعادة وبدون إعادة", duration: "24:37", kind: "video" },
      { id: "u3-l7", title: "مراجعة الوحدة", duration: "33:00", kind: "review" },
      { id: "u3-l8", title: "اختبار الوحدة", duration: "45 دقيقة", kind: "exam" },
    ],
  },
  {
    id: "u4",
    index: "04",
    title: "القطوع المخروطية",
    desc: "القطع المكافئ والناقص والزائد",
    formula: "x² + y²",
    icon: "Orbit",
    lessons: [
      { id: "u4-l1", title: "مقدمة في القطوع المخروطية", duration: "16:55", kind: "video" },
      { id: "u4-l2", title: "القطع المكافئ", duration: "28:20", kind: "video" },
      { id: "u4-l3", title: "القطع الناقص", duration: "30:44", kind: "video" },
      { id: "u4-l4", title: "القطع الزائد", duration: "27:19", kind: "video" },
      { id: "u4-l5", title: "انسحاب المحاور الإحداثية", duration: "22:08", kind: "video" },
      { id: "u4-l6", title: "دوران المحاور الإحداثية", duration: "25:36", kind: "video" },
      { id: "u4-l7", title: "مراجعة الوحدة", duration: "34:00", kind: "review" },
      { id: "u4-l8", title: "اختبار الوحدة", duration: "50 دقيقة", kind: "exam" },
    ],
  },
  {
    id: "u5",
    index: "05",
    title: "الهندسة الفضائية",
    desc: "المستقيمات والمستويات والزوايا",
    formula: "3D",
    icon: "Box",
    lessons: [
      { id: "u5-l1", title: "المستقيم العمودي على مستوى", duration: "23:42", kind: "video" },
      { id: "u5-l2", title: "العمود والمائل", duration: "21:27", kind: "video" },
      { id: "u5-l3", title: "الزاوية الزوجية", duration: "26:53", kind: "video" },
      { id: "u5-l4", title: "مراجعة الوحدة", duration: "28:00", kind: "review" },
      { id: "u5-l5", title: "اختبار الوحدة", duration: "40 دقيقة", kind: "exam" },
    ],
  },
  {
    id: "u6",
    index: "06",
    title: "التفاضل",
    desc: "المشتقات وتطبيقاتها والقيم القصوى",
    formula: "f′(x)",
    icon: "TrendingUp",
    lessons: [
      { id: "u6-l1", title: "نهايات واتصال الدوال المثلثية", duration: "25:31", kind: "video" },
      { id: "u6-l2", title: "المشتقات", duration: "29:16", kind: "video" },
      { id: "u6-l3", title: "قاعدة التسلسل", duration: "24:09", kind: "video" },
      { id: "u6-l4", title: "اشتقاق الدوال الضمنية", duration: "27:44", kind: "video" },
      { id: "u6-l5", title: "اشتقاق الدوال اللوغاريتمية والآسية", duration: "31:22", kind: "video" },
      { id: "u6-l6", title: "اشتقاق الدوال المثلثية", duration: "26:58", kind: "video" },
      { id: "u6-l7", title: "مبرهنتا رول والقيمة المتوسطة", duration: "23:35", kind: "video" },
      { id: "u6-l8", title: "القيم القصوى", duration: "30:12", kind: "video" },
      { id: "u6-l9", title: "دراسة تغير الدالة", duration: "28:47", kind: "video" },
      { id: "u6-l10", title: "مراجعة الوحدة", duration: "38:00", kind: "review" },
      { id: "u6-l11", title: "اختبار الوحدة", duration: "60 دقيقة", kind: "exam" },
    ],
  },
  {
    id: "u7",
    index: "07",
    title: "التكامل",
    desc: "طرق التكامل والمساحات والحجوم",
    formula: "∫ f(x) dx",
    icon: "Pi",
    lessons: [
      { id: "u7-l1", title: "التكامل غير المحدد", duration: "24:26", kind: "video" },
      { id: "u7-l2", title: "التكامل المحدد", duration: "27:03", kind: "video" },
      { id: "u7-l3", title: "التكامل بالتعويض", duration: "25:51", kind: "video" },
      { id: "u7-l4", title: "التكامل بالتجزئة", duration: "29:38", kind: "video" },
      { id: "u7-l5", title: "تكامل الدوال الكسرية", duration: "26:14", kind: "video" },
      { id: "u7-l6", title: "تطبيقات التكامل", duration: "23:49", kind: "video" },
      { id: "u7-l7", title: "حساب المساحات", duration: "28:05", kind: "video" },
      { id: "u7-l8", title: "حساب الحجوم الدورانية", duration: "30:57", kind: "video" },
      { id: "u7-l9", title: "مراجعة الوحدة", duration: "40:00", kind: "review" },
      { id: "u7-l10", title: "اختبار الوحدة", duration: "60 دقيقة", kind: "exam" },
    ],
  },
];

export const extraSections = [
  { id: "foundation", title: "تأسيس الرياضيات من الصفر", icon: "Blocks" },
  { id: "final-review", title: "المراجعة النهائية الشاملة", icon: "Target" },
  { id: "ministry", title: "النماذج الوزارية للأعوام السابقة", icon: "FileBadge" },
  { id: "bank", title: "بنك الأسئلة", icon: "LibraryBig" },
  { id: "formulas", title: "ملخصات القوانين الرياضية", icon: "NotebookPen" },
  { id: "trials", title: "الاختبارات التجريبية", icon: "Timer" },
];

export interface Pack {
  id: string;
  name: string;
  days: number;
  tagline: string;
  price: number;
  popular?: boolean;
  features: string[];
}

export const packs: Pack[] = [
  {
    id: "weekly",
    name: "الباقة الأسبوعية",
    days: 7,
    tagline: "للمراجعة السريعة",
    price: 3000,
    features: ["جميع المحاضرات", "ملفات PDF تعليمية", "اختبارات إلكترونية", "متابعة التقدم"],
  },
  {
    id: "monthly",
    name: "الباقة الشهرية",
    days: 30,
    tagline: "للدراسة المستمرة",
    price: 8000,
    popular: true,
    features: ["جميع المحاضرات", "ملفات PDF تعليمية", "اختبارات إلكترونية", "بنك الأسئلة", "أولوية الدعم"],
  },
  {
    id: "termly",
    name: "الباقة الفصلية",
    days: 90,
    tagline: "للدراسة خلال الفصل",
    price: 20000,
    features: ["جميع المحاضرات", "ملفات PDF تعليمية", "اختبارات إلكترونية", "بنك الأسئلة", "النماذج الوزارية"],
  },
  {
    id: "yearly",
    name: "الباقة السنوية",
    days: 365,
    tagline: "للدراسة طوال العام",
    price: 55000,
    features: ["كل مزايا المنصة", "المراجعة النهائية", "النماذج الوزارية", "ملخصات القوانين", "مجموعة واتساب"],
  },
];
