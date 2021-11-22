// Subject
// Subject class manages observers and notify them of events.

class Subject {
    private _observers: Observer[] = [];

    attach(observer: Observer) {
        this._observers.push(observer);
    }

    detach(observer: Observer) {
        const idx: number = this._observers.indexOf(observer);
        this._observers.splice(idx, 1);
    }

    notifyAll(...args: any[]) {
        this._observers.forEach(observer => observer.update(...args))
    }
}

export interface Observer {
    update: (...args: any[]) => any
}

class ObserverOne implements Observer {
    // This observer simply logs the arguments and timestamp
    update = (...args: any[]) => {
        console.log(`ObserverOne: ${args} ${new Date().toLocaleString()}`)
    }
}

class ObserverTwo implements Observer {
    // This observer concats the arguments.
    update = (...args: any[]) => {
        const concat = args.reduce((prev, cur) => prev + cur + "", "CONCATENATED: ");
        console.log(concat);
        return concat;
    }
}

const subject = new Subject();

subject.attach(new ObserverOne());
subject.attach(new ObserverTwo());

subject.notifyAll("Event 1", "Event 2", "Event 3");
