import { financeTools } from "./finance";
import { healthTools } from "./health";
import { pdfTools } from "./pdf";
import { Tool } from "@/types/tool";

export const allTools: Tool[] = [
  ...financeTools,
  ...healthTools,
  ...pdfTools,
];
