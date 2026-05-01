const EXPORT_FILENAMES = {
  json: 'time-entries.json',
  csv: 'time-entries.csv',
};

const EXPORT_MIME_TYPES = {
  json: 'application/json',
  csv: 'text/csv;charset=utf-8',
};

const escapeCsvValue = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;

const getTagsValue = (tags) => (Array.isArray(tags) ? tags.join('|') : '');

export const downloadFile = (filename, content, type) => {
  const file = content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const toCsv = (items) => {
  const hasUsers = items.some((item) => item.user);
  const headers = [
    ...(hasUsers ? ['userId', 'userEmail', 'username', 'userName'] : []),
    'name',
    'project',
    'tags',
    'date',
    'startAt',
    'endAt',
    'durationSeconds',
    'type',
    'isActive',
  ];
  const rows = items.map((item) =>
    [
      ...(hasUsers ? [item.user?.id, item.user?.email, item.user?.username, item.user?.name] : []),
      item.name,
      item.project,
      getTagsValue(item.tags),
      item.date,
      item.startAt,
      item.endAt,
      item.durationSeconds,
      item.type,
      item.isActive,
    ]
      .map(escapeCsvValue)
      .join(','),
  );

  return [headers.join(','), ...rows].join('\n');
};

export const exportJson = (entries) => {
  downloadFile(
    EXPORT_FILENAMES.json,
    JSON.stringify(Array.isArray(entries) ? entries : [], null, 2),
    EXPORT_MIME_TYPES.json,
  );
};

export const exportCsv = (entries) => {
  downloadFile(EXPORT_FILENAMES.csv, toCsv(Array.isArray(entries) ? entries : []), EXPORT_MIME_TYPES.csv);
};

export const getExportFilename = (format) => EXPORT_FILENAMES[format] || `time-entries.${format}`;

export const downloadApiExport = (response, format) => {
  const contentDisposition = response?.headers?.['content-disposition'] || '';
  const filenameMatch = contentDisposition.match(/filename\*?=(?:UTF-8''|")?([^";]+)"?/i);
  const filename = filenameMatch?.[1] ? decodeURIComponent(filenameMatch[1]) : getExportFilename(format);

  downloadFile(filename, response?.data, EXPORT_MIME_TYPES[format]);
};
