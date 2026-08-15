'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, QrCode, Upload, Download, Scan } from 'lucide-react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';

export default function QrCodeStudioToolWrapper() {
  const meta = tools.find(t => t.slug === 'qr-code-studio');
  return (
    <EnhancedToolWrapper meta={meta}>
      <QrCodeStudioTool />
    </EnhancedToolWrapper>
  );
}
