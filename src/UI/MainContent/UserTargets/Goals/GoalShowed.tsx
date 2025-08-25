import { useContext, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { UIContext } from "../../../UI";
import StepsContainer from "../Steps/StepsContainer";
import NewStepContainer from "../Steps/NewStepContainer";
import Category from "./GoalCategory";
import styles from "./goalShowed.module.css";

interface GoalShowedProps {
  setGoalShowed: (v: string | null) => void;
  goalShowed: string | null;
}

export default function GoalShowed({ setGoalShowed, goalShowed }: GoalShowedProps) {
  const [isCreatingStep, setIsCreatingStep] = useState(false);
  const context = useContext(UIContext);
  if (!context) throw new Error("UIContext must be used within a provider");

  const goal = context.goals.find(g => g.goal_id === goalShowed);
  if (!goal) return null;

  // Cerrar con tecla ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setGoalShowed(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setGoalShowed]);

  // Bloquear scroll del body mientras el modal esté abierto
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const due = new Date(goal.due_date).toLocaleDateString("es-ES", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });

  const modal = (
    // Click en overlay cierra
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="goal-title"
      onClick={() => setGoalShowed(null)}
    >
      {/* Evitar que los clics dentro de la tarjeta cierren */}
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        {/* Header: [Cerrar] [Título+meta] [Acciones] */}
        <header className={styles.header}>
          <button
            type="button"
            className={styles.closeBtn}
            aria-label="Cerrar"
            onClick={() => setGoalShowed(null)}
          >
            ✕
          </button>

          <div className={styles.titleBlock}>
            <h1 id="goal-title" className={styles.title}>{goal.goal_name}</h1>
            <div className={styles.metaRow}>
              <span className={`${styles.chip} ${styles.category}`}>
                <Category cat={goal.category} />
              </span>
              <span className={styles.separator} aria-hidden>•</span>
              <span className={styles.chip}><strong>Vence:</strong> {due}</span>
            </div>
          </div>

          <div className={styles.actions}>
            {!isCreatingStep && (
              <button className={styles.primary} onClick={() => setIsCreatingStep(true)}>
                + Añadir paso
              </button>
            )}
          </div>
        </header>

        <hr className={styles.hr} />

        <main className={styles.content}>
          {!isCreatingStep ? (
            <div className={styles.stepsWrap}>
              <StepsContainer
                goalIdProps={goal.goal_id}
                onRequestCreate={() => setIsCreatingStep(true)}
              />
            </div>
          ) : (
            <div className={styles.formWrap}>
              <NewStepContainer
                goalIdProps={goal.goal_id}
                setIsShowingCreateStepField={setIsCreatingStep}
              />
              <button className={styles.ghost} onClick={() => setIsCreatingStep(false)}>
                Cancelar
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
