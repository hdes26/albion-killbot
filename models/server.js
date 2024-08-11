const config = require("config");
const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");


class Server {
    constructor() {
        this.app = express();
        this.port = config.get("api.port");
        this.paths = {
            auth: "/auth",
            events: "/events",
            guild: "/guild",
        };

        //Conectar a base de datos
        this.connectDB()

        //Middlewares
        this.middlewares();

        // Rutas
        this.routes();

    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {
        //CORS
        this.app.use(cors());

        // Parsing and reading the body
        this.app.use(express.json());

        // Public directory
        this.app.use(express.static("public"));
    }

    routes() {
        //this.app.use(this.paths.auth, require("../routes/auth.routes"));
        this.app.use(this.paths.events, require("../routes/events.routes"));
        this.app.use(this.paths.guild, require("../routes/guild.routes"));
    }


    listen() {
        this.app.listen(this.port, () => {
            console.log("Server running on the port", this.port);
        });
    }
}

module.exports = Server;