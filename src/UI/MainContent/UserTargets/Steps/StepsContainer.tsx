import { useContext } from "react";
import { UIContext } from "../../../UI";

export default function StepsContainer({goalIdProps}: {goalIdProps: string}) {

    console.log(goalIdProps);

    const context = useContext(UIContext);
    if (!context) {
        throw new Error("appContext must be used within an AppProvider");
    }
    const { steps, setSteps } = context;

    function setAchievedStep(stepProp: any) {
        fetch(`http://localhost:3000/steps/${stepProp.step_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ achieved: stepProp.achieved === true ? false : true})
        }).then(() => { 
            alert("Step marked as achieved");
            setSteps(steps.map(step => step.step_id === stepProp.step_id ? { ...step, achieved: stepProp.achieved ? true : false} : step));
        })
            .catch(error => {
                console.error('Error updating step:', error);
                alert("Error updating step");
            });
    }

    function deleteStep(stepId: string) {
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

    return (
        <section>
            {steps.filter(step => step.goal_id === goalIdProps).map((step) =>
                <section key={step.step_id}>
                    <h2>{step.step_name}</h2>
                    <input type="checkbox" 
                    defaultChecked={step.achieved}  
                    onClick={() => setAchievedStep(step)}
                    />
                    <button onClick={() => deleteStep(step.step_id)}>Delete</button>
                </section>
            )}
        </section>
    );
}