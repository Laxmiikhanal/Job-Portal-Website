'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      Job.belongsTo(models.User, { foreignKey: 'postedBy', as: 'postedBy' });
    }
  }
  Job.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      companyLogo: {
        type: DataTypes.JSON, // To store `public_id` and `url` from Cloudinary
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      skillsRequired: {
        type: DataTypes.ARRAY(DataTypes.STRING), // Array of skills
        allowNull: true,
      },
      experience: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      salary: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      employmentType: {
        type: DataTypes.ENUM('full-time', 'part-time', 'contract', 'internship'),
        allowNull: false,
        defaultValue: 'full-time', // Default value for employmentType
      },
      status: {
        type: DataTypes.ENUM('active', 'closed'),
        allowNull: false,
        defaultValue: 'active', // Default status is 'active'
      },
      postedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Refers to the Users table
          key: 'id',
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Automatically sets the current timestamp
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: 'Job',
    }
  );

  return Job;
};
