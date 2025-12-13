module sui_nft::nft {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use sui::transfer;
    use std::string::{Self, String};

    /// NFT Collection with unique metadata
    struct NFT has key, store {
        id: UID,
        name: String,
        description: String,
        uri: String,
    }

    /// Event emitted when an NFT is minted
    struct NFTMinted has copy, drop {
        nft_id: ID,
        owner: address,
        name: String,
    }

    /// Mint a new NFT to the sender
    entry fun mint(
        name: vector<u8>,
        description: vector<u8>,
        uri: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let nft = NFT {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            uri: string::utf8(uri),
        };

        let nft_id = object::id(&nft);
        transfer::transfer(nft, sender);

        event::emit(NFTMinted {
            nft_id: nft_id,
            owner: sender,
            name: string::utf8(name),
        });
    }
}

