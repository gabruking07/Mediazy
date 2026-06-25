import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

export type ToolCategory = "pdf" | "image" | "developer" | "text" | "utility";

export type ToolModule = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: ToolCategory;
  popular?: boolean;
  icon: LucideIcon;
  keywords: string[];
  component: ComponentType;
};

export type CategoryMeta = {
  slug: ToolCategory;
  name: string;
  description: string;
  href: string;
};
