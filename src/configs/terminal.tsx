import type { TerminalData } from "~/types";

const terminal: TerminalData[] = [
  {
    id: "about",
    title: "about/",
    type: "folder",
    children: [
      {
        id: "about-bio",
        title: "bio.txt",
        type: "file",
        content: (
          <div className="py-1">
            <div>
              Hey there, I'm Rohan. I am a third year student majoring in Software
              Engineering at the University of Waterloo currently looking for Winter 2025
              and Spring 2025 Internships!
            </div>
          </div>
        )
      },
      {
        id: "about-interests",
        title: "interests.txt",
        type: "file",
        content: "Fullstack Development / Machine Learning / Computer Vision"
      },
      {
        id: "about-who-cares",
        title: "who-cares.txt",
        type: "file",
        content: "I'm a rising Junior at UWaterloo! I hope you like the website!"
      },
      {
        id: "about-contact",
        title: "contact.txt",
        type: "file",
        content: (
          <div>
            <p>The blue texts are links! Click on them to see where they go!</p>
            <ul className="list-disc ml-6">
              <li>
                Email:{" "}
                <a
                  className="text-blue-300"
                  href="mailto:rrjagtap@uwaterloo.ca"
                  target="_blank"
                  rel="noreferrer"
                >
                  rrjagtap@uwaterloo.ca
                </a>
              </li>
              <li>
                Github:{" "}
                <a
                  className="text-blue-300"
                  href="https://github.com/rohan-jagtap04"
                  target="_blank"
                  rel="noreferrer"
                >
                  @rohan-jagtap04
                </a>
              </li>
              <li>
                Linkedin:{" "}
                <a
                  className="text-blue-300"
                  href="https://www.linkedin.com/in/rrjagtap/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Rohan Jagtap
                </a>
              </li>
              <li>
                Medium:{" "}
                <a
                  className="text-blue-300"
                  href="https://rohjag18.medium.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Rohan's Medium Blog
                </a>
              </li>
            </ul>
          </div>
        )
      }
    ]
  },
  {
    id: "about-dream",
    title: "my-dream.cpp",
    type: "file",
    content: (
      <div className="py-1">
        <div>
          <span className="text-yellow-400">while</span>(
          <span className="text-blue-400">sleeping</span>) <span>{"{"}</span>
        </div>
        <div>
          <span className="text-blue-400 ml-9">money</span>
          <span className="text-yellow-400">++</span>;
        </div>
        <div>
          <span>{"}"}</span>
        </div>
      </div>
    )
  }
];

export default terminal;
