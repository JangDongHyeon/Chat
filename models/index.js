'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}



fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User=require('./user')(sequelize,Sequelize);
db.Room=require('./room')(sequelize,Sequelize);
db.Chat=require('./chat')(sequelize,Sequelize);

db.User.hasMany(db.Room,{foreignkey:'userid_room',sourceKey:'id'});
db.Room.belongsTo(db.User,{foreignkey:'userid_room',targetKey:'id'});

db.Room.hasOne(db.Chat,{foreignkey:'roomid_chat',sourceKey:'id'});
db.Chat.belongsTo(db.Room,{foreignkey:'roomid_chat',targetKey:'id'});

db.User.hasOne(db.Chat,{foreignkey:'userid_chat',sourceKey:'id'});
db.Chat.belongsTo(db.User,{foreignkey:'userid_chat',targetKey:'id'});



module.exports = db;
