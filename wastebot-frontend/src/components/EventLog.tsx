import { Clock, MapPin, Trash2 } from 'lucide-react';
import type { WasteEvent } from '../App';

type EventLogProps = {
  events: WasteEvent[];
};

export function EventLog({ events }: EventLogProps) {
  return (
    <div className="glass rounded-2xl shadow-premium border border-white/20 dark:border-white/10 p-5 md:p-6 transition-premium hover:shadow-premium-lg group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 md:mb-6 relative z-10 flex items-center gap-2">
        <span className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-400 rounded-full"></span>
        Recent Detections
      </h2>
      {events.length === 0 ? (
        <div className="text-center py-12 relative z-10">
          <div className="relative inline-block mb-4">
            <Trash2 className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 animate-pulse" />
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            No recent detections
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Waste detections will appear here when robots detect waste items
          </p>
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4 relative z-10">
          {events.map((event, index) => (
            <div
              key={event.id}
              className="flex items-start gap-3 md:gap-4 p-4 md:p-5 glass rounded-xl border border-white/20 dark:border-white/10 transition-premium hover:scale-[1.02] hover:shadow-md group animate-fadeIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/10 dark:from-green-500/30 dark:to-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md transition-premium group-hover:scale-110 group-hover:rotate-3">
                <Trash2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="min-w-0">
                    <p className="text-gray-900 dark:text-white font-semibold truncate text-base">
                      {event.wasteType}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm truncate mt-1">
                      {event.robotName}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 flex-shrink-0 bg-white/50 dark:bg-white/5 px-2 py-1 rounded-lg">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs whitespace-nowrap font-medium">{event.timestamp}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 bg-white/30 dark:bg-white/5 px-2 py-1 rounded-lg inline-flex">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs truncate font-medium">{event.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
