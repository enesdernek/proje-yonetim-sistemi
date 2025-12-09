import React from 'react'
import { useParams } from 'react-router-dom';

function Project() {

    const { projectId } = useParams();
    
    return (
        <div>{projectId}</div>
    )
}

export default Project