'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // User can post many jobs
      User.hasMany(models.Job, { foreignKey: 'postedBy', as: 'jobsPosted' });

      // User can save many jobs
      User.belongsToMany(models.Job, { 
        through: 'SavedJobs', // Junction table
        foreignKey: 'userId', 
        as: 'savedJobs' 
      });
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8, 100], // Minimum length of 8 characters
        },
      },
      avatar: {
        type: DataTypes.JSONB, // To store public_id and URL for the user's avatar
        allowNull: true,
      },
      skills: {
        type: DataTypes.STRING, // Could be a comma-separated string or converted to ARRAY(DataTypes.STRING)
        allowNull: true,
      },
      resume: {
        type: DataTypes.JSONB, // To store resume file details (e.g., public_id, URL)
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user', // Default role
        validate: {
          isIn: [['user', 'admin']], // Only allow 'user' or 'admin' roles
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};
