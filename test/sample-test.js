/* test/sample-test.js */
describe("NFTMarket", function() {
    it("Should create and execute market sales", async function() {
      /* развертывание маркетплейса */
      const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace")
      const nftMarketplace = await NFTMarketplace.deploy()
      await nftMarketplace.deployed()
      let listingPrice = await nftMarketplace.getListingPrice()
      listingPrice = listingPrice.toString()
      const auctionPrice = ethers.utils.parseUnits('1', 'ether')
      /* создание двух токенов */
      await nftMarketplace.createToken("https://www.mytokenlocation.com", auctionPrice, { value: listingPrice })
      await nftMarketplace.createToken("https://www.mytokenlocation2.com", auctionPrice, { value: listingPrice })
      const [_, buyerAddress] = await ethers.getSigners()
      /* выполнение продажи токена другому пользователю */
      await nftMarketplace.connect(buyerAddress).createMarketSale(1, { value: auctionPrice })
      /* перепродажа токена */
      await nftMarketplace.connect(buyerAddress).resellToken(1, auctionPrice, { value: listingPrice })
      /* запрос и возврат непроданных позиций */
      items = await nftMarketplace.fetchMarketItems()
      items = await Promise.all(items.map(async i => {
        const tokenUri = await nftMarketplace.tokenURI(i.tokenId)
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri
        }
        return item
      }))
      console.log('items: ', items)
    })
  })