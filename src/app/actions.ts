"use server";

export async function getLeetCodeStats(username: string) {
  // 1. Define our safe fallback data upfront
  const fallbackData = {
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

  try {
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
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        "Accept": "*/*",
      },
      body: JSON.stringify({ query, variables: { username } }),
      next: { revalidate: 43200 }, // Cache for 12 hours
    });

    // 🚨 THE FIX: If Cloudflare blocks Vercel, DO NOT throw an error. 
    // Just return the fallback data smoothly.
    if (!res.ok) {
      console.warn(`Blocked by Cloudflare with status: ${res.status}`);
      return fallbackData;
    }

    const json = await res.json();
    
    // 🚨 THE FIX: If LeetCode refuses the query, return the fallback data.
    if (json.errors || !json.data?.matchedUser) {
      console.warn("GraphQL query failed or user not found.");
      return fallbackData;
    }

    const matchedUser = json.data.matchedUser;
    const stats = matchedUser.submitStats.acSubmissionNum;
    const totalStats = matchedUser.submitStats.totalSubmissionNum;
    
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

    // Return the actual live data if everything succeeded!
    return {
      status: "success",
      totalSolved: getCount("All"),
      easySolved: getCount("Easy"),
      mediumSolved: getCount("Medium"),
      hardSolved: getCount("Hard"),
      totalSubmissions: getTotalSubmissions(),
      ranking: matchedUser.profile.ranking,
      streak: activeStreak,
      badges: matchedUser.badges || [],
      languages: matchedUser.languageProblemCount || [],
    };
    
  } catch (error) {
    // 🚨 THE FIX: If the fetch completely times out, intercept it and return the fallback.
    console.error("Critical Server Action Network Error intercepted.");
    return fallbackData;
  }
}