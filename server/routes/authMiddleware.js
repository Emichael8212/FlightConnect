import jwt from "jsonwebtoken";


export const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return (
            res.status(401).json({error: "No token given"})
        )
    };
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    }   catch   (error) {
        console.error(error)
        res.status(403).json({error: "Token expired or Invalid"});
    }

}