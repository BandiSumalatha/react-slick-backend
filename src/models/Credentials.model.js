import { DataTypes } from "sequelize";
import sequelize from "../config/db.config.js";
import User from "./User.model.js";

const UserCredentials =sequelize.define('Credential',{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true,
  },
  password:{
    type:DataTypes.STRING,
    allowNull:false
  },
  confirmPassword:{
    type:DataTypes.STRING,
    allowNull:false
  },
  userId:{
    type:DataTypes.INTEGER,
    allowNull:false,
    unique:true
  },

})

UserCredentials.belongsTo(User,{foreignKey:'userId'});
export default UserCredentials;