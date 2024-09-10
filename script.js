const SHA256 = window.sha256;

let merkleTree;
let merkleRoot;

// Function to initialize the Merkle tree
function initializeMerkleTree() {
  try {
    const eligibleAddresses = [
        '0xf3ed7c11235053691e39bfcd0872c5c9c1913d73',
        '0xde874917d3817e4a4175087bdd35990d1bf2d7cc',
        '0x93283e4e89b43890404003d395d96b644015da00',
        '0x1cd6531b6a78f4fc05569ecad2f6d708b4fd0bf2',
        '0x0fca4e66a8bbe3477f6f6780c2023144842208cd',
        '0x1e08a64821f67482dfcc84c7bcf7694ea37fffb5'
    ];

    console.log("Eligible addresses:", eligibleAddresses);

    const leaves = eligibleAddresses.map(addr => SHA256(addr).toString());
    merkleTree = new window.MerkleTree(leaves, SHA256);
    merkleRoot = merkleTree.getRoot().toString("hex");

    console.log("Merkle tree initialized. Root:", merkleRoot);
  } catch (error) {
    console.error("Failed to initialize the Merkle tree:", error);
  }
}

// Function to check the eligibility of an address
function checkEligibility() {
  if (!merkleTree || !merkleRoot) {
    console.error("Merkle tree is not initialized.");
    return;
  }

  const address = document.getElementById("addressInput").value.trim();
  const leaf = SHA256(address).toString();
  const proof = merkleTree.getProof(leaf);
  const isEligible = merkleTree.verify(proof, leaf, merkleRoot);

  displayEligibilityResult(isEligible);
}

function displayEligibilityResult(isEligible) {
  const resultElement = document.getElementById("result");
  const resultText = resultElement.querySelector("p");

  resultElement.classList.remove("hidden", "bg-green-600", "bg-red-600");
  resultElement.classList.add(isEligible ? "bg-green-600" : "bg-red-600");

  resultText.textContent = isEligible
    ? "Eligible for airdrop!"
    : "Not eligible for airdrop.";
}

// Event listener for DOM content load
document.addEventListener("DOMContentLoaded", () => {
  initializeMerkleTree();

  const checkButton = document.getElementById("checkButton");
  if (checkButton) {
    checkButton.addEventListener("click", checkEligibility);
  } else {
    console.error("Check button not found.");
  }
});
