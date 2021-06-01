const mongoose = require('mongoose');

// connecting with cloud database "mernstack"       // ***** if password contains "#" replace it with "%23" ***** //

const DB = process.env.DATABASE;

mongoose.connect(DB, {
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
}).then(() =>{
    console.log('spacex db connection successful..')
}).catch((e) => {
    console.log(e);
});


