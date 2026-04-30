import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

interface DispatchPageProps {
  alarmList: any[];
  onAssign: (alarm: any) => void;
  onResolve: (id: string) => void;
  onSelectAlarm: (alarmId: string) => void;
}

export default function DispatchPage({ alarmList, onAssign, onResolve, onSelectAlarm }: DispatchPageProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Alarm Queue</CardTitle>
          <CardDescription>Prioritise and dispatch</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Since</TableHead>
                <TableHead>SLA</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alarmList.filter((a: any) => !a.completed).map((a: any) => {
                const pct = Math.min(100, Math.round((a.sinceMins / a.slaMins) * 100));
                return (
                  <TableRow key={a.id}>
                    <TableCell>{a.id}</TableCell>
                    <TableCell>{a.site}</TableCell>
                    <TableCell>{a.type}</TableCell>
                    <TableCell>{a.sinceMins}m</TableCell>
                    <TableCell className="w-48">
                      <Progress value={pct} />
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="secondary" onClick={() => onAssign(a)}>Assign nearest</Button>
                      <Button size="sm" onClick={() => onResolve(a.id)}>Resolve</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Dispatch tools</CardTitle>
          <CardDescription>Pick alarm and act</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select onValueChange={(v) => onSelectAlarm(v)}>
            <SelectTrigger><SelectValue placeholder="Select alarm" /></SelectTrigger>
            <SelectContent>
              {alarmList.filter((a: any) => !a.completed).map((a: any) => <SelectItem key={a.id} value={a.id}>{a.id} – {a.site}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button className="w-full">Notify client</Button>
          <Button variant="outline" className="w-full">View pre-plan</Button>
        </CardContent>
      </Card>
    </div>
  );
}