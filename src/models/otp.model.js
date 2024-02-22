import { DataTypes } from "sequelize";
import sequelize from "../config/db.config.js";
import User from "./User.model.js";

const Otp = sequelize.define('otp', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Define the association with the User model
Otp.belongsTo(User, { foreignKey: 'userId' });

export default Otp;
