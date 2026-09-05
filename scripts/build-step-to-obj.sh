#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
NATIVE_DIR="${ROOT_DIR}/src/lib/converters/step-3dpdf/native"
BUILD_DIR="${NATIVE_DIR}/build"
BIN_DIR="${ROOT_DIR}/bin"

echo "Building step-to-obj native binary..."
mkdir -p "${BUILD_DIR}" "${BIN_DIR}"

cmake -S "${NATIVE_DIR}" -B "${BUILD_DIR}" -DCMAKE_BUILD_TYPE=Release
cmake --build "${BUILD_DIR}" --config Release -j"$(nproc)"

cp "${BUILD_DIR}/step-to-obj" "${BIN_DIR}/step-to-obj"
chmod +x "${BIN_DIR}/step-to-obj"

echo "step-to-obj successfully built and installed to: ${BIN_DIR}/step-to-obj"
