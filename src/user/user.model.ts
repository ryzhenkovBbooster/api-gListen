import {Column, DataType, Model, Table} from "sequelize-typescript";

interface USerCreationAttrs {
    email: string,
    password: string
}


@Table({tableName: 'users'})
export class User extends Model<User, USerCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement:true, primaryKey: true })
    id: Number;


    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;

    @Column({type: DataType.STRING, unique: false, allowNull:false})
    password: string;
}