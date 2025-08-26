import { useState, useContext } from "react";
import { appContext } from "../../../../App";
import { UIContext } from "../../../UI";
import styles from "./newGoal.module.css";

interface NewGoal {
  goal_name: string;
  category: string;
  due_date: string;
  user_id: string | null;
}

interface NewGoalContainerProps {
  setIsShowingCreateGoalField: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NewGoalContainer({ setIsShowingCreateGoalField }: NewGoalContainerProps) {
  const app = useContext(appContext);
  const ui = useContext(UIContext);
  if (!app || !ui) throw new Error("Contexts must be used within providers");

  const { userLoggedIn } = app;
  const { setGoals } = ui;

  // Fecha por defecto: +1 mes
  const defaultDueDate = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split("T")[0];
  })();

  const [newGoal, setNewGoal] = useState<NewGoal>({
    goal_name: "",
    category: "Education",
    due_date: defaultDueDate,
    user_id: userLoggedIn?.id || null
  });

  async function addNewGoal() {
    if (newGoal.goal_name.trim() === "") {
      alert("Goal name cannot be empty");
      return;
    }
    if (newGoal.user_id !== null) {
      try {
        const res = await fetch("https://myway-backend.fly.dev/goals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newGoal),
        });
        if (!res.ok) throw new Error("Create failed");
        const data = await res.json();
        setGoals(prev => [...prev, data.goal]);
        setIsShowingCreateGoalField(false);
      } catch (e: any) {
        console.log(`Error creating goal: ${e.message}`);
      }
    }
  }

  return (
    <section className={styles.panel} aria-label="Create new goal">
      <h1 className={styles.title}>Create new Goal</h1>

      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); addNewGoal(); }}>
        {/* Goal name */}
        <div className={styles.group}>
          <label className={styles.label} htmlFor="goal-name">Goal name:</label>
          <input
            id="goal-name"
            className={styles.input}
            placeholder="Enter goal name"
            type="text"
            value={newGoal.goal_name}
            onChange={e => setNewGoal({ ...newGoal, goal_name: e.target.value })}
            required
          />
        </div>

        {/* Category */}
        <div className={styles.group}>
          <label className={styles.label} htmlFor="goal-category">Category:</label>
          <select
            id="goal-category"
            className={styles.select}
            value={newGoal.category}
            onChange={e => setNewGoal({ ...newGoal, category: e.target.value })}
          >
            <option value="Education">Education</option>
            <option value="Travel">Travel</option>
            <option value="Work">Work</option>
            <option value="Finance">Finance</option>
            <option value="Health">Health</option>
          </select>
        </div>

        {/* Due date */}
        <div className={styles.group}>
          <label className={styles.label} htmlFor="goal-due">Due date:</label>
          <input
            id="goal-due"
            className={styles.date}
            type="date"
            value={newGoal.due_date}
            onChange={e => setNewGoal({ ...newGoal, due_date: e.target.value })}
          />
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button type="submit" className={`${styles.btn} ${styles.primary}`}>Create</button>
          <button
            type="button"
            className={`${styles.btn} ${styles.ghost}`}
            onClick={() => setIsShowingCreateGoalField(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
