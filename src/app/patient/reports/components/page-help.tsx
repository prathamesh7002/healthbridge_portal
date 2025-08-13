import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function PageHelp() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <HelpCircle className="h-4 w-4" />
            <span className="sr-only">Help</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-[300px]">
          <p className="text-sm">
            View and manage your medical reports and prescriptions here. 
            You can filter by type, search by name, or upload new documents.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
