import type { Freshness } from '@/types/slang';
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

interface SlangFreshnessMeterProps {
  freshness: Freshness;
}

const freshnessConfig: Record<Freshness, { value: number; color: string; label: string; tooltip: string }> = {
  fresh: { value: 100, color: 'bg-green-500', label: '🔥 Fresh', tooltip: 'Hot off the press! Currently trending.' },
  established: { value: 75, color: 'bg-blue-500', label: '✅ Established', tooltip: 'Widely known and used.' },
  waning: { value: 50, color: 'bg-yellow-500', label: '📉 Waning', tooltip: 'Losing popularity, use with caution.' },
  cringe: { value: 25, color: 'bg-orange-500', label: '😬 Cringe', tooltip: 'Generally considered outdated or embarrassing.' },
  dead: { value: 10, color: 'bg-red-500', label: '💀 Dead', tooltip: 'Avoid using this term unless ironically.' },
};

export function SlangFreshnessMeter({ freshness }: SlangFreshnessMeterProps) {
  const config = freshnessConfig[freshness];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="w-full text-left">
           <div className="flex items-center gap-2">
                <Progress value={config.value} className={cn("h-2 w-24", config.color)} indicatorClassName={config.color} />
                <span className={cn("text-xs font-medium capitalize", `text-${config.color.replace('bg-','').replace('-500','')}-600 dark:text-${config.color.replace('bg-','').replace('-500','')}-400`)}>{config.label}</span>
           </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Need to ensure Tailwind includes these dynamic classes
// bg-green-500 text-green-600 dark:text-green-400
// bg-blue-500 text-blue-600 dark:text-blue-400
// bg-yellow-500 text-yellow-600 dark:text-yellow-400
// bg-orange-500 text-orange-600 dark:text-orange-400
// bg-red-500 text-red-600 dark:text-red-400
