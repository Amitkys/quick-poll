export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Amitkys",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    // {
    //   label: "Home",
    //   href: "/",
    // },
    // {
    //   label: "Docs",
    //   href: "/docs",
    // },
    {
      label: "Create your own poll",
      href: "/create",
    },
    // {
    //   label: "Blog",
    //   href: "/blog",
    // },
    // {
    //   label: "About",
    //   href: "/about",
    // },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/amitkys",
    twitter: "https://twitter.com/amitkys",
    docs: "https://google.com",
    discord: "https://discord.gg/google",
    sponsor: "https://google.com",
  },
};
