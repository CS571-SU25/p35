import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { StepId } from "./builderSteps";
import { nextStep, prevStep } from "./builderSteps";

export function useWizardArrows(active: StepId) {
  const navigate = useNavigate();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.altKey)) return;
      if (e.key === "ArrowRight") navigate(`/builder/${prevStep(active)}`);
      if (e.key === "ArrowLeft")  navigate(`/builder/${nextStep(active)}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, navigate]);
}
