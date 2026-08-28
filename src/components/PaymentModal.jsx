import React, { useState, useEffect } from "react";
import {
  X,
  CreditCard,
  QrCode,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Lock,
  ArrowRight,
  Store,
  RefreshCw
} from "lucide-react";
import { processOnlinePayment, generateUpiUri, UPI_CONFIG } from "../services/paymentService";

export default function PaymentModal({
  isOpen,
  onClose,
  bookingDetails,
  onPaymentSuccess
}) {
  const [selectedMethod, setSelectedMethod] = useState("UPI_QR"); // "UPI_QR" | "UPI_APP" | "CARD" | "PAY_AT_COUNTER"
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [countdown, setCountdown] = useState(300); // 5 mins

  // Card Form State
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");

  // UPI App State
  const [selectedUpiApp, setSelectedUpiApp] = useState("GPay");

  const totalPayable = bookingDetails?.preOrder?.totalBill || 0;
  const bookingId = bookingDetails?.bookingId || "DLC-RES";
  const customer = bookingDetails?.customer || {};

  // Reset countdown
  useEffect(() => {
    if (!isOpen) return;
    setCountdown(300);
    setErrorMsg("");
    setIsProcessing(false);

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleFormatCardNumber = (val) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 16);
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    setCardNumber(formatted);
  };

  const handleFormatExpiry = (val) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 2) {
      setCardExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2)}`);
    } else {
      setCardExpiry(cleaned);
    }
  };

  const handleProcessPayment = async (methodOverride = null) => {
    setErrorMsg("");
    setIsProcessing(true);

    const method = methodOverride || selectedMethod;

    if (method === "CARD") {
      if (cardNumber.replace(/\s/g, "").length < 15) {
        setIsProcessing(false);
        setErrorMsg("Please enter a valid 16-digit card number.");
        return;
      }
      if (!cardExpiry || cardExpiry.length < 5) {
        setIsProcessing(false);
        setErrorMsg("Please enter valid card expiry (MM/YY).");
        return;
      }
      if (!cardCvv || cardCvv.length < 3) {
        setIsProcessing(false);
        setErrorMsg("Please enter 3-digit CVV.");
        return;
      }
    }

    try {
      const result = await processOnlinePayment({
        amount: totalPayable,
        method: method,
        bookingId: bookingId,
        customer: customer,
        paymentDetails: {
          cardNumber: cardNumber,
          cardBrand: "Visa/MasterCard",
          upiVpa: method === "UPI_APP" ? `${selectedUpiApp.toLowerCase()}@upi` : UPI_CONFIG.vpa
        }
      });

      setIsProcessing(false);
      if (onPaymentSuccess) {
        onPaymentSuccess(result);
      }
      onClose();
    } catch (err) {
      setIsProcessing(false);
      setErrorMsg(err.message || "Payment processing failed. Please try again.");
    }
  };

  const upiUri = generateUpiUri(totalPayable, bookingId);
  const upiQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=255-255-255&bgcolor=20-20-20&data=${encodeURIComponent(
    upiUri
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-lg bg-background-card border border-white/15 rounded-sm shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Modal Header */}
        <div className="p-5 bg-background-darker border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-coffee-400 bg-coffee-500/10 flex items-center justify-center text-coffee-300">
              <ShieldCheck className="w-5 h-5 text-coffee-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl text-cream-100 uppercase tracking-wide">
                  DLC Express Checkout
                </h3>
                <span className="px-1.5 py-0.5 rounded-xs bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[9px] font-bold">
                  256-BIT SSL
                </span>
              </div>
              <p className="text-[11px] text-muted font-sans">
                Duplex Lounge Cafe • Order #{bookingId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-muted hover:text-cream-100 hover:bg-white/10 rounded-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bill Summary Strip */}
        <div className="p-4 bg-coffee-500/10 border-b border-coffee-500/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-coffee-300/80 uppercase tracking-widest font-semibold block">
              Total Amount Payable
            </span>
            <span className="text-xs text-muted font-light">All taxes included</span>
          </div>
          <div className="text-right">
            <span className="font-serif text-2xl font-bold text-coffee-300">
              ₹{totalPayable}
            </span>
          </div>
        </div>

        {/* Payment Method Selector Tabs */}
        <div className="grid grid-cols-4 border-b border-white/10 bg-background-darker/70 text-center">
          <button
            type="button"
            onClick={() => setSelectedMethod("UPI_QR")}
            className={`py-3 px-1 text-[11px] font-bold uppercase tracking-wider transition-colors flex flex-col items-center gap-1 border-b-2 ${
              selectedMethod === "UPI_QR"
                ? "border-coffee-400 text-coffee-300 bg-white/5"
                : "border-transparent text-muted hover:text-cream-200"
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>UPI QR</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMethod("UPI_APP")}
            className={`py-3 px-1 text-[11px] font-bold uppercase tracking-wider transition-colors flex flex-col items-center gap-1 border-b-2 ${
              selectedMethod === "UPI_APP"
                ? "border-coffee-400 text-coffee-300 bg-white/5"
                : "border-transparent text-muted hover:text-cream-200"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>UPI Apps</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMethod("CARD")}
            className={`py-3 px-1 text-[11px] font-bold uppercase tracking-wider transition-colors flex flex-col items-center gap-1 border-b-2 ${
              selectedMethod === "CARD"
                ? "border-coffee-400 text-coffee-300 bg-white/5"
                : "border-transparent text-muted hover:text-cream-200"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Card</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMethod("PAY_AT_COUNTER")}
            className={`py-3 px-1 text-[11px] font-bold uppercase tracking-wider transition-colors flex flex-col items-center gap-1 border-b-2 ${
              selectedMethod === "PAY_AT_COUNTER"
                ? "border-coffee-400 text-coffee-300 bg-white/5"
                : "border-transparent text-muted hover:text-cream-200"
            }`}
          >
            <Store className="w-4 h-4" />
            <span>At Cafe</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {errorMsg && (
            <div className="p-3 rounded-sm bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: UPI QR CODE */}
          {selectedMethod === "UPI_QR" && (
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 flex items-center gap-2 text-xs text-amber-400 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>QR Expires in: <strong>{formatTimer(countdown)}</strong></span>
              </div>

              {/* Dynamic QR Code Box */}
              <div className="p-4 bg-neutral-900 border-2 border-coffee-500/40 rounded-sm shadow-xl relative group mb-4">
                <img
                  src={upiQrCodeUrl}
                  alt="Duplex Lounge Cafe UPI QR Code"
                  className="w-48 h-48 rounded-xs"
                />
                <div className="mt-2 text-[10px] text-muted uppercase tracking-wider">
                  VPA: <span className="text-coffee-300 font-bold">{UPI_CONFIG.vpa}</span>
                </div>
              </div>

              <p className="text-xs text-muted max-w-xs mb-4">
                Scan with any UPI app (GPay, PhonePe, Paytm, CRED, BHIM) to complete ₹{totalPayable} payment.
              </p>

              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleProcessPayment("UPI_QR")}
                className="w-full inline-flex items-center justify-center gap-2 bg-coffee-400 hover:bg-coffee-500 text-background-darker font-bold text-xs uppercase tracking-widest py-3.5 rounded-sm transition-all shadow-lg"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying UPI Payment...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>I Have Paid ₹{totalPayable} / Simulate Approval</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 2: UPI APPS */}
          {selectedMethod === "UPI_APP" && (
            <div className="space-y-4">
              <span className="block text-xs text-muted">Select your preferred UPI application:</span>
              <div className="grid grid-cols-2 gap-3">
                {["Google Pay", "PhonePe", "Paytm", "BHIM UPI"].map((app) => (
                  <button
                    key={app}
                    type="button"
                    onClick={() => setSelectedUpiApp(app)}
                    className={`p-3.5 rounded-sm border text-left flex items-center justify-between transition-all ${
                      selectedUpiApp === app
                        ? "bg-coffee-500/15 border-coffee-400 text-coffee-300"
                        : "bg-background-darker border-white/10 text-cream-200 hover:border-white/20"
                    }`}
                  >
                    <span className="text-xs font-semibold">{app}</span>
                    {selectedUpiApp === app && <CheckCircle2 className="w-4 h-4 text-coffee-400" />}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleProcessPayment("UPI_APP")}
                  className="w-full inline-flex items-center justify-center gap-2 bg-coffee-400 hover:bg-coffee-500 text-background-darker font-bold text-xs uppercase tracking-widest py-3.5 rounded-sm transition-all shadow-md"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Opening {selectedUpiApp}...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay ₹{totalPayable} via {selectedUpiApp}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: CREDIT / DEBIT CARD */}
          {selectedMethod === "CARD" && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="Name on card"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full bg-background-darker border border-white/15 focus:border-coffee-400 text-cream-100 text-xs px-3 py-2.5 rounded-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-coffee-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="4532 •••• •••• 8892"
                    value={cardNumber}
                    onChange={(e) => handleFormatCardNumber(e.target.value)}
                    className="w-full bg-background-darker border border-white/15 focus:border-coffee-400 text-cream-100 text-xs pl-10 pr-3 py-2.5 rounded-sm outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => handleFormatExpiry(e.target.value)}
                    className="w-full bg-background-darker border border-white/15 focus:border-coffee-400 text-cream-100 text-xs px-3 py-2.5 rounded-sm outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1">
                    CVV / CVC
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="•••"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-background-darker border border-white/15 focus:border-coffee-400 text-cream-100 text-xs px-3 py-2.5 rounded-sm outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleProcessPayment("CARD")}
                  className="w-full inline-flex items-center justify-center gap-2 bg-coffee-400 hover:bg-coffee-500 text-background-darker font-bold text-xs uppercase tracking-widest py-3.5 rounded-sm transition-all shadow-md"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authorizing Card...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Pay ₹{totalPayable} Securely</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: PAY AT CAFE / COUNTER */}
          {selectedMethod === "PAY_AT_COUNTER" && (
            <div className="p-4 bg-background-darker border border-white/10 rounded-sm text-center space-y-3">
              <Store className="w-10 h-10 text-coffee-400 mx-auto" />
              <h4 className="font-serif text-lg text-cream-100">Pay on Arrival at Cafe</h4>
              <p className="text-xs text-muted leading-relaxed max-w-sm mx-auto">
                No upfront online payment required today. You can pay your bill of <strong>₹{totalPayable}</strong> using Cash, UPI, or Card at the cafe counter after your meal.
              </p>

              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleProcessPayment("PAY_AT_COUNTER")}
                className="w-full inline-flex items-center justify-center gap-2 bg-coffee-400 hover:bg-coffee-500 text-background-darker font-bold text-xs uppercase tracking-widest py-3.5 rounded-sm transition-all shadow-md mt-2"
              >
                {isProcessing ? "Confirming Booking..." : "Confirm & Pay At Cafe"}
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
