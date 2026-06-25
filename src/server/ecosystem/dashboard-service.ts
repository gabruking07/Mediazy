import { calculateLevel } from "@/shared/ecosystem/levels";
import { defaultDailyQuests } from "@/shared/ecosystem/rewards";
import { prisma } from "@/server/lib/prisma";

export type EcosystemDashboard = Awaited<ReturnType<typeof getEcosystemDashboard>>;

export async function getEcosystemDashboard(userId: string) {
  const [
    xpAggregate,
    coinAggregate,
    achievementCount,
    favoriteCount,
    recentActivity,
    statistics,
    notifications
  ] = await Promise.all([
    prisma.xPTransaction.aggregate({
      where: { userId },
      _sum: { amount: true }
    }),
    prisma.coinTransaction.aggregate({
      where: { userId },
      _sum: { amount: true }
    }),
    prisma.userAchievement.count({
      where: { userId, unlockedAt: { not: null } }
    }),
    prisma.favorite.count({
      where: { userId }
    }),
    prisma.recentActivity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 6
    }),
    prisma.userStatistics.findUnique({
      where: { userId }
    }),
    prisma.notification.count({
      where: { userId, readAt: null }
    })
  ]);

  const totalXp = xpAggregate._sum.amount ?? 0;
  const coins = coinAggregate._sum.amount ?? 0;
  const level = calculateLevel(totalXp);
  const toolsUsed = statistics?.toolsUsed ?? 0;

  return {
    totalXp,
    coins,
    level,
    rank: calculateRank(totalXp),
    achievementCount,
    favoriteCount,
    unreadNotifications: notifications,
    streak: {
      current: statistics?.currentStreak ?? 0,
      longest: statistics?.longestStreak ?? 0
    },
    statistics: {
      toolsUsed,
      imagesConverted: statistics?.imagesConverted ?? 0,
      pdfFilesProcessed: statistics?.pdfFilesProcessed ?? 0,
      qrGenerated: statistics?.qrGenerated ?? 0,
      timeSavedMinutes: Math.round((statistics?.timeSavedSeconds ?? 0) / 60),
      storageSavedMb: Math.round((statistics?.storageSavedBytes ?? 0) / 1024 / 1024)
    },
    weekly: buildWeeklyActivity(toolsUsed),
    quests: defaultDailyQuests.map((quest, index) => ({
      ...quest,
      progress: Math.min(quest.target, index === 0 ? Math.min(quest.target, toolsUsed) : 0)
    })),
    recentActivity: recentActivity.map((activity) => ({
      id: activity.id,
      label: activity.label,
      type: activity.type,
      createdAt: activity.createdAt.toISOString()
    }))
  };
}

function calculateRank(totalXp: number) {
  if (totalXp >= 30000) return "Top 1%";
  if (totalXp >= 7500) return "Top 5%";
  if (totalXp >= 1500) return "Top 20%";
  return "Unranked";
}

function buildWeeklyActivity(toolsUsed: number) {
  const base = Math.max(1, Math.ceil(toolsUsed / 7));
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => ({
    day,
    value: Math.max(1, base + ((index * 3) % 8))
  }));
}
