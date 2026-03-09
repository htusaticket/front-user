"use client";

import { motion } from "framer-motion";
import { AlertTriangle, MessageCircle } from "lucide-react";
import Link from "next/link";

const WHATSAPP_NUMBER = "59891351103";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hola, mi cuenta en High Ticket USA ha sido suspendida. Me gustaría resolver esta situación y regularizar mi acceso.",
);

export default function Suspended() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto flex w-full max-w-md flex-col items-center text-center"
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-500">
        <AlertTriangle className="h-10 w-10" />
      </div>

      <h1 className="mb-4 font-display text-3xl font-bold text-gray-900">
        Cuenta Suspendida
      </h1>

      <p className="mb-8 text-gray-500 leading-relaxed">
        Lamentamos informarte que tu cuenta ha sido suspendida temporalmente
        debido a un incumplimiento de nuestros términos de servicio o falta de
        pago.
      </p>

      <div className="w-full rounded-2xl bg-gray-50 p-6 text-left">
        <h3 className="mb-2 font-bold text-gray-900">¿Quieres regularizar tu acceso?</h3>
        <p className="mb-4 text-sm text-gray-500">
          Ponte en contacto con nuestro equipo por WhatsApp para resolver tu situación rápidamente.
        </p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-bold text-white transition-colors hover:bg-green-700"
        >
          <MessageCircle className="h-4 w-4" />
          Contactar por WhatsApp
        </a>
      </div>

      <Link
        href="/"
        className="mt-6 text-sm font-bold text-gray-500 transition-colors hover:text-gray-700 hover:underline"
      >
        Volver al Inicio
      </Link>
    </motion.div>
  );
}
