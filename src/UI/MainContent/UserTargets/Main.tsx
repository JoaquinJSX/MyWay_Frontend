import Goals from "./Goals/Goals";
import CompletedGoals from "./Goals/CompletedGoals";
import styles from "./main.module.css";

interface MainProps {
    whatIsShowing: string;
}

export default function Main({ whatIsShowing }: MainProps) {
    const isPending = whatIsShowing === "pending_tasks";

    return (
        <main
            className={styles.mainContainer}
            role="main"
            aria-live="polite"
            aria-busy="false"
        >
            <section className={styles.contentArea} aria-label={isPending ? "Metas pendientes" : "Metas completadas"}>
                {isPending ? <Goals /> : <CompletedGoals />}
            </section>
        </main>
    );
}
