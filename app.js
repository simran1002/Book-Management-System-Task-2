const express = require("express");

require("./db/connection");

const Book = require("./model/book");

const app = express();

app.use(express.json());

const port = process.env.PORT || 8000;


//--------------------------------------------------------------- retrieve all books record-------------------------------------------------------- 
app.get("/books",async(req,res)=>{

    try{
       const booksData=await Book.find();
       res.send(booksData);
    }catch(e){
        res.send(e);
    }
});



//-----------------------------------------------------------------create a new book records --------------------------------------------------
app.post("/books",async (req, res) => {
    try{
        const user = new Book(req.body);
        const adduser=await user.save();
        res.status(201).send(adduser);
    }catch(e){
        res.status(400).send(e);
    }
  });


//----------------------------------------------------------- Delete all Book Records----------------------------------------------
app.delete("/books",async(req,res)=>{
    try {
        const deleteData=await Book.deleteMany();
        console.log(deleteData);
        res.send(deleteData);
    } catch (e) {
        res.status(500).send(e);   
    }
})



//--------------------------------------------------------- fetching book record having inventory less than n-----------------------
app.get("/books/availibility/:amount",async(req,res)=>{

    try {
        const value=req.params.amount;
        const bookData=await Book.find({inventory:{$lt:value}});
        console.log(bookData);

        if(!bookData){
            return res.status(404).send();
        }else{
            res.send(bookData);
        }
        
    } catch (e) {
        res.send(e);
    }
});


//--------------------------------------------------------- fetching book record having inventory equal to zero-----------------------
app.get("/books/unavailable_Books",async(req,res)=>{

    try {
        const bookData=await Book.find({inventory:0});
        console.log(bookData);

        if(!bookData){
            return res.status(404).send();
        }else{
            res.send(bookData);
        }
        
    } catch (e) {
        res.send(e);
    }
});


//---------------------------------------------------- Fetching book record of a particular book----------------------------------------------------------------- 
app.get("/book/:isbnNumber",async(req,res)=>{

    try {
        const isbnnumber =req.params.isbnNumber;
        const BookData=await Book.findOne({isbn_Number:isbnnumber});
        console.log(BookData);

        if(!BookData){
            return res.status(404).send();
        }else{
            res.send(BookData);
        }
        
    } catch (e) {
        res.send(e);
    }
});



//----------------------------------------------------  Replacing one record with the another record----------------------------------------------------------------- 
app.put("/book/replace/:isbnno",async(req,res)=>{
    try {
        const bookRep=req.params.isbnno;
        const newBook=req.body;
        const replaceBook=await Book.findOneAndReplace({isbn_number:bookRep},newBook,{
            new:true
        });
        console.log(replaceBook);
        res.send(replaceBook);
    } catch (e) {
        res.status(400).send(e);
    }
})

// ------------------------------------------Update Books Records using isbn_Number.-----------------------------------
app.patch("/book/update/:isbnno",async(req,res)=>{
    try {
        const BooksReq=req.params.isbnno;
        console.log(BooksReq);
        const updateBooks=await Book.findOneAndUpdate({isbn_number:BooksReq},req.body,{
            new:true
        });
        console.log(updateBooks);
        res.send(updateBooks);
        
    } catch (e) {
        
        res.status(400).send(e);
    }

});

//----------------------------------------------------------- Delete the record of particular book----------------------------------------------
app.delete("/book/delete/:isbn_no", async (req, res) => {
   
      var result = "";
      const isbn_no = req.params.isbn_no;
      if (isbn_no) {
        const book = await Book.find({ isbn_no: isbn_no });
        console.log(book);
          const bookDelete = await Book.deleteOne({ isbn_no: isbn_no });
          result = "Book deleted";
         // res.render("success", { message: result });
          res.send("Book deleted")
        }
});
//     } catch (e) {
        
//         res.status(400).send(e);
//       res.send(result);
   
//       };
//     }
//   );
  

 

//----------------------------------------------------------- Decrement the inventory of alloted book----------------------------------------------
app.get("/book/issue_book/:isbn_no", async (req, res) => {
   
    try {
      const isbn_no = req.params.isbn_no;
      var book = await Book.find({ isbn_no: isbn_no });
      console.log(book);
            const inventory = book[0].inventory - 1;
            const issueBook = await Book.updateOne(
              { isbn_no: isbn_no },
              { inventory: inventory }
            );
            console.log(issueBook);
            res.send(book)
            book = await Book.find({ isbn_no: isbn_no });
            res.render("show", { books: book });
            } catch (e) {
        
    res.status(400).send(e);
  res.send(e);

  };
}
);

app.listen(port, () => {
  console.log("connected");
});