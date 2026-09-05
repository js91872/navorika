export interface ImageBandwidthInput {
  imageSizeKb: number;
  imagesPerView: number;
  pageViews: number;
}

export interface ImageBandwidthResult {
  dataPerViewKb: number;
  totalTransferKb: number;
  totalTransferMb: number;
  totalTransferGb: number;
  [key: string]: number | string | null;
}

export function calculateImageBandwidth(input: ImageBandwidthInput): ImageBandwidthResult {
  const imageSizeKb = Number.isFinite(input.imageSizeKb) ? Math.max(0, input.imageSizeKb) : 0;
  const imagesPerView = Number.isFinite(input.imagesPerView) ? Math.max(0, input.imagesPerView) : 0;
  const pageViews = Number.isFinite(input.pageViews) ? Math.max(0, input.pageViews) : 0;

  const dataPerViewKb = Number((imageSizeKb * imagesPerView).toFixed(2));
  const totalTransferKb = Number((dataPerViewKb * pageViews).toFixed(2));
  // Binary convention: 1 MB = 1024 KB, 1 GB = 1024 MB
  const totalTransferMb = Number((totalTransferKb / 1024).toFixed(2));
  const totalTransferGb = Number((totalTransferMb / 1024).toFixed(3));

  return {
    dataPerViewKb,
    totalTransferKb,
    totalTransferMb,
    totalTransferGb,
  };
}
