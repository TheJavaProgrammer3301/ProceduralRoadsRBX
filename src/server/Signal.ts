class Connection<T extends any[]> {
	index: number;
	delegate?: (...args: T) => void;
	signal?: Signal<T>;

	constructor(signal: Signal<T>, delegate: (...args: T) => void, index: number) {
		this.signal = signal;
		this.delegate = delegate;
		this.index = index;
	}

	disconnect() {
		this.signal?.connections.remove(this.index);

		this.delegate = undefined;
		this.signal = undefined;
	}
}

class Signal<T extends unknown[]> {
	name: string;
	connections: Connection<T>[];
	yieldingThreads: thread[];

	constructor(signalName: string) {
		this.name = signalName;
		this.connections = [];
		this.yieldingThreads = [];
	}

	connect(callback: (...args: T) => void) {
		const connection = new Connection(this, callback, this.connections.size());

		this.connections.push(connection);

		return connection;
	}

	fire(...args: T) {
		this.connections.forEach((connection: Connection<T>) => {
			const thread = coroutine.create(() => {
				if (connection.delegate) {
					connection.delegate(...args);
				}
			});

			try {
				coroutine.resume(thread);
			} catch (e: any) {
				error(`Exception thrown in the ${this.name} handler: ${tostring(e)}`);
			}
		});

		this.yieldingThreads.forEach((thread) => {
			if (thread) {
				coroutine.resume(thread, args);
			}
		});
	}

	fireSync(...args: T) {
		this.connections.forEach((connection: Connection<T>) => {
			if (connection.delegate) {
				try {
					connection.delegate(...args);
				} catch (e: any) {
					error(`Exception thrown in the ${this.name} handler: ${tostring(e)}`);
				}
			}
		});

		this.yieldingThreads.forEach((thread) => {
			if (thread) {
				coroutine.resume(thread, ...args);
			}
		});
	}

	wait() {
		let args = [];
		const thread = coroutine.running();

		this.yieldingThreads.push(thread);

		args = coroutine.yield();

		this.yieldingThreads.remove(this.yieldingThreads.indexOf(thread));

		return args
	}

	dispose() {
		this.connections.forEach((connection) => {
			connection.disconnect();
		})

		this.connections.clear();
	}

	destroy() {
		this.dispose();
	}
}

export { Signal, Connection };