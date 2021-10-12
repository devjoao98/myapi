const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/myapi', {
    useNewUrlParser: true,
});

mongoose.Promise = global.Promise;



module.exports = mongoose;