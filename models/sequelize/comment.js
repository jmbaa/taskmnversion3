/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "comment",
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
      },
      bookId: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        references: {
          model: "book",
          key: "id",
        },
      },
      comment: {
        type: DataTypes.STRING(450),
        allowNull: false,
        validate: {
          isEmail: {
            msg: "Заавал цахим хаягаа оруулна уу", 
          },
        },
        get() {
          let comment = this.getDataValue("comment").toLowerCase();
          return comment.charAt(0).toUpperCase() + comment.slice(1);
        },

        set(value) {
          this.setDataValue("comment", value.replace("миа", "гоё"));
        }
      },
    },
    {
      tableName: "comment",
      timestamps: true,
    }
  );
};
