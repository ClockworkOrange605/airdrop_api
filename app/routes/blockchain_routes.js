var config = require('../../config.json');

module.exports = function(app, db) {
    app.post('/blockchain/bitcoin_rpc/verifymessage', (req, resp) => {
        var rpc = require('node-bitcoin-rpc');
        rpc.init(config.bitcoin_rpc.host, config.bitcoin_rpc.port, config.bitcoin_rpc.user, config.bitcoin_rpc.password);

        rpc.call('verifymessage',
            [req.body.address_bitcoin, req.body.signature, req.body.address_waves+req.body.address_bitcoin],
            function (err, res) {
                if (err !== null) {
                    resp.send(err);
                } else {
                    /*var Web3 = require('web3');
                    var web3 = new Web3();

                    web3.setProvider(new web3.providers.HttpProvider(config.web3.path));

                    var abi_air = require('../contracts/air_abi.json');
                    contractAir = new web3.eth.Contract(abi_air);

                    contractAir.methods.setDrop('btc', req.body.address_waves, req.body.address_bitcoin, 0);*/
                    resp.send(res);
                }
            });
    });

    app.post('/blockchain/bitcoin_rpc/airdrop_list', (req, resp) => {
        var RequestClient = require("reqclient").RequestClient;
        var client = new RequestClient(config.bitcoin_api.url);

        var tokensCount = req.body.count;
        var blockHeight = req.body.height;
        var totalBalance = 0;

        /*var Web3 = require('web3');
        var web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider(config.web3.path));
        var abi_air = require('../contracts/air_abi.json');

        contractAir = new web3.eth.Contract(abi_air, config.web3.address);
        console.log(contractAir);

        var addresses = [];
        for (var i=0; i<contractAir.methods.countaddr().call(); i++) {
            addresses.push(contractAir.methods.getDrop(i).call());
        }*/

        var addresses = [{'network': 'btc', 'address': "mmtGYdEbVj3FZSmEUSvgRwtcivdTqXnk2H", 'waves': "3Mrfg23sCV9UFqYQYS5oEoMzmXdvmtMkMKW"},
                         {'network': 'btc', 'address': "mqsFNrt6t4eWiHBtpo3GWvpoDhdr9s4Z5U", 'waves': "3NCmr3UjLy54V6AeoSWwizHiNSCc2ZRXDGP"},
                         {'network': 'btc', 'address': "mnGPXW8zGx4aRHvDTWPJVDJgK52gCnx7PY", 'waves': "3NA8XXcU6XMt8qWvHUqavgTXeUnYky79T3k"}];

        var requests = addresses.map(function (address, index) {
            return client.get(address.address+"/full");
        });

        Promise.all(requests).then(function (results) {
            var totalBalance = results.reduce(function (acc, response) {
                acc += response.balance;
                return acc;
            },0)
            var r = results.map(function (response, index) {
                /*var balance = response.txs.filter( function (transaction) {
                    return transaction.block_height <= blockHeight;
                }).reduce(function (sum, transaction) {
                    return transaction.outputs.filter(function (output) {
                        return output.addresses.includes(addresses[index].address);
                    }).reduce(function (sum, output) {
                        return output.value;
                    }, 0);
                }, 0);*/
                return {
                    'waves': addresses[index].waves,
                    'network': addresses[index].network,
                    'address': addresses[index].address,
                    'balance': response.balance,
                    'ergo': (response.balance / totalBalance) * tokensCount
                }
            });
            resp.send(r)
        })
    });
};