export type XmlToWordMode = 'hierarchy' | 'table' | 'raw';
export type WordToXmlMode = 'structured' | 'raw';
export interface XmlTreeNode { name: string; attributes: Record<string, string>; children: XmlTreeNode[]; text: string }
export interface ConversionResult { blob: Blob; fileName: string; warnings: string[] }
