import { allTools } from "@/data/tools/index";

export interface Tool {
  id: string;
  name: string;
  description: string;
  path: string;
  category?: string;
}

export function getAllTools(): Tool[] {
  return allTools || [];
}
