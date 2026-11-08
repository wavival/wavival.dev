import type { Lang } from "@/i18n/utils";

/** Public WhatsApp number of wavival, in international format without the plus sign. */
export const WHATSAPP_NUMBER = "573016560222";

/** Prefilled message every WhatsApp link on the site opens with, by page language. */
export const WHATSAPP_MESSAGE: Record<Lang, string> = {
  es: "Hola, vengo de wavival.dev y quiero solicitar un servicio.",
  en: "Hi, I'm coming from wavival.dev and I'd like to request a service.",
};

export const whatsappHref = (lang: Lang) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE[lang])}`;
