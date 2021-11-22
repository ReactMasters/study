// Context
class Validator {

    // You can force a default validateStrategy with a constructor.
    constructor(validateStrategy: ValidateStrategy) {
        this._validateStrategy = validateStrategy;
    }

    private _validateStrategy: ValidateStrategy;

    set validateStrategy(strategy: ValidateStrategy) {
        this._validateStrategy = strategy;
    }

    validate(...args: any[]) {
        return this._validateStrategy.run(...args);
    }
}

interface ValidateStrategy {
    run: Function
}


// Strategies
class UsernameValidator implements ValidateStrategy {
    run(username: string) {
        return /[a-zA-Z]{1,12}/.test(username);
    }
}

class AgeValidator implements ValidateStrategy {
    run(age: number) {
        return age > 0 && age < 200;
    }
}

const validator = new Validator(new UsernameValidator());
validator.validate("username");
validator.validateStrategy = new AgeValidator();
validator.validate(12);