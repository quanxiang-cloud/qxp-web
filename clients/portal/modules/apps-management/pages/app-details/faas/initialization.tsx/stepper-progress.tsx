import React from 'react';
import cs from 'classnames';

interface StepperProgressProps {
  stepTitles: string[];
  currentStep: number;
  className?: string;
}

function StepperProgress({
  stepTitles,
  currentStep,
  className,
}: StepperProgressProps): JSX.Element {
  return (
    <div className={cs('stepper-progress', className)}>
      <div className="stepper-progress-wrapper">
        {
          stepTitles.map((title, idx) => {
            const done = currentStep > idx + 1;
            return (
              <div className="step-title" key={title}>
                <div className="step-title-wrap">
                  <div className={cs('step-title-number', {
                    'step-number-current': currentStep === idx + 1,
                    'step-number-done': done,
                  })}>{ !done ? (idx + 1) : '✅'}</div>
                  <div className={cs('step-title-text')}
                  >
                    {title}
                  </div>
                </div>
                {
                  (idx !== stepTitles.length - 1) && (
                    <div className="progress-bar-wrap">
                      <div className={cs('progress-bar', {
                        'step-done': done,
                      })} />
                    </div>)

                }
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

export default StepperProgress;
