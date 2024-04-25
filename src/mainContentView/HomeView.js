import React from "react";
import PageNavigation from "../components/PageNavigation";

function HomeView(props) {
    return (
        <div>
            <PageNavigation
                prevPage={props.prevPage}
                nextPage={props.nextPage}
            />
            This is the home view
        </div>
    )
}

export default HomeView