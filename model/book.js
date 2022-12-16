const mongoose=require("mongoose");
const validator=require("validator");



const BookSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:4
    },
    isbn_no:{
        type:String,
        required:true,
        unique:[true,"Book Number already exists"],
        maxlength:30
    },
    author_name:{
        type:String,
        required:true,
    },
    genre:{
        type:String
    },
    inventory:{
        type:String
    }
});



const Book= new mongoose.model("Books",BookSchema);


module.exports=Book;
