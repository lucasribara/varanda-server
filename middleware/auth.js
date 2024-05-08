import jwt from 'jsonwebtoken'

export const verifyToken = async (req, res, next) => {
    try{        
        let token = req.header("Authorization");

        if(!token) return res.status(403).send("Access Denied");

        if(token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

export const verifyAdminToken = async (req, res, next) => {
    try{        
        let token = req.header("Authorization");

        if(!token) return res.status(403).send("Access Denied");

        if(token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(verified.role && verified.role == "admin") {
            req.user = verified;
            next();
        } else {
            res.status(403).send("You don't have the access for this action");
        }
        

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}