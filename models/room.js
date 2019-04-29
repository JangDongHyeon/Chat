module.exports = (sequelize, DataTypes) => (
    sequelize.define('room',{
          title:{
            type: DataTypes.STRING(70),
            allowNull: false,
          },
          max:{
              type:DataTypes.INTEGER(10),
              allowNull: true,
              defaultValue:0

          },
          owner:{
              type:DataTypes.STRING(30),
              allowNull: false,
          },
          password:{
            type:DataTypes.STRING(100),
          },
          language:{
              type:DataTypes.INTEGER(10),
              allowNull: false,
          }
       } ,  
        { timestamps: true,
          
        })
);

    
