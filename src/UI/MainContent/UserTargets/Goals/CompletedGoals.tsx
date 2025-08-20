import { useContext, useEffect, useState } from "react";
import { UIContext } from "../../../UI";
import Category from "./GoalCategory";
import styles from './goals.module.css';

export default function CompletedGoals() {

    const [achievedGoals, setAchievedGoals] = useState<any[]>([]);

    const context = useContext(UIContext);
    if (!context) {
        throw new Error("appContext must be used within an AppProvider");
    }
    const { goals, setGoals } = context;

    // Obtain from the 'goals' only those that have been achieved
    useEffect(() => {
        setAchievedGoals(goals.filter(goal => goal.achieved));
    }, [goals]);

    // Mark goal as achieved or desmark it
    function setAchievedGoal(goalProp: any) {
        // Alternatively, toggle the achieved status of the goal (true if it was false, and vice versa)
        const newAchievedStatus = !goalProp.achieved;

        fetch(`http://localhost:3000/goals/${goalProp.goal_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ achieved: newAchievedStatus })
        }).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        }).then(() => {
            // Update the state to reflect the change
            setGoals(goals.map(goal =>
                goal.goal_id === goalProp.goal_id ? { ...goal, achieved: newAchievedStatus } : goal
            ));
        })
            .catch(error => {
                console.error('Error updating goal:', error);
                alert("Error updating goal: " + error.message);
            });
    }

    // Delete goal receiving the goal_id as prop
    function deleteGoal(goalId: string) {
        fetch(`http://localhost:3000/goals/${goalId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        }).then(() => {
            setGoals(goals.filter(goal => goal.goal_id !== goalId));
        })
            .catch(error => {
                console.error('Error deleting goal:', error);
                alert("Error deleting goal: " + error.message);
            });
    }

    // Function to get the percentage of steps completed for a goal
    const PercentageOfStepsCompleted = ({ goalId }: { goalId: string }) => {
        const context = useContext(UIContext);
        if (!context) {
            throw new Error("appContext must be used within an AppProvider");
        }
        const { steps } = context;

        // Filter steps to get only those that belong to the current goal
        const goalSteps = steps.filter((step: any) => step.goal_id === goalId);

        // Calculate the number of completed steps
        const completedStepsCount = goalSteps.filter((step: any) => step.achieved).length;

        // Calculate the percentage of completed steps
        let progressPercentage = 0;
        if (goalSteps.length > 0) {
            progressPercentage = (completedStepsCount / goalSteps.length) * 100;
        }

        // Render the progress bar with the calculated percentage
        return (
            <div className={styles.progressContainer}>
                <div
                    className={styles.progressBar}
                    style={{ width: `${progressPercentage}%`, backgroundColor: 'green' }}
                >
                    {progressPercentage.toFixed(0)}%
                </div>
            </div>
        );
    };

    return (
        <>
            {achievedGoals.length > 0 ? (
                achievedGoals.map(goal => (
                    <section className={styles.achievedGoalContainer} key={goal.goal_id}>
                        <button className={styles.setAchievedGoalBtn} onClick={() => setAchievedGoal(goal)}>
                            Mark as pending
                        </button>
                        <section className={styles.aboutGoalAchieved}>
                            <Category category={goal.category} />
                            <h1>
                                {goal.goal_name}
                            </h1>
                            {/* <p>Achieved steps percentage:</p> */}
                            {/* <PercentageOfStepsCompleted goalId={goal.goal_id} /> */}
                            <div>
                                <button onClick={() => deleteGoal(goal.goal_id)}>Delete</button>
                            </div>
                        </section>
                    </section>
                ))
            ) : (
                <h2>You haven't achieved goals yet.</h2>
            )}
        </>
    );
}