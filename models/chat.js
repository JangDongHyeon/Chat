module.exports = (sequelize, DataTypes) => (
    sequelize.define('chat',{
          chat:{
            type: DataTypes.STRING(1000),
           
          },
          gif:{
              type:DataTypes.INTEGER(10),
              
          },
          userChat:{
            type: DataTypes.STRING(100),
          },
          nick:{
            type: DataTypes.STRING(100),
          },
         
       },
       { timestamps: true,
          
       })  
        
);

    

    
