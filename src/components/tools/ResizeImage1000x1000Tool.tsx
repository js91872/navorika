"use client";

import {
  ChangeEvent,
  DragEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Check,
  Download,
  ImageIcon,
  RefreshCcw,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";

type FitMode = "crop" | "contain" | "stretch";
type OutputFormat = "image/jpeg" | "image/png" | "image/webp";

type ImageInfo = {
  width: number;
  height: number;
};

const TARGET_WIDTH = 1000;
const TARGET_HEIGHT = 1000;

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function extensionForType(type: OutputFormat): string {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/webp") return "webp";
  return "png";
}

function formatLabel(type: OutputFormat): string {
  if (type === "image/jpeg") return "JPG";
  if (type === "image/webp") return "WebP";
  return "PNG";
}

export default function ResizeImage1000x1000Tool() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [inputUrl, setInputUrl] = useState("");
  const [outputUrl, setOutputUrl] = useState("");
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);

  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);

  const [fitMode, setFitMode] = useState<FitMode>("crop");
  const [format, setFormat] = useState<OutputFormat>("image/jpeg");
  const [quality, setQuality] = useState(90);
  const [background, setBackground] = useState("#ffffff");

  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (inputUrl) URL.revokeObjectURL(inputUrl);
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [inputUrl, outputUrl]);

  function clearOutput() {
    if (outputUrl) {
      URL.revokeObjectURL(outputUrl);
    }

    setOutputUrl("");
    setOutputBlob(null);
  }

  function resetTool() {
    if (inputUrl) URL.revokeObjectURL(inputUrl);
    if (outputUrl) URL.revokeObjectURL(outputUrl);

    setFile(null);
    setInputUrl("");
    setOutputUrl("");
    setOutputBlob(null);
    setImageInfo(null);
    setError("");
    setProcessing(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function acceptFile(selected: File | undefined) {
    setError("");
    clearOutput();

    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setError("Please choose a JPG, PNG, WebP, GIF, BMP, or other browser-readable image.");
      return;
    }

    if (selected.size > 25 * 1024 * 1024) {
      setError("Please use an image smaller than 25 MB.");
      return;
    }

    const url = URL.createObjectURL(selected);
    const image = new Image();

    image.onload = () => {
      if (image.naturalWidth < 1 || image.naturalHeight < 1) {
        URL.revokeObjectURL(url);
        setError("The selected image could not be read.");
        return;
      }

      if (inputUrl) URL.revokeObjectURL(inputUrl);

      setFile(selected);
      setInputUrl(url);
      setImageInfo({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      setError("This image format could not be decoded by your browser.");
    };

    image.src = url;
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    acceptFile(event.target.files?.[0]);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    acceptFile(event.dataTransfer.files?.[0]);
  }

  function drawImage(
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement
  ) {
    const sourceWidth = image.naturalWidth;
    const sourceHeight = image.naturalHeight;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    if (fitMode === "stretch") {
      ctx.drawImage(
        image,
        0,
        0,
        TARGET_WIDTH,
        TARGET_HEIGHT
      );
      return;
    }

    if (fitMode === "contain") {
      const scale = Math.min(
        TARGET_WIDTH / sourceWidth,
        TARGET_HEIGHT / sourceHeight
      );

      const width = sourceWidth * scale;
      const height = sourceHeight * scale;

      const x = (TARGET_WIDTH - width) / 2;
      const y = (TARGET_HEIGHT - height) / 2;

      ctx.fillStyle = background;
      ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);

      ctx.drawImage(image, x, y, width, height);
      return;
    }

    // Crop to fill while preserving aspect ratio.
    const scale = Math.max(
      TARGET_WIDTH / sourceWidth,
      TARGET_HEIGHT / sourceHeight
    );

    const renderedWidth = sourceWidth * scale;
    const renderedHeight = sourceHeight * scale;

    const x = (TARGET_WIDTH - renderedWidth) / 2;
    const y = (TARGET_HEIGHT - renderedHeight) / 2;

    ctx.drawImage(
      image,
      x,
      y,
      renderedWidth,
      renderedHeight
    );
  }

  async function convertImage() {
    if (!file || !inputUrl) return;

    setProcessing(true);
    setError("");
    clearOutput();

    try {
      const image = new Image();

      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("Unable to load the image."));
        image.src = inputUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = TARGET_WIDTH;
      canvas.height = TARGET_HEIGHT;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Canvas processing is not available in this browser.");
      }

      // JPEG does not support transparency.
      if (format === "image/jpeg" && fitMode !== "contain") {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);
      }

      drawImage(ctx, image);

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(
          resolve,
          format,
          format === "image/png" ? undefined : quality / 100
        );
      });

      if (!blob) {
        throw new Error(
          "Your browser could not create the resized image."
        );
      }

      const url = URL.createObjectURL(blob);

      setOutputBlob(blob);
      setOutputUrl(url);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "The image could not be resized."
      );
    } finally {
      setProcessing(false);
    }
  }

  function downloadImage() {
    if (!outputBlob || !outputUrl) return;

    const extension = extensionForType(format);
    const originalName =
      file?.name.replace(/\.[^/.]+$/, "") || "image";

    const anchor = document.createElement("a");
    anchor.href = outputUrl;
    anchor.download =
      `${originalName}-1000x1000.${extension}`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        {!file ? (
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`cursor-pointer rounded-2xl border-2 border-dashed px-5 py-12 text-center transition sm:py-16 ${
              dragging
                ? "border-blue-500 bg-blue-50"
                : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50"
            }`}
          >
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <Upload className="h-7 w-7" />
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              Upload an image
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
              Drop an image here or click to choose a file. Your image is
              processed locally in your browser and is not uploaded to
              Navorika.
            </p>

            <div className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white">
              Choose image
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleInput}
            />
          </div>
        ) : (
          <div className="space-y-7">
            <div className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <ImageIcon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">
                    {file.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {imageInfo
                      ? `${imageInfo.width} × ${imageInfo.height} px`
                      : "Reading dimensions"}
                    {" · "}
                    {formatBytes(file.size)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={resetTool}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
                Remove
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <p className="mb-3 text-sm font-bold text-slate-900">
                  Original
                </p>

                <div className="flex min-h-[280px] items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-[linear-gradient(45deg,#f1f5f9_25%,transparent_25%),linear-gradient(-45deg,#f1f5f9_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f1f5f9_75%),linear-gradient(-45deg,transparent_75%,#f1f5f9_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={inputUrl}
                    alt="Original uploaded image preview"
                    className="max-h-[420px] max-w-full object-contain"
                  />
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-bold text-slate-900">
                  1000 × 1000 preview
                </p>

                <div className="flex aspect-square max-h-[420px] items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  {outputUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={outputUrl}
                      alt="1000 by 1000 resized image preview"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="px-6 text-center text-slate-400">
                      <ImageIcon className="mx-auto mb-3 h-10 w-10" />
                      <p className="text-sm">
                        Your resized image will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-5 border-t border-slate-200 pt-7 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-900">
                  Resize method
                </label>

                <select
                  value={fitMode}
                  onChange={(event) => {
                    setFitMode(event.target.value as FitMode);
                    clearOutput();
                  }}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="crop">
                    Crop to fill — recommended
                  </option>
                  <option value="contain">
                    Fit entire image with padding
                  </option>
                  <option value="stretch">
                    Stretch to exactly 1000 × 1000
                  </option>
                </select>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Crop preserves proportions without empty borders. Fit
                  preserves the complete image. Stretch may distort the
                  original aspect ratio.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-900">
                  Output format
                </label>

                <select
                  value={format}
                  onChange={(event) => {
                    setFormat(event.target.value as OutputFormat);
                    clearOutput();
                  }}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="image/jpeg">JPG</option>
                  <option value="image/png">PNG</option>
                  <option value="image/webp">WebP</option>
                </select>
              </div>

              <div>
                <label className="mb-2 flex items-center justify-between text-sm font-bold text-slate-900">
                  <span>Quality</span>
                  <span>{quality}%</span>
                </label>

                <input
                  type="range"
                  min="40"
                  max="100"
                  step="1"
                  value={quality}
                  disabled={format === "image/png"}
                  onChange={(event) => {
                    setQuality(Number(event.target.value));
                    clearOutput();
                  }}
                  className="w-full accent-blue-600 disabled:opacity-40"
                />

                <p className="mt-2 text-xs text-slate-500">
                  {format === "image/png"
                    ? "PNG is exported losslessly, so the quality setting is not used."
                    : "Higher quality normally creates a larger file."}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-900">
                  Padding/background
                </label>

                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={background}
                    onChange={(event) => {
                      setBackground(event.target.value);
                      clearOutput();
                    }}
                    className="h-12 w-16 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
                  />

                  <input
                    type="text"
                    value={background}
                    onChange={(event) => {
                      setBackground(event.target.value);
                      clearOutput();
                    }}
                    className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 font-mono text-sm"
                    aria-label="Background color"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                <div>
                  <p className="font-semibold text-slate-900">
                    Target dimensions: 1000 × 1000 pixels
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    The downloaded file will always have an exact canvas
                    size of 1000 pixels wide by 1000 pixels high.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {!outputUrl ? (
              <button
                type="button"
                onClick={convertImage}
                disabled={processing}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processing ? (
                  <>
                    <RefreshCcw className="h-5 w-5 animate-spin" />
                    Resizing image...
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-5 w-5" />
                    Resize to 1000 × 1000
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={downloadImage}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-bold text-white hover:bg-blue-700"
                  >
                    <Download className="h-5 w-5" />
                    Download {formatLabel(format)}
                  </button>

                  <button
                    type="button"
                    onClick={convertImage}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-4 font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <RefreshCcw className="h-5 w-5" />
                    Reprocess
                  </button>
                </div>

                <div className="text-center text-sm text-slate-500">
                  Output: 1000 × 1000 px
                  {outputBlob
                    ? ` · ${formatBytes(outputBlob.size)} · ${formatLabel(format)}`
                    : ""}
                </div>
              </div>
            )}
          </div>
        )}

        {error && !file && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <ShieldCheck className="mb-3 h-6 w-6 text-blue-600" />
          <h3 className="font-bold text-slate-900">
            Private processing
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Image processing happens locally in your browser. Your file
            does not need to be uploaded to our server.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <ImageIcon className="mb-3 h-6 w-6 text-blue-600" />
          <h3 className="font-bold text-slate-900">
            Exact dimensions
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Every successful export has a 1000 × 1000 pixel canvas,
            regardless of the original image dimensions.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <Download className="mb-3 h-6 w-6 text-blue-600" />
          <h3 className="font-bold text-slate-900">
            JPG, PNG or WebP
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Choose the output format that suits your website, profile,
            marketplace listing, or other image workflow.
          </p>
        </div>
      </section>
    </div>
  );
}
