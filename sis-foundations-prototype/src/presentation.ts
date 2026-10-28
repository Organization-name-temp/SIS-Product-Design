import { tr, type Locale } from "./shared";
const names: Record<string, [string, string, string]> = {
  stacked: ["Stacked", "متراص", "Empilé"],
  expanded: ["Expanded", "موسع", "Déplié"],
  default: ["Default", "افتراضي", "Par défaut"],
  alternate: ["Subtle surface", "سطح خفيف", "Surface discrète"],
  "long-content": ["Long content", "محتوى طويل", "Contenu long"],
  selected: ["Selected", "محدد", "Sélectionné"],
  hover: ["Hover", "تحويم", "Survol"],
  focus: ["Focus", "تركيز", "Focus"],
  pressed: ["Pressed", "مضغوط", "Appuyé"],
  disabled: ["Disabled", "معطل", "Désactivé"],
  "read-only": ["Read-only", "قراءة فقط", "Lecture seule"],
  invalid: ["Invalid", "غير صالح", "Non valide"],
  pending: ["Pending", "قيد الانتظار", "En attente"],
  empty: ["Empty", "فارغ", "Vide"],
  "no-results": ["No results", "لا نتائج", "Aucun résultat"],
  error: ["Error", "خطأ", "Erreur"],
  success: ["Success", "نجاح", "Succès"],
  denied: ["Access denied", "الوصول مرفوض", "Accès refusé"],
  conflict: ["Conflict", "تعارض", "Conflit"],
  partial: ["Partial results", "نتائج جزئية", "Résultats partiels"],
  unavailable: [
    "Service unavailable",
    "الخدمة غير متاحة",
    "Service indisponible",
  ],
  "session-expired": ["Session expired", "انتهت الجلسة", "Session expirée"],
  loading: ["Loading", "جار التحميل", "Chargement"],
};
export function presentationName(name: string, locale: Locale) {
  return names[name] ? tr(locale, ...names[name]) : name;
}
