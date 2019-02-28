# tipify
[![Build Status](https://travis-ci.com/henry781/tipify.svg?branch=master)](https://travis-ci.com/henry781/tipify)

## Usage

```
npm install --save tipify
```

Enable experimental decorators in tsconfig.
```
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    ...
```

Instantiate a new converter.
```
const car = new Car();

const converter = new JsonConverter();

const json = converter.serialize(car);

const car2 = converter.deserialize(car, Car);
```

## Mapping

`@jsonObject()` should be set on each class;

`@jsonProperty('name', String)` should be set on each class field;


### Example

```
@jsonObject()
export class Passenger {

    @jsonProperty('pid', PidConverter)
    private _pid: Pid;

    @jsonProperty('gender', Enum(Gender, EnumStrategy.INDEX_COMPATIBLE))
    private _gender: Gender;

    @jsonProperty('name', String)
    private _name: string;

    @jsonProperty('informations', Any)
    private _informations: object;

    constructor(options?: PassengerOptions) {
        if (options) {
            this._pid = options.pid;
            this._gender = options.gender;
            this._name = options.name;
            this._informations = options.informations;
        }
    }
}
```

Type defined with `@jsonProperty()` can be :
* A class with `@jsonObject()`
* A custom converter
* A standard type defined below
* An array of class, custom converter or standard type, like `[String]`


|                | 
|----------------|
| String         |
| Number         |
| Boolean        |
| Any            |
| Enum(...)      |


## Implicit type mapping
When type is not specified in `@jsonProperty` decorator, mapper will try to get type information from emitted metadata.
_Warning_ : It does not works with array and generics.

```
@jsonObject()
export class Passenger {

    @jsonProperty('id')
    private _id: number;

    @jsonProperty('name')
    private _name: string;

    @jsonProperty('active')
    private _active: boolean;
    
    @jsonProperty('airline')
    private _airline: Airline;
}
```

## Polymorphism

Tipify can manage polymorphism when `discriminatorProperty` and `discriminatorValue` are defined.

#### Parent class
```
@jsonObject({discriminatorProperty: 'type'})
export abstract class Vehicle {

    @jsonProperty('type', String)
    private _type: string;
    
    constructor(type?: string) {
        this._type = type;
    }
}
```
#### Child class
```
@jsonObject({discriminatorValue: 'car'})
export class Car extends Vehicle {

    constructor() {
        super('car');
    }
}
```
#### Usage
```
const result = converter.deserialize({ "type" : "car" }, Vehicle);
chai.expect(result).instanceof(Car);
```


## Enum

```
@jsonProperty('color', Enum(Color, EnumStrategy.NAME_COMPATIBLE))
private _color: Color;
```

|                 |   |
|-----------------|---|
| NAME_COMPATIBLE |   |
| NAME            |   |
| INDEX_COMPATIBLE|   |
| INDEX           |   |

## Custom converter

```
@jsonCustomConverter()
export class PidConverter implements JsonCustomConverter<Pid> {

    public deserialize(obj: any): Pid {
        return undefined;
    }

    public serialize(obj: Pid): any {
        return undefined;
    }
}
```

## Parsing

Tipify can parse boolean and numbers when option `tryParse` is enabed.

```
const result = converter.deserialize('true', Boolean, {tryParse: true});
```
