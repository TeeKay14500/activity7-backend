const STATUSES = ["Pending", "In progress", "Completed"];

const RULES = [
  { field: "title", label: "Title", min: 3, max: 80 },
  { field: "category", label: "Category", min: 2, max: 40 },
  { field: "description", label: "Description", min: 5, max: 300 },
];

// Returns a positive integer, or null if the value is not one.
function parseId(value) {
  if (!/^[0-9]+$/.test(String(value))) return null;
  const n = Number(value);
  return Number.isSafeInteger(n) && n > 0 ? n : null;
}

// Returns { error } or { value } with the four trimmed editable fields. Any id in body is ignored.
function validateRecord(body) {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Request body must be a JSON object." };
  }
  const value = {};
  for (const { field, label, min, max } of RULES) {
    const raw = body[field];
    if (raw === undefined || raw === null) return { error: `${label} is required.` };
    if (typeof raw !== "string") return { error: `${label} must be a string.` };
    const text = raw.trim();
    if (text.length < min || text.length > max) {
      return { error: `${label} must have ${min} to ${max} characters.` };
    }
    value[field] = text;
  }
  const status = body.status;
  if (status === undefined || status === null) return { error: "Status is required." };
  if (typeof status !== "string") return { error: "Status must be a string." };
  const s = status.trim();
  if (!STATUSES.includes(s)) {
    return { error: "Status must be one of: Pending, In progress, Completed." };
  }
  value.status = s;
  return { value };
}

module.exports = { parseId, validateRecord, STATUSES };
