export interface FileDetails {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

export type ConversionMode = 'encode' | 'decode';