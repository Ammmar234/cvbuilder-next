import React, { useMemo, memo } from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

interface Step {
  id: number;
  name: string;
  completed: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = memo(({ steps, currentStep }) => {
  const renderedSteps = useMemo(
    () =>
      steps.map((step) => (
        <li key={step.id} className="relative flex-1 min-w-0">
          <div className="relative flex flex-col  sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 sm:space-x-reverse px-2">
            <div
              className={`
                flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300
                ${
                  step.completed
                    ? 'bg-blue-600 text-white'
                    : currentStep === step.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }
              `}
            >
              {step.completed ? (
                <CheckIcon className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{step.id}</span>
              )}
            </div>
            <div className="min-w-0 flex-1 text-center sm:text-right">
              <span
                className={`
                  text-sm font-medium transition-colors duration-300
                  ${
                    step.completed || currentStep === step.id
                      ? 'text-blue-600'
                      : 'text-gray-500'
                  } 
                `}
              >
                {step.name}
              </span>
            </div>
          </div>
        </li>
      )),
    [steps, currentStep]
  );

  return (
    <div className="bg-white px-4 py-5 border-b border-gray-200 flex items-center justify-between sm:px-6">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between overflow-x-auto ">{renderedSteps}</ol>
      </nav>
    </div>
  );
});
