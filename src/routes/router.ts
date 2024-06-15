import express, { Express, Request, Response } from "express";
import {
  allUsers,
  createUser,
  followUser,
  getFollowers,
  getUserById,
  loginUser,
  logoutUser,
  getProductCompany,
  getProductionCompanyById,
  updateUser,
  CreateProductionCompany,
} from "../controller/userController";
import {
  BannerVideoFromAdmin,
  CreateBannervideos,
  Createvideos,
  activeBanner,
  addBannerVideo,
  allVideos,
  bannerVideo,
  findVideoById,
  findVideoByLanguage,
  getCategories,
  getLikes,
  postVideoLike,
  postVideoViews,
  searchVideo,
} from "../controller/videoController";
import { upload } from "../service/db/s3/s3";
import { authMiddleware } from "../middlewares/findUserMiddleware";
import {
  getMonthlySub,
  monthlySub,
  updateMonthlySub,
} from "../controller/monthlySubController";
import { activeAds, createAds, getAds } from "../controller/adsController";
import { getWatchLater, watchLater } from "../controller/watchController";

const router = express.Router();

// User
router.get("/auth/user", allUsers);
router.get("/auth/user/:user_id", getUserById);
router.post("/auth/signup", createUser);
router.post("/auth/login", loginUser);
router.get("/auth/logout", logoutUser);

const cpUpdateUser = upload.fields([
  { name: "profilePic", maxCount: 1 },
  { name: "backgroundPic", maxCount: 1 },
]);

router.put("/auth/user/:user_id", cpUpdateUser, updateUser);

// Production User
const cpUploadUser = upload.fields([{ name: "logo", maxCount: 1 }]);
const cpUploadBackground = upload.fields([
  { name: "backgroundImage", maxCount: 1 },
  { name: "logo", maxCount: 1 },
]);
router.post("/auth/production/signup", cpUploadUser, CreateProductionCompany);
router.get("/auth/production/user", getProductCompany);
router.get("/auth/production/user/:user_id", getProductionCompanyById);
router.put(
  "/auth/production/user/:user_id",
  cpUploadBackground,
  getProductionCompanyById
);

// upload video
const cpUpload = upload.fields([
  { name: "preview_video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
  { name: "orginal_video", maxCount: 1 },
]);

const cpUploadBanner = upload.fields([
  { name: "preview_video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

router.post("/create_videos", cpUpload, Createvideos);
router.post("/create/banner-video", cpUploadBanner, CreateBannervideos);
router.get("/video/:video_id", findVideoById);
router.get("/videos", allVideos);
router.get("/banner", bannerVideo);
router.post("/banner/active/:video_id", activeBanner);
router.get("/category/:category", bannerVideo);
router.get("/category", getCategories);
router.get("/search/:search", searchVideo);
router.get("/language/:language", findVideoByLanguage);

//admin
router.post("/add/banner", addBannerVideo);
router.get("/video/banner", BannerVideoFromAdmin);
// router.post("/video/view/:video_id", postVideoViews);
router.post("/video/view/:video_id", authMiddleware, postVideoViews);
router.post("/video/like/:video_id", authMiddleware, postVideoLike);
router.get("/video/like/:video_id", authMiddleware, getLikes);

// Payment
router.post("/payment", authMiddleware, monthlySub);
router.get("/payment/:id", authMiddleware, getMonthlySub);
router.put("/payment/:id", authMiddleware, updateMonthlySub);

// Follower
router.post("/follow/:user_id", authMiddleware, followUser);
router.get("/followers/:video_id", getFollowers);

// Ads
const cpUploadAds = upload.fields([{ name: "ads_video", maxCount: 1 }]);
router.post("/ads", cpUploadAds, createAds);
router.get("/ads", getAds);
router.put("/ads/active/:id", activeAds);

// Watch Later
router.post("/watch-later/:video_id", authMiddleware, watchLater);
router.get("/watch-later", authMiddleware, getWatchLater);
export default router;
