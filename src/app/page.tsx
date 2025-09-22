"use client";

import { useState, useRef, useEffect } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";

interface QRSettings {
  size: number;
  errorCorrection: "L" | "M" | "Q" | "H";
  fgColor: string;
  bgColor: string;
}

export default function Home() {
  const [text, setText] = useState("");
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [qrSettings, setQrSettings] = useState<QRSettings>({
    size: 256,
    errorCorrection: "M",
    fgColor: "#000000",
    bgColor: "#ffffff",
  });
  const qrCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      setQrCodeValue(text);
    }
  };

  const handleDownload = (format: "png" | "svg") => {
    if (format === "png" && qrCodeRef.current) {
      const canvas = qrCodeRef.current.querySelector("canvas");
      if (canvas) {
        const link = document.createElement("a");
        link.download = `qr-code-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    } else {
      const svgElement = document.getElementById("qr-code-svg");
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const blob = new Blob([svgData], { type: "image/svg+xml" });
        const link = document.createElement("a");
        link.download = `qr-code-${Date.now()}.svg`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      }
    }
  };

  const handleClear = () => {
    setText("");
    setQrCodeValue("");
  };

  return (
    <main className="min-h-screen p-4 sm:p-6 flex flex-col items-center justify-center relative">
      {/* Theme Toggle */}
      <motion.button
        onClick={() => setIsDark(!isDark)}
        className="theme-toggle fixed top-4 right-4 sm:top-6 sm:right-6 z-10"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isDark ? (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-morphism rounded-3xl p-6 sm:p-8 w-full max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 dark:from-gray-100 dark:via-gray-300 dark:to-gray-500 bg-clip-text text-transparent leading-tight"
          >
            Monochrome QR Studio
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base sm:text-lg opacity-80 font-light px-4 leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Elegant monochromatic QR codes with precision
          </motion.p>
        </div>

        {/* Input Form */}
        <motion.form
          onSubmit={handleGenerate}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="relative mb-4 sm:mb-6">
            <input
              type="text"
              placeholder="Enter your text, URL, or message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="elegant-input w-full p-3 sm:p-4 pr-24 sm:pr-32 rounded-2xl text-base sm:text-lg font-medium placeholder-opacity-60"
              style={{ 
                color: 'var(--text-primary)',
                backgroundColor: 'var(--surface-secondary)'
              }}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 sm:gap-2">
              {text && (
                <motion.button
                  type="button"
                  onClick={handleClear}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              )}
              <motion.button
                type="submit"
                disabled={!text.trim()}
                className="btn-luxury px-4 sm:px-6 py-2 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Generate
              </motion.button>
            </div>
          </div>
        </motion.form>

        {/* Settings Toggle */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <motion.button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-opacity-30 hover:bg-opacity-10 transition-all text-sm sm:text-base"
            style={{ 
              borderColor: 'var(--accent)',
              backgroundColor: showSettings ? 'var(--accent)' : 'transparent',
              color: showSettings ? 'var(--surface)' : 'var(--text-secondary)'
            }}
            whileHover={{ scale: 1.05 }}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="hidden sm:inline">Advanced Options</span>
            <span className="sm:hidden">Options</span>
          </motion.button>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 sm:mb-6 p-4 sm:p-6 rounded-2xl border border-opacity-20"
              style={{ 
                borderColor: 'var(--accent)',
                backgroundColor: 'var(--surface-secondary)'
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Size</label>
                  <input
                    type="range"
                    min="128"
                    max="512"
                    value={qrSettings.size}
                    onChange={(e) => setQrSettings({...qrSettings, size: parseInt(e.target.value)})}
                    className="w-full"
                  />
                  <span className="text-xs sm:text-sm opacity-70">{qrSettings.size}px</span>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Error Correction</label>
                  <select
                    value={qrSettings.errorCorrection}
                    onChange={(e) => setQrSettings({...qrSettings, errorCorrection: e.target.value as "L" | "M" | "Q" | "H"})}
                    className="elegant-input w-full p-2 rounded-lg text-sm sm:text-base"
                  >
                    <option value="L">Low (7%)</option>
                    <option value="M">Medium (15%)</option>
                    <option value="Q">Quartile (25%)</option>
                    <option value="H">High (30%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Foreground Color</label>
                  <input
                    type="color"
                    value={qrSettings.fgColor}
                    onChange={(e) => setQrSettings({...qrSettings, fgColor: e.target.value})}
                    className="w-full h-10 rounded-lg border border-opacity-30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Background Color</label>
                  <input
                    type="color"
                    value={qrSettings.bgColor}
                    onChange={(e) => setQrSettings({...qrSettings, bgColor: e.target.value})}
                    className="w-full h-10 rounded-lg border border-opacity-30"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* QR Code Display */}
        <AnimatePresence>
          {qrCodeValue && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center gap-4 sm:gap-6"
            >
              <div
                ref={qrCodeRef}
                className="glass-morphism p-4 sm:p-6 rounded-3xl shimmer"
              >
                <QRCodeCanvas
                  value={qrCodeValue}
                  size={isMobile ? Math.min(qrSettings.size, 200) : qrSettings.size}
                  bgColor={qrSettings.bgColor}
                  fgColor={qrSettings.fgColor}
                  level={qrSettings.errorCorrection}
                  includeMargin={true}
                />
                <div style={{ display: 'none' }}>
                  <QRCodeSVG
                    id="qr-code-svg"
                    value={qrCodeValue}
                    size={isMobile ? Math.min(qrSettings.size, 200) : qrSettings.size}
                    bgColor={qrSettings.bgColor}
                    fgColor={qrSettings.fgColor}
                    level={qrSettings.errorCorrection}
                    includeMargin={true}
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                <motion.button
                  onClick={() => handleDownload("png")}
                  className="btn-luxury flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PNG
                </motion.button>
                <motion.button
                  onClick={() => handleDownload("svg")}
                  className="btn-luxury flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download SVG
                </motion.button>
              </div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center text-xs sm:text-sm opacity-70 max-w-xs sm:max-w-md truncate px-4"
                style={{ color: 'var(--text-secondary)' }}
              >
                Generated for: {qrCodeValue}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
