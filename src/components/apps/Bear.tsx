import { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula, prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useStore } from "~/stores";
import bear from "~/configs/bear";
import type { BearMdData } from "~/types";
import { Feed } from "~/model/medium/feed";
import { Item } from "~/model/medium/item";
import { writeFile } from "fs";
import { join } from "path";
import { Script } from "vm";
import { Id } from "~/model/youtube/id";
import { Snippet } from "~/model/youtube/snippet";

interface MediumResponse {
  status: string;
  feed: Feed;
  items: Item[];
}

interface Video {
  kind: string;
  etag: string;
  id: Id;
  snippet: Snippet;
}

interface VideoResponse {
  kind: string;
  etag: string;
  nextPageToken: string;
  regionCode: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: Video[];
}

interface ContentProps {
  contentID: string;
  contentURL: string;
}

interface MiddlebarProps {
  items: BearMdData[];
  cur: number;
  setContent: (id: string, url: string, index: number) => void;
}

interface SidebarProps {
  cur: number;
  setMidBar: (items: BearMdData[], index: number) => void;
}

interface BearState extends ContentProps {
  curSidebar: number;
  curMidbar: number;
  midbarList: BearMdData[];
}

const makeBlogMarkdown = (items: Item[]) => {
  let content = "# Medium Blogs \n\n";

  for (const item of items) {
    const image = (item.description as any)
      .toString()
      .match(/<img[^>]+src="([^">]+)"/)[1];
    content += `## [${item.title}](${item.link})\n\n`;
    content += `![Alt text](${image} "a title")\n\n`;
    content += `&nbsp; &nbsp; &nbsp;\n\n`;
  }
  return content;
};

const makeVideoMarkdown = (items: Video[]) => {
  let content = "# My Videos \n\n";

  for (const item of items) {
    content += `## ${item.snippet.title}\n\n`;
    content += `[![alt text](${item.snippet.thumbnails.default.url})](https://www.youtube.com/watch?v=${item.id.videoId})\n\n`;
    content += `&nbsp; &nbsp; &nbsp;\n\n`;
  }
  return content;
};

const Highlighter = (dark: boolean): any => {
  interface codeProps {
    node: any;
    inline: boolean;
    className: string;
    children: any;
  }

  return {
    code({ node, inline, className, children, ...props }: codeProps) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={dark ? dracula : prism}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className}>{children}</code>
      );
    }
  };
};

const Sidebar = ({ cur, setMidBar }: SidebarProps) => {
  return (
    <div className="w-full h-full bg-gray-700 text-white">
      <div className="h-12 pr-3 hstack space-x-3 justify-end">
        <span className="i-ic:baseline-cloud-off text-xl" />
        <span className="i-akar-icons:settings-vertical text-xl" />
      </div>
      <ul>
        {bear.map((item, index) => (
          <li
            key={`bear-sidebar-${item.id}`}
            className={`pl-6 h-8 hstack cursor-default ${
              cur === index ? "bg-red-500" : "bg-transparent"
            } ${cur === index ? "" : "hover:bg-gray-600"}`}
            onClick={() => setMidBar(item.md, index)}
          >
            <span className={item.icon} />
            <span className="ml-2">{item.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Middlebar = ({ items, cur, setContent }: MiddlebarProps) => {
  return (
    <div className="w-full h-full border-r c-border-300" bg="gray-50 dark:gray-800">
      <ul>
        {items.map((item: BearMdData, index: number) => (
          <li
            key={`bear-midbar-${item.id}`}
            className={`h-26 flex flex-col cursor-default border-l-2 ${
              cur === index
                ? "border-red-500 bg-white dark:bg-gray-900"
                : "border-transparent bg-transparent"
            } hover:(bg-white dark:bg-gray-900)`}
            onClick={() => setContent(item.id, item.file, index)}
          >
            <div className="h-8 mt-3 hstack flex-none">
              <div className="-mt-1 w-10 vstack flex-none c-text-500">
                <span className={item.icon} />
              </div>
              <span className="relative text-gray-900 dark:text-gray-100 flex-grow font-bold">
                {item.title}
                {item.link && (
                  <a
                    className="absolute top-1 right-4"
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="i-ant-design:link-outlined c-text-500" />
                  </a>
                )}
              </span>
            </div>
            <div className="h-16 ml-10 pb-2 pr-1 text-sm c-text-500 border-b c-border-300">
              {item.excerpt}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const getRepoURL = (url: string) => {
  return url.slice(0, -10) + "/";
};

const fixImageURL = (text: string, contentURL: string): string => {
  text = text.replace(/&nbsp;/g, "");
  if (contentURL.indexOf("raw.githubusercontent.com") !== -1) {
    const repoURL = getRepoURL(contentURL);

    const imgReg = /!\[(.*?)\]\((.*?)\)/;
    const imgRegGlobal = /!\[(.*?)\]\((.*?)\)/g;

    const imgList = text.match(imgRegGlobal);

    if (imgList) {
      for (const img of imgList) {
        const imgURL = (img.match(imgReg) as Array<string>)[2];
        if (imgURL.indexOf("http") !== -1) continue;
        const newImgURL = repoURL + imgURL;
        text = text.replace(imgURL, newImgURL);
      }
    }
  }
  return text;
};

const Content = ({ contentID, contentURL }: ContentProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storeMd, setStoreMd] = useState<{ [key: string]: string }>({});
  const [blogs, setBlogs] = useState<string>("");
  const [videos, setVideos] = useState<string>("");
  const dark = useStore((state) => state.dark);

  const fetchMarkdown = useCallback(
    (id: string, url: string) => {
      if (!storeMd[id]) {
        if (url.indexOf("TeamGhostwriter") !== -1) {
          storeMd["ghostwriter"] = `# Western9 Hackathon

Ever looked at the likes of Jcole, Kendrick Lamar, or Drake and wondered how you could become the next hip-hop sensation?

Here's where Ghostwriter comes in to help you learn how to freestyle.

Start rapping from one of our pre-saved beats and record your self into a mic. Through Google Cloud's Speech-to-Text technology, we take the words you rap and find words that rhyme with it through the Rhymezone API to spark ideas for your next line.

Want to hear your freestyles and share them? You can save your recorded freestyles on to our instance of CockroachDB and share them with other users.

Check out the code [here](https://github.com/TeamGhostwriter/ghostwriter/tree/main).
`;
          setStoreMd({ ...storeMd });
        } else {
          fetch(url, { mode: "cors" })
            .then((response) => response.text())
            .then((text) => {
              storeMd[id] = fixImageURL(text, url);
              setStoreMd({ ...storeMd });
            })
            .catch((error) => console.error(error));
        }
      }
    },
    [storeMd]
  );

  useEffect(() => {
    // Function to fetch data from API
    const fetchBlog = async () => {
      try {
        const response = await fetch(
          "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@rohjag18"
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const blogResponse: MediumResponse = JSON.parse(await response.text());
        setBlogs(makeBlogMarkdown(blogResponse.items));
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    const fetchVideo = async () => {
      const YOUTUBE_API_KEY = "AIzaSyCZVzMm37QSKwQNS5A9FrlwZO8EJeWgqRs";
      const CHANNEL_ID = "UC8yrr_a-DeQgYhAGSr_TbrQ";
      const API_URL = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=10`;

      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const videoResponse: VideoResponse = JSON.parse(await response.text());
        console.log(videoResponse.items[0].snippet.thumbnails.default.url);
        setVideos(makeVideoMarkdown(videoResponse.items));
        // console.log(videos);
        setLoading(false);
      } catch (error) {
        let videoMarkdown = `# My Videos \n\n`;
        videoMarkdown += `## [A Deep Dive Into Logistic Regression](https://youtu.be/Tjaaztrg0VQ?si=VjgPfWlDnHkVRvVd)\n\n`;
        videoMarkdown += `[![log_reg](../../../../../public/img/sites/logistic_reg.jpeg)](https://youtu.be/Tjaaztrg0VQ?si=7BUUb4LGA5DR169k)\n\n`;
        videoMarkdown += `&nbsp; &nbsp; &nbsp;\n\n`;
        videoMarkdown += `## [Proof - Without Activations Functions, Neural Network Models Become Linear](https://youtu.be/fKikzjjgdRw?si=ziV2hC5K8BSHHI0i)\n\n`;
        videoMarkdown += `[![log_reg](../../../../../public/img/sites/activation_func.jpeg)](https://youtu.be/fKikzjjgdRw?si=ziV2hC5K8BSHHI0i)\n\n`;
        videoMarkdown += `&nbsp; &nbsp; &nbsp;\n\n`;
        videoMarkdown += `## [Smart Parking Pitch](https://youtu.be/4E-kBQfX5es?si=xXMbsUoLPAkiUIH_)\n\n`;
        videoMarkdown += `[![log_reg](../../../../../public/img/sites/smart_parking.jpeg)](https://youtu.be/4E-kBQfX5es?si=xXMbsUoLPAkiUIH_)\n\n`;
        videoMarkdown += `&nbsp; &nbsp; &nbsp;\n\n`;
        videoMarkdown += `## [Spaceutica SHAD 2020 Video Pitch](https://youtu.be/jNpEP6N6JEQ?si=JxZyGcIy6oRWPASx)\n\n`;
        videoMarkdown += `[![log_reg](../../../../../public/img/sites/SHAD_pitch.jpeg)](https://youtu.be/jNpEP6N6JEQ?si=JxZyGcIy6oRWPASx)\n\n`;
        videoMarkdown += `&nbsp; &nbsp; &nbsp;\n\n`;

        setVideos(videoMarkdown);
      }
    };

    fetchBlog();
    fetchVideo();
  }, []);

  useEffect(() => {
    fetchMarkdown(contentID, contentURL);
  }, [contentID, contentURL, fetchMarkdown]);

  return (
    <div className="markdown w-full h-full c-text-700 bg-gray-50 dark:bg-gray-800 overflow-scroll py-6">
      <div className="w-2/3 px-2 mx-auto">
        <ReactMarkdown
          linkTarget="_blank"
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={Highlighter(dark as boolean)}
        >
          {contentID === "blogs"
            ? blogs
            : contentID === "videos"
            ? videos
            : storeMd[contentID]}
        </ReactMarkdown>
      </div>
    </div>
  );
};

const Bear = () => {
  const [state, setState] = useState<BearState>({
    curSidebar: 0,
    curMidbar: 0,
    midbarList: bear[0].md,
    contentID: bear[0].md[0].id,
    contentURL: bear[0].md[0].file
  });

  const setMidBar = (items: BearMdData[], index: number) => {
    setState({
      curSidebar: index,
      curMidbar: 0,
      midbarList: items,
      contentID: items[0].id,
      contentURL: items[0].file
    });
  };

  const setContent = (id: string, url: string, index: number) => {
    setState({
      ...state,
      curMidbar: index,
      contentID: id,
      contentURL: url
    });
  };

  return (
    <div className="bear font-avenir flex w-full h-full">
      <div className="flex-none w-44">
        <Sidebar cur={state.curSidebar} setMidBar={setMidBar} />
      </div>
      <div className="flex-none w-60">
        <Middlebar
          items={state.midbarList}
          cur={state.curMidbar}
          setContent={setContent}
        />
      </div>
      <div className="flex-grow">
        <Content contentID={state.contentID} contentURL={state.contentURL} />
      </div>
    </div>
  );
};

export default Bear;
