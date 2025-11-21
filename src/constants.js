export const PRIORITY_OPTIONS = [
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
];

export const PRIORITY_LABEL = PRIORITY_OPTIONS.reduce((result, option) => {
  result[option.value] = option.label;
  return result;
}, {});

export const PRIORITY_RANK = PRIORITY_OPTIONS.reduce((result, option, index) => {
  result[option.value] = PRIORITY_OPTIONS.length - index;
  return result;
}, {});

export const DEFAULT_PRIORITY =
  PRIORITY_OPTIONS.find((option) => option.value === 'medium')?.value ||
  PRIORITY_OPTIONS[0].value;

