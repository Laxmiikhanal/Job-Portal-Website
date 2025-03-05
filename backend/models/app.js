'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Application extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // An application belongs to one job
      Application.belongsTo(models.Job, { foreignKey: 'jobId', as: 'job' });

      // An application belongs to one user (the applicant)
      Application.belongsTo(models.User, { foreignKey: 'userId', as: 'applicant' });
    }
  }

  Application.init(
    {
      jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Jobs', // Refers to Jobs table
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Refers to Users table
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      applicantResume: {
        type: DataTypes.JSONB, // Storing resume details like public_id and url
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending', // Default status
        validate: {
          isIn: [['pending', 'accepted', 'rejected']], // Valid status values
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Automatically set the date to the current timestamp
      },
    },
    {
      sequelize,
      modelName: 'Application', // Name of the model
      tableName: 'Applications',  // Name of the table in the database
      timestamps: false, // Assuming we don't want to use updatedAt here (if you do, you can remove this line)
    }
  );

  return Application;
};
