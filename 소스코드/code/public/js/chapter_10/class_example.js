class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  sayHello() {
    console.log(`안녕하세요, 제 이름은 ${this.name}이고 ${this.age}살입니다.`);
  }

  get info() {
    return `${this.name} (${this.age}세)`;
  }

  set updateAge(newAge) {
    if (newAge > 0) {
      this.age = newAge;
    }
  }

  static isAdult(person) {
    return person.age >= 20;
  }
}

class Employee extends Person {
  constructor(name, age, position) {
    super(name, age);
    this.position = position;
  }

  sayHello() {
    super.sayHello();
    console.log(`저는 ${this.position}로 일하고 있습니다.`);
  }
}

const person1 = new Person('김영민', 38);
person1.sayHello();

console.log(person1.info);
person1.updateAge = 40;
console.log(person1.info);

console.log(Person.isAdult(person1));

const employee1 = new Employee('김철수', 28, '개발자');
employee1.sayHello();
