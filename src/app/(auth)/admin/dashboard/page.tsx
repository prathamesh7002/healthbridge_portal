
import { StatCard } from '@/components/shared/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, User, Stethoscope, CalendarCheck, Activity } from 'lucide-react';
import Link from 'next/link';

const recentActivities = [
    { id: 1, type: 'New Patient', description: 'Demo Patient registered.', timestamp: '2 hours ago', badge: 'secondary' as const },
    { id: 2, type: 'New Doctor', description: 'Dr. Demo added.', timestamp: '5 hours ago', badge: 'secondary' as const },
    { id: 3, type: 'Appointment', description: 'Apt. #AP234 confirmed for Demo Patient.', timestamp: 'Yesterday', badge: 'success' as const },
    { id: 4, type: 'System', description: 'Database backup completed.', timestamp: '2 days ago', badge: 'default' as const },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Patients" value="1" icon={User} description="+1 this month" />
                <StatCard title="Total Doctors" value="1" icon={Stethoscope} description="+1 this month" />
                <StatCard title="Appointments Today" value="0" icon={CalendarCheck} />
                <StatCard title="System Health" value="Operational" icon={Activity} />
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Recent Clinic Activity</CardTitle>
                        <CardDescription>A log of recent events across the platform.</CardDescription>
                    </div>
                    <Button asChild size="sm" variant="outline" className="gap-1">
                        <Link href="#">View All <ArrowUpRight className="h-4 w-4" /></Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event Type</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Timestamp</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentActivities.length > 0 ? (
                                recentActivities.map((activity) => (
                                <TableRow key={activity.id}>
                                    <TableCell>
                                        <Badge variant={activity.badge}>{activity.type}</Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{activity.description}</TableCell>
                                    <TableCell className="text-right text-muted-foreground">{activity.timestamp}</TableCell>
                                </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">
                                        No recent activity.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
