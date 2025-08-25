import { useContext } from "react";
import { UIContext } from "../../../UI";
import styles from "./completedGoals.module.css";

export default function CompletedGoals() {
  const context = useContext(UIContext);
  if (!context) throw new Error("UIContext must be used within a provider");
  const { goals, setGoals } = context;

  const completed = goals.filter(g => g.achieved);

  async function deleteGoal(goalId: string) {
    try {
      const res = await fetch(`https://myway-backend.fly.dev/goals/${goalId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setGoals(prev => prev.filter(g => g.goal_id !== goalId));
      alert("Goal deleted successfully");
    } catch (e:any) {
      alert(`Error deleting goal: ${e.message}`);
    }
  }

  async function markAsPending(goalId: string) {
    try {
      const res = await fetch(`https://myway-backend.fly.dev/goals/${goalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ achieved: false })
      });
      if (!res.ok) throw new Error("Update failed");
      setGoals(prev => prev.map(g => g.goal_id === goalId ? { ...g, achieved: false } : g));
      alert("Goal moved back to pending");
    } catch (e:any) {
      alert(`Error updating goal: ${e.message}`);
    }
  }

  return (
    <section className={styles.wrapper} aria-label="Metas completadas">
      {completed.length === 0 ? (
        <div className={styles.empty}>
          <p>No tienes metas completadas todavía.</p>
          <small>Vuelve a la pestaña Pendings para seguir trabajando en tus metas.</small>
        </div>
      ) : (
        <div className={styles.grid}>
          {completed.map(goal => (
            <article key={goal.goal_id} className={styles.card}>
              <header className={styles.head}>
                <span className={styles.emoji} aria-hidden>🟢</span>
                <div>
                  <h2 className={styles.title}>{goal.goal_name}</h2>
                  {goal.due_date && <div className={styles.meta}>Vencía: {new Date(goal.due_date).toLocaleDateString()}</div>}
                </div>
              </header>

              <div className={styles.actions}>
                <button className={`${styles.btn} ${styles.restore}`} onClick={() => markAsPending(goal.goal_id)}>
                  Marcar como pendiente
                </button>
                <button className={`${styles.btn} ${styles.delete}`} onClick={() => deleteGoal(goal.goal_id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
