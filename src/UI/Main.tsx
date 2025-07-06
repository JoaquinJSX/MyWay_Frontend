import { useEffect, useState } from "react";

interface MainProps {
    users: any[];
    userLoggedInIndex: number | null;
}

interface NewGoal {
    goal_name: string;
    category: string;
    due_date: string;
    user_id: string | null;
}

interface NewStep {
    step_name: string;
    user_id?: string;
    goal_id?: string;
}

export default function Main({ users, userLoggedInIndex }: MainProps) {

    const [userId, setUserId] = useState<string>();

    useEffect(() => {
        if (userLoggedInIndex !== null) {
            setUserId(users[userLoggedInIndex].id);
        }
    }, [userLoggedInIndex]);

    const [goals, setGoals] = useState<any[]>([]);
    const [steps, setSteps] = useState<any[]>([]);
    const [isShowingCreateGoalField, setIsShowingCreateGoalField] = useState<boolean>(false);
    const [isShowingCreateStepField, setIsShowingCreateStepField] = useState<boolean>(false);
    

    const defaultDueDate = (() => {
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return nextMonth.toISOString().split('T')[0];
    })();

    const [newGoal, setNewGoal] = useState<NewGoal>({
        goal_name: '',
        category: 'Education',
        due_date: defaultDueDate,
        user_id: userId ? userId : null
    });

    const [newStep, setNewStep] = useState<NewStep>();

    

    function getGoals() {
        if (userId) {
            fetch(`http://localhost:3000/goals/${userId}`)
                .then(response => response.json())
                .then(data => {
                    const userGoals = data.filter((goal: any) => goal.user_id === userId);
                    setGoals(userGoals);
                    if (userGoals.length > 0) {
                        console.log(userGoals);
                    } else {
                        console.log("No goals found for the user.");
                    }

                })
                .catch(error => {
                    console.error('Error fetching goals:', error);
                });
        }
    }

    function getSteps() {
        if (userId) {
            fetch(`http://localhost:3000/steps/${userId}`)
                .then(response => response.json())
                .then(data => {
                    const userSteps = data.filter((step: any) => step.user_id === userId);
                    setSteps(userSteps);
                    if (userSteps.length > 0) {
                        console.log(userSteps);
                    } else {
                        console.log("No steps found for the user.");
                    }

                })
                .catch(error => {
                    console.error('Error fetching steps:', error);
                });
        }
    }

    function addNewGoal() {
        if (userId) {
            fetch('http://localhost:3000/goals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...newGoal, user_id: userId })
            }).then(() => {
                alert("Goal created successfully");
                setNewGoal({
                    ...newGoal,
                    goal_name: '',
                    category: 'Education',
                    due_date: defaultDueDate,
                });
            })
                .catch(error => {
                    console.error('Error creating user:', error);
                    alert("Error creating user");
                });
        }
    }

    useEffect(() => {
        getGoals();
        getSteps();
    }, [userId]);

    function deleteGoal(goalId: string) {
        if (userId) {
            fetch(`http://localhost:3000/goals/${goalId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(() => {
                alert("Goal deleted successfully");
                setGoals(goals.filter(goal => goal.goal_id !== goalId));
            })
                .catch(error => {
                    console.error('Error deleting goal:', error);
                    alert("Error deleting goal");
                });
        }
    }

    function addStep(goalId: string) {
        if (userId && goals.length > 0) {
            fetch('http://localhost:3000/steps', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        ...newStep,
                        goal_id: goalId,
                        user_id: userId
                    }
                )
            }).then(() => {
                alert("Goal created successfully");
                setIsShowingCreateStepField(false);
            })
                .catch(error => {
                    console.error('Error creating user:', error);
                    alert("Error creating user");
                });
        }
    }

    function deleteStep(stepId: string) {
        if (userId) {
            fetch(`http://localhost:3000/steps/${stepId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(() => {
                alert("Step deleted successfully");
                setSteps(steps.filter(step => step.step_id !== stepId));
            })
                .catch(error => {
                    console.error('Error deleting step:', error);
                    alert("Error deleting step");
                });
        }
    }

    return (
        <div>
            <h1>MyWay App</h1>
            <div>
                <button onClick={() => setIsShowingCreateGoalField(true)}>Add new goal</button>
                {isShowingCreateGoalField ?
                    <>
                        <h1>Create new Goal</h1>
                        <section>
                            Goal name: <input
                                type="text" value={newGoal.goal_name}
                                onChange={(e) => setNewGoal({ ...newGoal, goal_name: e.target.value })}
                            />
                            <br />
                            Goal category:
                            <select value={newGoal.category} onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}>
                                <option value="Education">Education</option>
                                <option value="Travel">Travel</option>
                                <option value="Work">Work</option>
                                <option value="Finance">Finance</option>
                            </select>
                            <br />
                            Due date: <input type="date"
                                value={newGoal.due_date}
                                onChange={(e) => setNewGoal({ ...newGoal, due_date: e.target.value })}
                            />
                        </section>
                        <button onClick={addNewGoal}>Create</button>
                    </>
                    :
                    <>
                        <h1>Goals:</h1>
                        {goals.map((item) =>
                            <section key={item.goal_id}>
                                <h1>{item.goal_name}</h1>
                                <button onClick={() => setIsShowingCreateStepField(!isShowingCreateStepField ? true : false)}>
                                    {!isShowingCreateStepField ? 'Add new step' : 'Close'}
                                </button>
                                <button onClick={() => deleteGoal(item.goal_id)}>Delete goal</button>
                                {isShowingCreateStepField &&
                                    <section>
                                        Step name: <input type="text" value={newStep?.step_name}
                                            onChange={e => setNewStep({ ...newStep, step_name: e.target.value })} />
                                        <br />
                                        <button onClick={() => addStep(item.goal_id)}>Add</button>
                                    </section>}
                                <h1>Steps:</h1>
                                <>
                                    {steps.filter(step => step.goal_id === item.goal_id).map((step) =>
                                        <section key={step.step_id}>
                                            <h2>{step.step_name}</h2>
                                            <button onClick={() => deleteStep(step.step_id)}>Delete</button>
                                        </section>
                                    )}
                                </>
                            </section>)}
                    </>}
            </div>
        </div>
    );
}