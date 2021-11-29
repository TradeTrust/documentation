---
id: non-fungible-token
title: Non-Fungible Token
sidebar_label: Non-Fungible Token
---

## Introduction

The hype over NFTs...

<p align="center" width="100%">
  <figure>
      <img src='/docs/appendix/non-fungible-token/nyan-cat.jpeg' width="300" />
      <figcaption><i><a href="https://www.nytimes.com/2021/02/22/business/nft-nba-top-shot-crypto.html">Nyan Cat</a> sold for $580,000</i></figcaption>
  </figure>
</p>

Yes, this animated flying cat above that has been circulating around the internet was sold for nearly $600,000 in the NFT market, which you have probably heard or seen this term while surfing the web.

With the recent increase in the hype over Non-Fungible Tokens (NFTs), you may be wondering what is the surge in popularity of it all about? This article will explain to you what it is and how it is being used in GovTech.

_Definition(s):_ <br />
_Fungible - Replaceable by another identical item_ <br />
_Non-Fungible - Irreplaceable by any other item_ <br />
_Token - An object that represents something else, such as another object_

By definition, _fungible_ means an item that could be easily replaceable by another identical item, for e.g. one $50 banknote is interchangeable with five $10 banknotes. So _non-fungible_ basically means the opposite and that an item is irreplaceable which cannot be substituted by any other item(s). As for a _token_, it can simply be deemed as a digital certificate stored in a distributed database.

## What is NFT?

In essence, an NFT (Non-Fungible Token) is a digital certificate that contains information about a unique or irreplaceable item.

An example of NFT would be an artwork digitally drawn and painted by an artist (i.e. using an iPad and Apple Pencil). A digital certificate could be created that includes information about the artwork like the artist’s name and digital signature. The certificate would then be published on the blockchain and given a unique identity, like an identification number. Anyone with the certificate could verify its authenticity on the blockchain and claim ownership of it.

## How are NFTs used?

NFTs are used primarily as a way to identify the owner of unique digital items, which include drawings, songs, items in video games, etc. For someone to own the original item, the ownership of it could be transferred with the use of the associated NFT through buying and selling in the NFT marketplace [3].

Just to provide an example to put everything into context, let us go back to the flying cat mentioned at the beginning of this article. The creator, Chris Torres, believes NFT could provide creators like himself, with recognition over the artwork they create and be compensated for them directly, which was why he created an NFT for his animated flying cat and listed it for sale on a crypto art platform called Foundation. The NFT acts as a form of identification that proves the original creator has verified and signed on, which establishes its credibility and authenticity. The NFT created was then tagged to Chris Torres’s unique Ethereum wallet address which proves that he was the sole owner. Upon successful sales of the Nyan Cat’s NFT, the ownership would then be transferred to the wallet address of the corresponding buyer. This way, it makes sure that there is only a one-of-a-kind edition of the artwork, created by the original creator, listed for sale.

## How is NFT used in TradeTrust?

The current implementation of the TradeTrust framework uses the Ethereum blockchain whereby the ERC-721 provides a widely-used smart contract API used on non-fungible tokens (NFTs) to allow transfer of ownership whilst providing assurance of integrity, singularity, and control [1]. Traditionally, in order to take legal possession of any shipment goods, a physical document, like the bill of lading would have to be presented to the shipper. This brings many disadvantages like administrative costs for processing paperwork as well as exposure to fraud where the documents could be easily forged.

By using NFT, these documents are tokenised which would allow the same ownership to be verified in a decentralized manner. This actually solves a lot of the disadvantages and risks that exist in how global trade traditionally works.

The idea of NFTs implemented for electronic trade documents is similar to the flying cat example whereby a document, now exists in digital form (electronic bill of lading), contains information about the owner of the goods and the current holder possessing the documents, much like the details about the creator of any digital artwork. These two entities are identified by their unique Ethereum wallet addresses and that they are the only legal and authorized entities allowed and able to perform any endorsement or transfer actions to the documents. For example, when the goods are shipped from one place to another, the documents are handed over to the following recipient which is a transfer of documents process between the two entities. It is done by having the current holder stated in the document to initiate a change in holdership on TradeTrust. This information would then be updated in the Ethereum Blockchain, which stores the most up-to-date information related to the documents.

Two simple illustrations are shown below for a clearer representation of how the process of the transfer in ownership of a bill of lading works;

<p align="center" width="100%">
  <figure>
      <img src='/docs/appendix/non-fungible-token/tradetrust-nft-1.png' />
      <figcaption><i>Illustration 1</i></figcaption>
  </figure>
</p>

In _Illustration 1_, there are two documents, the bill of lading which indicates the information about the goods, and a title escrow that indicates holder and beneficiary. The bill of lading has a unique id (#001) and is tagged to the title escrow (#555) document which indicates at this instance, who is the holder (Tom) and who is the beneficiary (Harry). This bill of lading is said to be tokenised to the title escrow, which in other words, means that this title escrow cannot be replaced by any other entity other than the ones indicated inside of it.

<p align="center" width="100%">
  <figure>
      <img src='/docs/appendix/non-fungible-token/tradetrust-nft-2.png' />
      <figcaption><i>Illustration 2</i></figcaption>
  </figure>
</p>

In _Illustration 2_, there is a change in the beneficiary for the bill of lading document. This change in beneficiary results in a new title escrow (#556) being created and having the ownership of the document transferred and tagged to the new title escrow.

## How was it implemented?

_Definition(s):_ <br />
_ERC-721 - An open standard that describes how to build NFTs on Ethereum Virtual Machine (EVM) compatible blockchains_

With all of these implementations, you may wonder how they were achieved. The implementations follow what is called _ERC-721_, which is basically a standardized interface for creating NFTs and provides basic functionalities of being identifiable, trackable, and transferable [1]. This could be simply thought of as having a set of rules in place when manufacturing a mobile phone and that every mobile phone needs to have the basic functionality of being able to make calls and send text messages.

By using this standardized interface, allows every single NFT to contain the same baseline characteristics in terms of what they should and are able to do, e.g. all of the NFTs created are able to have their ownership transferred from one entity to another.

## References

[1] https://ethereum.org/en/developers/docs/standards/tokens/erc-721/ <br />
[2] https://www.nytimes.com/2021/02/22/business/nft-nba-top-shot-crypto.html <br />
[3] https://www.theverge.com/22310188/nft-explainer-what-is-blockchain-crypto-art-faq
