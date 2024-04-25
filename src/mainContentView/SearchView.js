import React from "react";
import PageNavigation from "../components/PageNavigation";

function SearchView(props){

    return(
        <div>
            <PageNavigation 
                prevPage={props.prevPage}
                nextPage={props.nextPage}
            />
            This is the search view
        </div>
    )

}

export default SearchView;