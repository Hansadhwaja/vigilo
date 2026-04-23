import { PendingAttachment } from '@/types'
import { X } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react';

interface AttachmentPreviewProps {
    pendingAttachments: PendingAttachment[];
    setPendingAttachments: Dispatch<SetStateAction<PendingAttachment[]>>
}


const AttachmentPreview = ({ pendingAttachments, setPendingAttachments }: AttachmentPreviewProps) => {
    return (
        <div>
            {!!pendingAttachments.length && (
                <div className="mb-2 flex flex-wrap gap-2">
                    {pendingAttachments.map((file) => (
                        <div key={file.id} className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
                            <span className="max-w-45 truncate" title={file.name}>{file.name}</span>
                            <button
                                type="button"
                                onClick={() => setPendingAttachments((p) => p.filter((f) => f.id !== file.id))}
                                className="text-emerald-700 hover:text-emerald-900">
                                <X size={13} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default AttachmentPreview