"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: boolean[];
  stepNames: string[];
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  completedSteps,
  stepNames,
}: ProgressIndicatorProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isActive = index === currentStep;
          const isCompleted = completedSteps[index];
          const isPast = index < currentStep;

          return (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-105 bg-background border-border text-muted-foreground hover:border-primary",
                    {
                      "bg-primary border-primary text-primary-foreground":
                        isActive,
                      "bg-green-500 border-green-500 text-white":
                        isPast || isCompleted,
                    }
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </span>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium text-center max-w-20 text-muted-foreground",
                    {
                      "text-primary": isActive,
                      "text-green-600": isPast || isCompleted,
                    }
                  )}
                >
                  {stepNames[index]}
                </span>
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-16 mx-4 transition-colors duration-200",
                    {
                      "bg-primary": currentStep > index,
                      "bg-green-500": isPast || isCompleted,
                      "bg-border": currentStep <= index,
                    }
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
