const User = require('../../models/user'); 
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Registeruser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const existinguser = await User.findOne({
            $or: [{ Username: username }, { Email: email }]
        });

        if (existinguser) {
            return res.status(400).json({ msg: 'Username or Email already exists' });
        }

        // Hash the password
        const gensalt = await bcryptjs.genSalt(13);
        const hashedPassword = await bcryptjs.hash(password, gensalt);

        // Create new user
        const user = new User({
            Username: username,
            Email: email,
            Password: hashedPassword,
            Role: req.body.Role || 'user'
        });

        await user.save();

        res.status(201).json({
            message: 'User created successfully. Please log in.',
            user: {
                _id: user._id,
                email: user.Email,
                username: user.Username,
                role: user.Role
            }
        });

    } catch (e) {
        res.status( ).json({ message: e.message });
    }
};


const Loginuser = async (req, res) => {
    const { email, password } = req.body; 

    try {
        console.log("Request Body:", req.body);

        const user = await User.findOne({ Email: email });
        console.log("User from DB:", user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare hashed password
        const isMatch = await bcryptjs.compare(password, user.Password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check JWT secret key
        if (!process.env.JWT_SECRET_KEY) {
            return res.status(500).json({ message: "JWT secret key is missing" });
        }

        // Generate JWT token
        const access_token = jwt.sign(
            { _id: user._id, email: user.Email, Role: user.Role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
        );

        // Create user response object
        const userResponse = {
            _id: user._id,
            email: user.Email,
            username: user.Username,
            role: user.Role
        };

        // Set cookie with access token
        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000 // 1 hour
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                _id: user._id,
                email: user.Email,
                username: user.Username,
                role: user.Role
            }
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

const Logoutuser = async (req, res) => {
    try {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict",
        });

        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};

const checkAuth = async (req, res) => {
    try {
        const token = req.cookies['access_token'];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded._id);
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ 
            success: true,
            user: {
                _id: user._id,
                email: user.Email,
                username: user.Username,
                role: user.Role
            },
            token: token
        });
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};
module.exports = { Registeruser, Loginuser, Logoutuser, checkAuth };
