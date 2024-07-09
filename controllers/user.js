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
      phoneNumber,
      homeNumber,
    } = req.body;
    let passwordHash
    if (password && password !== "") {
      const salt = await bcrypt.genSalt();
      passwordHash = await bcrypt.hash(password, salt);
    } else {
      return res.status(400).json({ errStatus: 400, msg: "Verifique a senha inserida e tente novamente" });
    }
    // if(role !== "admin" && role !== "customer") 
    //     return res.status(400).json({ message: "Invalid role for user" })

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      orders: [],
      role: "customer",
      phoneNumber,
      homeNumber,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);

  } catch (e) {
    res.status(500).json({ errStatus: 500, error: e.message, msg: "Ocorreu um erro" });
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ errStatus: 400, msg: "Email Inválido." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ errStatus: 400, msg: "Senha Incorreta." });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    var returnUser = user.toObject();
    delete returnUser.password;
    res.status(200).json({ token, user: returnUser });
  }
  catch (e) {
    res.status(500).json({ errStatus: 500, error: e.message, msg: "Ocorreu um erro" });
  }
}

export const update = async (req, res) => {
  try {

    if (!req.body || anyFieldIsEmpty(req.body)) {
      return res.status(400).send({
        errStatus: 400,
        msg: "Informação para atualizar não pode ser vazia."
      });
    }
    const id = req.params.id;

    User.findByIdAndUpdate(id, req.body, { useFindAndModify: false, new: true })
      .then(data => {
        if (!data) {
          res.status(404).send({
            errStatus: 404,
            msg: `Usuario não foi encontrado`
          });
        } else res.status(201).json(data);
      })
      .catch(err => {
        res.status(500).send({
          errStatus: 500,
          msg: "Erro ao atualizar usuario"
        });
      });
  } catch (e) {
    res.status(500).json({ errStatus: 500, error: e.message, msg: "Ocorreu um erro" });
  }
}

const anyFieldIsEmpty = (obj) => {
  const isFieldEmpty = (value) => {
    return value === null || value === undefined || value.toString().trim() === '';
  }
  for (const key in obj) {
    if (isFieldEmpty(obj[key])) {
      return true;
    }
  }
  return false;
}