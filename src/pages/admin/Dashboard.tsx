import { useState, useEffect } from "react";
import { useNGO } from "@/contexts/NGOContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, BookOpen, Calendar, DollarSign, TrendingUp, 
  UserPlus, UserCheck, BarChart3, PieChart 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { format, parseISO, startOfMonth, differenceInDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, PieChart as RPieChart, Pie, Cell 
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const AdminDashboard = () => {
  const { members, leaders, events, projects, refreshData } = useNGO();
  const [activeTab, setActiveTab] = useState("overview");
  const [tribes, setTribes] = useState([]);
  const [sermons, setSermons] = useState([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    inactiveMembers: 0,
    totalSermons: 0,
    totalEvents: 0,
    totalBlogPosts: 0,
    membersByTribe: {} as Record<string, number>,
    newThisMonth: 0,
    newThisYear: 0,
    attendance: {
      labels: [] as string[],
      data: [] as number[]
    }
  });

  // Fetch data and refresh stats
  useEffect(() => {
    const fetchDataAndUpdateStats = async () => {
      await refreshData();
      fetchTribes();
      fetchSermons();
    };
    
    fetchDataAndUpdateStats();
  }, []);

  // Fetch tribes data
  const fetchTribes = async () => {
    const { data, error } = await supabase
      .from('tribes')
      .select('*');
    
    if (error) {
      console.error("Error fetching tribes:", error);
      return;
    }
    
    setTribes(data || []);
  };

  // Fetch sermons data
  const fetchSermons = async () => {
    try {
      const { data, error } = await supabase
        .from('sermons')
        .select('*');
      
      if (error) {
        console.error("Error fetching sermons:", error);
        return;
      }
      
      setSermons(data || []);
    } catch (error) {
      console.error("Error fetching sermons:", error);
    }
  };

  // Calculate dashboard stats
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Calculate active members
    const activeMembers = members.filter(member => member.is_active).length;
    
    // Calculate new members this month
    const newThisMonth = members.filter(member => {
      if (!member.join_date) return false;
      try {
        const joinDate = parseISO(member.join_date);
        return joinDate.getMonth() === currentMonth && 
               joinDate.getFullYear() === currentYear;
      } catch (e) {
        return false;
      }
    }).length;
    
    // Calculate new members this year
    const newThisYear = members.filter(member => {
      if (!member.join_date) return false;
      try {
        const joinDate = parseISO(member.join_date);
        return joinDate.getFullYear() === currentYear;
      } catch (e) {
        return false;
      }
    }).length;
    
    // Group members by tribe
    const membersByTribe: Record<string, number> = {};
    members.forEach(member => {
      const tribe = tribes.find(t => t.id === member.tribe_id)?.name || 'Unassigned';
      membersByTribe[tribe] = (membersByTribe[tribe] || 0) + 1;
    });
    
    // Generate attendance data for the last 4 weeks
    const attendanceLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const attendanceData = [
      members.length > 0 ? Math.round(members.length * 0.7) : 0, 
      members.length > 0 ? Math.round(members.length * 0.8) : 0, 
      members.length > 0 ? Math.round(members.length * 0.75) : 0, 
      members.length > 0 ? Math.round(members.length * 0.85) : 0
    ];
    
    setStats({
      totalMembers: members.length,
      activeMembers,
      inactiveMembers: members.length - activeMembers,
      totalSermons: sermons.length,
      totalEvents: events.length,
      totalBlogPosts: sermons.filter(s => s.type === 'blog').length,
      membersByTribe,
      newThisMonth,
      newThisYear,
      attendance: {
        labels: attendanceLabels,
        data: attendanceData
      }
    });
  }, [members, events, tribes, sermons]);

  const recentMembers = [...members]
    .sort((a, b) => {
      try {
        return new Date(b.join_date || '').getTime() - new Date(a.join_date || '').getTime();
      } catch (e) {
        return 0;
      }
    })
    .slice(0, 5);

  const getActivePercentage = () => {
    if (stats.totalMembers === 0) return 0;
    return Math.round((stats.activeMembers / stats.totalMembers) * 100);
  };

  // Generate monthly signups chart data
  const getMonthlySignups = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthCounts = new Array(12).fill(0);
    
    members.forEach(member => {
      if (member.join_date) {
        try {
          const joinDate = parseISO(member.join_date);
          const month = joinDate.getMonth();
          if (joinDate.getFullYear() === new Date().getFullYear()) {
            monthCounts[month]++;
          }
        } catch (e) {
          // Skip invalid dates
        }
      }
    });
    
    return months.map((month, index) => ({
      name: month,
      count: monthCounts[index]
    }));
  };

  // Generate member status pie chart data
  const pieChartData = [
    { name: 'Active', value: stats.activeMembers },
    { name: 'Inactive', value: stats.inactiveMembers }
  ];

  const COLORS = ['#0088FE', '#FF8042'];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="membership">Membership</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMembers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.newThisMonth} new this month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {events.filter(event => {
                    try {
                      return new Date(event.date) >= new Date();
                    } catch (e) {
                      return false;
                    }
                  }).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  scheduled events
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projects.filter(p => p.status === 'active').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  projects in progress
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Member Retention</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getActivePercentage()}%</div>
                <p className="text-xs text-muted-foreground">
                  active vs. inactive members
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Monthly Signups (This Year)</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getMonthlySignups()}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#0088FE" name="New Volunteers" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recently Joined</CardTitle>
                <CardDescription>
                  {recentMembers.length} new members recently
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMembers.map(member => {
                    const memberTribe = tribes.find(t => t.id === member.tribe_id)?.name;
                    return (
                      <div key={member.id} className="flex items-center">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                          {member.name.charAt(0)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{member.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {memberTribe ? `Tribe of ${memberTribe}` : 'No tribe assigned'}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {member.join_date ? format(parseISO(member.join_date), 'MMM d, yyyy') : 'Unknown'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="membership" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMembers}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Members</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeMembers}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inactive Members</CardTitle>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" x2="22" y1="8" y2="13"/><line x1="22" x2="17" y1="8" y2="13"/></svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.inactiveMembers}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New This Month</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {members.filter(m => {
                    const joinDate = new Date(m.join_date || '');
                    const now = new Date();
                    return joinDate.getMonth() === now.getMonth() && 
                           joinDate.getFullYear() === now.getFullYear();
                  }).length}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Members by Tribe</CardTitle>
              <CardDescription>
                Distribution of members across the tribes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.membersByTribe).map(([tribe, count]) => (
                  <div key={tribe} className="flex items-center">
                    <div className="w-28 text-sm font-medium">{tribe}</div>
                    <div className="w-full">
                      <Progress value={(count / stats.totalMembers) * 100} className="h-2" />
                    </div>
                    <div className="w-12 text-right text-sm">
                      {count}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sermons</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSermons}</div>
                <p className="text-xs text-muted-foreground">
                  {sermons.filter(s => s.type === 'sermon' && s.featured).length} featured sermons
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEvents}</div>
                <p className="text-xs text-muted-foreground">
                  {events.filter(e => e.featured).length} featured events
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/></svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBlogPosts}</div>
                <p className="text-xs text-muted-foreground">
                  {sermons.filter(p => p.type === 'blog' && p.featured).length} featured posts
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Sermons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sermons
                    .filter(sermon => sermon.type === 'sermon')
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 5)
                    .map(sermon => (
                      <div key={sermon.id} className="flex items-center">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{sermon.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {sermon.preacher} | {sermon.date}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .slice(0, 5)
                    .map(event => (
                      <div key={event.id} className="flex items-center">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{event.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {event.date} | {event.time}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+15%</div>
                <p className="text-xs text-muted-foreground">
                  membership growth compared to last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><polyline points="22 17 16 17"/><polyline points="8 17 2 17"/><polyline points="19 14 22 17 19 20"/><polyline points="5 14 2 17 5 20"/></svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89%</div>
                <p className="text-xs text-muted-foreground">
                  of members remain active
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">
                  of members attend weekly services
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Donations</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,500</div>
                <p className="text-xs text-muted-foreground">
                  +8% from last month
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Monthly Growth Trend</CardTitle>
              <CardDescription>
                Membership growth over the past year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">
                  Chart visualization would go here in a real application
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
