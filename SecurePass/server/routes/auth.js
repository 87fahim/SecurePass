import express from "express";
import jwt from "jsonwebtoken";
import authController from '../controllers/authController.js';
const { loginUser, registerUser, getUser} = authController;
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get("/user", getUser);

router.post('/refresh-token', (req, res) => {
    console.log('/refresh-token:', req.cookies);
    if(req.cookies === undefined){
        console.log("USER IS NOT LOGGED IN.");
        res.json({ message: "USER IS NOT LOGGED IN" });
        return;
    }
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'Unauthorized, this message is from routes/auth.js line 15.' });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden, invalid refresh token.' });
        const newAccessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ accessToken: newAccessToken });
    });
});

router.post('/logout', (req, res) => {
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
});



export default router;

