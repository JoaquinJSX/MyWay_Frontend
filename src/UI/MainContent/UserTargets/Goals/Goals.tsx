import { useState, useEffect, useContext } from "react";
import GoalsContainer from "./GoalsContainer";
import NewGoalContainer from "./NewGoalContainer";
import GoalShowed from "./GoalShowed";
import { UIContext } from "../../../UI";

export default function Goals() {

    const [isShowingCreateGoalField, setIsShowingCreateGoalField] = useState<boolean>(false);
    const [isShowingAllGoals, setIsShowingAllGoals] = useState(true);
    const [goalShowed, setGoalShowed] = useState<string | null>(null);
    const context = useContext(UIContext);

    if (!context) {
        throw new Error("appContext must be used within an AppProvider");
    }
    const { goals } = context;

    useEffect(() => {
        setIsShowingCreateGoalField(false);
    }, [goals]);

    useEffect(() => {
        setIsShowingAllGoals(goalShowed === null ? true : false);
    }, [goalShowed]);

    return (
        <div>
            {!isShowingCreateGoalField ?
                <section>
                    {/*Verify if is showing a specific goal or all the goals container, and return it's 
                            specific component*/}
                    {isShowingAllGoals ?
                        <GoalsContainer setGoalShowed={setGoalShowed}
                            isShowingCreateGoalField={isShowingCreateGoalField}
                            setIsShowingCreateGoalField={setIsShowingCreateGoalField}
                        />
                        :
                        <GoalShowed goalShowed={goalShowed} setGoalShowed={setGoalShowed} />}
                </section>
                :
                <NewGoalContainer setIsShowingCreateGoalField={setIsShowingCreateGoalField} />}
        </div>
    );
}