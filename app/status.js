const express = require('express');
const router = express.Router();

/**
 * Resource representation based on the following the pattern: 
 * https://cloud.google.com/blog/products/application-development/api-design-why-you-should-use-links-not-keys-to-represent-relationships-in-apis
 */
router.get('', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.find
    res.status(200).json({status: 'service is up'});
    console.log("status: ",req.url,req.body,req.params);

});


module.exports = router;
