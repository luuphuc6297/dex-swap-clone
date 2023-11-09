import { ContextApi } from "@pancakeswap/localization";
import { FooterLinkType } from "../../../components/Footer/types";

export const footerLinks: (t: ContextApi["t"]) => FooterLinkType[] = (t) => [
  {
    label: t("About"),
    items: [
      {
        label: t("Contact"),
        href: "#",
        isHighlighted: true,
      },
      {
        label: t("Brand"),
        href: "#",
      },
      {
        label: t("Blog"),
        href: "#",
      },
      {
        label: t("Community"),
        href: "#",
      },
      {
        label: t("Litepaper"),
        href: "#",
      },
      {
        label: t("Terms Of Service"),
        href: "#",
      },
    ],
  },
  {
    label: t("Help"),
    items: [
      {
        label: t("Customer Support"),
        href: "#",
      },
      {
        label: t("Troubleshooting"),
        href: "#",
      },
      {
        label: t("Guides"),
        href: "#",
      },
    ],
  },
  {
    label: t("Developers"),
    items: [
      {
        label: "Github",
        href: "#",
      },
      {
        label: t("Documentation"),
        href: "#",
      },
      {
        label: t("Bug Bounty"),
        href: "#",
      },
      {
        label: t("Audits"),
        href: "#",
      },
      {
        label: t("Careers"),
        href: "#",
      },
    ],
  },
];
