import Order from "../models/Order.js"
import MenuItem from "../models/MenuItem.js";
import mongoose from "mongoose";
import { setOrderState } from "../helpers/orderStates.js";

export const getTodayOrders = async (req, res) => {
    try {
        let getToday = {}
        const beginningOfDay = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString()
        const endingOfDay = new Date(new Date().setUTCHours(23, 59, 59, 999)).toISOString()

        getToday.createdAt = {
            $gte: beginningOfDay,
            $lte: endingOfDay
        }

        const ordersWithUserDetails = await Order.find(getToday)           
            .populate('user')
            .exec();

        res.status(200).json(ordersWithUserDetails);

    } catch (e) {
        res.status(500).json({ error: e.message })
    }
}

export const createOrder = async (req, res) => {
    try {
        const {
            user,
            items,
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
        });
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
}

export const updateStatus = async (req, res) => {
    const {
        code
    } = req.body;

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