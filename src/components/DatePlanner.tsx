import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Utensils,
  Heart,
  Share2,
  CalendarPlus,
  Download,
  Copy,
  MessageCircle,
  Smartphone,
  ChevronLeft,
} from 'lucide-react';
import { DatePlan, InviteConfig } from '../types';
import { TIME_SLOTS } from '../data/cuisines';
import { generateGoogleCalendarUrl, downloadICSFile } from '../utils/calendar';
import { sounds } from '../utils/audio';

interface DatePlannerProps {
  invite: InviteConfig;
  onBackToCard: () => void;
}

export const DatePlanner: React.FC<DatePlannerProps> = ({ invite, onBackToCard }) => {
  const isMidnight = invite.theme === 'midnight';

  // Helper to format ISO date YYYY-MM-DD
  const formatISO = (d: Date) => d.toISOString().split('T')[0];

  // Calculate upcoming dates
  const quickDates = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday

    const getNextDayOfWeek = (targetDay: number, weekOffset: number = 0) => {
      const d = new Date(now);
      const diff = (targetDay - currentDay + 7) % 7 + (weekOffset * 7);
      d.setDate(now.getDate() + (diff === 0 && weekOffset === 0 ? 7 : diff));
      return d;
    };

    const thisFri = getNextDayOfWeek(5, 0);
    const thisSat = getNextDayOfWeek(6, 0);
    const thisSun = getNextDayOfWeek(0, 0);
    const nextFri = getNextDayOfWeek(5, 1);
    const nextSat = getNextDayOfWeek(6, 1);

    return [
      { label: 'This Friday', date: formatISO(thisFri), display: thisFri.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) },
      { label: 'This Saturday', date: formatISO(thisSat), display: thisSat.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) },
      { label: 'This Sunday', date: formatISO(thisSun), display: thisSun.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) },
      { label: 'Next Friday', date: formatISO(nextFri), display: nextFri.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) },
      { label: 'Next Saturday', date: formatISO(nextSat), display: nextSat.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) },
    ];
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(quickDates[1]?.date || formatISO(new Date()));
  const [selectedTime, setSelectedTime] = useState<string>('19:30');
  const [preferredFood, setPreferredFood] = useState<string>('');
  const [copiedToast, setCopiedToast] = useState(false);

  const plan: DatePlan = {
    date: selectedDate,
    time: selectedTime,
    preferredFood: preferredFood.trim(),
  };

  // Format date readable
  const formattedDate = useMemo(() => {
    try {
      const [year, month, day] = selectedDate.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      return d.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return selectedDate;
    }
  }, [selectedDate]);

  // Format time 12hr readable
  const formattedTime = useMemo(() => {
    const [h, m] = selectedTime.split(':').map(Number);
    const period = (h || 0) >= 12 ? 'PM' : 'AM';
    const hour12 = ((h || 0) % 12) || 12;
    return `${hour12}:${String(m || 0).padStart(2, '0')} ${period}`;
  }, [selectedTime]);

  const messageSummary = useMemo(() => {
    const to = invite.senderName ? `Hey ${invite.senderName}!` : 'Hey!';
    const foodMention = preferredFood.trim()
      ? `\n🍽️ Craving: ${preferredFood.trim()}`
      : '\n🍽️ Craving: Surprise me with your favorite!';
    return `${to} I'm in for dinner! 🍷\n\n📅 Date: ${formattedDate}\n⏰ Time: ${formattedTime}${foodMention}\n\nCan't wait! ❤️`;
  }, [invite.senderName, formattedDate, formattedTime, preferredFood]);

  const handleCopySummary = async () => {
    sounds.playPop();
    try {
      await navigator.clipboard.writeText(messageSummary);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    } catch {
      // Fallback
    }
  };

  const handleWhatsApp = () => {
    sounds.playPop();
    const url = `https://wa.me/?text=${encodeURIComponent(messageSummary)}`;
    window.open(url, '_blank');
  };

  const handleSMS = () => {
    sounds.playPop();
    window.location.href = `sms:?&body=${encodeURIComponent(messageSummary)}`;
  };

  const handleGoogleCalendar = () => {
    sounds.playPop();
    const url = generateGoogleCalendarUrl(plan, invite);
    window.open(url, '_blank');
  };

  const handleDownloadICS = () => {
    sounds.playPop();
    downloadICSFile(plan, invite);
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto py-3 sm:py-6 px-1.5 sm:px-3 space-y-5 relative z-10 pb-10">
      {/* Smartphone Page Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBackToCard}
          className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
            isMidnight
              ? 'border-slate-800 text-slate-300 hover:bg-slate-800'
              : 'border-stone-200 text-stone-600 hover:bg-stone-100'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold ${
            isMidnight
              ? 'bg-indigo-950/90 text-indigo-300 border border-indigo-800/60'
              : 'bg-rose-100 text-rose-700'
          }`}
        >
          <Heart
            className={`w-3 h-3 ${
              isMidnight ? 'fill-indigo-400 text-indigo-400' : 'fill-rose-600 text-rose-600'
            }`}
          />
          <span>Accepted!</span>
        </div>
      </div>

      <div className="text-center space-y-1">
        <h1
          className={`text-2xl sm:text-3xl font-bold font-display tracking-tight leading-tight ${
            isMidnight ? 'text-white' : 'text-stone-900'
          }`}
        >
          When are we going?
        </h1>
        <p
          className={`text-xs sm:text-sm max-w-xs mx-auto ${
            isMidnight ? 'text-slate-300' : 'text-stone-600'
          }`}
        >
          Pick the day & time, and tell me what you feel like eating!
        </p>
      </div>

      {/* 1-Column Smartphone Flow */}
      <div className="space-y-4">
        {/* Section 1: Choose Date */}
        <section
          className={`rounded-3xl border p-4 sm:p-5 space-y-3 shadow-sm transition-colors ${
            isMidnight
              ? 'bg-slate-900/95 border-indigo-900/70 text-slate-100'
              : 'bg-white/95 border-rose-100 text-stone-900'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <CalendarIcon
              className={`w-4 h-4 ${isMidnight ? 'text-indigo-400' : 'text-rose-500'}`}
            />
            <h2>1. Choose the Date</h2>
          </div>

          {/* Quick Date Pills (Mobile Grid) */}
          <div className="grid grid-cols-2 gap-2">
            {quickDates.slice(0, 4).map((item) => {
              const isSelected = selectedDate === item.date;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setSelectedDate(item.date);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer min-h-[48px] flex flex-col justify-center ${
                    isSelected
                      ? isMidnight
                        ? 'border-indigo-500 bg-indigo-950 text-white ring-2 ring-indigo-500/30'
                        : 'border-rose-600 bg-rose-50/80 text-rose-900 ring-2 ring-rose-500/20'
                      : isMidnight
                      ? 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                  }`}
                >
                  <p
                    className={`text-[10px] font-medium leading-none ${
                      isMidnight ? 'text-slate-400' : 'text-stone-500'
                    }`}
                  >
                    {item.label}
                  </p>
                  <p className="text-xs sm:text-sm font-bold mt-1 leading-none">{item.display}</p>
                </button>
              );
            })}
          </div>

          {/* Custom Date Input */}
          <div className="pt-1">
            <input
              type="date"
              min={formatISO(new Date())}
              value={selectedDate}
              onChange={(e) => {
                sounds.playPop();
                setSelectedDate(e.target.value);
              }}
              className={`w-full min-h-[44px] px-3 py-2 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 transition-colors ${
                isMidnight
                  ? 'bg-slate-800/80 border-slate-700 text-slate-100 focus:ring-indigo-500'
                  : 'bg-stone-50 border-stone-200 text-stone-800 focus:ring-rose-500 focus:bg-white'
              }`}
            />
          </div>
        </section>

        {/* Section 2: Choose Time */}
        <section
          className={`rounded-3xl border p-4 sm:p-5 space-y-3 shadow-sm transition-colors ${
            isMidnight
              ? 'bg-slate-900/95 border-indigo-900/70 text-slate-100'
              : 'bg-white/95 border-rose-100 text-stone-900'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <Clock
              className={`w-4 h-4 ${isMidnight ? 'text-indigo-400' : 'text-rose-500'}`}
            />
            <h2>2. Preferred Dinner Time</h2>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map((t) => {
              const isSelected = selectedTime === t;
              const [h, m] = t.split(':').map(Number);
              const hour12 = (h % 12) || 12;
              const display = `${hour12}:${String(m).padStart(2, '0')}`;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setSelectedTime(t);
                  }}
                  className={`min-h-[44px] py-2 px-2 rounded-xl text-center border font-semibold text-xs transition-all cursor-pointer flex items-center justify-center ${
                    isSelected
                      ? isMidnight
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-stone-900 text-white border-stone-900 shadow-sm'
                      : isMidnight
                      ? 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                      : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                  }`}
                >
                  {display} PM
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 3: Open Food Preference */}
        <section
          className={`rounded-3xl border p-4 sm:p-5 space-y-3 shadow-sm transition-colors ${
            isMidnight
              ? 'bg-slate-900/95 border-indigo-900/70 text-slate-100'
              : 'bg-white/95 border-rose-100 text-stone-900'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <Utensils
              className={`w-4 h-4 ${isMidnight ? 'text-indigo-400' : 'text-rose-500'}`}
            />
            <h2>3. What food do you prefer we eat?</h2>
          </div>

          <div>
            <textarea
              value={preferredFood}
              onChange={(e) => setPreferredFood(e.target.value)}
              placeholder="e.g. Handmade pasta, fresh sushi, street tacos, burgers, seafood, ramen..."
              rows={3}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-base focus:outline-none focus:ring-2 transition-all ${
                isMidnight
                  ? 'bg-slate-800/90 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:ring-indigo-500'
                  : 'bg-stone-50 border-stone-200 text-stone-800 placeholder:text-stone-400 focus:ring-rose-500 focus:bg-white'
              }`}
            />
          </div>
        </section>

        {/* Smartphone Confirmed Ticket */}
        <div
          className={`rounded-3xl p-5 shadow-xl relative overflow-hidden text-white transition-colors ${
            isMidnight
              ? 'bg-slate-950 border border-indigo-900/80'
              : 'bg-stone-900'
          }`}
        >
          <div className="flex items-center justify-between border-b pb-3 mb-3 border-stone-800">
            <div>
              <p
                className={`text-[9px] uppercase font-bold tracking-widest ${
                  isMidnight ? 'text-indigo-400' : 'text-rose-400'
                }`}
              >
                Confirmed Date Pass
              </p>
              <h3 className="font-display text-lg font-bold text-white">Dinner for Two</h3>
            </div>
            <span className="text-2xl">🍷</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-0.5 border-b border-stone-800/70">
              <span className="text-slate-400">Date:</span>
              <span className="font-semibold text-slate-100">{formattedDate}</span>
            </div>

            <div className="flex justify-between items-center py-0.5 border-b border-stone-800/70">
              <span className="text-slate-400">Time:</span>
              <span className="font-semibold text-slate-100">{formattedTime}</span>
            </div>

            <div className="py-0.5">
              <span className="text-slate-400 block mb-0.5">Food:</span>
              <p
                className={`text-xs font-medium p-2 rounded-lg italic ${
                  isMidnight
                    ? 'bg-slate-900/90 text-indigo-200 border border-slate-800'
                    : 'bg-stone-800/60 text-rose-200'
                }`}
              >
                {preferredFood.trim() || 'You pick what we eat! ✨'}
              </p>
            </div>
          </div>
        </div>

        {/* Smartphone Action Hub (Tactile Touch Buttons) */}
        <div
          className={`rounded-3xl border p-4 space-y-2.5 shadow-sm transition-colors ${
            isMidnight
              ? 'bg-slate-900/95 border-indigo-900/70 text-slate-100'
              : 'bg-white/95 border-rose-100 text-stone-900'
          }`}
        >
          <h4
            className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isMidnight ? 'text-indigo-400' : 'text-stone-500'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            Lock it in & Share
          </h4>

          {/* Google Calendar (Primary Mobile CTA) */}
          <button
            onClick={handleGoogleCalendar}
            className={`w-full min-h-[48px] px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.98] cursor-pointer border ${
              isMidnight
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 shadow-sm'
                : 'bg-rose-600 hover:bg-rose-700 text-white border-rose-600 shadow-sm'
            }`}
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Add to Google Calendar</span>
          </button>

          {/* Quick Messaging Grid */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleWhatsApp}
              className="min-h-[44px] py-2 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-500" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleSMS}
              className="min-h-[44px] py-2 px-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-blue-500" />
              <span>iMessage / SMS</span>
            </button>
          </div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDownloadICS}
              className={`min-h-[40px] py-1.5 px-2 rounded-xl font-medium text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                isMidnight
                  ? 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Save .ics invite</span>
            </button>

            <button
              onClick={handleCopySummary}
              className={`min-h-[40px] py-1.5 px-2 rounded-xl text-[11px] font-medium flex items-center justify-center gap-1.5 border transition-colors cursor-pointer ${
                isMidnight
                  ? 'text-slate-300 hover:bg-slate-800 border-slate-700'
                  : 'text-stone-700 hover:bg-stone-50 border-stone-200'
              }`}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedToast ? 'Copied! 📋' : 'Copy summary'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
