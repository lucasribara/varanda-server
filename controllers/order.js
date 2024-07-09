import Order from "../models/Order.js"
import MenuItem from "../models/MenuItem.js";
import mongoose from "mongoose";
import { setOrderState } from "../helpers/orderStates.js";
import { getUserIdFromToken } from "../middleware/auth.js";

export const getWorkingOrders = async (req, res) => {
    try {       
        const ordersWithUserDetails = await Order.find({'state.code': { $ne: 5 }})
            .populate('user', 'firstName lastName homeNumber phoneNumber')
            .exec();

        res.status(200).json(ordersWithUserDetails);

    } catch (e) {
        res.status(500).json({ error: e.message })
    }
}

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.params.id;

        const orders = await Order.find({ user: userId }).sort('-createdAt');
        res.status(200).json(orders);
        
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
}

export const createOrder = async (req, res) => {
    try {
        const {
            user,
            items,
            comment
        } = req.body;

        const menu = await MenuItem.find();
        
        const totalPrice = getTotalOrderPrice(items, menu);
        if(!totalPrice) {
            return res.status(400).json({message: "Ocorreu um erro ao processar seu pedido"});
        }
        const newOrder = new Order({
            user: new mongoose.Types.ObjectId(user),
            price: totalPrice,
            state: setOrderState(1),
            items,
            comment
        });
        console.log(newOrder);
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message })
    }
}

export const updateStatus = async (req, res) => {
    const {
        code
    } = req.body;
    console.log(req.body);
    setOrderState(code)
    const orderId = req.params.id;

    Order.findByIdAndUpdate(orderId, {state: setOrderState(code)}, { useFindAndModify: false, new: true })
    .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Não foi possivel atualizar pedido ${orderId}`
          });
        } else res.status(201).json(data);
      })
      .catch(err => {
        res.status(500).send({
          message: `Erro ao atualizar pedido ${orderId}`
        });
      });
}

const getTotalOrderPrice = (orderItems, menu) => {
    let total = 0;

    for (const id of orderItems) {
        const item = menu.find(item => item._id.toString() === id);
        if (!item) return null;        
        total += item.price;         
    }
    return total;
}