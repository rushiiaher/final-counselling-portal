"use client";

import React, { useState, use } from "react";
import PageContainer from "@/components/shared/PageContainer";
import { AssessmentRegistry } from "@/lib/assessments/registry";
import { submitAssessmentAction } from "@/app/actions/assessment.actions";
import { useRouter } from "next/navigation";
import { AssessmentType } from "@prisma/client";

export default function TakeAssessmentPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = use(params);
  const router = useRouter();
  
  const assessmentType = type.toUpperCase() as AssessmentType;
  const assessment = AssessmentRegistry[assessmentType];

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!assessment) return <PageContainer className="bg-page"><div className="max-w-[560px] mx-auto py-16"><div className="ui-card p-8 text-center text-ink-2">Assessment not found.</div></div></PageContainer>;

  const handleSelect = (score: number) => {
    const q = assessment.questions[currentStep];
    const newAnswers = { ...answers, [q.id]: score };
    setAnswers(newAnswers);
    
    if (currentStep < assessment.questions.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 250);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const token = localStorage.getItem("anon_session_token");
    
    const res = await submitAssessmentAction(assessment.type, answers, token);
    if (res.success) {
      router.push(`/assessments/results/${res.resultId}`);
    } else {
      setIsSubmitting(false);
    }
  };

  const q = assessment.questions[currentStep];
  const progress = ((currentStep + 1) / assessment.questions.length) * 100;
  const canSubmit = Object.keys(answers).length === assessment.questions.length;

  return (
    <PageContainer className="!max-w-none !px-4 !py-0 bg-page">
      <div className="max-w-[560px] mx-auto py-10 md:py-16">
        <div className="mb-6">
          <h1 className="font-display text-h2 font-bold text-ink mb-4">{assessment.name}</h1>
          <div
            className="h-2 w-full bg-tint rounded-full overflow-hidden"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
            <div className="h-full bg-navy rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-[13px] font-semibold text-ink-2 mt-2">Question {currentStep + 1} of {assessment.questions.length}</p>
        </div>

        <div className="ui-card p-5 sm:p-8">
          <h2 className="text-[0.9375rem] font-normal font-sans text-ink-2 mb-6 leading-relaxed">
            Over the last 2 weeks, how often have you been bothered by:
            <br />
            <span className="font-display font-bold text-h3 sm:text-[22px] text-ink mt-2 block leading-snug">"{q.text}"</span>
          </h2>

          <div className="space-y-3">
            {assessment.options.map((opt, i) => {
              const selected = answers[q.id] === opt.score;
              return (
                <button
                  key={i}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => handleSelect(opt.score)}
                  className={`w-full min-h-[56px] px-4 py-3 rounded-[12px] border text-left text-[0.9375rem] font-medium flex items-center gap-3 transition-colors duration-150 ${
                    selected
                      ? "border-navy bg-tint text-navy"
                      : "border-line bg-surface text-ink hover:bg-hover"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                      selected ? "border-navy" : "border-[#9CA3AF]"
                    }`}
                  >
                    {selected && <span className="w-2.5 h-2.5 rounded-full bg-navy" />}
                  </span>
                  {opt.text}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="btn btn-ghost"
          >
            &larr; Previous
          </button>

          {currentStep === assessment.questions.length - 1 && canSubmit && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn btn-action px-8"
            >
              {isSubmitting ? "Processing..." : "View Results"}
            </button>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
