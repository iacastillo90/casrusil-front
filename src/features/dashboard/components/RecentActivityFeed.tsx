import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecentActivityFeed() {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>
                    Has realizado 265 ventas este mes.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    <div className="flex items-center">
                        <Avatar className="h-9 w-9">
                            <AvatarFallback>OM</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">Olivia Martin</p>
                            <p className="text-sm text-muted-foreground">
                                olivia.martin@email.com
                            </p>
                        </div>
                        <div className="ml-auto font-medium" suppressHydrationWarning>+$1.999.000</div>
                    </div>
                    <div className="flex items-center">
                        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
                            <AvatarFallback>JL</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">Jackson Lee</p>
                            <p className="text-sm text-muted-foreground">jackson.lee@email.com</p>
                        </div>
                        <div className="ml-auto font-medium" suppressHydrationWarning>+$39.000</div>
                    </div>
                    <div className="flex items-center">
                        <Avatar className="h-9 w-9">
                            <AvatarFallback>IN</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">Isabella Nguyen</p>
                            <p className="text-sm text-muted-foreground">
                                isabella.nguyen@email.com
                            </p>
                        </div>
                        <div className="ml-auto font-medium" suppressHydrationWarning>+$299.000</div>
                    </div>
                    <div className="flex items-center">
                        <Avatar className="h-9 w-9">
                            <AvatarFallback>WK</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">William Kim</p>
                            <p className="text-sm text-muted-foreground">will@email.com</p>
                        </div>
                        <div className="ml-auto font-medium" suppressHydrationWarning>+$99.000</div>
                    </div>
                    <div className="flex items-center">
                        <Avatar className="h-9 w-9">
                            <AvatarFallback>SD</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">Sofia Davis</p>
                            <p className="text-sm text-muted-foreground">sofia.davis@email.com</p>
                        </div>
                        <div className="ml-auto font-medium" suppressHydrationWarning>+$39.000</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
