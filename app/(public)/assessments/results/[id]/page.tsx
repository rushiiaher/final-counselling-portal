import React from "react";
import PageContainer from "@/components/shared/PageContainer";
import { AlertTriangle, Info, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import BookAppointmentButton from "@/components/shared/BookAppointmentButton";

import prisma from "@/lib/prisma";

export default async function AssessmentResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await prisma.assessmentResult.findUnique({ where: { id } });

  if (!result) return <PageContainer className="bg-page"><div className="max-w-[560px] mx-auto py-16"><div className="ui-card p-8 text-center text-ink-2">Result not found.</div></div></PageContainer>;

  return (
    <PageContainer className="!max-w-none !px-4 !py-0 bg-page">
      <div className="max-w-[640px] mx-auto py-10 md:py-16">
        <div className="bg-surface border border-line p-4 rounded-[16px] text-sm text-ink-2 mb-6 flex gap-3 leading-relaxed">
          <Info className="w-5 h-5 shrink-0 text-navy" />
          <p>
            <strong className="text-ink">Clinical Disclaimer:</strong> This assessment is a screening tool and not a clinical diagnosis.
            The results are meant to provide context and help guide professional support.
          </p>
        </div>

        {result.triggeredCrisis && (
          <div className="bg-danger-tint border border-danger/20 p-6 sm:p-8 rounded-[16px] mb-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-surface rounded-full flex items-center justify-center text-danger mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="font-display text-h2 font-bold text-[#7F1D1D] mb-2">You are not alone.</h3>
            <p className="text-[#991B1B] mb-6 max-w-md leading-relaxed">
              Based on your answers, you may be experiencing significant distress or thoughts of self-harm.
              Please connect with emergency services or our crisis support immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link href="/chat" className="btn bg-danger text-white hover:bg-[#991B1B] px-6">
                Start Anonymous Chat
              </Link>
              <a href="tel:112" className="btn bg-surface text-danger border-danger/40 hover:bg-danger-tint px-6">
                Call Helpline
              </a>
            </div>
          </div>
        )}

        <div className="ui-card overflow-hidden mb-6">
          <div className="px-6 py-8 sm:p-10 text-center border-b border-line bg-tint">
            <h2 className="text-[13px] font-semibold font-sans text-ink-2 mb-3">{result.assessmentType} Screening Result</h2>
            <div className="font-display text-6xl sm:text-7xl font-bold text-navy mb-4">{result.score}</div>
            <span className={`tag text-xs px-4 py-1.5 ${
              result.severity === 'SEVERE' || result.severity === 'MODERATELY_SEVERE' ? 'tag-red' :
              result.severity === 'MODERATE' ? 'tag-amber' :
              'tag-green'
            }`}>
              {result.severity.replace("_", " ")}
            </span>
          </div>

          <div className="p-5 sm:p-8 space-y-4">
            <h3 className="font-display font-bold text-ink text-h3">Recommended Next Steps</h3>

            {(result.severity === "MINIMAL" || result.severity === "MILD") && !result.triggeredCrisis && (
              <div className="flex gap-4 p-5 border border-line rounded-[12px] bg-page">
                <ShieldCheck className="w-6 h-6 text-action shrink-0" />
                <div>
                  <h4 className="font-semibold text-ink text-base">Self-Guided Resources</h4>
                  <p className="text-sm text-ink-2 mt-1 mb-3 leading-relaxed">Your score indicates mild symptoms. Exploring our clinical resource hub may provide helpful coping strategies.</p>
                  <Link href="/resources" className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-semibold text-navy hover:underline underline-offset-4">Browse Resources <ArrowRight className="w-4 h-4" /></Link>
                </div>
              </div>
            )}

            {(result.severity === "MODERATE" || result.severity === "MODERATELY_SEVERE" || result.severity === "SEVERE") && !result.triggeredCrisis && (
              <div className="flex gap-4 p-5 border border-line rounded-[12px] bg-page">
                <ShieldCheck className="w-6 h-6 text-navy shrink-0" />
                <div>
                  <h4 className="font-semibold text-ink text-base">Professional Support Recommended</h4>
                  <p className="text-sm text-ink-2 mt-1 mb-4 leading-relaxed">Your score suggests you may benefit from speaking with a clinical professional to explore what you're experiencing.</p>
                  <div className="flex flex-wrap gap-2">
                    <BookAppointmentButton
                      label="Book Session"
                      className="btn btn-action"
                    />
                    <Link href="/chat" className="btn btn-outline">Chat Anonymously</Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
