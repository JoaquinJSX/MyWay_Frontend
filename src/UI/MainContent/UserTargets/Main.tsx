import Goals from "./Goals/Goals";
import CompletedGoals from "./Goals/CompletedGoals";
import styles from './main.module.css';

interface MainProps {
    whatIsShowing: string;
}

export default function Main({ whatIsShowing }: MainProps) {

    return (
        <main className={styles.mainContainer}>
            {whatIsShowing === 'pending_tasks' ?
                <Goals />
                :
                <CompletedGoals />}
        </main>
    );
}