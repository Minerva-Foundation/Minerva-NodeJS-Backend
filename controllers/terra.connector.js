/**
 * Terra blockchain connector to query if user holds the assets 
 * Author: Chean Koh
 * Version: 1.0.0
 * Updated: 04/05/2022
 */
const terra = require('@terra-money/terra.js');

// connect to bombay testnet
const terraConnector = new terra.LCDClient({
    URL: 'https://bombay-lcd.terra.dev',
    chainID: 'bombay-12',
});
const terraObj = {}

terraObj.isOwner = async (contract, ownerAddress) => {
    try {
        const result = await terraConnector.wasm.contractQuery(
            contract,
            { tokens: { "owner": ownerAddress, "limit": 2 } } // query msg
        );
        return result;
    } catch (error) {
        console.log("Querying blokchain failed...")
        console.log(error);
    }
}

module.exports = terraObj;

