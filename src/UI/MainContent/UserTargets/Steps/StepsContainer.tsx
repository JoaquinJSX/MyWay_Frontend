import { useContext } from "react";
import { UIContext } from "../../../UI";
import styles from "./steps.module.css";

export default function StepsContainer(
  { goalIdProps, onRequestCreate }: { goalIdProps: string; onRequestCreate?: () => void }
) {
  const context = useContext(UIContext);
  if (!context) throw new Error("StepsContainer must be used within an AppProvider. UIContext is null.");
  const { steps, setSteps } = context;

  async function setAchievedStep(stepProp: any) {
    const newAchievedStatus = !stepProp.achieved;
    try {
      const response = await fetch(`https://myway-backend.fly.dev/steps/${stepProp.step_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ achieved: newAchievedStatus })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorData.message || response.statusText}`);
      }
      setSteps(prev =>
        prev.map(step => (step.step_id === stepProp.step_id ? { ...step, achieved: newAchievedStatus } : step))
      );
    } catch (error: any) {
      console.error("Error updating step:", error);
      alert(`Error updating step: ${error.message}`);
    }
  }

  async function deleteStep(stepId: string) {
    try {
      const response = await fetch(`https://myway-backend.fly.dev/steps/${stepId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorData.message || response.statusText}`);
      }
      setSteps(prev => prev.filter(step => step.step_id !== stepId));
    } catch (error: any) {
      console.error("Error deleting step:", error);
      alert(`Error deleting step: ${error.message}`);
    }
  }

  const filteredSteps = steps.filter(step => step.goal_id === goalIdProps);

  return (
    <section className={styles.steps}>
      {filteredSteps.length > 0 ? (
        filteredSteps.map(step => (
          <div key={step.step_id} className={`${styles.stepItem} ${step.achieved ? styles.achieved : ""}`}>
            <input
              className={styles.checkbox}
              type="checkbox"
              checked={!!step.achieved}
              onChange={() => setAchievedStep(step)}
              aria-label={step.achieved ? "Mark as pending" : "Mark as achieved"}
            />
            <h2 className={styles.stepTitle}>{step.step_name}</h2>
            <button className={styles.deleteBtn} onClick={() => deleteStep(step.step_id)}>Delete</button>
          </div>
        ))
      ) : (
        <div className={styles.empty}>
          <p>No hay pasos aún. ¡Crea el primero!</p>
          <button className={styles.secondary} onClick={() => onRequestCreate?.()}>
            Añadir paso
          </button>
        </div>
      )}
    </section>
  );
}
