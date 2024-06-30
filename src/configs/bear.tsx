import type { BearData } from "~/types";

const bear: BearData[] = [
  {
    id: "profile",
    title: "Profile",
    icon: "i-fa-solid:paw",
    md: [
      {
        id: "about-me",
        title: "About Me",
        file: "markdown/about-me.md",
        icon: "i-la:code",
        excerpt: "Hey there, I'm Rohan. I am a third year student majoring..."
      },
      {
        id: "blogs",
        title: "Rohan's Blogs",
        file: "markdown/links.md",
        icon: "i-icon-park-outline:link",
        excerpt:
          "Here are articles I've written about Neural Networks, Computer Vision, and more..."
      },
      {
        id: "videos",
        title: "Rohan's Videos",
        file: "markdown/videos.md",
        icon: "i-feather:video",
        excerpt: "Here are some videos I've made..."
      }
    ]
  },
  {
    id: "project",
    title: "Projects",
    icon: "i-octicon:repo",
    md: [
      {
        id: "scan-ai",
        title: "ScanAI",
        file: "https://raw.githubusercontent.com/rohan-jagtap04/ScanAI/master/README.md",
        icon: "i-ri:gamepad-line",
        excerpt:
          "An app I published to aid my school district with storing and distributing information...",
        link: "https://github.com/rohan-jagtap04/ScanAI"
      },
      {
        id: "ghostwriter",
        title: "Ghostwriter",
        file: "https://github.com/TeamGhostwriter/ghostwriter/blob/main/README.md",
        icon: "i-ri:newspaper-fill",
        excerpt: "Learn to freestyle and become the next rap legend...",
        link: "https://github.com/TeamGhostwriter/ghostwriter/tree/main"
      },
      {
        id: "gpthome",
        title: "GPTHome",
        file: "https://raw.githubusercontent.com/rohan-jagtap04/GPTHome/main/README.md",
        icon: "i-fa-brands:vuejs",
        excerpt: "A MacOS app for accessing OpenAI's GPT-3.5 and GPT-4 models..",
        link: "https://raw.githubusercontent.com/rohan-jagtap04/GPTHome"
      },
      {
        id: "neural-network-asteroid",
        title: "Asteroid AI",
        file: "https://raw.githubusercontent.com/rohan-jagtap04/Passion_Project/master/Neural%20Network%20Asteroid/ReadMe.md",
        icon: "i-akar-icons:sword",
        excerpt: "Asteroid game with a neural network AI...",
        link: "https://github.com/rohan-jagtap04/Passion_Project/tree/master/Neural%20Network%20Asteroid"
      },
      {
        id: "neural-network-flappy-bird",
        title: "Flappy Bird",
        file: "https://raw.githubusercontent.com/rohan-jagtap04/Passion_Project/master/Flappy%20Bird%20AI/ReadMe.md",
        icon: "i-icon-park-outline:heavy-metal",
        excerpt: "The classic Flappy Bird game with a neural network AI...",
        link: "https://github.com/rohan-jagtap04/Passion_Project/tree/master/Flappy%20Bird%20AI"
      },
      {
        id: "text-classification",
        title: "Text Classification",
        file: "https://raw.githubusercontent.com/Renovamen/Text-Classification/master/README.md",
        icon: "i-gg:format-text",
        excerpt: "PyTorch implementation of text classification models...",
        link: "https://github.com/Renovamen/Text-Classification"
      }
    ]
  }
];

export default bear;
