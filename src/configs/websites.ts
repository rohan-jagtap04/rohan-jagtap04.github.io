import type { WebsitesData } from "~/types";

const websites: WebsitesData = {
	favorites: {
		title: "SNS Links",
		sites: [
			{
				id: "my-blog",
				title: "Website",
				img: "img/icons/launchpad/Medium.png",
				link: "https://medium.com/@rohjag18",
				inner: true,
			},
			{
				id: "my-github",
				title: "Github",
				img: "img/sites/github.svg",
				link: "https://github.com/rohan-jagtap04",
			},
			{
				id: "my-linkedin",
				title: "Linkedin",
				img: "img/sites/linkedin.svg",
				link: "https://www.linkedin.com/in/rrjagtap",
			},
			{
				id: "my-twitter",
				title: "Twitter",
				img: "img/sites/twitter.svg",
				link: "https://www.twitter.com/rohjag04",
			},
			{
				id: "my-email",
				title: "Email",
				img: "img/sites/gmail.svg",
				link: "mailto:rrjagtap@uwaterloo.ca",
			},
		],
	},
	freq: {
		title: "Frequently Visited",
		sites: [
			{
				id: "github",
				title: "Github",
				img: "img/sites/github.svg",
				link: "https://github.com/",
			},
			{
				id: "arxiv",
				title: "arXiv",
				img: "img/sites/arxiv.png",
				link: "https://arxiv.org/",
			},
			{
				id: "twitter",
				title: "Twitter",
				img: "img/sites/twitter.svg",
				link: "https://www.twitter.com/",
			},
			{
				id: "dribbble",
				title: "Dribbble",
				img: "img/sites/dribbble.svg",
				link: "https://dribbble.com/",
			},
			{
				id: "pinterest",
				title: "Pinterest",
				img: "img/sites/pinterest.svg",
				link: "https://www.pinterest.com/",
			},
			{
				id: "leetcode",
				title: "LeetCode",
				img: "img/sites/leetcode.svg",
				link: "https://leetcode.com/",
			},
			{
				id: "reddit",
				title: "Reddit",
				img: "img/sites/reddit.svg",
				link: "https://www.reddit.com/",
			},
			{
				id: "hacker-news",
				title: "Hacker News",
				img: "img/sites/hacker.svg",
				link: "https://news.ycombinator.com/",
			},
		],
	},
};

export default websites;
