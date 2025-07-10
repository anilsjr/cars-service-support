import express from 'express';
const router = express.Router();
import loginUser  from "../controllers/auth.controller.js";


router.post("/login", loginUser);
router.get('/login', (req,res) => {
    res.send({"msg":"GET /login"})
});

export default  router;

