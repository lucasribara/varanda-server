import jwt from 'jsonwebtoken'
import { token } from 'morgan';

export const verifyToken = async (req, res, next) => {
    try{        
        let token = req.header("Authorization");

        const verified = getDecodedToken(token);

        req.user = verified;
        next();

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

export const verifyAdminToken = async (req, res, next) => {
    try{        
        let token = req.header("Authorization");
        
        const verified = getDecodedToken(token);

        if(verified.role && verified.role == "admin") {
            req.user = verified;
            next();
        } else {
            res.status(403).send("Você não tem permissão para essa ação.");
        }        

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

export const getUserIdFromToken = async (token) => {
    try{
        const verified = getDecodedToken(token);
        return verified._id;
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

const getDecodedToken = (token) => {
    if(!token) return res.status(403).send("Acesso Negado");

    if(token.startsWith("Bearer ")) {
        token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    return verified
}