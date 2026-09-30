import React, { useState } from 'react';
import { X, Copy, Check, Send, Sparkles, Sun, Moon, Share2, MessageCircle } from 'lucide-react';
import { InviteConfig, AppTheme } from '../types';
import { sounds } from '../utils/audio';

interface CreateInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  invite: InviteConfig;
  onSave: (config: InviteConfig) => void;
}

export const CreateInviteModal: React.FC<CreateInviteModalProps> = ({
  isOpen,
  onClose,
  invite,
  onSave,
}) => {
  const [recipient, setRecipient] = useState(invite.recipientName);
  const [sender, setSender] = useState(invite.senderName);
  const [message, setMessage] = useState(invite.customMessage);
  const [theme, setTheme] = useState<AppTheme>(invite.theme || 'midnight');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateShareUrl = () => {
    const params = new URLSearchParams();
    if (recipient.trim()) params.set('to', recipient.trim());
    if (sender.trim()) params.set('from', sender.trim());
    if (message.trim()) params.set('msg', message.trim());
    if (theme) params.set('theme', theme);

    // Prefer public shared URL if currently in dev
    let baseOrigin = window.location.origin;
    if (baseOrigin.includes('ais-dev-')) {
      baseOrigin = baseOrigin.replace('ais-dev-', 'ais-pre-');
    }

    const base = `${baseOrigin}${window.location.pathname}`;
    return params.toString() ? `${base}?${params.toString()}` : base;
  };

  const handleApply = () => {
    sounds.playPop();
    const newConfig: InviteConfig = {
      recipientName: recipient.trim(),
      senderName: sender.trim(),
      customMessage: message.trim(),
      theme,
    };
    onSave(newConfig);

    // Update browser URL query params without reloading
    const params = new URLSearchParams();
    if (newConfig.recipientName) params.set('to', newConfig.recipientName);
    if (newConfig.senderName) params.set('from', newConfig.senderName);
    if (newConfig.customMessage) params.set('msg', newConfig.customMessage);
    if (newConfig.theme) params.set('theme', newConfig.theme);

    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState({}, '', newUrl);

    onClose();
  };

  const handleCopyLink = async () => {
    sounds.playPop();
    const url = generateShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    sounds.playPop();
    const url = generateShareUrl();
    const title = recipient.trim()
      ? `Dinner date invitation for ${recipient.trim()}! 🍷`
      : 'Will you go to dinner with me? 🍷';
    const text = message.trim() || 'I have a very important dinner question for you...';

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  const handleWhatsAppShare = () => {
    sounds.playPop();
    const url = generateShareUrl();
    const text = `Hey${recipient.trim() ? ` ${recipient.trim()}` : ''}! I made something special for you 🍷✨ Check it out:\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const isMidnight = theme === 'midnight';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className={`rounded-3xl border max-w-sm sm:max-w-md w-full p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 relative transition-colors max-h-[90vh] overflow-y-auto ${
          isMidnight
            ? 'bg-slate-900 border-indigo-900/70 text-slate-100'
            : 'bg-white border-rose-100 text-stone-900'
        }`}
      >
        <div
          className={`flex items-center justify-between border-b pb-3 ${
            isMidnight ? 'border-slate-800' : 'border-stone-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isMidnight
                  ? 'bg-indigo-950 text-indigo-400'
                  : 'bg-rose-100 text-rose-600'
              }`}
            >
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg leading-none">
                Share & Personalize
              </h3>
              <p className="text-[10px] text-stone-400 mt-0.5">Send this invite to someone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              isMidnight
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3.5 text-sm">
          {/* Quick Share Buttons on Mobile */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleNativeShare}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer text-white shadow-xs ${
                isMidnight
                  ? 'bg-indigo-600 hover:bg-indigo-500'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Link</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>

          {/* Color Palette Selector */}
          <div>
            <label
              className={`block text-xs font-semibold mb-1.5 ${
                isMidnight ? 'text-slate-300' : 'text-stone-700'
              }`}
            >
              Color Palette
            </label>
            <div className="grid grid-cols-2 gap-2">
              {/* Sunset Option */}
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setTheme('sunset');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                  theme === 'sunset'
                    ? 'border-rose-500 bg-rose-50/80 text-rose-950 ring-2 ring-rose-400/40 shadow-xs'
                    : isMidnight
                    ? 'border-slate-800 bg-slate-800/60 text-slate-300 hover:border-slate-700'
                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
                }`}
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Sun className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight">Sunset</p>
                  <p className="text-[9px] opacity-75">Warm rose</p>
                </div>
              </button>

              {/* Midnight Option */}
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setTheme('midnight');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                  theme === 'midnight'
                    ? 'border-indigo-500 bg-indigo-950/80 text-indigo-100 ring-2 ring-indigo-400/40 shadow-xs'
                    : isMidnight
                    ? 'border-slate-800 bg-slate-800/60 text-slate-300 hover:border-slate-700'
                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
                }`}
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-400 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Moon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight">Midnight</p>
                  <p className="text-[9px] opacity-75">Cool indigo</p>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label
              className={`block text-xs font-semibold mb-1 ${
                isMidnight ? 'text-slate-300' : 'text-stone-700'
              }`}
            >
              Who are you asking out? (Their name)
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. Sarah, Alex, Sweetheart..."
              className={`w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                isMidnight
                  ? 'bg-slate-800/80 border-slate-700 text-slate-100 focus:ring-indigo-500'
                  : 'bg-white border-stone-200 text-stone-800 focus:ring-rose-500'
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-xs font-semibold mb-1 ${
                isMidnight ? 'text-slate-300' : 'text-stone-700'
              }`}
            >
              Your name (Sender)
            </label>
            <input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="e.g. Michael, Jack..."
              className={`w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                isMidnight
                  ? 'bg-slate-800/80 border-slate-700 text-slate-100 focus:ring-indigo-500'
                  : 'bg-white border-stone-200 text-stone-800 focus:ring-rose-500'
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-xs font-semibold mb-1 ${
                isMidnight ? 'text-slate-300' : 'text-stone-700'
              }`}
            >
              Sweet note / Pitch
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              placeholder="e.g. Great food, great company, and dessert is on me!"
              className={`w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                isMidnight
                  ? 'bg-slate-800/80 border-slate-700 text-slate-100 focus:ring-indigo-500'
                  : 'bg-white border-stone-200 text-stone-800 focus:ring-rose-500'
              }`}
            />
          </div>
        </div>

        {/* Shareable Link Box */}
        <div
          className={`p-3 border rounded-xl space-y-1.5 ${
            isMidnight
              ? 'bg-indigo-950/40 border-indigo-900/60'
              : 'bg-rose-50/70 border-rose-100'
          }`}
        >
          <p
            className={`text-[10px] font-semibold uppercase tracking-wider ${
              isMidnight ? 'text-indigo-400' : 'text-rose-800'
            }`}
          >
            Direct Invite Link
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={generateShareUrl()}
              className={`w-full px-2 py-1.5 rounded-lg border text-[11px] select-all font-mono truncate ${
                isMidnight
                  ? 'bg-slate-800 border-slate-700 text-slate-200'
                  : 'bg-white border-rose-200 text-stone-600'
              }`}
            />
            <button
              onClick={handleCopyLink}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors text-white ${
                isMidnight
                  ? 'bg-indigo-600 hover:bg-indigo-500'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-[10px] text-stone-400">
            Anyone opening this link will see your invitation on their smartphone!
          </p>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleApply}
            className={`flex-1 py-2.5 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              isMidnight
                ? 'bg-indigo-600 hover:bg-indigo-500'
                : 'bg-stone-900 hover:bg-stone-800'
            }`}
          >
            <Send className={`w-4 h-4 ${isMidnight ? 'text-indigo-200' : 'text-rose-400'}`} />
            <span>Save & Apply</span>
          </button>
        </div>
      </div>
    </div>
  );
};
