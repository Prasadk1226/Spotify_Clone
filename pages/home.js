// Array of objects representing each artist's data (image, name, label)
const artists = [
  {
    image: "https://i.scdn.co/image/ab67616d00001e020d66934f5370419636c78f18",
    name: "Po Ve po - The Pain of Love",
    label: "Anirudh Ravichander",
    track : ""
  },
  {
    image: "https://i.scdn.co/image/ab67616d00001e026d1640c173667692706892a5",
    name: "Pachchandaname",
    label: "A.R Rahman",
  },
  {
    image: "https://i.scdn.co/image/ab67616d0000b273f005bcdb12df80e598fb24bb",
    name: "Preminche Premava",
    label: "A.R Rahman",
  },
  {
    image: "https://i.scdn.co/image/ab67706f00000002c2265a92c0ef9e4b59cc3ab3",
    name: `Illuminati - From "Aavesham"`,
    label: "Sushin Shyam",
  },
  {
    image: "https://i.scdn.co/image/ab67616d00001e02c55687b6cdba45d13ff07c91",
    name: "Thalavanchi eragade",
    label: "A.R Rahman",
    song : "https://open.spotify.com/embed/track/1m6R9gLcwA4E9ecWpo4qsY?utm_source=generator&theme=0"
  },
  {
    image: "https://i.scdn.co/image/ab67616d0000b27340d3b59b2f1478395b4e3857",
    name: "Nee Paata Madhuram - The Touch of Love",
    label: "Anirudh Ravichander",
  },
  {
    image: "https://i.scdn.co/image/ab67616d00001e02855f01d9b50ecc5863656691",
    name: `Emo Emo-From "Raahu"`,
    label: "Praveen Lakkaraju",
  },
  {
    image: "https://i.scdn.co/image/ab67706f00000002a9ca5b9e79e85b7b60229a9f",
    name: `Adigaa- From "hi Nanna"`,
    label: "Karthik",
  },
  {
    image: "https://i.scdn.co/image/ab67616d0000b273f4df10de23eced036aab17cd",
    name: "Neeve Neeve",
    label: "G.V Prakash",
  },
];

// Select all the card elements (images, names, labels)
const cardImages = document.querySelectorAll(".card-img");
const cardNames = document.querySelectorAll(".card-text-name");
const cardLabels = document.querySelectorAll(".card-text-label");

// Loop through the cards and update with data from the objects
for (let i = 0; i < artists.length; i++) {
  (cardImages[i].src = artists[i].image), 
    (cardNames[i].innerHTML = artists[i].name), 
    (cardLabels[i].innerHTML = artists[i].label)     
    // console.log(i);
}
console.log(artists[4].song)
