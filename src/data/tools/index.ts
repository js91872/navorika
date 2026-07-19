import { financeTools } from "./finance";
import { healthTools } from "./health";
import { Tool } from "@/types/tool";

export const allTools: Tool[] = [
  ...financeTools,
  ...healthTools,
];
