# tipify
[![Build Status](https://travis-ci.com/henry781/tipify.svg?branch=master)](https://travis-ci.com/henry781/tipify)

## Usage

Install _tipify_ dependency.
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
const converter = new JsonConverter();

const car = new Car();

const json = converter.serialize(car);
const car2 = converter.deserialize(json, Car);
```

## Mapping

`@jsonObject()` should be set on each class;

`@jsonProperty('name', String)` should be set on each class field;

Type defined with `@jsonProperty()` can be :
* A class decorated with `@jsonObject()`
* A custom converter
* A type defined below

| @jsonObject(#)                     | Type                     |
|------------------------------------|--------------------------|
| String                             | string                   |
| Number                             | number                   |
| Boolean                            | boolean                  |
| arrayOf(Passenger)                 | Passenger[]              |
| arrayOf(array(String))             | string[][]               |
| enumOf(Color)                      | Color                    |
| any()                              | any                      |
| keyValueOf(String, Passenger)      | {[key:string]: Passenger}|

### Example

```
@jsonObject()
export class Passenger {

    @jsonProperty('pid', PidConverter)
    private _pid: Pid;

    @jsonProperty('gender', enumOf(Gender, EnumStrategy.NAME))
    private _gender: Gender;

    @jsonProperty('name', String)
    private _name: string;

    @jsonProperty('informations', any())
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

### Implicit type mapping
When type is not specified in `@jsonProperty` decorator, mapper will try to get type information from emitted metadata.

**Warning** : It does not works with array and generics.

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

    @jsonProperty('type')
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
@jsonProperty('color', enumOf(Color, EnumStrategy.NAME_COMPATIBLE))
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
export const pidConverter: CustomConverter<Pid, CustomConverterArgs> = {

    deserialize(obj: any): Pid {

        if (isNullOrUndefined(obj)) {
            return obj;
        }

        return {
            id: parseInt(obj, 10),
        } as Pid;
    },

    serialize(obj: Pid): any {

        if (isNullOrUndefined(obj)) {
            return obj;
        }

        return obj.id;
    },
};
```

## Boolean and number parsing

Tipify can parse boolean and numbers when option `tryParse` is enabled.

**Note**: Parsing is enabled by default;

```
const converter = new JsonConverter({ deserialize: { tryParse: true }});
const result = converter.deserialize('true', Boolean);
```

## Unsafe serialize mode

To serialize objects wrapped into non typed objects, use options `unsafe: true`.

```
const car = new Car({brand: 'dodge', name: 'charger'});
const obj = [{charger: [car]}];

const result = converter.serialize(obj, undefined, {unsafe: true});
console.log(result);
// [{"charger":[{"brand":"dodge","type":"car","name":"charger"}]}]
```

## Keep initialized field value

Tipify will keep value initialized by class by default:
```
@jsonProperty('name', String)
public _name = 'titi';
```

A given JSON:
```
{}
```

is deserialized into:
```
{ _name: 'titi' }
```

This feature can be disabled with:
```
const converter = new JsonConverter({ deserialize: { keepObjectFieldValues: false } })
```

*Note*: Tipify use the constructor to create an instance.
