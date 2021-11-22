import { Observer } from './observer_pattern'

type ObserverMap = Record<string, Observer[]>;

type User = {
    email: string
    phone?: string
}

enum SIGNUP_TYPE {
    EMAIL_SIGNUP,
    PHONE_SIGNUP
}

class SignupSubject {
    private _observers: ObserverMap = {};

    attach(topic: SIGNUP_TYPE, observer: Observer) {
        if (!this._observers.hasOwnProperty(topic)) {
            this._observers[topic] = [];
        }
        this._observers[topic].push(observer);
    }

    detach(topic: SIGNUP_TYPE, observer: Observer) {
        const idx: number = this._observers[topic].indexOf(observer);
        this._observers[topic].splice(idx, 1);
    }

    notifyTopic(topic: SIGNUP_TYPE, user: User) {
        this?._observers[topic]?.forEach(observer => observer.update(user));
    }
}

class EmailSubManager implements Observer {
    update(user: User) {
        // Send an email to users
        console.log("An email has been sent to user:", user);
    }
}

class PhoneSubManager implements Observer {
    update(user: User) {
        // Send an SMS message to users
        console.log("An SMS message has been sent to user:", user);
    }
}

const signupSubject = new SignupSubject();
const emailSub = new EmailSubManager();
const phoneSub = new PhoneSubManager();
signupSubject.attach(SIGNUP_TYPE.EMAIL_SIGNUP, emailSub);
signupSubject.attach(SIGNUP_TYPE.PHONE_SIGNUP, emailSub);
signupSubject.attach(SIGNUP_TYPE.PHONE_SIGNUP, phoneSub);

// A user has signed up using his email.
const userOne: User = {
    email: "userOne@gmail.com"
}
signupSubject.notifyTopic(SIGNUP_TYPE.EMAIL_SIGNUP, userOne);

// A user has signed up using his phone number.
const userTwo: User = {
    email: "userTwo@gmail.com",
    phone: "123-4567-8910"
}
signupSubject.notifyTopic(SIGNUP_TYPE.PHONE_SIGNUP, userTwo);