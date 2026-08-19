"use server";

export async function getLeetCodeStats(username: string) {
  try {
    // Added languageProblemCount to fetch language-specific solved metrics
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          profile { ranking }
          submitStats {
            acSubmissionNum { difficulty count }
            totalSubmissionNum { difficulty submissions }
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

    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Referer": "https://leetcode.com",
      },
      body: JSON.stringify({ query, variables: { username } }),
      next: { revalidate: 3600 }, 
    });

    if (!res.ok) {
      throw new Error(`LeetCode Official API returned status: ${res.status}`);
    }

    const json = await res.json();
    
    if (json.errors || !json.data?.matchedUser) {
      throw new Error("User not found or GraphQL query failed");
    }

    const matchedUser = json.data.matchedUser;
    const stats = matchedUser.submitStats.acSubmissionNum;
    const totalStats = matchedUser.submitStats.totalSubmissionNum;
    const ranking = matchedUser.profile.ranking;
    const badges = matchedUser.badges || [];
    const languages = matchedUser.languageProblemCount || []; // Extracted languages

    // --- ACCURATE STREAK CALCULATION ---
    let activeStreak = 0;
    if (matchedUser.userCalendar?.submissionCalendar) {
      const calendarJson = JSON.parse(matchedUser.userCalendar.submissionCalendar);
      const timestamps = Object.keys(calendarJson).map(Number).sort((a, b) => b - a);
      
      if (timestamps.length > 0) {
        let latest = timestamps[0];
        const currentTime = Math.floor(Date.now() / 1000);
        const SECONDS_IN_DAY = 86400;
        
        if (currentTime - latest < SECONDS_IN_DAY * 2.5) {
          activeStreak = 1;
          for (let i = 1; i < timestamps.length; i++) {
            const diff = latest - timestamps[i];
            if (diff === SECONDS_IN_DAY) {
              activeStreak++;
              latest = timestamps[i];
            } else if (diff < SECONDS_IN_DAY) {
              continue;
            } else {
              break; 
            }
          }
        }
      }
    }

    const getCount = (diff: string) => 
      stats.find((item: { difficulty: string; count: number }) => item.difficulty === diff)?.count || 0;

    const getTotalSubmissions = () => 
      totalStats.find((item: { difficulty: string; submissions: number }) => item.difficulty === "All")?.submissions || 0;

    return {
      status: "success",
      totalSolved: getCount("All"),
      easySolved: getCount("Easy"),
      mediumSolved: getCount("Medium"),
      hardSolved: getCount("Hard"),
      totalSubmissions: getTotalSubmissions(),
      ranking: ranking,
      streak: activeStreak,
      badges: badges,
      languages: languages, // Passed to the frontend
    };
    
  } catch (error) {
    console.error("Server Action Error fetching LeetCode stats:", error);
    return {
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
  }
}