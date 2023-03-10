const conn = require('./dbConnection');
var moment = require('moment');
var multer = require('multer');
const path = require('node:path');

//Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../Client/public/Uploads')    //directory name where save the file
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})
var upload = multer({
    storage: storage
});

const createdAt = () =>{
    // return moment().format('ll');               // Jan 8, 2023 // Multiple Locale Support
    return moment().format('MMMM Do, YYYY'); //January 8th 2023
}
const assign_cover = (file_name) =>{
    const filename = (file_name) ? file_name.filename : "story_cover.jpg";
    return filename;
}
const controllers = (app) =>{
    app.post('/publish-story', upload.single('cover_file'), (req, res) =>{
        console.log(req.body, req.file);
        let slug_title =req.body.storyTitle.replace(/\s+/g, '-').toLowerCase();
        const story_data = {
            storyTitle: req.body.storyTitle,
            slug: slug_title,
            storySubtitle: req.body.storySubtitle,
            storyContent: req.body.storyContent,
            // storyCover: "story_cover.png",
            storyCover: assign_cover(req.file),
            story_selection: req.body.story_selection,
            created_at: createdAt()
        }
        console.log(story_data.storyTitle);
        console.log(story_data.slug);
        console.log(story_data.storySubtitle);
        console.log(story_data.storyContent);
        //DB Queries Work
        console.log("Database Connection Successful");

        //SEARCH DB for an existing article title
        const searchTitle = `SELECT COUNT(*) AS titleCount FROM stories WHERE title = "${story_data.storyTitle}"`;
        conn.query(searchTitle, (err, result) =>{
            if (err) throw err;
            else{
                const titleCount = result[0].titleCount;
                if(titleCount > 0){
                    console.log(`${story_data.storyTitle} title already exists`);
                    res.status(400).json(`title already exists`).end();
                }else{
                    // If no title exists then insert the new article in db
                    console.log(`No other title matches it`);
                    const insertSQL = "INSERT INTO stories(title, slug, headline, content, cover, story_selection, created_at) VALUES (?)";
                    const insertValues = [story_data.storyTitle, story_data.slug, story_data.storySubtitle, story_data.storyContent, 
                        story_data.storyCover, story_data.story_selection, story_data.created_at];
                    conn.query(insertSQL, [insertValues], (err, result) =>{
                        if (err) throw err;
                        else{
                        console.log("Number of records inserted: " + result.affectedRows);
                        res.send(story_data.storyTitle + "Successfully added");
                        }
                    });
                }   
            }
        });
    
    });
    app.get('/allblogs', (req, res) =>{

        //DB Queries work
        const getBlogs = "SELECT * FROM stories";
        conn.query(getBlogs, (err, results) =>{
            if (err) throw err;
            else{
            console.log("All Records retrieved successfully");
            console.log(results);
            res.send(results);
            }
        });
    });
    app.get('/article/:slug', (req, res) =>{
        if(!req.params.slug)
            console.log(`URL Params not available `);
        else{
            console.log(`URL Params available as ${req.params.slug}`);
            let slug = req.params.slug;
            //DB Queries work
        const getArticle = "SELECT * FROM stories WHERE slug = ?";
        conn.query(getArticle, [slug], (err, result) =>{
            if (err) throw err;
            else{
            console.log("All Records retrieved successfully");
            console.log(result);
            res.send(result);
            }
        });
        }
    });
    app.get('/edit/:slug', (req, res) =>{
        if(!req.params.slug)
            console.log(`URL Params not available `);
        else{
            console.log(`URL Params available as ${req.params.slug}`);
            let slug = req.params.slug;
            //DB Queries work
        const getArticle = "SELECT * FROM stories WHERE slug = ?";
        conn.query(getArticle, [slug], (err, result) =>{
            if (err) throw err;
            else{
            console.log("All Records retrieved successfully");
            console.log(result);
            res.send(result);
            }
        });
        }
    });
    app.post('/update-story', upload.none(), (req, res) =>{
        console.log(req.body);
        const story_update_data = {
            storyTitle: req.body.storyTitle,
            storySubtitle: req.body.storySubtitle,
            storyContent: req.body.storyContent,
            storySlug: req.body.story_slug,
            story_selection: req.body.story_selection
            // created_at: createdAt() ---You can also implement the last updated timestamp
        }
        //DB Queries work
        const updateSQL = "UPDATE stories SET title = ?, headline = ?, content = ?, story_selection = ? WHERE slug = ?";
        const data = [story_update_data.storyTitle, story_update_data.storySubtitle,
             story_update_data.storyContent, story_update_data.story_selection, story_update_data.storySlug];

        conn.query(updateSQL, data, (err, result) =>{
            if (err) throw err;
            else{
            console.log("Number of records updated: " + result.affectedRows);
            res.send(story_update_data.storyTitle + "Successfully updated");
            }
        });
    });
}
module.exports = controllers;