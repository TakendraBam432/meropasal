
import React from "react";
import { ShipmentUpdate, formatDate, formatTime } from "../types";
import { Clock, MapPin } from "lucide-react";

interface ShipmentUpdatesProps {
  updates: ShipmentUpdate[];
}

const ShipmentUpdates = ({ updates }: ShipmentUpdatesProps) => {
  if (!updates || updates.length === 0) {
    return null;
  }

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-medium mb-4">Shipment Updates</h3>
      <div className="space-y-4">
        {updates.map((update, index) => (
          <div key={index} className="relative pl-6 pb-4 border-l border-gray-200 last:border-l-0 last:pb-0">
            <div className="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-500"></div>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-sm">{update.status}</h4>
                <p className="text-sm text-gray-600 mt-1">{update.description}</p>
                {update.location && (
                  <p className="text-sm text-gray-500 mt-1 flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {update.location}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{formatDate(update.timestamp)}</p>
                <p className="text-xs text-gray-400 flex items-center justify-end">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTime(update.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShipmentUpdates;
