
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Users, UserPlus, Calendar, PieChart as PieChartIcon } from "lucide-react";
import { useNGO } from "@/contexts/NGOContext";
import { format, parseISO } from "date-fns";

const AdminMembers = () => {
  const { members, refreshData } = useNGO();
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVolunteers: 0,
    activeVolunteers: 0,
    inactiveVolunteers: 0,
    newThisMonth: 0,
    newThisYear: 0
  });

  useEffect(() => {
    refreshData().then(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredVolunteers(members);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredVolunteers(
        members.filter(
          volunteer =>
            volunteer.name.toLowerCase().includes(query) ||
            (volunteer.email && volunteer.email.toLowerCase().includes(query)) ||
            (volunteer.phone && volunteer.phone.includes(query))
        )
      );
    }
  }, [searchQuery, members]);

  useEffect(() => {
    calculateStats(members);
  }, [members]);

  const calculateStats = (volunteerData) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const activeVolunteers = volunteerData.filter(vol => vol.is_active).length;
    const inactiveVolunteers = volunteerData.length - activeVolunteers;

    const newThisMonth = volunteerData.filter(vol => {
      if (!vol.join_date) return false;
      try {
        const joinDate = parseISO(vol.join_date);
        return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
      } catch (e) {
        return false;
      }
    }).length;

    const newThisYear = volunteerData.filter(vol => {
      if (!vol.join_date) return false;
      try {
        const joinDate = parseISO(vol.join_date);
        return joinDate.getFullYear() === currentYear;
      } catch (e) {
        return false;
      }
    }).length;

    setStats({
      totalVolunteers: volunteerData.length,
      activeVolunteers,
      inactiveVolunteers,
      newThisMonth,
      newThisYear
    });
  };

  const exportToCSV = () => {
    // Create CSV content
    const headers = ['Name', 'Email', 'Phone', 'Address', 'Join Date', 'Status'];
    const csvRows = [headers];

    filteredVolunteers.forEach(volunteer => {
      const row = [
        volunteer.name,
        volunteer.email || 'N/A',
        volunteer.phone || 'N/A',
        volunteer.address || 'N/A',
        volunteer.join_date ? format(parseISO(volunteer.join_date), 'yyyy-MM-dd') : 'N/A',
        volunteer.is_active ? 'Active' : 'Inactive'
      ];
      csvRows.push(row);
    });

    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `volunteers-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Monthly volunteer sign-up data from actual members data
  const getMonthlySignups = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthCounts = new Array(12).fill(0);
    
    members.forEach(volunteer => {
      if (volunteer.join_date) {
        try {
          const joinDate = parseISO(volunteer.join_date);
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

  const pieChartData = [
    { name: 'Active', value: stats.activeVolunteers },
    { name: 'Inactive', value: stats.inactiveVolunteers }
  ];

  const COLORS = ['#0088FE', '#FF8042'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Volunteer Management</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="flex items-center" 
            onClick={exportToCSV}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button className="flex items-center" onClick={() => window.location.href = '/volunteer'}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Volunteer
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Volunteers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVolunteers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.newThisMonth} new this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Volunteers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeVolunteers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeVolunteers > 0 
                ? `${Math.round((stats.activeVolunteers / stats.totalVolunteers) * 100)}% of total` 
                : '0% of total'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New This Year</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newThisYear}</div>
            <p className="text-xs text-muted-foreground">Since January 1st</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalVolunteers > 0 
                ? `${Math.round((stats.activeVolunteers / stats.totalVolunteers) * 100)}%` 
                : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">Active vs. Inactive</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Volunteer Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Volunteer Sign-ups (This Year)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
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
                  <Bar dataKey="count" fill="#0088FE" name="New Volunteers" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Volunteer List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <CardTitle>All Volunteers</CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search volunteers..."
                className="pl-8 w-full md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVolunteers.length > 0 ? (
                    filteredVolunteers.map((volunteer) => (
                      <TableRow key={volunteer.id}>
                        <TableCell className="font-medium">{volunteer.name}</TableCell>
                        <TableCell>{volunteer.email || "—"}</TableCell>
                        <TableCell>{volunteer.phone || "—"}</TableCell>
                        <TableCell>
                          {volunteer.join_date 
                            ? format(parseISO(volunteer.join_date), "MMM d, yyyy") 
                            : "—"}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            volunteer.is_active 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {volunteer.is_active ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No volunteers found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMembers;
