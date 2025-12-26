import { Clock, MapPin, Trash2 } from 'lucide-react';
import type { WasteEvent } from '../App';

type EventLogProps = {
  events: WasteEvent[];
};

export function EventLog({ events }: EventLogProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 md:mb-6">
        Recent Detections
      </h2>
      {events.length === 0 ? (
        <div className="text-center py-12">
          <Trash2 className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            No recent detections
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Waste detections will appear here when robots detect waste items
          </p>
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600 transition-all duration-200 hover:shadow-sm"
            >
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="min-w-0">
                    <p className="text-gray-900 dark:text-white font-medium truncate">
                      {event.wasteType}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm truncate">
                      {event.robotName}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 flex-shrink-0">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs whitespace-nowrap">{event.timestamp}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs truncate">{event.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
