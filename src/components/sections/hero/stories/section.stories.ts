import type { Meta, StoryObj } from "@storybook/react";
import HeroSection from "../section";

const meta = {
  title: "Hero",
  component: HeroSection,
  parameters: {
    layout: "fullscreen",
  },

  tags: ["autodocs"],
} satisfies Meta<typeof HeroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    stats: {
      tvl: 66_000_000,
      vol_30d: 60_000_000,
      xcm_vol_30d: 28_000_000,
      assets_count: 42,
      accounts_count: 109_000,
    },
  },
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};
