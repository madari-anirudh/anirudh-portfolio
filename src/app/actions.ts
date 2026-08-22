"use server";

interface LeetCodeBadge {
  name: string;
  icon: string;
}

interface LeetCodeLanguage {
  languageName: string;
  problemsSolved: number;
}

interface LeetCodeResult {
  status: "success" | "error";
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalSubmissions: number;
  ranking: number;
  streak: number;
  badges: LeetCodeBadge[];
  languages: LeetCodeLanguage[];
}

const fallbackData: LeetCodeResult = {
  status: "error",
  totalSolved: 0,
  easySolved: 0,
  mediumSolved: 0,
  hardSolved: 0,
  totalSubmissions: 0,
  ranking: 0,
  streak: 0,
  badges: [],
  languages: [],
};

export async function getLeetCodeStats(
  username: string
): Promise<LeetCodeResult> {
  try {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          profile {
            ranking
          }

          submitStats {
            acSubmissionNum {
              difficulty
              count
            }

            totalSubmissionNum {
              difficulty
              submissions
            }
          }

          userCalendar {
            submissionCalendar
          }

          badges {
            name
            icon
          }

          languageProblemCount {
            languageName
            problemsSolved
          }
        }
      }
    `;

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com/",
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({
        query,
        variables: {
          username,
        },
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("LEETCODE HTTP ERROR:", response.status);
      return fallbackData;
    }

    const json = await response.json();

    console.log("LEETCODE GRAPHQL RESPONSE:", {
      hasData: Boolean(json?.data),
      hasMatchedUser: Boolean(json?.data?.matchedUser),
      errors: json?.errors ?? null,
    });

    if (json?.errors || !json?.data?.matchedUser) {
      console.error("LEETCODE GRAPHQL ERROR:", json?.errors);
      return fallbackData;
    }

    const user = json.data.matchedUser;

    // -----------------------------
    // SAFE PROBLEM COUNTS
    // -----------------------------

    const acceptedStats = Array.isArray(
      user?.submitStats?.acSubmissionNum
    )
      ? user.submitStats.acSubmissionNum
      : [];

    const submissionStats = Array.isArray(
      user?.submitStats?.totalSubmissionNum
    )
      ? user.submitStats.totalSubmissionNum
      : [];

    const getSolved = (difficulty: string): number => {
      const item = acceptedStats.find(
        (entry: any) => entry?.difficulty === difficulty
      );

      return Number(item?.count ?? 0);
    };

    const getSubmissions = (): number => {
      const item = submissionStats.find(
        (entry: any) => entry?.difficulty === "All"
      );

      return Number(item?.submissions ?? 0);
    };

    // -----------------------------
    // SAFE STREAK CALCULATION
    // -----------------------------

    let activeStreak = 0;

    try {
      const calendar = user?.userCalendar?.submissionCalendar;

      if (typeof calendar === "string" && calendar.length > 0) {
        const parsedCalendar = JSON.parse(calendar);

        if (
          parsedCalendar &&
          typeof parsedCalendar === "object" &&
          !Array.isArray(parsedCalendar)
        ) {
          const timestamps = Object.keys(parsedCalendar)
            .map(Number)
            .filter(Number.isFinite)
            .sort((a, b) => b - a);

          if (timestamps.length > 0) {
            const DAY = 86400;
            const now = Math.floor(Date.now() / 1000);

            let latest = timestamps[0];

            // Don't count an old streak.
            if (now - latest <= DAY * 2) {
              activeStreak = 1;

              for (let i = 1; i < timestamps.length; i++) {
                const difference = latest - timestamps[i];

                if (difference >= DAY * 0.9 && difference <= DAY * 1.1) {
                  activeStreak++;
                  latest = timestamps[i];
                } else if (difference > DAY * 1.1) {
                  break;
                }
              }
            }
          }
        }
      }
    } catch (streakError) {
      console.error("LEETCODE STREAK ERROR:", streakError);

      // Important:
      // A streak failure should NOT destroy the entire
      // LeetCode statistics card.
      activeStreak = 0;
    }

    // -----------------------------
    // SAFE BADGES
    // -----------------------------

    const badges: LeetCodeBadge[] = Array.isArray(user?.badges)
      ? user.badges
          .filter(
            (badge: any) =>
              badge &&
              typeof badge.name === "string" &&
              typeof badge.icon === "string"
          )
          .map((badge: any) => ({
            name: badge.name,
            icon: badge.icon,
          }))
      : [];

    // -----------------------------
    // SAFE LANGUAGES
    // -----------------------------

    const languages: LeetCodeLanguage[] = Array.isArray(
      user?.languageProblemCount
    )
      ? user.languageProblemCount
          .filter(
            (language: any) =>
              language &&
              typeof language.languageName === "string"
          )
          .map((language: any) => ({
            languageName: language.languageName,
            problemsSolved: Number(language.problemsSolved ?? 0),
          }))
      : [];

    // -----------------------------
    // FINAL DATA
    // -----------------------------

    const result: LeetCodeResult = {
      status: "success",

      totalSolved: getSolved("All"),
      easySolved: getSolved("Easy"),
      mediumSolved: getSolved("Medium"),
      hardSolved: getSolved("Hard"),

      totalSubmissions: getSubmissions(),

      ranking: Number(user?.profile?.ranking ?? 0),

      streak: activeStreak,

      badges,

      languages,
    };

    console.log("LEETCODE FINAL DATA:", {
      totalSolved: result.totalSolved,
      easySolved: result.easySolved,
      mediumSolved: result.mediumSolved,
      hardSolved: result.hardSolved,
      ranking: result.ranking,
      streak: result.streak,
      submissions: result.totalSubmissions,
      badges: result.badges.length,
      languages: result.languages.length,
    });

    return result;
  } catch (error) {
    console.error("LEETCODE PROCESSING ERROR:", error);

    return fallbackData;
  }
}