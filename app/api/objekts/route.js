import { NextResponse } from 'next/server';

export async function GET() {
  const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
  const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
  const ARTMS_CONTRACT = process.env.ARTMS_CONTRACT;

  try {
    const url = `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}/getNFTs/?owner=${WALLET_ADDRESS}&contractAddresses[]=${ARTMS_CONTRACT}&withMetadata=true&orderBy=transferTime`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Alchemy API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.ownedNfts) {
      return NextResponse.json({ objekts: [] });
    }

    const objekts = data.ownedNfts.map(nft => ({
      id: BigInt(nft.id.tokenId).toString(),
      name: nft.metadata?.name || `Objekt #${BigInt(nft.id.tokenId).toString()}`,
      image: nft.metadata?.image || "https://via.placeholder.com/150",
    }));

    return NextResponse.json({ objekts });
  } catch (error) {
    console.error("Error fetching ARTMS Objekts:", error);
    return NextResponse.json(
      { error: "Failed to fetch Objekts" },
      { status: 500 }
    );
  }
}