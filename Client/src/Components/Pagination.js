import React from "react";
import '../Styles/Pagination.css';

const Pagination = ({postsPerPage, totalPosts, paginate}) =>{
    const pageNumbers = [];

    for(let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++){
        pageNumbers.push(i);
    }

    return(
        <nav>
            <ul>
                {pageNumbers.map( number =>{
                   return (<li key={number} className="page-item">
                        <a onClick={() => paginate(number)}href="#">{number}</a>
                    </li>)
                })}
            </ul>
        </nav>
    )
}
export default Pagination;