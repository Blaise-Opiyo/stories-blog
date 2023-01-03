import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import $ from 'jquery';
//CK Editor Imports Start
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import parse from 'html-react-parser';
//CK Editor Imports End
import { CloseOutline } from 'react-ionicons';


import '../Styles/Edit_article.css';

const Edit_article = () =>{
    // input & Global state variables
    const [storyTitle, setStoryTitle] = useState("");
    const [storySubtitle, setStorySubtitle] = useState("");
    const [storyContent, setStoryContent] = useState("");  
    const [story_selection, setStory_selection] = useState("Life update");
    const [coverFile, setCoverFile] = useState();
    const [coverFilename, setCoverFilename] = useState();
    const [duplicate_title, setDuplicate_title] = useState(false);
    const [publishError, setPublishError] = useState("");
    const [empty_input, setEmpty_input] = useState(false);
    const [input_error, setInput_error] = useState("");
    
    //Editor Content state variables
    const [editorContent, setEditorContent] = useState('');

    //Editor design related variables
    // const editorConfiguration = {
    //     toolbar: [ 'bold', 'italic' ]
    // };
    const subtitleRef = useRef(null);
    const addSubtitleRef = useRef(null);

    const navigate = useNavigate();

    //Functions and Methods
    const publishStory = (e) =>{
        e.preventDefault();
        setEmpty_input(false);
        setInput_error("");
        setDuplicate_title(false);
        setPublishError("");

        console.log("Story Title:" + storyTitle);
        console.log("Story Sub title:" + storySubtitle);
        console.log("Story Content" + storyContent);
        console.log(coverFilename);
        console.log(coverFile);
        const formData = new FormData();
        formData.append('storyTitle', storyTitle);
        formData.append('storySubtitle', storySubtitle);
        formData.append('storyContent', editorContent);
        formData.append('cover_file', coverFile);
        formData.append('story_selection', story_selection);

        console.log(Object.fromEntries(formData));
        if(storyTitle === ""){
            setEmpty_input(true);
            setInput_error(`The Article Title is Required`);
        }else if(editorContent === ""){
            setEmpty_input(true);
            setInput_error("The Article Content is Required");
        }

        Axios({
            method: 'post',
            url: 'http://localhost:4000/publish-story',   //addyoururl
            data: formData,
            headers: {'Content-Type': 'multipart/form-data' }
            })
          .then((res) => {
            console.log("Data Successfully sent to the server");
            console.log(res);
            navigate("/");
          })
          .catch(function (error) {
            if(error.response.status === 400 && error.response.data === "title already exists"){
                console.log("Title duplication error");
                setDuplicate_title(true);
                setPublishError("The title already exists");
            }
        });
    }

    //Inline and Components Scripts
    var coverUploadStyle = {
        display: "none"
    }
    const coverUploadInputFunction = () =>{
        $('#cover-upload-input').click();
    }
    const addSubtitleInput = () =>{
        subtitleRef.current.style.display = 'flex';
        addSubtitleRef.current.style.display = 'none'
    }
    const closeSubtitleInput = () =>{
        subtitleRef.current.style.display = 'none';
        addSubtitleRef.current.style.display = 'inline-block';
    }
    const getCoverFile = (e) =>{
        setCoverFilename(e.target.files[0].name);
        setCoverFile(e.target.files[0]);
        const filename = e.target.files[0].name;
        console.log(coverFilename);
        $('#cover-upload-btn').text(`Uploaded Image: ${filename}`);
    }
    const getSelection = (e) =>{
        setStory_selection(e.target.value);
    }
    return(
        <div className="Edit_article_cap">
            <form className="article-write-form" onSubmit={publishStory}>
                {empty_input === true ? 
                <p id="input-error">{input_error}</p>: 
                (duplicate_title === true ? <p id="input-error">{publishError}</p> : null)}

                <div className="write-options">
                    <span className="options-left">
                        <span>
                            <span id="cover-upload-btn" onClick={coverUploadInputFunction}>Add Cover</span>
                            <input type="file" id="cover-upload-input" name="cover-upload" onChange={getCoverFile} style={coverUploadStyle}/>
                        </span>
                        <span id="add-subtitle" ref={addSubtitleRef} onClick={addSubtitleInput}>Add Subtitle</span>
                    </span>
                    <span className="options-right">
                        <div class="box">
                            <select id="story-sel" name="story-sel" onChange={getSelection}>
                                <option value="Life update">Life update</option>
                                <option value="Thoughts">Thoughts</option>
                                <option value="Career">Career</option>
                                <option value="Productivity">Productivity</option>
                                <option value="Self development">Self development</option>
                                <option value="Personal life">Personal life</option>
                                <option value="Coding">Coding</option>
                            </select>
                        </div>
                        <button className="submit-article" >Publish</button>
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
                                    onChange={e => setStoryTitle(e.target.value)}>
                        </textarea>
                    </div>
                    <div className="Article-subtitle" ref={subtitleRef}>
                        <textarea   maxlength="150" 
                                    placeholder="Article subtitle…" 
                                    className="subtitle-txtarea"
                                    name="story_subtitle" 
                                    style={{height: "66px"}}
                                    value={storySubtitle}
                                    onChange={e => setStorySubtitle(e.target.value)}>

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
                        <textarea   maxlength="150" 
                                    placeholder="Tell your story…" 
                                    className="content-txtarea" 
                                    name="story_content" 
                                    style={{height: "74px"}}
                                    value={parse(editorContent)}
                                    onChange={e => setStoryContent(e.target.value)}>
                        </textarea>
                    </div>
                </div>             
            </form>
        </div>
    )
}
export default Edit_article;