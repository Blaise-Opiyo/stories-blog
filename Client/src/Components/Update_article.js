import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Axios from 'axios';
import $ from 'jquery';
//CK Editor Imports Start
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react'
import parse from 'html-react-parser';
//CK Editor Imports End
import { CloseOutline } from 'react-ionicons'


import '../Styles/Update_article.css';

const Update_article = () =>{
    // input & Global state variables
    const [storyTitle, setStoryTitle] = useState("");
    const [storySubtitle, setStorySubtitle] = useState("");
    const [storyContent, setStoryContent] = useState("");  
    const [story_selection, setStory_selection] = useState("");
    // const [coverFile, setCoverFile] = useState();
    // const [coverFilename, setCoverFilename] = useState();
    const [successResponse, setSuccessResponse] = useState(false);
    const [empty_input, setEmpty_input] = useState(false);
    const [input_error, setInput_error] = useState("");
    
    //Editor Content state variables
    const [editorContent, setEditorContent] = useState('');

    const [output_display, setOutput_display] = useState(false);
    const [output_text, setOutput_text] = useState("show output");
    //Editor design related variables
    // const editorConfiguration = {
    //     toolbar: [ 'bold', 'italic' ]
    // };
    const subtitleRef = useRef(null);
    const addSubtitleRef = useRef(null);
    const outputRef = useRef(null);
    const toggleOutputRef = useRef(null);

    const navigate = useNavigate();

    //GET AND DISPLAY ARTICLE IN FIELDS
    const [article_fields, setArticle_fields] = useState({});

    const params = useParams();
    console.log(params.slug);

    useEffect(() =>{
        Axios.get(`http://127.0.0.1:4000/edit/${params.slug}`)
        .then((response) =>{
            console.log(response.data[0]);
            setArticle_fields(response.data[0]);
            setStoryTitle(response.data[0].title);
            setStorySubtitle(response.data[0].headline);
            setEditorContent(response.data[0].content);
            setStory_selection(response.data[0].story_selection);
        }).catch((error) =>{
            console.log(error);
        })
    }, [])

    //Functions and Methods
    const updateStory = (e) =>{
        e.preventDefault();
        setEmpty_input(false);
        setInput_error("");
        setSuccessResponse(false);

        console.log("Story Title:" + storyTitle);
        console.log("Story Sub title:" + storySubtitle);
        console.log("Story Content" + storyContent);
        // console.log(coverFilename);
        // console.log(coverFile);
        const formData = new FormData();
        formData.append('storyTitle', storyTitle);
        formData.append('storySubtitle', storySubtitle);
        formData.append('storyContent', editorContent);
        // formData.append('cover_file', coverFile);
        formData.append('story_selection', story_selection);
        formData.append('story_slug', article_fields.slug);

        console.log(Object.fromEntries(formData));
        if(storyTitle === ""){
            setEmpty_input(true);
            setInput_error(`The Article Title is Required`);
            return;
        }else if(storySubtitle === ""){
            setEmpty_input(true);
            setInput_error(`The Subtitle content is required`);
            return;
        }else if(editorContent === ""){
            setEmpty_input(true);
            setInput_error("The Article Content is Required");
            return;
        }else{
            Axios({
                method: 'post',
                url: 'http://localhost:4000/update-story',   //addyoururl
                data: formData,
                headers: {'Content-Type': 'multipart/form-data' }
                })
              .then((data) => {
                console.log("Article successfully updated on the server");
                console.log(data);
                setSuccessResponse(true);
                // navigate("/");
              })
              .catch(function (error) {
                console.log(error);
            });
        }

    }

    //Inline and Components Scripts
    // var coverUploadStyle = {
    //     display: "none"
    // }
    // const coverUploadInputFunction = () =>{
    //     $('#cover-upload-input').click();
    // }
    const addSubtitleInput = () =>{
        subtitleRef.current.style.display = 'flex';
        addSubtitleRef.current.style.display = 'none'
    }
    const closeSubtitleInput = () =>{
        subtitleRef.current.style.display = 'none';
        addSubtitleRef.current.style.display = 'inline-block';
    }
    // const getCoverFile = (e) =>{
    //     setCoverFilename(e.target.files[0].name);
    //     setCoverFile(e.target.files[0]);
    //     const filename = e.target.files[0].name;
    //     console.log(coverFilename);
    //     $('#cover-upload-btn').text(`Uploaded Image: ${filename}`);
    // }
    const toggleOutput = (e) =>{
        console.log(toggleOutputRef);
        if(output_display === true){
            outputRef.current.style.display = 'none';
            setOutput_display(false);
            setOutput_text('show output');
            // toggleOutputRef.current.style.backgroundColor = '#ffffff';
            // toggleOutputRef.current.style.color = '#000000';

        }else if(output_display === false){
            outputRef.current.style.display = 'block';
            setOutput_display(true);
            setOutput_text('hide output');
            // toggleOutputRef.current.style.backgroundColor = '#000000';
            // toggleOutputRef.current.style.color = '#ffffff';
        }
    }
    const getSelection = (e) =>{
        // e.preventDefault();
        setStory_selection(e.target.value);
    }
    return(
        <div className="Edit_article_cap">
            <form className="article-write-form" onSubmit={updateStory}>
                {empty_input === true ? 
                <p id="input-error">{input_error}</p> : 
                (successResponse === true) ? <p id="successful-update-msg">Updated successfully</p> : null }

                <div className="write-options">
                    <span className="options-left">
                        {/* <span>
                            <span id="cover-upload-btn" onClick={coverUploadInputFunction}>Add Cover</span>
                            <input type="file" id="cover-upload-input" name="cover-upload" onChange={getCoverFile} style={coverUploadStyle}/>
                        </span> */}
                        <span id="add-subtitle" ref={addSubtitleRef} onClick={addSubtitleInput}>Add Subtitle</span>
                    </span>
                    <span className="options-right">
                        <div class="box">
                            <select id="story-sel" name="story-sel" onChange={getSelection}>
                                <option value="Life update">Life update</option>
                                <option value="Thoughts">Thoughts</option>
                                <option value="Career">Career</option>
                                <option value="Productivity">Productivity</option>
                                <option value="Gaming">Gaming</option>
                                <option value="Movies & TV shows">Movies & TV shows</option>
                                <option value="Coding">Coding</option>
                                <option value="Self development">Self development</option>
                                <option value="Personal life">Personal life</option>
                            </select>
                        </div>
                        <button className="submit-article" >Save changes</button>
                    </span>
                </div>
                <div className="article-components">
                    <div className="Article-title">
                        <textarea   maxlength="150" 
                                    placeholder="Article title…" 
                                    className="title-txtarea"
                                    name="story_title"
                                    style={{height: "74px"}}
                                    value={storyTitle}
                                    onChange={e => setStoryTitle(e.target.value)}>{article_fields.title}
                        </textarea>
                    </div>
                    <div className="Article-subtitle" ref={subtitleRef}>
                        <textarea   maxlength="150" 
                                    placeholder="Article subtitle…" 
                                    className="subtitle-txtarea"
                                    name="story_subtitle" 
                                    style={{height: "66px"}}
                                    value={storySubtitle}
                                    onChange={e => setStorySubtitle(e.target.value)}>{article_fields.headline}

                        </textarea>
                        <CloseOutline
                            color={'#00000'} 
                            // title={}
                            height="20px"
                            width="20px"
                            style={{borderRadius: "40%",
                                    backgroundColor: "rgb(226, 232, 240",
                                    cursor: "pointer"}}
                            onClick={closeSubtitleInput}
                        />
                    </div>
                    <div className="toggle-output" ref={toggleOutputRef} onClick={toggleOutput}>{output_text}</div>
                    <div className="Article-content">
                        <CKEditor
                            editor={ Editor }
                            data={editorContent}
                            // config={editorConfiguration}
                            onReady={ editor => {
                                // You can store the "editor" and use when it is needed.
                                console.log( 'Editor is ready to use!', editor );
                            } }
                            onChange={ ( event, editor ) => {
                                const data = editor.getData();
                                setEditorContent(data);
                                console.log(editorContent);
                            } }
                            onBlur={ ( event, editor ) => {
                                console.log( 'Blur.', editor );
                            } }
                            onFocus={ ( event, editor ) => {
                                console.log( 'Focus.', editor );
                            } }
                        />
                        <div className="editor-parse-content" ref={outputRef}>{parse(`${editorContent}`)}</div>                      
                    </div>
                </div>             
            </form>
        </div>
    )
}
export default Update_article;