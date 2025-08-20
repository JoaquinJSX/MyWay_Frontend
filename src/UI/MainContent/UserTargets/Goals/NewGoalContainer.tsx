import { useState, useContext } from "react";
import { appContext } from "../../../../App";
import { UIContext } from "../../../UI";
import styles from './goals.module.css';

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

    const context1 = useContext(appContext);
    const context2 = useContext(UIContext);
    if (!context1 || !context2) {
        throw new Error("appContext must be used within an AppProvider");
    }
    const { userLoggedIn } = context1;
    const { setGoals } = context2

    // Default due date is set to one month from today
    const defaultDueDate = (() => {
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return nextMonth.toISOString().split('T')[0];
    })();

    const [newGoal, setNewGoal] = useState<NewGoal>({
        goal_name: '',
        category: 'Education',
        due_date: defaultDueDate,
        user_id: userLoggedIn?.id ? userLoggedIn.id : null
    });

    function addNewGoal() {
        fetch('http://localhost:3000/goals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...newGoal, user_id: userLoggedIn?.id })
        }).then(() => {
            /* setGoals([goals.push(newGoal)]); */
            setGoals(prev => [...prev, newGoal]);
        })
    }

    return (
        <div className={styles.new_goal_container}>
            <h1>Create new Goal</h1>
            <section>
                Goal name: <input placeholder="Enter goal name"
                    type="text" value={newGoal.goal_name}
                    onChange={(e) => setNewGoal({ ...newGoal, goal_name: e.target.value })}
                />
                <br />
                Category:
                <select value={newGoal.category} onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}>
                    <option value="Education">Education</option>
                    <option value="Travel">Travel</option>
                    <option value="Work">Work</option>
                    <option value="Finance">Finance</option>
                    <option value="Health">Health</option>
                </select>
                <br />
                Due date: <input type="date"
                    value={newGoal.due_date}
                    onChange={(e) => setNewGoal({ ...newGoal, due_date: e.target.value })}
                />
            </section>
            <br />
            <button className={styles.createBtn} onClick={addNewGoal}>Create</button>
            <button className={styles.cancelBtn}
                onClick={() => setIsShowingCreateGoalField(false)}>
                Cancel
            </button>
        </div>
    );
}