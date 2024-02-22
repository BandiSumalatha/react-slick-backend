import { DataTypes } from "sequelize";
import sequelize from "../config/db.config.js";

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phonenumber: {
        type: DataTypes.STRING,
        allownull: false,
    },
    dob: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true
    },
  
    address: {
        type: DataTypes.STRING,
        allowNull:true
    },

});

export default User