
import React from "react";
import { PackageDetails as PackageDetailsType } from "../types";
import { Package, Scale, Ruler } from "lucide-react";

interface PackageDetailsProps {
  packageDetails: PackageDetailsType;
}

const PackageDetails = ({ packageDetails }: PackageDetailsProps) => {
  if (!packageDetails) {
    return null;
  }

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-medium mb-2 flex items-center">
        <Package className="h-4 w-4 mr-2" />
        Package Details
      </h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center">
          <Scale className="h-4 w-4 mr-2 text-gray-500" />
          <span>Weight: {packageDetails.weight} {packageDetails.weight_unit}</span>
        </div>
        
        {packageDetails.dimensions && (
          <div className="flex items-center">
            <Ruler className="h-4 w-4 mr-2 text-gray-500" />
            <span>
              Dimensions: {packageDetails.dimensions.length} × {packageDetails.dimensions.width} × {packageDetails.dimensions.height} {packageDetails.dimensions.unit}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageDetails;
