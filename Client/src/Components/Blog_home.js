import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import Axios from 'axios';
import '../Styles/Blog_home.css';

const Blog_home = () =>{
    //Data and Global State Varriables
    const [allBlogs, setAllBlogs] = useState([]);

    useEffect(() =>{
        Axios.get('http://127.0.0.1:4000/allblogs')
        .then((response) =>{
            console.log(response.data[0]);
            setAllBlogs(response.data);
        }).catch((error) =>{
            console.log(error);
        })
    }, []);

    const blogItems = allBlogs.map((blog) =>{
        return(
            <li key={blog.id} className="Article-post">
                {/* <a className="Article-title" href="itemdetails/<%= items[i].slug %>">{blog.title}</a> */}
                <Link className="Article-title" to={`/article/${blog.slug}`}>{blog.title}</Link>
                <p className="Article-snip">{blog.headline}</p>
                <div className="Article-meta">
                    <span className="Article-date">{blog.created_at}</span>
                    <ul className="Article-tags">
                        <li className="Article-tag">Life Update</li>
                    </ul>
                </div>
            </li>
        )
    })

    return(
        <div className="Blog_home_cap">
            <h1 className="Articles-head">Code, Live and Write it</h1>
            <ul className="Articles-list">
                <li className="Article-post">
                    <a className="Article-title" href="best-president">The best president that never was.</a>
                    <p className="Article-snip">Make your React app performant by preventing unnecessary re-renders</p>
                    <div className="Article-meta">
                        <span className="Article-date">Sat, August 22, 2020</span>
                        <ul className="Article-tags">
                            <li className="Article-tag">Life Update</li>
                            <li className="Article-tag">Life Update</li>
                            <li className="Article-tag">Life Update</li>
                        </ul>
                    </div>
                </li>
                <li className="Article-post">
                    <a className="Article-title" href="best-president">The best president that never was.</a>
                    <p className="Article-snip">Make your React app performant by preventing unnecessary re-renders</p>
                    <div className="Article-meta">
                        <span className="Article-date">Sat, August 22, 2020</span>
                        <ul className="Article-tags">
                            <li className="Article-tag">Life Update</li>
                        </ul>
                    </div>
                </li>
                {blogItems}
            </ul>
        </div>
    )
}
export default Blog_home;