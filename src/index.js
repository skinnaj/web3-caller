const {Command, flags} = require('@oclif/command')
const Web3 = require('web3')
var fs = require('fs')

class Web3CallerCommand extends Command {
  async run() {
    const {flags} = this.parse(Web3CallerCommand)
    const abiFile = flags.abiPath
    const network = flags.network || 'mainnet'
    const infuraKey = flags.infuraKey
    const contractAddress = flags.contract
    const contractMethod = flags.method
    const methodArgs = flags.methodArgs.split(',')

    const contract = JSON.parse(fs.readFileSync(abiFile))

    const web3Instance = new Web3(
      `https://${network}.infura.io/v3/${infuraKey}`
    )

    const nftContract = new web3Instance.eth.Contract(contract, contractAddress)

    let resp
    try {
      resp = await nftContract.methods[contractMethod](...methodArgs).call()
    } catch (error) {
      this.log(error)
      return
    }

    this.log(resp)
  }
}

Web3CallerCommand.description = `Describe the command here
...
Extra documentation goes here
`

Web3CallerCommand.flags = {
  // add --version flag to show CLI version
  version: flags.version({char: 'v'}),
  // add --help flag to show CLI version
  help: flags.help({char: 'h'}),

  abiPath: flags.string({char: 'a', description: 'Path to the contract abi json'}),
  network: flags.string({char: 'n', description: 'Ethereum network you are calling, e.g.: mainnet or rinkeby'}),
  infuraKey: flags.string({char: 'i', description: 'Your infura key'}),
  contract: flags.string({char: 'c', description: 'Contract address'}),
  method: flags.string({char: 'm', description: 'The method you want to call'}),
  methodArgs: flags.string({char: 'g', description: 'The method arguments, comma separated e.g.: "10,1"'}),
}

module.exports = Web3CallerCommand
