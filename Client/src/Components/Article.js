import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";
import parse from 'html-react-parser';
import '../Styles/Article.css';

const Article = () =>{
    //Data and Global State Varriables
    const [article, setArticle] = useState({});

    const params = useParams();
    console.log(params.slug);

    useEffect(() =>{
        Axios.get(`http://127.0.0.1:4000/article/${params.slug}`)
        .then((response) =>{
            console.log(response.data[0]);
            setArticle(response.data[0]);
        }).catch((error) =>{
            console.log(error);
        })
    }, [])
    return(
        <div className="Article-cap">
            <Link id="edit-article-btn" to={`/edit/${article.slug}`}>Edit</Link>
            {/* <div id="edit-article-btn">Edit</div> */}
            <div className="article-cover-cont">
                <img className="article-cover" src={`/Uploads/${article.cover}`} alt={`${article.cover}`}/>
            </div>
            <div className="article-title">
                <h1 className="title-heading">{article.title}</h1>
                <div className="title-meta">
                    <small className="date-created">{article.created_at}</small>
                </div>
            </div>
            <div className="article-content">
                {parse(`${article.content}`)}
            </div>
            
        </div>
    )
}
export default Article;