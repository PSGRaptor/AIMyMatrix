import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Props {
    name: string;
    icon: string;
    running: boolean;
    onClick: () => void;
}

export default function PlatformCard({ name, icon, running, onClick }: Props) {
    return (
        <Button
            variant={running ? 'default' : 'ghost'}
            className={cn('justify-start gap-2 px-2 py-1 w-full', running && 'font-bold')}
            onClick={onClick}
        >
            <img src={`./icons/${icon}`} alt="" className="w-5 h-5" />
            {name}
        </Button>
    );
}