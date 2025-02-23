
import { Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface OrdersHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onExport: () => void;
}

export const OrdersHeader = ({ searchQuery, onSearchChange, onExport }: OrdersHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
      <div className="flex gap-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};
