export interface Intent {
    apply: () => Promise<void> | void;
    invert: () => Promise<void> | void;
    label?: string;
}

type Listener = () => void;

class IntentLog {
    private past: Array<Intent> = [];
    private future: Array<Intent> = [];
    private limit: number;
    private listeners = new Set<Listener>();

    constructor(limit = 50) {
        this.limit = limit;
    }

    record(intent: Intent): void {
        this.past.push(intent);
        if (this.past.length > this.limit) this.past.shift();
        this.future = [];
        this.notify();
    }

    async undo(): Promise<void> {
        const intent = this.past.pop();
        if (!intent) return;
        await intent.invert();
        this.future.push(intent);
        this.notify();
    }

    async redo(): Promise<void> {
        const intent = this.future.pop();
        if (!intent) return;
        await intent.apply();
        this.past.push(intent);
        this.notify();
    }

    clear(): void {
        this.past = [];
        this.future = [];
        this.notify();
    }

    get canUndo(): boolean {
        return this.past.length > 0;
    }

    get canRedo(): boolean {
        return this.future.length > 0;
    }

    subscribe(listener: Listener): () => void {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }

    private notify(): void {
        for (const listener of this.listeners) listener();
    }
}

export const intentLog = new IntentLog();
