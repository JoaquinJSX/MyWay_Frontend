import { useState } from "react";
import Header from "./Header/Header";

type WhatIsShowingProps = 'pending_tasks' | 'completed_tasks';

export default function Main() {

    const [whatIsShowing, setWhatIsShowing] = useState<WhatIsShowingProps>('pending_tasks');

    return(
        <main>
           <Header setWhatIsShowing={setWhatIsShowing} /> 
        </main>
    );
}