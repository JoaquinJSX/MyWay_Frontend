import { useContext, useState, useEffect } from "react";
import { UIContext } from "../../../UI";
import Category from "./GoalCategory";
import styles from './goals.module.css';

type GoalsContainerProps = {
    setGoalShowed: React.Dispatch<React.SetStateAction<string | null>>;
    setIsShowingCreateGoalField: React.Dispatch<React.SetStateAction<boolean>>;
    isShowingCreateGoalField: boolean;
}

export default function GoalsContainer({ setGoalShowed, isShowingCreateGoalField, setIsShowingCreateGoalField }: GoalsContainerProps) {

    const context = useContext(UIContext);
    if (!context) {
        throw new Error("appContext must be used within an AppProvider");
    }
    const { goals, setGoals, steps } = context;
    const [pendingGoals, setPendingGoals] = useState<any[]>([]);

    // Filter pending goals (those not achieved)
    useEffect(() => {
        setPendingGoals(goals.filter(goal => !goal.achieved));
    }, [goals, steps]);

    function deleteGoal(goalId: string) {
        fetch(`https://myway-backend.fly.dev/goals/${goalId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            setGoals(goals.filter(goal => goal.goal_id !== goalId));
        })
            .catch(error => {
                console.error('Error deleting goal:', error);
                alert("Error deleting goal");
            });
    }

    // Function to set a goal as achieved or pending
    function setAchievedGoal(goalProp: any) {
        fetch(`https://myway-backend.fly.dev/goals/${goalProp.goal_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ achieved: goalProp.achieved === true ? false : true })
        }).then(() => {
            setGoals(goals.map(goal => goal.goal_id === goalProp.goal_id ? { ...goal, achieved: !goalProp.achieved } : goal));
        })
            .catch(error => {
                console.error('Error updating goal:', error);
                alert("Error updating goal");
            });
    }

    type goalTypes = {
        goal_id: string;
        goal_name: string;
        category: string;
        due_date: string;
        progress: number;
    }

    // Function to calculate the percentage of steps completed for a goal
    const PercentageOfStepsCompleted = ({ goalId }: { goalId: string }) => {
        const goalSteps = steps.filter((step: any) => step.goal_id === goalId);
        const achievedSteps = goalSteps.filter((step: any) => step.achieved).length;
        const percentage = (achievedSteps / goalSteps.length) * 100;

        return (
            <div className={styles.progressContainer}>
                <div
                    className={styles.progressBar}
                    style={{ width: `${percentage}%` }}
                >
                    {percentage.toFixed(0)}%
                </div>
            </div>
        );
    }

    return (
        <>
            {pendingGoals.length > 0 ?
                <div className={styles.pendingGoalsContainer}>
                    <button className={styles.create_new_goal_btn}
                        onClick={() => setIsShowingCreateGoalField(isShowingCreateGoalField ? false : true)}>
                        +
                    </button>
                    {pendingGoals.map((goal: goalTypes) =>
                        <section className={styles.goalContainer} key={goal.goal_id}>
                            <button className={styles.setAchievedGoalBtn} onClick={() => setAchievedGoal(goal)}>
                                Mark as achieved
                            </button>
                            <section className={styles.aboutGoal}>
                                <Category category={goal.category} />
                                <h1>
                                    {goal.goal_name}
                                </h1>
                                <h3>
                                    {
                                        new Date(goal.due_date).toLocaleDateString('es-ES', { day: "2-digit", month: "2-digit", year: "numeric" })
                                    }
                                </h3>
                                <PercentageOfStepsCompleted goalId={goal.goal_id} />
                                <div className={styles.goalButtonsContainer}>
                                    <button
                                        className={styles.getGoalShowedBtn}
                                        onClick={() => setGoalShowed(goal.goal_id)}>
                                        View
                                    </button>
                                    <button
                                        className={styles.deleteGoalBtn}
                                        onClick={() => deleteGoal(goal.goal_id)}>
                                        Delete
                                    </button>
                                </div>
                            </section>
                        </section>
                    )}

                </div>
                :
                <div className={styles.no_goals_container}>
                    <h2>You have no pending goals!</h2>
                    <br />
                    <button className={styles.create_new_goal_btn}
                        onClick={() => setIsShowingCreateGoalField(isShowingCreateGoalField ? false : true)}>
                        +
                    </button>
                </div>}
        </>
    );
}