import { useContext, useState } from "react";
import { UIContext } from "../../../UI";
import StepsContainer from "../Steps/StepsContainer";
import NewStepContainer from "../Steps/NewStepContainer";
import Category from "./GoalCategory";
import styles from './goals.module.css';

interface GoalShowedProps {
    setGoalShowed: any;
    goalShowed: string | null;
}

export default function GoalShowed({ setGoalShowed, goalShowed }: GoalShowedProps) {

    const [isShowingCreateStepField, setIsShowingCreateStepField] = useState<boolean>(false);

    const context = useContext(UIContext);

    if (!context) {
        throw new Error("appContext must be used within an AppProvider");
    }
    const { goals } = context;

    return (
        <section className={styles.goalShowedContainer}>
            <button onClick={() => setIsShowingCreateStepField(true)}>Add step</button>
            <button onClick={() => setGoalShowed(null)}>Exit</button>
            {goals.filter(goal => goal.goal_id === goalShowed).map((goal) =>
                <div key={goal.goal_id}>
                    <section>
                        <div className={styles.goalShowedHeader}>
                            <Category category={goal.category} />
                            <h1>
                                {goal.goal_name}
                            </h1>
                        </div>
                        <h3>
                            Due date: {
                                new Date(goal.due_date).toLocaleDateString('es-ES', { day: "2-digit", month: "2-digit", year: "numeric" })
                            }
                        </h3>
                        <p>{goal.progress}</p>
                        <hr />
                        {!isShowingCreateStepField ?
                            <StepsContainer goalIdProps={goal.goal_id} />
                            :
                            <NewStepContainer goalIdProps={goalShowed} setIsShowingCreateStepField={setIsShowingCreateStepField} />}
                    </section>
                </div>)}
        </section>
    );
}