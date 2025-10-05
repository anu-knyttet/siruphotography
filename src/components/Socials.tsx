import React from "react";
import YoutubeIcon from "@/components/icons/youtube";
import FacebookIcon from "@/components/icons/facebook";
import InstagramIcon from "@/components/icons/instagram";
import TiktokIcon from "@/components/icons/tiktok";

const socials = [
  {
    name: "Instagram",
    url: "https://instagram.com/siru_bhurtel_babyphotography",
    Icon: InstagramIcon,
  },
  {
    name: "Facebook",
    url: "https://facebook.com/bhurtel.siru",
    Icon: FacebookIcon,
  },
  {
    name: "YouTube",
    url: "https://youtube.com/@sirubhurtelphotography",
    Icon: YoutubeIcon,
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@sirubhurtel",
    Icon: TiktokIcon,
  },
];

const Socials: React.FC = () => (
  <div className="hidden sm:blockjustify-center sm:right-4 sm:bottom-0 sm:fixed sm:flex sm:flex-col sm:items-center sm:gap-4">
    {socials.map((social) => (
      <a
        key={social.name}
        href={social.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={social.name}
        className="flex items-center text-white hover:text-gray-300 no-underline"
      >
        <social.Icon width={24} height={24} fill="#ffe0c2" />
      </a>
    ))}
    <svg width="1" height="80" className="text-primary">
      <line x1="0.5" y1="0" x2="0.5" y2="80" stroke="currentColor" strokeWidth="1" />
    </svg>
  </div>
);

export const SocialsMobile: React.FC = () => (
  <div className="flex flex-row items-center gap-4">
    {socials.map((social) => (
      <a
        key={social.name}
        href={social.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={social.name}
        className="flex items-center text-white hover:text-gray-300 no-underline"
      >
        <social.Icon width={24} height={24} fill="#ffe0c2" />
      </a>
    ))}
  </div>
);

export default Socials;
