import { useContext } from "react";
import { UIContext } from "../../../UI"; 

export default function StepsContainer({ goalIdProps }: { goalIdProps: string }) {

    const context = useContext(UIContext);
    if (!context) {
        throw new Error("StepsContainer must be used within an AppProvider. UIContext is null.");
    }
    const { steps, setSteps } = context;

    // Function to set a step as achieved or pending
    async function setAchievedStep(stepProp: any) {
        // Determine the new achieved status based on the current state (true if it was false, and vice versa)
        const newAchievedStatus = !stepProp.achieved;

        try {
            const response = await fetch(`http://localhost:3000/steps/${stepProp.step_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ achieved: newAchievedStatus })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorData.message || response.statusText}`);
            }
            // Update the specific step in the state
            setSteps(prevSteps => 
                prevSteps.map(step =>
                    step.step_id === stepProp.step_id ? { ...step, achieved: newAchievedStatus } : step
                )
            );
        } catch (error: any) {
            console.error('Error updating step:', error);
            alert(`Error updating step: ${error.message}`);
        }
    }

    async function deleteStep(stepId: string) {
        try {
            const response = await fetch(`http://localhost:3000/steps/${stepId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorData.message || response.statusText}`);
            }
            alert("Step deleted successfully");
            setSteps(prevSteps => prevSteps.filter(step => step.step_id !== stepId)); // Update the state to remove the deleted step
        } catch (error: any) {
            console.error('Error deleting step:', error);
            alert(`Error deleting step: ${error.message}`);
        }
    }

    // Filter steps by goalIdProps
    const filteredSteps = steps.filter(step => step.goal_id === goalIdProps);

    return (
        <section>
            {filteredSteps.length > 0 ? (
                filteredSteps.map((step) => (
                    <section key={step.step_id}>
                        <h2>{step.step_name}</h2>
                        <input
                            type="checkbox"
                            // Control the checkbox based on the achieved status
                            checked={step.achieved}
                            // Use the setAchievedStep function to update the step
                            onChange={() => setAchievedStep(step)} 
                        />
                        <button onClick={() => deleteStep(step.step_id)}>Delete</button>
                    </section>
                ))
            ) : (
                <p>No steps found for this goal yet. Add some!</p> 
            )}
        </section>
    );
}