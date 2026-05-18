import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, FileText } from 'lucide-react';
import { useState } from 'react';

const ExportAlarmModal = () => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Export Alarm Data</DialogTitle>
                    <DialogDescription>
                        Choose format for exporting alarm records and reports
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-4">
                    <Button
                        onClick={() => { }}
                        className="flex flex-col items-center gap-2 h-20"
                        variant="outline"
                    >
                        <FileText className="h-8 w-8" />
                        <span>Export CSV</span>
                    </Button>

                    <Button
                        onClick={() => { }}
                        className="flex flex-col items-center gap-2 h-20"
                        variant="outline"
                    >
                        <Download className="h-8 w-8" />
                        <span>Export PDF Report</span>
                    </Button>
                </div>

                <div className="text-xl text-gray-600">
                    <p>CSV: Raw data suitable for spreadsheet analysis</p>
                    <p>PDF: Formatted report with charts and summaries</p>
                </div>

                <div className="flex justify-end pt-4">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ExportAlarmModal