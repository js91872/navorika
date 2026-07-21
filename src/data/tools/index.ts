import { financeTools } from "./finance";
import { healthTools } from "./health";
import { pdfTools } from "./pdf";
import { imageTools } from "./image";
import { developerTools } from "./developer";
import { Tool } from "@/types/tool";

export const allTools: Tool[] = [
  ...financeTools,
  ...healthTools,
  ...pdfTools,
  ...imageTools,
  ...developerTools,
];
