import { useState, useEffect } from "react";
import { useNGO } from "@/contexts/NGOContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BookOpen, Calendar, DollarSign, TrendingUp, UserPlus, UserCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const { members, leaders, events, projects } = useNGO();
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
    attendance: {
      labels: [] as string[],
      data: [] as number[]
    }
  });

  // Fetch tribes data
  useEffect(() => {
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
    
    fetchTribes();
  }, []);

  // Fetch sermons data
  useEffect(() => {
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
    
    fetchSermons();
  }, []);

  // Calculate dashboard stats
  useEffect(() => {
    const activeMembers = members.filter(member => member.is_active).length;
    
    const membersByTribe: Record<string, number> = {};
    members.forEach(member => {
      const tribe = tribes.find(t => t.id === member.tribe_id)?.name || 'Unassigned';
      membersByTribe[tribe] = (membersByTribe[tribe] || 0) + 1;
    });
    
    // Generate mock attendance data for the last 4 weeks
    const attendanceLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const attendanceData = [
      members.length * 0.7, 
      members.length * 0.8, 
      members.length * 0.75, 
      members.length * 0.85
    ].map(Math.round);
    
    setStats({
      totalMembers: members.length,
      activeMembers,
      inactiveMembers: members.length - activeMembers,
      totalSermons: sermons.length,
      totalEvents: events.length,
      totalBlogPosts: sermons.filter(s => s.type === 'blog').length,
      membersByTribe,
      attendance: {
        labels: attendanceLabels,
        data: attendanceData
      }
    });
  }, [members, events, tribes, sermons]);

  const recentMembers = [...members]
    .sort((a, b) => new Date(b.join_date || '').getTime() - new Date(a.join_date || '').getTime())
    .slice(0, 5);

  const getActivePercentage = () => {
    if (stats.totalMembers === 0) return 0;
    return Math.round((stats.activeMembers / stats.totalMembers) * 100);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold font-serif text-church-primary mb-6">Admin Dashboard</h1>
      
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
                  {getActivePercentage()}% active members
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sermon Library</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSermons}</div>
                <p className="text-xs text-muted-foreground">
                  sermons in the library
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
                  scheduled events
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
                  articles published
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Weekly Attendance</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="space-y-4">
                  {stats.attendance.labels.map((week, index) => (
                    <div key={week} className="flex items-center">
                      <div className="w-16 text-sm">{week}</div>
                      <div className="w-full">
                        <Progress value={(stats.attendance.data[index] / stats.totalMembers) * 100} className="h-2" />
                      </div>
                      <div className="w-12 text-right text-sm">
                        {stats.attendance.data[index]}
                      </div>
                    </div>
                  ))}
                </div>
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
                        <div className="w-9 h-9 rounded-full bg-church-primary/10 flex items-center justify-center text-church-primary mr-3">
                          {member.name.charAt(0)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{member.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {memberTribe ? `Tribe of ${memberTribe}` : 'No tribe assigned'}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {member.join_date}
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
                        <div className="w-9 h-9 rounded-full bg-church-primary/10 flex items-center justify-center text-church-primary mr-3">
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
                        <div className="w-9 h-9 rounded-full bg-church-primary/10 flex items-center justify-center text-church-primary mr-3">
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
