const blockchainRoutes = require('./blockchain_routes');
module.exports = function(app, db) {
    blockchainRoutes(app, db);
};