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
import crypto from 'crypto'
import { v2 as cloudinary} from "cloudinary"
import {CloudinaryStorage} from 'multer-storage-cloudinary'

// Convert your strings to 32-byte key and 16-byte IV using hash functions
const key = crypto.createHash('sha256').update('my-secret-key').digest();   // 32 bytes
const iv = crypto.createHash('md5').update('my-initialization-vector').digest(); // 16 bytes


// Encrypt Function
function encryptEN(text) {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Decrypt Function
function decryptEN(encryptedText) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}


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


  const storage2 = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'course_thumbnails', // Cloudinary folder name
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
    },
  });

  const upload2 = multer({storage : storage2})

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
app.post('/api/addcourse', upload2.single('thumbnail'), async (req, res) => {
  const { cname, category, faculty, description, creator } = req.body;

  if (!cname || !category || !faculty || !description || !req.file) {
    return res.json({ status: false, message: "All fields and image are required" });
  }

  try {
    const imageUrl = req.file.path; // Cloudinary URL
    console.log(imageUrl);
    

    const newCourse = new coursemodel({
      cname,
      category,
      faculty,
      description,
      creator,
      image: imageUrl, // Save Cloudinary image URL
    });

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

app.post('/api/graphinfo', async (req, res) => {
  try {
    // Get all enrollments
    const enrollments = await enrolledmodel.find({});
    
    // Get all courses with their categories
    const courses = await coursemodel.find({}, { _id: 1, category: 1 });
    
    // Create a map of course ID to category for quick lookup
    const courseIdToCategoryMap = {};
    courses.forEach(course => {
      courseIdToCategoryMap[course._id.toString()] = course.category;
    });
    
    // Count enrollments per category
    const categoryCountMap = {};
    
    // Process each enrollment
    enrollments.forEach(enrollment => {
      const courseId = enrollment.courseid;
      const category = courseIdToCategoryMap[courseId];
      
      // Only count if we found a valid category
      if (category) {
        if (categoryCountMap[category]) {
          categoryCountMap[category]++;
        } else {
          categoryCountMap[category] = 1;
        }
      }
    });
    
    // Prepare the two arrays needed for the spider graph

    console.log("ccmap",categoryCountMap);
    

    const categoriesArray = Object.keys(categoryCountMap);
    const valuesArray = categoriesArray.map(category => categoryCountMap[category]);

    console.log("carray",categoriesArray);

    const result = []

    categoriesArray.forEach((cat, i)=>{
      var obj = {}
      obj['subject'] = cat
      obj['value'] = valuesArray[i]
      result.push(obj)
    })

    console.log("res is",result);
    
    
    
    // Send the response
    res.status(200).json(result);
    
  } catch (error) {
    console.error('Error fetching graph data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch graph data',
      error: error.message
    });
  }
});


app.post("/api/showmycourses", async (req, res) => {
  const { userid, admin } = req.body;

  if (!userid) {
    return res.json({ status: false, message: "User ID is required" });
  }

  try {
    // First, get completion data for all enrolled courses
    const completionData = await getUserCourseCompletionStatus(userid);
    
    // Create a map of course IDs to completion info for quick lookup
    const completionMap = new Map(
      completionData.map(data => [data.courseId, {
        completionPercentage: data.completionPercentage,
        completedVideos: data.completedVideos,
        totalVideos: data.totalVideos
      }])
    );

    // Get enrolled courses and all courses
    const enrolledCourses = await enrolledmodel.find({ userid });
    const allCourses = await coursemodel.find();
    const courseMap = new Map(allCourses.map((c) => [c._id.toString(), c]));

    // Map enrolled courses to course objects and add completion status
    const result = enrolledCourses.map(e => {
      const courseId = e.courseid;
      const course = courseMap.get(courseId);
      
      if (!course) return null;
      
      // Add completion data to course object
      return {
        ...course.toObject(),
        completion: completionMap.get(courseId) || {
          completionPercentage: 0,
          completedVideos: 0,
          totalVideos: 0
        }
      };
    }).filter(course => course); // Remove any null values

    res.json({ 
      status: true, 
      message: "Enrolled courses retrieved with completion status", 
      courses: result 
    });
  } catch (error) {
    console.error("Error fetching courses with completion status:", error);
    res.json({ status: false, message: "Error fetching courses", error: error.message });
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

const videoUpload = (req, res, next) => {
  console.log('uploading...');
  
  upload.single("video")(req, res, (err) => {
    if (err) {
      console.error("Upload Error:", err); // Full error object
      return res.status(400).json({ success: false, message: "Upload failed", error: err.message });
    }
    next(); // proceed to actual route if no error
  });
};


app.post("/api/upload", videoUpload, async (req, res) => {
  try {
    console.log("started uploading...");
    
    const videoUrl = encryptEN(req.file.path); // Cloudinary video URL
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
    console.log("Error",err);
    
    return res.json({ success: false, message: err.message });
  }
});

app.get("/api/getvideos/:cid",async (req, res)=>{
  const cid = req.params.cid

  if (!cid){
    return res.json({})
  }


  const videos = await videomodel.find({courseid : cid})

  console.log(videos);
  
  const decryptedVideos = videos.map((v) => {
    const videoObj = v.toObject();
  
    try {
      videoObj.videoUrl = decryptEN(videoObj.videoUrl); // Try decrypting
    } catch (err) {
      console.warn("Skipping decryption for this videoUrl:", videoObj.videoUrl);
      // Leave the original URL if decryption fails
    }
  
    return videoObj;
  });
  

  return res.json({videos: decryptedVideos})


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

      // console.log("actinos is ",userAction);
      

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
      console.log('user', user, req.body);
      

      // console.log(interestedCourses)
      //user: {
      //   _id: '67c9ac596ed570d3467b3219',
      //   username: 'd',
      //   email: 'd',
      //   password: '$2b$10$P5P69GASW43pzfpergxcdudh7HnlXaBRJy8KeG9g2N3EVHqqULzuW',
      //   __v: 0,
      //   admin: false
      // }

      //first get my courses
      //then see how much of it is completed
      //in actions, c means completed
      //videoid in videos
      //log the completion percentage
      

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
      console.log('nothing');
      
      return res.json({status : false})
    }
    

    const videoObj = videodata[0].toObject();
    console.log(videoObj.videoUrl);
    

    try {
      // Try decrypting if it's encrypted
      let nnnn = decryptEN(videoObj.videoUrl);
      console.log("decrypted:",nnnn);
      
      videoObj.videoUrl = nnnn
      console.log(videoObj);
      
    } catch (decryptErr) {
      console.warn("Decryption failed for video URL, sending as is.");
      return res.json({status : true ,data :videodata}) 
    }

    console.log(videodata);
    

    return res.json({status : true ,data : [videoObj]})  

  } catch (error) {
    console.log("error");
    
    
    return res.json({status : false, err : error})

  }


})

// app.get('/api/video/:vid', async (req, res) => {
//   try {
//     const vid = req.params.vid;

//     const videodata = await videomodel.findOne({ _id: vid });

//     if (!videodata) {
//       return res.json({ status: false });
//     }

//     const videoObj = videodata.toObject();

//     try {
//       // Try decrypting if it's encrypted
//       videoObj.videoUrl = decryptEN(videoObj.videoUrl);
//     } catch (decryptErr) {
//       console.warn("Decryption failed for video URL, sending as is.");
//     }

//     return res.json({ status: true, data: videoObj });

//   } catch (error) {
//     return res.json({ status: false, err: error.message });
//   }
// });



app.get('/api/created/:cid', async (req, res) => {
  const { cid } = req.params;

  try {
    const courses = await coursemodel.find({ creator: cid });

    if (courses.length === 0) {
      return res.status(404).json({ message: 'No courses found for this creator.' });
    }

    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


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

app.get('/api/course-details/:id', async (req, res) => {
  try {
    const { id: courseId } = req.params;
    const userId = req.query.userId;
    
    if (!courseId) {
      return res.status(400).json({ error: 'Course ID is required' });
    }
    
    // Find the course
    const course = await coursemodel.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Get enrollment count
    const enrollmentCount = await enrolledmodel.countDocuments({ courseid: courseId });
    
    // Check if the user is enrolled (if userId is provided)
    let isEnrolled = false;
    if (userId) {
      const enrollment = await enrolledmodel.findOne({ 
        userid: userId, 
        courseid: courseId 
      });
      isEnrolled = !!enrollment;
    }
    
    // Get videos count and video information
    const videos = await videomodel.find({ courseid: courseId });
    const videoCount = videos.length;
    
    // Get faculty details (assuming faculty is stored as ID)
    // If faculty is just a name string, you can skip this part
    // const facultyDetails = await facultymodel.findById(course.faculty);
    
    // Prepare response
    const courseDetails = {
      courseId: course._id,
      name: course.cname,
      category: course.category,
      faculty: course.faculty,
      description: course.description,
      image: course.image,
      creator: course.creator,
      createdDate: course.created,
      
      // Additional stats
      enrollmentCount,
      videoCount,
      isEnrolled,
      
      // Optional: include video details if the user is enrolled
      videos: isEnrolled ? videos.map(video => ({
        id: video._id,
        title: video.title,
        description: video.description,
        videoUrl: video.videoUrl
      })) : []
    };
    
    return res.status(200).json(courseDetails);
    
  } catch (error) {
    console.error('Error fetching course details:', error);
    return res.status(500).json({ error: 'Server error while fetching course details' });
  }
});


app.get('/api/analytics/:courseid', async (req, res) => {
  try {
    const { courseid } = req.params;

    // Step 1: Get all video IDs under this course
    const videos = await videomodel.find({ courseid });
    const videoIds = videos.map(v => v._id.toString());

    if (videoIds.length === 0) {
      return res.json({ message: 'No videos found for this course.' });
    }

    // Step 2: Get all actions for these videos
    const actions = await actionmodel.find({ video: { $in: videoIds } });

    // Step 3: Global course stats
    const stats = {
      comments: 0,
      likes: 0,
      dislikes: 0,
      completions: 0
    };

    // Step 4: Per video stats
    const perVideoStats = {};

    videos.forEach(video => {
      perVideoStats[video._id] = {
        title: video.title,
        likes: 0,
        dislikes: 0,
        completions: 0
      };
    });

    // Step 5: Tally actions
    actions.forEach(action => {
      switch (action.action) {
        case 'c':
          stats.completions += 1;
          if (perVideoStats[action.video]) {
            perVideoStats[action.video].completions += 1;
          }
          break;
        case 'l':
          stats.likes += 1;
          if (perVideoStats[action.video]) {
            perVideoStats[action.video].likes += 1;
          }
          break;
        case 'd':
          stats.dislikes += 1;
          if (perVideoStats[action.video]) {
            perVideoStats[action.video].dislikes += 1;
          }
          break;
        default:
          break;
      }
    });

    // Convert perVideoStats to an array
    const perVideo = Object.entries(perVideoStats).map(([id, data]) => ({
      videoId: id,
      ...data
    }));

    res.json({
      ...stats,
      perVideo
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});



async function getUserCourseCompletionStatus(userId) {
  try {
    // Get all courses the user is enrolled in
    const enrolledCourses = await enrolledmodel.find({ userid: userId });
    
    if (!enrolledCourses.length) {
      console.log('User is not enrolled in any courses');
      return [];
    }
    
    // Array to store completion data
    let completionData = [];
    
    // Process each enrolled course
    for (const enrollment of enrolledCourses) {
      // Get course details
      const course = await coursemodel.findById(enrollment.courseid);
      
      if (!course) {
        console.log(`Course with ID ${enrollment.courseid} not found`);
        continue;
      }
      
      // Get all videos for this course
      const courseVideos = await videomodel.find({ courseid: enrollment.courseid });
      const totalVideos = courseVideos.length;
      
      if (totalVideos === 0) {
        completionData.push({
          courseId: enrollment.courseid,
          courseName: course.cname,
          completionPercentage: 0,
          completedVideos: 0,
          totalVideos: 0
        });
        continue;
      }
      
      // Get completed video actions for this user and course
      const completedVideoActions = await actionmodel.find({
        user: userId,
        action: 'c',
        video: { $in: courseVideos.map(video => video._id.toString()) }
      });
      
      // Count unique completed videos (in case there are duplicate actions)
      const uniqueCompletedVideos = new Set(completedVideoActions.map(action => action.video)).size;
      
      // Calculate completion percentage
      const completionPercentage = (uniqueCompletedVideos / totalVideos) * 100;
      
      // Add to completion data
      completionData.push({
        courseId: enrollment.courseid.toString(),
        courseName: course.cname,
        completionPercentage: Math.round(completionPercentage),
        completedVideos: uniqueCompletedVideos,
        totalVideos
      });
    }
    
    return completionData;
  } catch (error) {
    console.error('Error getting user course completion status:', error);
    throw error;
  }
}