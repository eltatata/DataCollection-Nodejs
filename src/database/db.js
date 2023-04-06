import mongoose from "mongoose";

export default mongoose.connect(process.env.URI)
    .then((connection) => {
        console.log('conectado a MongoDB');
        return connection.connection.getClient();
    })
    .catch((error) => {
        console.log(`Error de conexion a DB: ${error}`);
    });