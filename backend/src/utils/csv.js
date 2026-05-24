const escapeCell = (value) => {
  const normalized = value === undefined || value === null ? "" : String(value);
  return `"${normalized.replaceAll('"', '""')}"`;
};

export const toCsv = (rows) => {
  const headers = ["Type", "Amount", "Category", "Date", "Description", "Tags"];
  const lines = rows.map((row) =>
    [
      row.type,
      row.amount,
      row.category,
      row.date?.toISOString?.().slice(0, 10) ?? row.date,
      row.description,
      row.tags?.join(", ")
    ]
      .map(escapeCell)
      .join(",")
  );

  return [headers.map(escapeCell).join(","), ...lines].join("\n");
};
