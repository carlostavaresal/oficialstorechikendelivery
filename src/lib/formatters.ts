
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatCurrency(value: string | number): string {
  if (typeof value === "string") {
    return value; // Return as is if already formatted
  }
  
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(date: Date): string {
  return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

export function formatDistanceToNowLocalized(date: Date): string {
  return formatDistanceToNow(date, { 
    addSuffix: true,
    locale: ptBR 
  });
}
