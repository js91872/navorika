"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";

const MAX_FILES = 500;
const MAX_TOTAL_BYTES = 10 * 1024 * 1024;
const PREVIEW_LIMIT = 200_000;

type MergeMode = "matching-root" | "wrapper";

type InputFile = {
  id: string;
  file: File;
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function escapeXmlAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function parserError(document: XMLDocument): string | null {
  const errors = document.getElementsByTagName("parsererror");

  if (errors.length > 0) {
    return errors[0].textContent?.trim() || "Invalid XML document.";
  }

  if (!document.documentElement) {
    return "The XML document does not contain a root element.";
  }

  return null;
}

export default function XmlMergeTool() {
  const [files, setFiles] = useState<InputFile[]>([]);
  const [mode, setMode] = useState<MergeMode>("matching-root");
  const [wrapperName, setWrapperName] = useState("merged");
  const [outputName, setOutputName] = useState("merged.xml");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const cancelled = useRef(false);

  const totalBytes = files.reduce((sum, item) => sum + item.file.size, 0);

  function addFiles(selected: File[]) {
    setError("");
    setResult("");

    const xmlFiles = selected.filter(
      (file) =>
        file.name.toLowerCase().endsWith(".xml") ||
        file.type === "application/xml" ||
        file.type === "text/xml"
    );

    if (xmlFiles.length !== selected.length) {
      setError("Only XML files can be added.");
      return;
    }

    const next = [
      ...files,
      ...xmlFiles.map((file, index) => ({
        id: `${file.name}-${file.size}-${file.lastModified}-${Date.now()}-${index}`,
        file,
      })),
    ];

    if (next.length > MAX_FILES) {
      setError(`You can merge a maximum of ${MAX_FILES} XML files.`);
      return;
    }

    const nextSize = next.reduce((sum, item) => sum + item.file.size, 0);

    if (nextSize > MAX_TOTAL_BYTES) {
      setError(
        `The selected files total ${formatBytes(nextSize)}. The maximum combined size is 10 MB.`
      );
      return;
    }

    setFiles(next);
  }

  function handleSelection(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) addFiles(Array.from(event.target.files));
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    addFiles(Array.from(event.dataTransfer.files));
  }

  function moveFile(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= files.length) return;

    const next = [...files];
    [next[index], next[target]] = [next[target], next[index]];
    setFiles(next);
    setResult("");
  }

  function removeFile(id: string) {
    setFiles((current) => current.filter((item) => item.id !== id));
    setResult("");
    setError("");
  }

  function clearAll() {
    cancelled.current = true;
    setFiles([]);
    setResult("");
    setError("");
    setProgress(0);
    setProcessing(false);
  }

  async function mergeFiles() {
    setError("");
    setResult("");

    if (files.length < 2) {
      setError("Add at least two XML files to merge.");
      return;
    }

    if (
      mode === "wrapper" &&
      !/^[A-Za-z_][A-Za-z0-9_.-]*$/.test(wrapperName)
    ) {
      setError("Enter a valid XML wrapper element name.");
      return;
    }

    setProcessing(true);
    setProgress(0);
    cancelled.current = false;

    try {
      const parser = new DOMParser();
      const serializer = new XMLSerializer();
      const documents: { name: string; document: XMLDocument }[] = [];

      for (let index = 0; index < files.length; index++) {
        if (cancelled.current) return;

        const item = files[index];
        const text = await item.file.text();
        const document = parser.parseFromString(text, "application/xml");
        const validationError = parserError(document);

        if (validationError) {
          throw new Error(
            `${item.file.name} is not valid XML. ${validationError.slice(0, 300)}`
          );
        }

        documents.push({ name: item.file.name, document });
        setProgress(Math.round(((index + 1) / files.length) * 70));

        if (index % 10 === 0) {
          await new Promise<void>((resolve) =>
            requestAnimationFrame(() => resolve())
          );
        }
      }

      if (cancelled.current) return;

      let merged = '<?xml version="1.0" encoding="UTF-8"?>\n';

      if (mode === "matching-root") {
        const firstRoot = documents[0].document.documentElement;
        const expectedName = firstRoot.tagName;
        const expectedNamespace = firstRoot.namespaceURI;

        for (const item of documents.slice(1)) {
          const root = item.document.documentElement;

          if (
            root.tagName !== expectedName ||
            root.namespaceURI !== expectedNamespace
          ) {
            throw new Error(
              `${item.name} has root <${root.tagName}>, but the first file has root <${expectedName}>. Use “Wrap complete documents” for files with different roots.`
            );
          }
        }

        const attributes = Array.from(firstRoot.attributes)
          .map(
            (attribute) =>
              ` ${attribute.name}="${escapeXmlAttribute(attribute.value)}"`
          )
          .join("");

        const children: string[] = [];

        for (const item of documents) {
          const root = item.document.documentElement;

          for (const node of Array.from(root.childNodes)) {
            children.push(serializer.serializeToString(node));
          }
        }

        merged += `<${expectedName}${attributes}>`;
        if (children.length) merged += `\n${children.join("\n")}\n`;
        merged += `</${expectedName}>`;
      } else {
        const children = documents.map(({ document }) =>
          serializer.serializeToString(document.documentElement)
        );

        merged += `<${wrapperName}>\n${children.join("\n")}\n</${wrapperName}>`;
      }

      if (cancelled.current) return;

      const validation = parser.parseFromString(merged, "application/xml");
      const finalError = parserError(validation);

      if (finalError) {
        throw new Error(
          `The merged output could not be validated. ${finalError.slice(0, 300)}`
        );
      }

      setResult(merged);
      setProgress(100);
    } catch (exception) {
      setProgress(0);
      setError(
        exception instanceof Error
          ? exception.message
          : "The XML files could not be merged."
      );
    } finally {
      setProcessing(false);
    }
  }

  function downloadResult() {
    if (!result) return;

    const filename = outputName.trim().toLowerCase().endsWith(".xml")
      ? outputName.trim()
      : `${outputName.trim() || "merged"}.xml`;

    const blob = new Blob([result], {
      type: "application/xml;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div
          onDragEnter={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`rounded-xl border-2 border-dashed p-8 text-center transition ${
            dragging
              ? "border-blue-500 bg-blue-50"
              : "border-slate-300 bg-slate-50"
          }`}
        >
          <p className="font-semibold text-slate-900">
            Drop XML files here
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Add up to 500 files with a combined size of 10 MB.
          </p>

          <label className="mt-5 inline-flex cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700">
            Select XML files
            <input
              type="file"
              accept=".xml,application/xml,text/xml"
              multiple
              onChange={handleSelection}
              className="sr-only"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap justify-between gap-2 text-sm text-slate-600">
          <span>{files.length} / 500 files</span>
          <span>{formatBytes(totalBytes)} / 10 MB</span>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
          >
            {error}
          </div>
        )}
      </section>

      {files.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Files and merge order
            </h2>
            <button
              type="button"
              onClick={clearAll}
              className="text-sm font-medium text-red-600 hover:text-red-700"
            >
              Clear all
            </button>
          </div>

          <ol className="mt-4 max-h-80 space-y-2 overflow-y-auto">
            {files.map((item, index) => (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-lg border border-slate-200 p-3"
              >
                <span className="w-8 text-sm text-slate-500">
                  {index + 1}.
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-800">
                    {item.file.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatBytes(item.file.size)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => moveFile(index, -1)}
                  disabled={index === 0}
                  aria-label={`Move ${item.file.name} up`}
                  className="rounded border px-2 py-1 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveFile(index, 1)}
                  disabled={index === files.length - 1}
                  aria-label={`Move ${item.file.name} down`}
                  className="rounded border px-2 py-1 disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeFile(item.id)}
                  aria-label={`Remove ${item.file.name}`}
                  className="rounded border border-red-200 px-2 py-1 text-red-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ol>
        </section>
      )}

      {files.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-lg font-semibold text-slate-900">
            Merge settings
          </h2>

          <fieldset className="mt-4 space-y-3">
            <label className="flex cursor-pointer gap-3 rounded-lg border p-4">
              <input
                type="radio"
                checked={mode === "matching-root"}
                onChange={() => setMode("matching-root")}
                className="mt-1"
              />
              <span>
                <span className="block font-medium text-slate-900">
                  Merge children of matching roots
                </span>
                <span className="block text-sm text-slate-600">
                  Best when every file has the same root element.
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer gap-3 rounded-lg border p-4">
              <input
                type="radio"
                checked={mode === "wrapper"}
                onChange={() => setMode("wrapper")}
                className="mt-1"
              />
              <span>
                <span className="block font-medium text-slate-900">
                  Wrap complete documents
                </span>
                <span className="block text-sm text-slate-600">
                  Keeps each original root inside one new wrapper element.
                </span>
              </span>
            </label>
          </fieldset>

          {mode === "wrapper" && (
            <label className="mt-4 block">
              <span className="text-sm font-medium text-slate-700">
                Wrapper element name
              </span>
              <input
                value={wrapperName}
                onChange={(event) => setWrapperName(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              />
            </label>
          )}

          <label className="mt-4 block">
            <span className="text-sm font-medium text-slate-700">
              Output filename
            </span>
            <input
              value={outputName}
              onChange={(event) => setOutputName(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
          </label>

          {processing && (
            <div className="mt-5">
              <div className="mb-2 flex justify-between text-sm text-slate-600">
                <span>Validating and merging files…</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-blue-600 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={mergeFiles}
              disabled={processing || files.length < 2}
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {processing ? "Merging…" : "Merge XML files"}
            </button>

            {processing && (
              <button
                type="button"
                onClick={() => {
                  cancelled.current = true;
                  setProcessing(false);
                  setProgress(0);
                }}
                className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700"
              >
                Cancel
              </button>
            )}
          </div>
        </section>
      )}

      {result && (
        <section className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-emerald-800">
                XML files merged successfully
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Output size: {formatBytes(new Blob([result]).size)}
              </p>
            </div>

            <button
              type="button"
              onClick={downloadResult}
              className="rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white hover:bg-emerald-700"
            >
              Download merged XML
            </button>
          </div>

          <label className="mt-5 block">
            <span className="text-sm font-medium text-slate-700">
              Output preview
              {result.length > PREVIEW_LIMIT
                ? " (preview shortened; download contains the complete file)"
                : ""}
            </span>
            <textarea
              readOnly
              value={result.slice(0, PREVIEW_LIMIT)}
              rows={16}
              spellCheck={false}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-950 p-4 font-mono text-xs text-slate-100"
            />
          </label>
        </section>
      )}

      <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <h2 className="font-semibold text-slate-900">Private browser processing</h2>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          Your XML files are processed locally in your browser. They are not
          uploaded to Navorika or stored on a server.
        </p>
      </section>
    </div>
  );
}
