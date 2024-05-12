import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            homeNumber,
        } = req.body;
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        // if(role !== "admin" && role !== "customer") 
        //     return res.status(400).json({ message: "Invalid role for user" })
        
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            orders: [],
            role: "customer",
            homeNumber,
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
                
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({email: email});
        if(!user) return res.status(400).json({ msg:"Invalid Email." });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ msg:"Invalid Password." });        

        const token = jwt.sign({id: user._id, role: user.role }, process.env.JWT_SECRET);
        delete user.password;
        delete user.role;
        res.status(200).json({token, user});
    }
    catch (e) {
        res.status(500).json({error: e.message});
    }
}