"use client";

import { motion } from "framer-motion";
import { Clock, MessageCircle } from "lucide-react";
import Link from "next/link";

const WHATSAPP_NUMBER = "59891351103";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hola, me registré en High Ticket English y mi cuenta está pendiente de aprobación. ¿Podrían ayudarme?",
);

export default function Pending() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto flex w-full max-w-md flex-col items-center text-center"
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-500">
        <Clock className="h-10 w-10" />
      </div>

      <h1 className="mb-4 font-display text-3xl font-bold text-gray-900">
        Cuenta en Revisión
      </h1>

      <p className="mb-8 text-gray-500 leading-relaxed">
        Tu solicitud de registro ha sido recibida y está siendo procesada por
        nuestro equipo. Te notificaremos por correo electrónico una vez que tu
        cuenta haya sido aprobada.
      </p>

      <div className="space-y-4 w-full">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 text-sm font-bold text-white transition-colors hover:bg-green-700"
        >
          <MessageCircle className="h-4 w-4" />
          Contactar Soporte
        </a>
        
        <Link
          href="/"
          className="block w-full rounded-xl bg-gray-100 py-3.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200"
        >
          Volver al Inicio
        </Link>
      </div>
    </motion.div>
  );
}
