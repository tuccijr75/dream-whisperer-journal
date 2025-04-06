
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDreams } from "@/utils/dreamStorage";
import { Dream, DreamMood, DreamType } from "@/types/dream";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Header from "@/components/Header";
import { format, parse, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

const MOOD_COLORS = {
  happy: "#4ade80",
  sad: "#60a5fa",
  scared: "#f87171",
  confused: "#fbbf24",
  peaceful: "#a78bfa",
  excited: "#f472b6"
};

const TYPE_COLORS = {
  normal: "#94a3b8",
  lucid: "#a78bfa",
  nightmare: "#f87171",
  recurring: "#fbbf24"
};

const Statistics = () => {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const loadedDreams = getDreams();
      setDreams(loadedDreams);
    } catch (error) {
      console.error("Error loading dreams for statistics:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const moodData = useMemo(() => {
    const moodCounts: Record<DreamMood, number> = {
      happy: 0,
      sad: 0,
      scared: 0,
      confused: 0,
      peaceful: 0,
      excited: 0
    };

    dreams.forEach(dream => {
      moodCounts[dream.mood]++;
    });

    return Object.entries(moodCounts)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0);
  }, [dreams]);

  const typeData = useMemo(() => {
    const typeCounts: Record<DreamType, number> = {
      normal: 0,
      lucid: 0,
      nightmare: 0,
      recurring: 0
    };

    dreams.forEach(dream => {
      typeCounts[dream.type]++;
    });

    return Object.entries(typeCounts)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0);
  }, [dreams]);

  const monthlyData = useMemo(() => {
    const monthCounts: Record<string, number> = {};

    dreams.forEach(dream => {
      const date = new Date(dream.date);
      const monthYear = format(date, "MMM yyyy");
      
      if (!monthCounts[monthYear]) {
        monthCounts[monthYear] = 0;
      }
      
      monthCounts[monthYear]++;
    });

    return Object.entries(monthCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => {
        const dateA = parse(a.name, "MMM yyyy", new Date());
        const dateB = parse(b.name, "MMM yyyy", new Date());
        return dateA.getTime() - dateB.getTime();
      })
      .slice(-6); // Show only the last 6 months
  }, [dreams]);

  const tagData = useMemo(() => {
    const tagCounts: Record<string, number> = {};

    dreams.forEach(dream => {
      if (dream.tags && dream.tags.length > 0) {
        dream.tags.forEach(tag => {
          if (!tagCounts[tag]) {
            tagCounts[tag] = 0;
          }
          tagCounts[tag]++;
        });
      }
    });

    return Object.entries(tagCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 tags
  }, [dreams]);

  if (loading) {
    return <div className="flex justify-center py-12 text-white dream-text">Loading statistics...</div>;
  }

  return (
    <>
      <div className="background-pattern"></div>
      <div className="min-h-screen">
        <div className="container py-8 px-4 max-w-6xl relative z-10">
          <div className="flex items-center justify-between">
            <Header />
          </div>
          <main className="pt-4 pb-16">
            <h1 className="text-2xl font-bold text-white dream-text mb-6">Dream Statistics</h1>

            {dreams.length === 0 ? (
              <div className="text-center py-12 text-white dream-text">
                <p>No dreams recorded yet. Start journaling to see your statistics.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border border-dream-light-purple/30 bg-white/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Dream Moods</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={moodData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {moodData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={MOOD_COLORS[entry.name as DreamMood]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border border-dream-light-purple/30 bg-white/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Dream Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={typeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {typeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={TYPE_COLORS[entry.name as DreamType]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border border-dream-light-purple/30 bg-white/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Monthly Dream Count</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={monthlyData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" name="Dreams" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {tagData.length > 0 && (
                  <Card className="border border-dream-light-purple/30 bg-white/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Top Dream Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={tagData} layout="vertical">
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={100} />
                          <Tooltip />
                          <Bar dataKey="value" fill="#a78bfa" name="Count" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Statistics;
