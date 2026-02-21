"use client";

import { ChevronDown, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en";

// Traducciones de países al español
const countryNamesES: Record<string, string> = {
  AR: "Argentina",
  BO: "Bolivia",
  BR: "Brasil",
  CL: "Chile",
  CO: "Colombia",
  CR: "Costa Rica",
  CU: "Cuba",
  DO: "República Dominicana",
  EC: "Ecuador",
  SV: "El Salvador",
  GT: "Guatemala",
  HN: "Honduras",
  MX: "México",
  NI: "Nicaragua",
  PA: "Panamá",
  PY: "Paraguay",
  PE: "Perú",
  PR: "Puerto Rico",
  ES: "España",
  US: "Estados Unidos",
  UY: "Uruguay",
  VE: "Venezuela",
};

// Función para obtener la bandera emoji del país
const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// Países prioritarios (Latinoamérica + España)
const priorityCountryCodes = [
  "AR", "BO", "BR", "CL", "CO", "CR", "CU", "DO", "EC", "SV", 
  "GT", "HN", "MX", "NI", "PA", "PY", "PE", "PR", "ES", "US", "UY", "VE",
] as const;

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function CountrySelect({ value, onChange, error }: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Obtener todos los países
  const allCountries = getCountries();
  
  // Ordenar países: prioritarios primero, luego el resto
  const sortedCountries = [
    ...priorityCountryCodes.filter(code => allCountries.includes(code)),
    ...allCountries.filter(code => !priorityCountryCodes.includes(code as typeof priorityCountryCodes[number])),
  ];

  // Filtrar países por búsqueda
  const filteredCountries = sortedCountries.filter((country) => {
    const name = countryNamesES[country] || (en as Record<string, string>)[country] || country;
    return name.toLowerCase().includes(search.toLowerCase());
  });

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus en el input de búsqueda al abrir
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const getCountryName = (code: string) => {
    return countryNamesES[code] || (en as Record<string, string>)[code] || code;
  };

  const _selectedCountryName = value ? getCountryName(
    sortedCountries.find(
      (code) => getCountryName(code) === value,
    ) || "",
  ) : "";

  const handleSelect = (countryCode: string) => {
    onChange(getCountryName(countryCode));
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="flex flex-col" ref={containerRef}>
      <label
        htmlFor="country"
        className="mb-1.5 font-display text-sm font-bold text-gray-700"
      >
        País
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full rounded-xl border px-4 py-3 text-left text-sm outline-none transition-all ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
              : "border-gray-200 focus:border-brand-cyan-dark focus:ring-4 focus:ring-brand-cyan-dark/10 hover:border-brand-cyan-dark/50"
          } bg-gray-50/50 flex items-center justify-between`}
        >
          <span className={value ? "text-gray-900" : "text-gray-500"}>
            {value ? (
              <span className="flex items-center gap-2">
                <span className="text-lg">
                  {getFlagEmoji(
                    sortedCountries.find(
                      (code) => getCountryName(code) === value,
                    ) || "",
                  )}
                </span>
                {value}
              </span>
            ) : (
              "Selecciona un país"
            )}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg">
            {/* Búsqueda */}
            <div className="border-b border-gray-100 p-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar país..."
                  className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-brand-cyan-dark"
                />
              </div>
            </div>

            {/* Lista de países */}
            <div className="max-h-60 overflow-y-auto">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((countryCode) => {
                  const name = getCountryName(countryCode);
                  const isSelected = value === name;
                  
                  return (
                    <button
                      key={countryCode}
                      type="button"
                      onClick={() => handleSelect(countryCode)}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                        isSelected
                          ? "bg-brand-cyan-dark/10 text-brand-cyan-dark"
                          : "text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-lg">{getFlagEmoji(countryCode)}</span>
                      <span className="flex-1">{name}</span>
                      <span className="text-xs text-gray-400">
                        +{getCountryCallingCode(countryCode)}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-6 text-center text-sm text-gray-500">
                  No se encontraron países
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
}
