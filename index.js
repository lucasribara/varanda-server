import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import menuRoutes from "./routes/menu.js";
import userRoutes from "./routes/users.js";
import orderRoutes from "./routes/orders.js";
import { addMenuItem } from "./controllers/menu.js";
import { verifyAdminToken } from "./middleware/auth.js";

//configs
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit : "30mb", extended: true}));
app.use(bodyParser.urlencoded({ limit : "30mb", extended: true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

//file storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
const upload = multer({storage});

//routes with files
app.post("/menu/add", verifyAdminToken, upload.single("picture"), addMenuItem);

//routes
app.use("/user", userRoutes)
app.use("/menu", menuRoutes);
app.use("/order", orderRoutes);

//mongoose setup
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão com o MongoDB:'));
db.once('open', () => {
  console.log('Conexão com o MongoDB estabelecida com sucesso');
});
// .then(() => {
//     app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
// })
// .catch((error) => console.log(`${error} -- Did not connect`));

io.on("connection", (socket) => {
    socket.on("join_admin", (data) => {
        console.log("Join User Socket Admin", data);
        socket.join(data);
    });
    socket.on("order_created", (data) => {
        console.log(data)
        socket.to(data.room).emit("receive_message", data)
    });
});

server.listen(PORT, () => {
    console.log("SERVER IO RUNNING")
});