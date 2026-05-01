import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import ActivityTable from './Table/ActivityTable'

const DashboardActivity = ({ currentTime }: { currentTime: Date }) => {
    return (
        <Card className="xl:col-span-2">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Live Activity Feed</CardTitle>
                        <CardDescription>
                            Real-time operations and billing events
                        </CardDescription>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm text-muted-foreground">Live</span>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <ActivityTable currentTime={currentTime} />
            </CardContent>
        </Card>
    )
}

export default DashboardActivity