// Isolate numeric expressions so RTL prose does not reverse width × height examples.
export default function BidiText({ text }: { text: string }) {
  return <>{text.split(/(\d[\d.,]*(?:\s*[×÷/]\s*\d[\d.,]*)*(?:\s*%)?)/g).map((part, index) =>
    index % 2 ? <bdi key={index} dir="ltr">{part}</bdi> : part)}</>;
}
