import {
  Braces,
  CaseSensitive,
  FileArchive,
  FileCode2,
  FileInput,
  FilePlus2,
  ImageDown,
  ImageMinus,
  ImageUp,
  KeyRound,
  LockKeyhole,
  QrCode,
  ScanLine,
  Shuffle,
} from "lucide-react";
import type { CategoryMeta, ToolModule } from "@/lib/tools/types";
import { Base64Tool } from "@/tools/developer/base64-tool";
import { JsonFormatterTool } from "@/tools/developer/json-formatter-tool";
import { JwtDecoderTool } from "@/tools/developer/jwt-decoder-tool";
import { UuidGeneratorTool } from "@/tools/developer/uuid-generator-tool";
import { ImageCompressorTool } from "@/tools/image/image-compressor-tool";
import { ImageConverterTool } from "@/tools/image/image-converter-tool";
import { ImageResizerTool } from "@/tools/image/image-resizer-tool";
import { PdfUtilityTool } from "@/tools/pdf/pdf-utility-tool";
import { TextCaseTool } from "@/tools/text/text-case-tool";
import { PasswordGeneratorTool } from "@/tools/utility/password-generator-tool";
import { QrGeneratorTool } from "@/tools/utility/qr-generator-tool";

export const categories: CategoryMeta[] = [
  {
    slug: "pdf",
    name: "PDF Tools",
    description: "Merge, split, and compress documents in secure workflows.",
    href: "/categories/pdf"
  },
  {
    slug: "image",
    name: "Image Tools",
    description: "Convert, resize, and optimize images for web and product teams.",
    href: "/categories/image"
  },
  {
    slug: "developer",
    name: "Developer Tools",
    description: "Format, decode, generate, and validate common developer data.",
    href: "/categories/developer"
  },
  {
    slug: "text",
    name: "Text Tools",
    description: "Transform and normalize copy without losing momentum.",
    href: "/categories/text"
  },
  {
    slug: "utility",
    name: "Utility Tools",
    description: "Generate QR codes, passwords, and everyday helpers.",
    href: "/categories/utility"
  }
];

export const tools: ToolModule[] = [
  {
    slug: "jpg-to-png",
    name: "JPG to PNG",
    shortDescription: "Convert JPG files into transparent-ready PNG images.",
    description: "Upload a JPG image and export it as a high-quality PNG.",
    category: "image",
    popular: true,
    icon: ImageDown,
    keywords: ["jpg", "jpeg", "png", "convert", "image"],
    component: () => <ImageConverterTool from="image/jpeg" to="image/png" label="Convert JPG to PNG" />
  },
  {
    slug: "png-to-jpg",
    name: "PNG to JPG",
    shortDescription: "Create compact JPG files from PNG images.",
    description: "Convert PNG images to JPG with a white background for compatibility.",
    category: "image",
    icon: ImageUp,
    keywords: ["png", "jpg", "jpeg", "convert", "image"],
    component: () => <ImageConverterTool from="image/png" to="image/jpeg" label="Convert PNG to JPG" />
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    shortDescription: "Compress images for faster websites and uploads.",
    description: "Reduce image file size while preserving crisp visual quality.",
    category: "image",
    popular: true,
    icon: ImageMinus,
    keywords: ["compress", "optimize", "image", "size"],
    component: ImageCompressorTool
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    shortDescription: "Resize images to exact dimensions.",
    description: "Set width and height, preview the output, and download instantly.",
    category: "image",
    icon: ScanLine,
    keywords: ["resize", "dimensions", "image", "crop"],
    component: ImageResizerTool
  },
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    shortDescription: "Combine multiple PDF files into one document.",
    description: "Merge PDFs in order directly in your browser.",
    category: "pdf",
    popular: true,
    icon: FilePlus2,
    keywords: ["pdf", "merge", "combine"],
    component: () => <PdfUtilityTool mode="merge" />
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    shortDescription: "Extract selected pages from a PDF.",
    description: "Split a PDF into a focused file by page range.",
    category: "pdf",
    icon: FileInput,
    keywords: ["pdf", "split", "pages"],
    component: () => <PdfUtilityTool mode="split" />
  },
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    shortDescription: "Optimize PDF files for sharing.",
    description: "Re-save PDF documents for cleaner, lighter sharing.",
    category: "pdf",
    icon: FileArchive,
    keywords: ["pdf", "compress", "optimize"],
    component: () => <PdfUtilityTool mode="compress" />
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    shortDescription: "Format, validate, and minify JSON.",
    description: "Paste JSON to validate, format, and minify it instantly.",
    category: "developer",
    popular: true,
    icon: Braces,
    keywords: ["json", "formatter", "developer", "beautify"],
    component: JsonFormatterTool
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    shortDescription: "Decode JWT headers and payloads safely.",
    description: "Inspect JWT token content without sending it to a server.",
    category: "developer",
    icon: KeyRound,
    keywords: ["jwt", "token", "decode"],
    component: JwtDecoderTool
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    shortDescription: "Generate UUID v4 identifiers.",
    description: "Create unique IDs for development, testing, and data modeling.",
    category: "developer",
    icon: Shuffle,
    keywords: ["uuid", "guid", "id", "generator"],
    component: UuidGeneratorTool
  },
  {
    slug: "base64-encode-decode",
    name: "Base64 Encode/Decode",
    shortDescription: "Encode and decode Base64 strings.",
    description: "Convert plain text to Base64 and decode Base64 back to text.",
    category: "developer",
    icon: FileCode2,
    keywords: ["base64", "encode", "decode"],
    component: Base64Tool
  },
  {
    slug: "qr-generator",
    name: "QR Generator",
    shortDescription: "Generate QR codes for links and text.",
    description: "Create downloadable QR codes for URLs, contact points, and campaigns.",
    category: "utility",
    popular: true,
    icon: QrCode,
    keywords: ["qr", "code", "generator"],
    component: QrGeneratorTool
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    shortDescription: "Generate secure passwords.",
    description: "Create strong passwords with custom length and character options.",
    category: "utility",
    icon: LockKeyhole,
    keywords: ["password", "security", "random"],
    component: PasswordGeneratorTool
  },
  {
    slug: "text-case-converter",
    name: "Text Case Converter",
    shortDescription: "Convert text between common case formats.",
    description: "Transform text into sentence, title, uppercase, lowercase, slug, or camel case.",
    category: "text",
    icon: CaseSensitive,
    keywords: ["text", "case", "converter", "slug"],
    component: TextCaseTool
  }
];

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getToolsByCategory(category: string) {
  return tools.filter((tool) => tool.category === category);
}

export function searchTools(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return tools;

  return tools.filter((tool) =>
    [tool.name, tool.shortDescription, tool.category, ...tool.keywords].some((value) =>
      value.toLowerCase().includes(normalized)
    )
  );
}
