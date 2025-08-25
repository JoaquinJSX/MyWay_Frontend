import { useState, useEffect, useContext, createContext } from "react";
import { appContext } from "../App";
import Header from "./MainContent/Header/Header";
import Main from "./MainContent/UserTargets/Main";
import styles from './ui.module.css';


type WhatIsShowingProps = 'pending_tasks' | 'completed_tasks';

type UIContextType = {
    goals: any[];
    setGoals: React.Dispatch<React.SetStateAction<any[]>>;
    steps: any[];
    setSteps: React.Dispatch<React.SetStateAction<any[]>>;
};

export const UIContext = createContext<UIContextType | undefined>(undefined);

export default function UI() {

    const context = useContext(appContext);
    if (!context) {
        throw new Error("appContext must be used within an AppProvider");
    }
    const { userLoggedIn } = context;

    const [goals, setGoals] = useState<any[]>([]);
    const [steps, setSteps] = useState<any[]>([]);
    const [whatIsShowing, setWhatIsShowing] = useState<WhatIsShowingProps>('pending_tasks');

    function getGoals() {
        if (userLoggedIn?.id) {
            fetch(`https://myway-backend.fly.dev/goals/${userLoggedIn?.id}`)
                .then(response => response.json())
                .then(data => {
                    const userGoals = data.filter((goal: any) => goal.user_id === userLoggedIn?.id);
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
        if (userLoggedIn?.id) {
            fetch(`https://myway-backend.fly.dev/steps/${userLoggedIn?.id}`)
                .then(response => response.json())
                .then(data => {
                    const userSteps = data.filter((step: any) => step.user_id === userLoggedIn?.id);
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

    // Fetch goals and steps when the component mounts
    useEffect(() => {
        getGoals();
        getSteps();
    }, []);

    // Context value to be provided to child components
    const contextValue: UIContextType = {
        goals,
        setGoals,
        steps,
        setSteps
    };

    return (
        <div className={styles.UIContainer}>
            <Header setWhatIsShowing={setWhatIsShowing} />
            <UIContext.Provider value={contextValue}>
                <Main whatIsShowing={whatIsShowing} />
            </UIContext.Provider>
        </div>
    )
}