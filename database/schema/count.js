const mongoose =require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


const Count = new Schema({
    collectionName:String,
    code:{default:99999,type:Number},
});

mongoose.model("Count",Count);