export const dailyRewardCalendar = Array.from({ length: 30 }, (_, index) => {
  const day = index + 1;
  const isMilestone = day % 7 === 0 || day === 30;

  return {
    day,
    xp: isMilestone ? 150 + day * 5 : 40 + day * 2,
    coins: isMilestone ? 80 + day * 3 : 20 + day,
    reward: day === 30 ? "Premium Trial" : isMilestone ? "Badge Progress" : "Daily Boost"
  };
});

export const defaultDailyQuests = [
  {
    slug: "compress-5-images",
    title: "Compress 5 Images",
    description: "Optimize five images with Mediazy.",
    target: 5,
    xpReward: 120,
    coinReward: 50
  },
  {
    slug: "merge-2-pdfs",
    title: "Merge 2 PDFs",
    description: "Create two merged PDF files.",
    target: 2,
    xpReward: 100,
    coinReward: 40
  },
  {
    slug: "generate-3-qr-codes",
    title: "Generate 3 QR Codes",
    description: "Create QR codes for links or text.",
    target: 3,
    xpReward: 90,
    coinReward: 35
  },
  {
    slug: "try-new-tool",
    title: "Try a New Tool",
    description: "Open a tool you have not used before.",
    target: 1,
    xpReward: 80,
    coinReward: 30
  }
];

export const achievementCatalog = [
  "First Login",
  "First Tool Used",
  "100 Tool Uses",
  "500 Tool Uses",
  "7 Day Streak",
  "30 Day Streak",
  "Image Master",
  "PDF Master",
  "Developer",
  "Explorer",
  "AI User",
  "Legend"
];
