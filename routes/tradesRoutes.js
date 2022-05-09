const express = require('express');
const controller = require('../controllers/tradeController');
const multer = require('multer');
const {isLoggedIn} = require('../middleware/auth');
const {validateId} = require('../middleware/validator')
const router = express.Router();
const storage = multer.diskStorage({
    //destination for files
    destination: function (request, file, callback) {
      callback(null, './public/images');
    },
  
    //add back the extension
    filename: function (request, file, callback) {
      callback(null, file.originalname);
    },
  });
  
  //upload parameters for multer
const upload = multer({
    storage: storage,
  });

  
// Display all trades
router.get('/',controller.index);

//Create new trade
router.get('/new',isLoggedIn, controller.new);

//display specific Details
router.get('/:id',validateId,controller.getDetailsByID);

//delete trade
router.delete('/:id',isLoggedIn,controller.deleteElementByID);

//Send trend to update
router.get('/:id/edit',isLoggedIn,controller.edit);

//Update  identified by id
router.put('/:id',isLoggedIn,upload.single('image'), controller.updateElementByID);

//add new trade 
router.post('/',isLoggedIn,upload.single('image'),controller.createNewTrade)

// add to watchList
router.post('/watchList/:id',validateId,isLoggedIn,controller.addToWatchList)

//remove from watchList
router.post('/removeFromWatchList/:id',validateId,isLoggedIn,controller.removeFromWatchList)

module.exports = router;