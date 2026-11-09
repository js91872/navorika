import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import CmykColorConverter from '@/components/tools/CmykColorConverter';
export default function Page(){
  return <ExpansionToolPage category="image-tools" eyebrow="CMYK, RGB and HEX Color Values" title="CMYK Color Converter — CMYK to HEX and RGB" description="Convert CMYK percentages to approximate HEX and RGB colors, or enter HEX to estimate CMYK values. Free browser-based color calculator." slug="cmyk-color-converter"><CmykColorConverter/></ExpansionToolPage>;
}
