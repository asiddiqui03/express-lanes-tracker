import { ArrowDown, ArrowUp, CarFront, Clock, Gauge, AlertTriangle, AlertCircle, Info, RefreshCw, Map } from "lucide-react";
import React from 'react';
import { fetchExpressLanesStatus } from '@/lib/api';
import { ThemeToggle } from "@/components/theme-toggle";

export const revalidate = 60; // Fetch fresh data every minute

async function getStatus() {
  return await fetchExpressLanesStatus();
}

export default async function Home() {
  const data = await getStatus();

  const isError = data.status === 'error';
  const isClosed = data.status === 'closed';
  const isInbound = data.status === 'inbound';
  const isOutbound = data.status === 'outbound';

  // Determine main status color and icon
  let statusColor = 'from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-950 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 shadow-gray-200/50 dark:shadow-gray-900/50';
  let badgeColor = 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700';
  let StatusIcon = AlertCircle;
  let statusTitle = "Status Unavailable";
  let statusSubtitle = "Unable to determine current lane configuration";

  if (isInbound) {
    statusColor = 'from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-950 text-emerald-950 dark:text-emerald-50 border-emerald-300 dark:border-emerald-800 shadow-emerald-200/50 dark:shadow-emerald-900/50';
    badgeColor = 'bg-emerald-200 dark:bg-emerald-800/50 text-emerald-800 dark:text-emerald-200 border-emerald-400 dark:border-emerald-700/50';
    StatusIcon = ArrowDown;
    statusTitle = "Inbound Open";
    statusSubtitle = "To Chicago (Southeast bound)";
  } else if (isOutbound) {
    statusColor = 'from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-950 text-blue-950 dark:text-blue-50 border-blue-300 dark:border-blue-800 shadow-blue-200/50 dark:shadow-blue-900/50';
    badgeColor = 'bg-blue-200 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200 border-blue-400 dark:border-blue-700/50';
    StatusIcon = ArrowUp;
    statusTitle = "Outbound Open";
    statusSubtitle = "From Chicago (Northwest bound)";
  } else if (isClosed) {
    statusColor = 'from-red-100 to-rose-200 dark:from-red-900 dark:to-rose-950 text-red-950 dark:text-red-50 border-red-300 dark:border-red-800 shadow-red-200/50 dark:shadow-red-900/50';
    badgeColor = 'bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-200 border-red-400 dark:border-red-800/50';
    StatusIcon = AlertTriangle;
    statusTitle = "Lanes Closed";
    statusSubtitle = "Express lanes are currently closed";
  } else if (isError) {
    statusTitle = "Service Unavailable";
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-neutral-100 font-sans selection:bg-neutral-800 selection:text-white flex flex-col pt-6 pb-12 sm:pt-10 sm:pb-16 px-4 relative overflow-hidden transition-colors duration-300">
      {/* Background ambient glow based on status */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-[0.15] dark:opacity-20 blur-[100px] sm:blur-[120px] rounded-full pointer-events-none transition-colors duration-1000 ${isInbound ? 'bg-emerald-500' : isOutbound ? 'bg-blue-500' : isClosed ? 'bg-red-500' : 'bg-gray-500'
        }`} />

      <div className="max-w-3xl w-full mx-auto relative z-10 flex-grow flex flex-col">

        {/* Top bar with theme toggle */}
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>

        {/* Header */}
        <header className="mb-8 text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-600 dark:text-neutral-400 mb-2 shadow-sm dark:shadow-inner">
            <CarFront className="w-6 h-6" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight dark:text-white flex flex-col gap-1 items-center justify-center">
            <span>I-90/94 Kennedy</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-700 dark:from-neutral-400 dark:to-neutral-600">Express Lanes</span>
          </h1>
          <p className="text-gray-500 dark:text-neutral-400 text-sm sm:text-base max-w-md mx-auto font-medium">
            Live real-time status of the Chicago Kennedy & Edens express lanes.
          </p>
        </header>

        {/* Main Status Card */}
        <div className={`
          relative overflow-hidden rounded-3xl p-8 sm:p-12 mb-6 border shadow-xl dark:shadow-2xl transition-all duration-500
          bg-gradient-to-br ${statusColor}
        `}>
          {/* subtle pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />

          <div className="relative z-10 flex flex-col items-center justify-center text-center">

            <div className={`
              inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full mb-6 relative
              ${badgeColor} border-[3px] shadow-sm dark:shadow-inner-xl animate-in zoom-in duration-500
            `}>
              <StatusIcon className="w-12 h-12 sm:w-16 sm:h-16 opacity-90" strokeWidth={2.5} />
            </div>

            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter mb-3 drop-shadow-sm">
              {statusTitle}
            </h2>

            <p className="text-lg sm:text-xl font-medium opacity-80 max-w-xs mx-auto mb-2">
              {statusSubtitle}
            </p>

            <div className={`mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${badgeColor}`}>
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isInbound || isOutbound ? 'bg-current' : 'bg-transparent'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isInbound || isOutbound ? 'bg-current' : 'bg-transparent'}`}></span>
              </span>
              LIVE DATA
            </div>
          </div>
        </div>

        {/* Map & Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

          {/* Stats Column */}
          <div className="flex flex-col gap-4">
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col justify-center items-start shadow-sm transition-transform hover:-translate-y-1 duration-300 h-full">
              <div className="flex items-center gap-3 text-gray-500 dark:text-neutral-400 font-medium mb-3">
                <Clock className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                <h3 className="text-sm uppercase tracking-wider">Travel Time</h3>
              </div>
              <p className="text-3xl font-bold dark:text-white tracking-tight">
                {data.travelTime !== 'Unknown' ? data.travelTime : '--'}
              </p>
            </div>

            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col justify-center items-start shadow-sm transition-transform hover:-translate-y-1 duration-300 h-full">
              <div className="flex items-center gap-3 text-gray-500 dark:text-neutral-400 font-medium mb-3">
                <Gauge className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                <h3 className="text-sm uppercase tracking-wider">Avg Speed</h3>
              </div>
              <p className="text-3xl font-bold dark:text-white tracking-tight">
                {data.speed !== 'Unknown' ? data.speed : '--'}
              </p>
            </div>
          </div>

          {/* Map Column */}
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-2 sm:p-4 shadow-sm flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 text-gray-500 dark:text-neutral-400 font-medium mb-3 px-2 pt-2">
              <Map className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm uppercase tracking-wider">Live Traffic Flow</h3>
            </div>
            <div className="flex-grow w-full min-h-[250px] md:min-h-0 rounded-xl overflow-hidden border border-gray-100 dark:border-neutral-800 relative bg-gray-100 dark:bg-neutral-950">
              {/* Embed Google Map centered on Kennedy Expressway with Traffic Layer using embedded URL format */}
              <iframe
                className="absolute inset-0 w-full h-full border-0"
                style={{ filter: "dark:invert(90%) dark:hue-rotate(180deg)" }} // Subtle CSS trick for dark maps if needed, though Maps usually handles its own or we accept light map. Alternatively, Maps Embed API handles it via styling. Here we use standard iframe.
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d11867.75508191995!2d-87.659929!3d41.924855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus&layer=t"
              ></iframe>
            </div>
          </div>

        </div>

        {/* Footer info box */}
        <div className="mt-auto pt-6 border-t border-gray-200 dark:border-neutral-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-500 dark:text-neutral-500 font-medium">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span>Data scraped automatically from public advisory sources.</span>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 py-1.5 px-3 rounded-full border border-gray-200 dark:border-neutral-800 shadow-sm">
            <RefreshCw className="w-3.5 h-3.5 text-gray-400 dark:text-neutral-400" />
            <span>Auto-updates every minute</span>
          </div>
        </div>

      </div>
    </main>
  );
}
