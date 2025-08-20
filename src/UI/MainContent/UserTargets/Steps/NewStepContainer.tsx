import { useState, useContext } from "react";
import { appContext } from "../../../../App";
import { UIContext } from "../../../UI";

interface NewStepContainerProps {
    goalIdProps: string | null;
    setIsShowingCreateStepField: React.Dispatch<React.SetStateAction<boolean>>;
}

interface NewStep {
    step_name: string;
    user_id: string;
    goal_id: string;
}

export default function NewStepContainer({ goalIdProps, setIsShowingCreateStepField }: NewStepContainerProps) {

    const context1 = useContext(appContext);
    const context2 = useContext(UIContext);
    if (!context1 || !context2) {
        throw new Error("appContext must be used within an AppProvider");
    }
    const { userLoggedIn } = context1;
    const { steps, setSteps } = context2;

    const [newStep, setNewStep] = useState<NewStep>({ step_name: '', user_id: '', goal_id: '' });

    function addStep(goalId: string | null) {
        fetch('http://localhost:3000/steps', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    ...newStep,
                    goal_id: goalId,
                    user_id: userLoggedIn?.id
                }
            )
        }).then(() => {
            alert("Step created successfully");
            setIsShowingCreateStepField(false);
            setSteps([
                ...steps,
                {
                    step_name: newStep.step_name,
                    user_id: userLoggedIn?.id,
                    goal_id: goalId
                }
            ]);
        })
            .catch(error => {
                console.error('Error creating step:', error);
                alert("Error creating step");
            });
    }

    return (
        <section>
            Step name: <input type="text" value={newStep.step_name}
                onChange={e => setNewStep({ ...newStep, step_name: e.target.value })} />
            <br />
            <button onClick={() => addStep(goalIdProps)}>Add</button>
            <button onClick={() => setIsShowingCreateStepField(false)}>Cancel</button>
        </section>
    );
}