import { Button } from "./Button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./DropdownMenu"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

interface ActionsMenuProps {
    onEdit?: () => void;
    onDelete?: () => void;
    itemName?: string;
}

export function ActionsMenu({ onEdit, onDelete, itemName = "Item" }: ActionsMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {onEdit && (
                    <DropdownMenuItem onClick={onEdit}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                    </DropdownMenuItem>
                )}
                {onDelete && (
                    <DropdownMenuItem
                        onClick={() => {
                            if (window.confirm(`Are you sure you want to delete this ${itemName}?`)) {
                                onDelete()
                            }
                        }}
                        className="text-red-400 focus:text-red-400 focus:bg-red-900/10"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
