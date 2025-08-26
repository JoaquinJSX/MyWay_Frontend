import { useState, useContext } from "react";
import { appContext } from "../../../../App";
import { UIContext } from "../../../UI";
import styles from "./steps.module.css";

interface NewStepContainerProps {
  goalIdProps: string | null;
  setIsShowingCreateStepField: React.Dispatch<React.SetStateAction<boolean>>;
}

interface NewStep {
  step_name: string;
  user_id: string;
  goal_id: string;
}

export default function NewStepContainer({ goalIdProps, setIsShowingCreateStepField }: NewStepContainerProps) {
  const context1 = useContext(appContext);
  const context2 = useContext(UIContext);
  if (!context1 || !context2) throw new Error("appContext must be used within an AppProvider");
  const { userLoggedIn } = context1;
  const { setSteps } = context2;

  const [newStep, setNewStep] = useState<NewStep>({ step_name: "", user_id: "", goal_id: "" });

  function addStep(goalId: string | null) {
    fetch("https://myway-backend.fly.dev/steps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newStep, goal_id: goalId, user_id: userLoggedIn?.id })
    }).then(res => {
      if (!res.ok) throw new Error("Create step failed");
      return res.json();
    })
      .then((data) => {
        setSteps(prev => [...prev, data]);
        setIsShowingCreateStepField(false);
      })
      .catch(error => {
        console.error("Error creating step:", error);
        alert("Error creating step");
      });
  }

  return (
    <section className={styles.stepForm}>
      <label htmlFor="stepName">Step name</label>
      <input
        id="stepName"
        className={styles.stepInput}
        type="text"
        value={newStep.step_name}
        onChange={e => setNewStep({ ...newStep, step_name: e.target.value })}
        placeholder="e.g. 30 min run"
        autoComplete="off"
      />
      <div className={styles.formActions}>
        <button className={styles.primary} onClick={() => addStep(goalIdProps)}>Add</button>
        <button className={styles.ghost} onClick={() => setIsShowingCreateStepField(false)}>Cancel</button>
      </div>
    </section>
  );
}
