// Fails when public/.well-known/security.txt has expired and warns when it is close to expiring.
// RFC 9116 requires a valid Expires field; an expired file tells researchers to ignore it.
import { readFileSync } from "node:fs";

const FILE = "public/.well-known/security.txt";
const WARN_DAYS = 60;
const DAY = 24 * 60 * 60 * 1000;

export function daysUntilExpiry(text, now = new Date()) {
  const match = text.match(/^Expires:\s*(.+)$/m);
  if (!match) return null;
  const expires = new Date(match[1].trim());
  if (Number.isNaN(expires.getTime())) return null;
  return Math.floor((expires.getTime() - now.getTime()) / DAY);
}

export function evaluate(text, now = new Date()) {
  const days = daysUntilExpiry(text, now);
  if (days === null) return { level: "error", message: `${FILE} has no valid Expires field.` };
  if (days < 0) {
    return {
      level: "error",
      message: `${FILE} expired ${-days} day(s) ago. Renew its Expires field.`,
    };
  }
  if (days <= WARN_DAYS) {
    return {
      level: "warning",
      message: `${FILE} expires in ${days} day(s). Renew its Expires field.`,
    };
  }
  return { level: "ok", message: `${FILE} is valid for ${days} more day(s).` };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = evaluate(readFileSync(FILE, "utf8"));
  if (result.level === "error") {
    console.error(`::error::${result.message}`);
    process.exit(1);
  }
  if (result.level === "warning") console.warn(`::warning::${result.message}`);
  else console.log(result.message);
}
