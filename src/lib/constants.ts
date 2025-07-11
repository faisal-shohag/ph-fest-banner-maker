import { Canvas } from "fabric";
import ImageKit from "imagekit";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
} from "lucide-react";
import { FaFileAlt, FaPalette } from "react-icons/fa";
import { FaDesktop, FaRegImage } from "react-icons/fa6";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";

export const fontFamily = [
  { title: "Aladin", family: '"Aladin", cursive', sample: "AaBbzZ" },
  { title: "আত্মা", family: '"Atma", cursive', sample: "অ আ ক খ" },
  { title: "বালু ডা ২", family: '"Baloo Da 2", cursive', sample: "অ আ ক খ" },
  { title: "Bonbon", family: '"Bonbon", cursive', sample: "AaBbzZ" },
  {
    title: "Bungee Shade",
    family: '"Bungee Shade", display',
    sample: "AaBbzZ",
  },
  {
    title: "Bungee Spice",
    family: '"Bungee Spice", display',
    sample: "AaBbzZ",
  },
  {
    title: "Bungee Tint",
    family: '"Bungee Tint", display',
    sample: "AaBbzZ",
  },
  {
    title: "DM Serif Text",
    family: '"DM Serif Text", serif',
    sample: "AaBbzZ",
  },
  { title: "Eater", family: '"Eater", cursive', sample: "AaBbzZ" },
  { title: "Faster One", family: '"Faster One", cursive', sample: "AaBbzZ" },
  { title: "গালাডা", family: '"Galada", cursive', sample: "অ আ ক খ" },
  {
    title: "হিন্দ শিলিগুড়ি",
    family: '"Hind Siliguri", sans-serif',
    sample: "অ আ ক খ",
  },
  {
    title: "Imperial Script",
    family: '"Imperial Script", cursive',
    sample: "AaBbzZ",
  },
  { title: "Inter", family: '"Inter", sans-serif', sample: "AaBbzZ" },
  { title: "Jost", family: '"Jost", sans-serif', sample: "AaBbzZ" },
  {
    title: "Kalnia Glaze",
    family: '"Kalnia Glaze", sans-serif',
    sample: "AaBbzZ",
  },
  { title: "কালপুরুষ", family: '"Kalpurush", serif', sample: "অ আ ক খ" },
  { title: "Lato", family: '"Lato", sans-serif', sample: "AaBbzZ" },
  {
    title: "Lavishly Yours",
    family: '"Lavishly Yours", cursive',
    sample: "AaBbzZ",
  },
  { title: "Lexend", family: '"Lexend", sans-serif', sample: "AaBbzZ" },
  {
    title: "Londrina Outline",
    family: '"Londrina Outline", display',
    sample: "AaBbzZ",
  },
  { title: "Lora", family: '"Lora", serif', sample: "AaBbzZ" },
  { title: "Manrope", family: '"Manrope", sans-serif', sample: "AaBbzZ" },
  { title: "মিনা", family: '"Mina", sans-serif', sample: "অ আ ক খ" },
  {
    title: "Montserrat",
    family: '"Montserrat", sans-serif',
    sample: "AaBbzZ",
  },
  {
    title: "Moo Lah Lah",
    family: '"Moo Lah Lah", cursive',
    sample: "AaBbzZ",
  },
  { title: "Nabla", family: '"Nabla", display', sample: "AaBbzZ" },
  {
    title: "Noto Sans Bengali",
    family: '"নোটো স্যান্স বাংলা", sans-serif',
    sample: "অ আ ক খ",
  },
  { title: "Noto Sans", family: '"Noto Sans", sans-serif', sample: "AaBbzZ" },
  {
    title: "নোটো শেরিফ বাংলা",
    family: '"Noto Serif Bengali", serif',
    sample: "অ আ ক খ",
  },
  { title: "Orbitron", family: '"Orbitron", sans-serif', sample: "AaBbzZ" },
  { title: "Outfit", family: '"Outfit", sans-serif', sample: "AaBbzZ" },
  { title: "Roboto", family: '"Roboto", sans-serif', sample: "AaBbzZ" },
  {
    title: "Rubik Distressed",
    family: '"Rubik Distressed", cursive',
    sample: "AaBbzZ",
  },
  {
    title: "Rubik Gemstones",
    family: '"Rubik Gemstones", cursive',
    sample: "AaBbzZ",
  },
  {
    title: "Rubik Glitch",
    family: '"Rubik Glitch", cursive',
    sample: "AaBbzZ",
  },
  {
    title: "Rubik Moonrocks",
    family: '"Rubik Moonrocks", cursive',
    sample: "AaBbzZ",
  },
  {
    title: "শ্রেয়াম ইউনিকোড",
    family: "Li Sweet Shreyam Unicode",
    sample: "অ আ ক খ",
  },
  { title: "SUSE", family: '"SUSE", sans-serif', sample: "AaBbzZ" },
  { title: "Tangerine", family: '"Tangerine", cursive', sample: "AaBbzZ" },
  { title: "তিরো বাংলা", family: '"Tiro Bangla", serif', sample: "অ আ ক খ" },
  {
    title: "Titillium Web",
    family: '"Titillium Web", sans-serif',
    sample: "AaBbzZ",
  },
  {
    title: "UnifrakturMaguntia",
    family: '"UnifrakturMaguntia", cursive',
    sample: "AaBbzZ",
  },
];

export const textAlignOptions = [
  {
    align: "alignLeft",
    Icon: AlignLeftIcon,
  },
  {
    align: "alignRight",
    Icon: AlignRightIcon,
  },
  {
    align: "alignCenter",
    Icon: AlignCenterIcon,
  },
  {
    align: "alignJustify",
    Icon: AlignJustifyIcon,
  },
];

export const fontSizes = Array.from({ length: 50 }, (_, i) => i + 10);

export const newCanvas = {
  version: "6.7.0",
  objects: [],
  background: "#adafb3",
};

export const fromNow = (dateString) => {
  const date: any = new Date(dateString);
  const now: any = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
  return date.toLocaleDateString();
};

export const createThumbnailFromCanvas = (fabCanvas) => {
  if (fabCanvas) {
    const dataURL = fabCanvas.toDataURL({
      format: "png",
      quality: 0.5,
      multiplier: 0.2,
    });
    return dataURL;
  }
};
export const imageKit = new ImageKit({
  publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY as string,
  privateKey: import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY as string,
  urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT as string,
});

export const canvasToBlob = (fabCanvas: Canvas, quality = 0.5) => {
  const canvas = fabCanvas.getElement();
  return new Promise((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", quality);
  });
};

export const resizeSvg = (svgString, width, height) => {
  // Input validation
  if (typeof svgString !== "string" || !svgString.trim()) {
    throw new Error("Invalid SVG string");
  }
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    throw new Error("Width and height must be positive numbers");
  }

  // Check if the string contains an SVG tag
  if (!svgString.includes("<svg")) {
    throw new Error("Input does not contain an SVG tag");
  }

  // Function to normalize units (optional, assumes pixels if no unit provided)
  const normalizeDimension = (value) => {
    return typeof value === "string" &&
      value.match(/^\d+(\.\d+)?(%|px|em|rem)?$/)
      ? value
      : `${value}px`;
  };

  const normalizedWidth = normalizeDimension(width);
  const normalizedHeight = normalizeDimension(height);

  // Replace or add width and height attributes
  let result = svgString;

  // Check if SVG tag already has width/height attributes
  if (/<svg[^>]*width=/.test(svgString)) {
    // Replace existing width
    result = result.replace(
      /(<svg[^>]*width=")[^"]*(")/,
      `$1${normalizedWidth}$2`
    );
  } else {
    // Add width attribute
    result = result.replace(/(<svg[^>]*)>/, `$1 width="${normalizedWidth}">`);
  }

  if (/<svg[^>]*height=/.test(svgString)) {
    // Replace existing height
    result = result.replace(
      /(<svg[^>]*height=")[^"]*(")/,
      `$1${normalizedHeight}$2`
    );
  } else {
    // Add height attribute
    result = result.replace(/(<svg[^>]*)>/, `$1 height="${normalizedHeight}">`);
  }

  return result;
};

export const isSVGString = (svg) => {
  return svg.trim().startsWith("<svg");
};

export const canvasPresets = {
  reels: {
    name: "Reels",
    width: 1080,
    height: 1920,
    description: "Perfect square format for Reels",
    icon: HiOutlineDevicePhoneMobile,
  },
  twitterPost: { width: 1200, height: 675 },
  normal: {
    name: "Standard Canvas",
    width: 800,
    height: 600,
    description: "Versatile canvas for any design",
    icon: FaPalette,
  },
  logo: {
    name: "Logo Design",
    width: 500,
    height: 500,
    description: "Perfect square for logo creation",
    icon: FaPalette,
  },
  a4Portrait: {
    name: "A4 Portrait",
    width: 794,
    height: 1123,
    description: "Standard document format",
    icon: FaFileAlt,
  },
  a4Landscape: {
    name: "A4 Landscape",
    width: 1123,
    height: 794,
    description: "Horizontal document layout",
    icon: FaFileAlt,
  },
  socialPost: {
    name: "Social Media",
    width: 1080,
    height: 1080,
    description: "Universal social media format",
    icon: FaRegImage,
  },
  presentation: {
    name: "Presentation",
    width: 1280,
    height: 720,
    description: "HD presentation slides",
    icon: FaDesktop,
  },
};

export function getAspectRatio(width, height) {
  function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
  }

  const divisor = gcd(width, height);
  const ratioWidth = width / divisor;
  const ratioHeight = height / divisor;

  return `${ratioWidth}:${ratioHeight}`;
}
