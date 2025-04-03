import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose"; 
import usermodel from "./dbs/users.js";
import coursemodel from "./dbs/coursesdb.js";
import enrolledmodel from "./dbs/enrolled.js";
import commentsmodel from "./dbs/comments.js";
import adminModel from "./dbs/admins.js";
import videomodel from "./dbs/videos.js";
import actionmodel from "./dbs/completed.js";
import bcrypt from "bcryptjs"; 
import multer from "multer";
import { v2 as cloudinary} from "cloudinary"
import {CloudinaryStorage} from 'multer-storage-cloudinary'




const app = express();
app.use(express.json());

const port = process.env.PORT || 9000;


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));


  //cloudinary here

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "videos", // Cloudinary folder name
      resource_type: "video", // Ensure it's a video upload
    },
  });

  const upload = multer({ storage });



//  Added GET route to fetch user by email
app.get("/api/get-user", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.json({ status: false, message: "Email is required" });
  }

  try {
    const user = await usermodel.findOne({ email });

    if (!user) {
      return res.json({ status: false, message: "User not found" });
    }

    res.json({ status: true, user });
  } catch (error) {
    res.json({ status: false, message: "Error fetching user", error });
  }
});

// Secure Sign-up with password hashing
app.post("/api/signup", async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.json({ status: false, message: "Please fill all fields" });
  }

  try {
    const existingUser = await usermodel.findOne({ email });
    if (existingUser) {
      return res.json({ status: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new usermodel({ email, username, password: hashedPassword });
    await newUser.save();

    res.json({ status: true, message: "Sign Up complete!" });
  } catch (error) {
    res.json({ status: false, message: "Error signing up", error });
  }
});

// Secure Login with password verification
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ status: false, message: "Please fill all fields" });
  }

  try {
    const user = await usermodel.findOne({ email }).lean();

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.json({ status: false, message: "Invalid credentials" });
    }

    user.admin = false

    console.log(user);
    

    res.json({ status: true, message: "Login successful", user : user });
  } catch (error) {
    res.json({ status: false, message: "Error logging in", error });
  }
});

//  Add a new course
app.post("/api/addcourse", async (req, res) => {
  const { cname, category, faculty , description} = req.body;

  if (!cname || !category || !faculty || !description) {
    return res.json({ status: false, message: "All fields are required" });
  }

  try {
    const newCourse = new coursemodel({ cname, category, faculty, description });
    await newCourse.save();
    res.json({ status: true, message: "Course created", details: newCourse });
  } catch (error) {

    if (error.code === 11000) {
      return res.json({ status: false, message: "Course already exists", error });  
    }

    res.json({ status: false, message: "Error creating course", error });
  }
});

//  Enroll a user in a course
app.post("/api/enroll", async (req, res) => {
  const { userid, courseid } = req.body;

  

  if (!userid || !courseid) {
    return res.json({ status: false, message: "User ID and Course ID are required" });
  }


  const buffer = await enrolledmodel.find({userid : userid, courseid : courseid})

  if (buffer.length > 0) {
   return res.json({ status: false, message: "Already enrolled" });
  }

  try {
    const enrollment = new enrolledmodel({ userid, courseid });
    await enrollment.save();
    res.json({ status: true, message: "Enrolled successfully" });
  } catch (error) {
    res.json({ status: false, message: "Error enrolling", error });
  }
});

//  Show courses enrolled by a user
app.post("/api/showmycourses", async (req, res) => {
  const { userid, admin } = req.body;

  if (!userid) {
    return res.json({ status: false, message: "User ID is required" });
  }

  try {
    const enrolledCourses = await enrolledmodel.find({ userid });
    const allCourses = await coursemodel.find();
    const courseMap = new Map(allCourses.map((c) => [c._id.toString(), c]));

    const result = enrolledCourses.map((e) => courseMap.get(e.courseid)).filter((course) => course);

    res.json({ status: true, message: "Enrolled courses retrieved", courses: result });
  } catch (error) {
    res.json({ status: false, message: "Error fetching courses", error });
  }
});

//  Add a comment
app.post("/api/addcomment", async (req, res) => {
  const { user, video, comment } = req.body;

  if (!user || !video || !comment) {
    return res.json({ status: false, message: "All fields are required" });
  }

  try {
    const newComment = new commentsmodel({ videodata: video, comment, user });
    await newComment.save();
    res.json({ status: true, message: "Comment added successfully" });
  } catch (error) {
    res.json({ status: false, message: "Error adding comment", error });
  }
});

//  Get comments for a specific video
app.get("/api/getcomments/:video", async (req, res) => {
  const video = req.params.video;

  try {
    const comments = await commentsmodel.find({ videodata: video });
    const users = await usermodel.find();
    const usersMap = new Map(users.map((u) => [u._id.toString(), u.username]));

    comments.forEach((c) => {
      c.user = usersMap.get(c.user);
    });

    res.json({ status: true, updateddata : comments });
  } catch (error) {
    res.json({ status: false, message: "Error fetching comments", error });
  }
});

// Check login (testing endpoint)
app.post("/api/checklogin", async (req, res) => {
  res.json({ status: true, data: req.body });
});
//  Start the server
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

// update password route
app.post("/api/update-password", async (req, res) => {
  console.log(req.body);
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    return res.json({ status: false, message: "All fields are required" });
  }

  try {
    const user = await usermodel.findOne({ email });

    if (!user) {
      return res.json({ status: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.json({ status: false, message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ status: true, message: "Password updated successfully" });
  } catch (error) {
    res.json({ status: false, message: "Error updating password", error });
  }
});

app.get('/api/allcourses',async (req, res) => {
  const courseData = await coursemodel.find({})
  res.json({ status : true, courses : courseData})  
})

app.post('/api/fun', (req, res)=>{
  res.json({message : "Fun"})
})

app.post("/api/upload", upload.single("video"), async (req, res) => {
  try {
    const videoUrl = req.file.path; // Cloudinary video URL

    const {title, courseid, description} = req.body

    console.log("video uploaded");
    
    if (!videoUrl) {
      return res.json({ success: false, message: "unable to upload video" });
    }

    

    const newvideo = new videomodel({title, 
      videoUrl, courseid, description
    })

    await newvideo.save()

    console.log("video saved");
    

    return res.json({ success: true, url: videoUrl });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
});

app.get("/api/getvideos/:cid",async (req, res)=>{
  const cid = req.params.cid

  if (!cid){
    return res.json({})
  }


  const videos = await videomodel.find({courseid : cid})

  return res.json({videos})


})

app.post("/api/getvideos/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const { user } = req.body; // Extract user ID from request body

    if (!cid) {
      return res.json({});
    }

    // Fetch videos for the given course ID
    const videos = await videomodel.find({ courseid: cid });

    // Fetch user actions (liked, disliked, completed) for the given user ID
    const actions = await actionmodel.find({ user });

    // Map each video with its respective action
    const videoData = videos.map((video) => {
      const userAction = actions.find((action) => action.video === video._id.toString());

      console.log("actinos is ",userAction);
      

      return {
        ...video._doc, // Spread video object
        liked: userAction?.action === "l" || false,
        disliked: userAction?.action === "d" || false,
        completed: userAction?.action === "c" || false,
      };
    });

    return res.json({ videos: videoData });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/api/getdashboardinfo', async (req, res) => {
  try {
      const { user } = req.body;

      if (!user) {
          return res.status(400).json({ error: 'User ID is required' });
      }

      // Fetch user enrollment data
      const enrolledCourses = await enrolledmodel.find({ userid: user });
      const enrolledCourseIds = enrolledCourses.map(enrollment => enrollment.courseid);

      // Most popular courses (sorted by number of enrollments)
      const popularCourses = await enrolledmodel.aggregate([
          { $group: { _id: "$courseid", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 }
      ]);

      const popularCourseIds = popularCourses.map(course => course._id);
      const popularCourseDetails = await coursemodel.find({ _id: { $in: popularCourseIds } });

      // Fetch user's liked videos
      const likedVideos = await actionmodel.find({ user: user, action: "l" });
      const likedVideoIds = likedVideos.map(video => video.video);

      // Extract unique course IDs from liked videos
      const videos = await videomodel.find({ _id: { $in: likedVideoIds } });
      const courseIds = [...new Set(videos.map(video => video.courseid))];

      // Get course details for the liked videos
      const interestedCourses = await coursemodel.find({ _id: { $in: courseIds } });


      console.log(interestedCourses);
      

      res.json({
          popularCourses: popularCourseDetails,
          interestedCourses
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/video/:vid',async (req, res)=>{

  try {

    const vid = req.params.vid


    const videodata = await videomodel.find({
      _id : vid
    })


    if (videodata.length === 0) {
      return res.json({status : false})
    }
  
    return res.json({status : true ,data : videodata})  

  } catch (error) {
    
    return res.json({status : false, err : error})

  }


})


app.post('/api/adminlogin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    // Find admin by email
    const admin = await adminModel.findOne({ email });
    console.log(admin);
    
    
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Assuming passwords are stored as hashed in the database
    // If not, you would need to modify this check
    // const isPasswordValid = await bcrypt.compare(password, admin.password);
    const isPasswordValid = password === admin.password
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Return success with token
    res.status(200).json({
      success: true,
      message: 'Login successful',
      admin: {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        admin : true
      }
    });
    
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.post('/api/action',async (req, res)=>{
  const {user, video, action} = req.body

  const newaction = new actionmodel({
    user, video, action
  })

  const buffer = await actionmodel.find({user, video, action})


  if (!buffer.length){

    await newaction.save()

    return res.json({message : 'done'})

  }

  return res.json({message : 'already exists'})

})

app.post('/api/getpriv',async (req, res)=>{

  const {_id} = req.body._id

  const user = await usermodel.findOne()

})

app.get('/api/search/:query',async (req, res)=>{

  const {query} = req.params

  if (query === '') {
    return res.json([])

  }

  const searchresults = await coursemodel.find({
    $or: [
        { cname: { $regex: new RegExp(query, "i") } },
        { category: { $regex: new RegExp(query, "i") } },
        { faculty: { $regex: new RegExp(query, "i") }},
        { description: { $regex: new RegExp(query, "i") } } // Case-insensitive search in description
    ]
});

res.json(searchresults)

})

function checkAdmin(req, res, next) {
  
  

}
