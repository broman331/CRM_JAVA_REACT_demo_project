
import { cn } from '../../lib/utils';
import type { HTMLAttributes } from 'react';

type SimpleSkeletonProps = HTMLAttributes<HTMLDivElement>;

export const Skeleton: React.FC<SimpleSkeletonProps> = ({ className, ...props }) => {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-slate-700/50", className)}
            {...props}
        />
    );
};
